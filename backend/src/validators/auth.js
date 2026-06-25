import { z } from "zod";

export const registerSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(255),
  name: z.string().min(1, "Your name is required").max(255),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required").max(20),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
