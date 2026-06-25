import { z } from "zod";

export const createSubscriptionSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  planId: z.string().uuid("Invalid plan ID"),
});

export const subscriptionParamsSchema = z.object({
  id: z.string().uuid("Invalid subscription ID"),
});
