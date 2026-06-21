import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000)) return NextResponse.json({ message: "Try again shortly." }, { status: 429 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await supabase.from("newsletter_subscribers").upsert({ email: parsed.data.email }, { onConflict: "email", ignoreDuplicates: true });
    if (error) return NextResponse.json({ message: "Could not subscribe." }, { status: 500 });
  }
  return NextResponse.json({ message: "Subscribed." });
}
