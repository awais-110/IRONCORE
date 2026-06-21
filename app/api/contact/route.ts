import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json({ message: "Too many requests. Try again shortly." }, { status: 429 });
  }
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success || parsed.data.company) return NextResponse.json({ message: "Check your message and try again." }, { status: 400 });

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.SIGNUP_FROM_EMAIL || "IRONCORE <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject: `IRONCORE contact: ${parsed.data.subject}`,
      text: `${parsed.data.name} (${parsed.data.email})\n\n${parsed.data.message}`
    });
  }

  return NextResponse.json({ message: process.env.RESEND_API_KEY ? "Message sent. We’ll get back to you shortly." : "Demo mode: message validated. Add Resend credentials to deliver it." });
}
