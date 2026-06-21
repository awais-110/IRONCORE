"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email") })
    });
    setStatus(response.ok ? "You’re on the list." : "Please try again.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="mt-5" aria-label="Newsletter signup">
      <div className="flex border-b border-hairline-strong focus-within:border-accent">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input id="newsletter-email" name="email" type="email" required placeholder="EMAIL ADDRESS" className="min-w-0 flex-1 bg-transparent py-3 font-mono text-xs outline-none placeholder:text-muted" />
        <button type="submit" className="px-3 text-accent" aria-label="Subscribe"><ArrowRight size={18} /></button>
      </div>
      <p className="mt-2 min-h-4 text-xs text-muted" aria-live="polite">{status}</p>
    </form>
  );
}
