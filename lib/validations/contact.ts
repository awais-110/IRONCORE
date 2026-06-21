import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Tell us what this is about"),
  message: z.string().min(10, "Add a little more detail").max(1000),
  company: z.string().max(0).optional()
});
