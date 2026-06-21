import { z } from "zod";

export const signupSchema = z.object({
  goal: z.enum(["Lose Fat", "Build Strength", "General Fitness", "Sport-Specific"]),
  selectedPlan: z.enum(["foundation", "performance", "elite"]),
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  preferredStartDate: z.string().min(1, "Choose a preferred start date"),
  message: z.string().max(500, "Keep your note under 500 characters").optional(),
  company: z.string().max(0).optional()
});

export type SignupValues = z.infer<typeof signupSchema>;
