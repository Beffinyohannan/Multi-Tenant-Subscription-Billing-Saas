import sequelize, { Tenant, User } from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import logger from "../config/logger.js";

function generateSlug(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || "company";
  return base;
}

async function ensureUniqueSlug(base) {
  let slug = base;
  let attempt = 0;
  while (attempt < 10) {
    const existing = await Tenant.findOne({ where: { slug }, raw: true });
    if (!existing) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
  throw new AppError("Unable to generate unique company slug", 500);
}

function buildTokens(user) {
  const payload = { userId: user.id, tenantId: user.tenant_id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function register({ companyName, name, email, phone, password }) {
  const existing = await User.findOne({ where: { email }, raw: true });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const slug = await ensureUniqueSlug(generateSlug(companyName));
  const hashed = await hashPassword(password);

  const transaction = await sequelize.transaction();

  try {
    const tenant = await Tenant.create(
      { name: companyName, slug, phone },
      { transaction }
    );

    const user = await User.create(
      {
        tenantId: tenant.id,
        name,
        email,
        password: hashed,
        role: "ADMIN",
      },
      { transaction }
    );

    await transaction.commit();

    const tokens = buildTokens({
      id: user.id,
      tenant_id: tenant.id,
      role: "ADMIN",
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        tenantId: tenant.id,
        name,
        email,
        role: "ADMIN",
      },
    };
  } catch (err) {
    await transaction.rollback();
    logger.error(err, "Register transaction failed");
    throw err;
  }
}

export async function login({ email, password }) {
  const user = await User.findOne({
    attributes: ["id", "tenant_id", "name", "email", "password", "role"],
    where: { email },
    raw: true,
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = buildTokens(user);

  return {
    ...tokens,
    user: {
      id: user.id,
      tenantId: user.tenant_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findOne({
    attributes: ["id", "tenant_id", "role"],
    where: { id: payload.userId },
    raw: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    tenantId: user.tenant_id,
    role: user.role,
  });

  return { accessToken };
}

export async function getMe(userId) {
  const user = await User.findByPk(userId, {
    attributes: ["id", "tenant_id", "name", "email", "role", "created_at"],
    raw: true,
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}
