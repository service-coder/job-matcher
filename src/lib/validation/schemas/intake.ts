import { z } from "zod";

export const intakeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  address: z.string().min(1, "Address is required"),
  company: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficultAccess: z.boolean(),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
