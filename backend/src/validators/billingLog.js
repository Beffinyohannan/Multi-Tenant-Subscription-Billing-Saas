import { z } from "zod";

export const createBillingLogSchema = z.object({
  subscriptionId: z.string().uuid("Invalid subscription ID"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  status: z.enum(["SUCCESS", "FAILED"], {
    message: "Status must be SUCCESS or FAILED",
  }),
  billingPeriod: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "billingPeriod must be in YYYY-MM format"),
});

export const billingLogParamsSchema = z.object({
  id: z.string().uuid("Invalid billing log ID"),
});
