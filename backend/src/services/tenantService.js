import { Tenant } from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";

export async function createTenant({ name, slug }) {
  const existing = await Tenant.findOne({ where: { slug }, raw: true });
  if (existing) {
    throw new AppError("Slug already taken", 409);
  }

  const tenant = await Tenant.create({ name, slug });
  return Tenant.findByPk(tenant.id, { raw: true });
}

export async function findAllTenants({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const { count, rows } = await Tenant.findAndCountAll({
    attributes: ["id", "name", "slug", "phone", "created_at", "updated_at"],
    order: [["created_at", "DESC"]],
    limit,
    offset,
    raw: true,
  });
  return { rows, count };
}

export async function findTenantById(id) {
  const tenant = await Tenant.findByPk(id, {
    attributes: ["id", "name", "slug", "phone", "created_at", "updated_at"],
    raw: true,
  });
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }
  return tenant;
}
