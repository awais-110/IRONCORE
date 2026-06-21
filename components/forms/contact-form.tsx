"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { contactSchema } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";

type ContactValues = z.infer<typeof contactSchema>;
const inputClass = "w-full border-b border-hairline-strong bg-transparent py-3 outline-none placeholder:text-muted focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function submit(values: ContactValues) {
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json();
    setStatus(result.message);
    if (response.ok) reset();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-7" noValidate>
      <ContactField label="Name" error={errors.name?.message}><input {...register("name")} className={inputClass} placeholder="YOUR NAME" /></ContactField>
      <ContactField label="Email" error={errors.email?.message}><input {...register("email")} type="email" className={inputClass} placeholder="YOU@EMAIL.COM" /></ContactField>
      <ContactField label="Subject" error={errors.subject?.message}><input {...register("subject")} className={inputClass} placeholder="WHAT IS THIS ABOUT?" /></ContactField>
      <ContactField label="Message" error={errors.message?.message}><textarea {...register("message")} rows={5} className={inputClass} placeholder="GIVE US THE USEFUL DETAILS" /></ContactField>
      <input {...register("company")} className="hidden" tabIndex={-1} autoComplete="off" />
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</Button>
      <p aria-live="polite" className="min-h-5 text-sm text-secondary">{status}</p>
    </form>
  );
}

function ContactField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="text-sm text-secondary">{label}{children}<span className="mt-2 block min-h-4 text-xs text-error">{error}</span></label>;
}
