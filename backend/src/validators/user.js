import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: z.enum(["ADMIN", "USER"]).optional().default("USER"),
});

export const userParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});
