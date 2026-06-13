import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().trim().min(1).max(100),

  lastName: z.string().trim().min(1).max(100),

  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),

  phoneNumber: z.string().trim().min(7).max(30),

  password: z.string().min(8).max(128),
});

export const signinSchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),

  password: z.string().min(8).max(128),
});

export const signoutSchema = z.object({
  sessionId: z.uuid(),
});
