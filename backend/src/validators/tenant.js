import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
});

export const tenantParamsSchema = z.object({
  id: z.string().uuid("Invalid tenant ID"),
});
