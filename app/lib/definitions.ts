import { z } from "zod";

// Enhanced schema validation for signup
export const SignUpSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(50, { message: "First name must be less than 50 characters." })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(50, { message: "Last name must be less than 50 characters." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(64, { message: "Password must be less than 64 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .regex(/^(?!.*(.)\1{2})/, { 
      message: "Avoid repeating the same character too many times" 
    })
    .trim(),
});

// Login schema
export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required" })
});

// Forgot password schema
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim()
});

// Reset password schema with confirmation
export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(64, { message: "Password must be less than 64 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Comprehensive form state type
export type FormState =
  | {
      errors?: {
        first_name?: string[];
        last_name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string[];
      };
      message?: string;
    }
  | undefined;
