import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  body,
  className
}: {
  eyebrow: string;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="display-title text-balance">{title}</h2>
      {body ? <p className="mt-6 max-w-2xl text-base leading-7 text-secondary md:text-lg">{body}</p> : null}
    </div>
  );
}
