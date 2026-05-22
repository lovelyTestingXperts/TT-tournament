import { z } from 'zod';

export const registerSchema =
  z
    .object({
      fullName: z
        .string()
        .min(
          3,
          'Full name is required'
        ),

      username: z
        .string()
        .min(
          3,
          'Username too short'
        ),

      email: z.email(
        'Invalid email'
      ),

      phoneNumber: z
        .string()
        .min(
          10,
          'Invalid phone number'
        ),

      role: z.enum([
        'player',
        'member',
        'referee',
      ]),

      password: z
        .string()
        .min(
          6,
          'Password must be at least 6 characters'
        ),

      confirmPassword:
        z.string(),
    })
    .refine(
      (
        data
      ) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          'Passwords do not match',
        path: [
          'confirmPassword',
        ],
      }
    );

export type RegisterFormData =
  z.infer<
    typeof registerSchema
  >;