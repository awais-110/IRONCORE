import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { signupSchema } from "@/lib/validations/signup";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!rateLimit(`signup:${ip}`, 4, 60_000)) {
    return NextResponse.json({ message: "Too many requests. Wait a minute and try again." }, { status: 429 });
  }

  const parsed = signupSchema.safeParse(await request.json());
  if (!parsed.success || parsed.data.company) {
    return NextResponse.json({ message: "Check the form and try again." }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (supabase) {
    const { data: tier } = await supabase.from("membership_tiers").select("id").eq("slug", parsed.data.selectedPlan).maybeSingle();
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      goal: parsed.data.goal,
      selected_plan_id: tier?.id ?? null,
      preferred_start_date: parsed.data.preferredStartDate,
      message: parsed.data.message || null
    });
    if (error) return NextResponse.json({ message: "We could not save your request. Please try again." }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.SIGNUP_FROM_EMAIL || "IRONCORE <onboarding@resend.dev>",
      to: parsed.data.email,
      subject: "Your IRONCORE trial request",
      html: `<div style="background:#0A0A0B;color:#EDEAE4;padding:32px;font-family:Arial,sans-serif"><h1 style="color:#FF4D1C">REQUEST RECEIVED.</h1><p>Hi ${parsed.data.name},</p><p>We have your goal and plan selection. A coach will contact you within one business day to schedule your first session.</p><p>— IRONCORE</p></div>`
    });
  }

  return NextResponse.json({
    message: supabase ? "Your request is in. A coach will contact you within one business day." : "Demo mode: your request was validated. Connect Supabase to store live submissions."
  });
}
