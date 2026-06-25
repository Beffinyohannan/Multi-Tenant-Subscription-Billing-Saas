import { User } from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { hashPassword } from "../utils/password.js";

export async function createUser(tenantId, { name, email, password, role }) {
  const existing = await User.findOne({ where: { email }, raw: true });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const hashed = await hashPassword(password);

  const user = await User.create({
    tenantId,
    name,
    email,
    password: hashed,
    role,
  });

  return User.findByPk(user.id, {
    attributes: ["id", "tenant_id", "name", "email", "role", "created_at"],
    raw: true,
  });
}

export async function findUsersByTenant(tenantId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const { count, rows } = await User.findAndCountAll({
    attributes: ["id", "tenant_id", "name", "email", "role", "created_at"],
    where: { tenant_id: tenantId },
    order: [["created_at", "DESC"]],
    limit,
    offset,
    raw: true,
  });
  return { rows, count };
}

export async function findUserByTenant(tenantId, userId) {
  const user = await User.findOne({
    attributes: ["id", "tenant_id", "name", "email", "role", "created_at"],
    where: { id: userId, tenant_id: tenantId },
    raw: true,
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

export async function deleteUserFromTenant(tenantId, userId) {
  const deleted = await User.destroy({
    where: { id: userId, tenant_id: tenantId },
  });
  if (deleted === 0) {
    throw new AppError("User not found", 404);
  }
  return { id: userId };
}
