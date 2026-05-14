import { z } from "zod";
import { Role } from "../../generated/prisma/enums";

export const SignUpSchema = z.object({
  body: z.object({
    name: z.string().max(255),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(Role),
    phone: z.string(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
});
