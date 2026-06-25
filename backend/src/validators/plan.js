import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  price: z.coerce.number().positive("Price must be greater than 0"),
  billingInterval: z.enum(["weekly", "monthly", "yearly"], {
    message: "billingInterval must be weekly, monthly, or yearly",
  }),
});

export const planParamsSchema = z.object({
  id: z.string().uuid("Invalid plan ID"),
});
