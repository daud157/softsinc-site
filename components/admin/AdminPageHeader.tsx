import { cn } from "@/lib/cn";

export function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        {eyebrow ? (
          <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ss-primary ring-1 ring-ss-primary/10">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ss-text sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ss-text/65 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
