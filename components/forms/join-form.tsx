"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { programs } from "@/lib/data";
import { signupSchema, type SignupValues } from "@/lib/validations/signup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const goals = [
  ["Lose Fat", "Build capacity while changing body composition."],
  ["Build Strength", "Move the number with structured barbell work."],
  ["General Fitness", "Feel capable, conditioned, and consistent."],
  ["Sport-Specific", "Train qualities that transfer to competition."]
] as const;

const inputClass = "w-full border-b border-hairline-strong bg-transparent px-0 py-3 text-primary outline-none placeholder:text-muted focus:border-accent";

export function JoinForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { selectedPlan: "performance", goal: "Build Strength", message: "", company: "" }
  });

  useEffect(() => {
    const plan = params.get("plan");
    if (plan && programs.some((item) => item.id === plan)) setValue("selectedPlan", plan as SignupValues["selectedPlan"]);
  }, [params, setValue]);

  const selectedGoal = watch("goal");
  const selectedPlan = watch("selectedPlan");

  async function next() {
    const valid = await trigger(step === 1 ? "goal" : "selectedPlan");
    if (valid) setStep((value) => Math.min(3, value + 1));
  }

  async function submit(values: SignupValues) {
    setStatus("loading");
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json();
    setServerMessage(result.message || "Something went wrong.");
    setStatus(response.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="border-t-2 border-success bg-surface p-7 md:p-10" aria-live="polite">
        <span className="grid size-12 place-items-center border border-success text-success"><Check /></span>
        <p className="eyebrow mt-8 text-success">Request received</p>
        <h2 className="display-title mt-4">Now the work gets real.</h2>
        <p className="mt-5 max-w-xl leading-7 text-secondary">{serverMessage}</p>
        <ol className="mt-8 grid gap-4 border-t border-hairline pt-6 font-mono text-xs text-muted">
          <li><span className="mr-4 text-accent">001</span> We review your goal and selected plan.</li>
          <li><span className="mr-4 text-accent">002</span> A coach contacts you within one business day.</li>
          <li><span className="mr-4 text-accent">003</span> You book your first assessment and training session.</li>
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="mb-10 grid grid-cols-3 border-y border-hairline">
        {["Goal", "Plan", "Details"].map((label, index) => {
          const number = index + 1;
          return (
            <div key={label} className={cn("border-l border-hairline px-3 py-4 first:border-l-0 md:px-5", number === step && "bg-accent-tint")}>
              <p className={cn("font-mono text-[10px]", number <= step ? "text-accent" : "text-muted")}>00{number}</p>
              <p className="mt-1 text-xs uppercase text-secondary">{label}</p>
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <fieldset>
          <legend className="display-title text-3xl">What are you training for?</legend>
          <div className="mt-8 grid gap-px bg-hairline sm:grid-cols-2">
            {goals.map(([goal, description]) => (
              <label key={goal} className={cn("cursor-pointer bg-surface p-5 transition-colors hover:bg-raised", selectedGoal === goal && "border-l-2 border-accent bg-accent-tint")}>
                <input type="radio" value={goal} {...register("goal")} className="sr-only" />
                <span className="font-display text-xl font-bold uppercase">{goal}</span>
                <span className="mt-2 block text-sm leading-6 text-secondary">{description}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset>
          <legend className="display-title text-3xl">Choose your support level.</legend>
          <div className="mt-8 grid gap-px bg-hairline">
            {programs.map((program) => (
              <label key={program.id} className={cn("flex cursor-pointer items-center justify-between gap-4 bg-surface p-5 transition-colors hover:bg-raised", selectedPlan === program.id && "border-l-2 border-accent bg-accent-tint")}>
                <input type="radio" value={program.id} {...register("selectedPlan")} className="sr-only" />
                <div><span className="font-display text-xl font-bold uppercase">{program.name}</span><span className="mt-1 block text-xs text-muted">{program.description}</span></div>
                <span className="shrink-0 font-mono text-lg">${program.monthly}<small className="text-[10px] text-muted"> / MO</small></span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset>
          <legend className="display-title text-3xl">Tell us where to reach you.</legend>
          <div className="mt-8 grid gap-7 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message}><input {...register("name")} className={inputClass} placeholder="YOUR NAME" aria-invalid={!!errors.name} /></Field>
            <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" className={inputClass} placeholder="YOU@EMAIL.COM" aria-invalid={!!errors.email} /></Field>
            <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} type="tel" className={inputClass} placeholder="+1 000 000 0000" aria-invalid={!!errors.phone} /></Field>
            <Field label="Preferred start date" error={errors.preferredStartDate?.message}><input {...register("preferredStartDate")} type="date" className={inputClass} aria-invalid={!!errors.preferredStartDate} /></Field>
            <div className="sm:col-span-2"><Field label="Anything your coach should know?" error={errors.message?.message}><textarea {...register("message")} rows={4} className={inputClass} placeholder="INJURIES, EXPERIENCE, OR CONTEXT" /></Field></div>
            <input {...register("company")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          </div>
        </fieldset>
      ) : null}

      <div className="mt-10 flex items-center justify-between border-t border-hairline pt-6">
        {step > 1 ? <Button type="button" variant="ghost" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={15} className="mr-2" /> Back</Button> : <span />}
        {step < 3 ? <Button type="button" onClick={next}>Continue <ArrowRight size={15} className="ml-2" /></Button> : <Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Request trial"}</Button>}
      </div>
      <p className="mt-4 text-right text-sm text-error" aria-live="polite">{status === "error" ? serverMessage : ""}</p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-secondary">
      {label}
      {children}
      <span className="mt-2 block min-h-4 text-xs text-error">{error}</span>
    </label>
  );
}
