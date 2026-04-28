import { cn } from "@/lib/cn";

export function TrustBadges({ className }: { className?: string }) {
  const items = [
    { label: "500+ Happy Customers" },
    { label: "Fast Support" },
    { label: "Warranty Included" },
    { label: "Secure Process" },
  ];

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {items.map((i) => (
        <div
          key={i.label}
          className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ss-text ring-1 ring-black/[0.07] backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-100 dark:ring-white/10"
        >
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-ss-bg-soft text-[10px] font-black text-ss-primary ring-1 ring-ss-primary/10">
            ✓
          </span>
          {i.label}
        </div>
      ))}
    </div>
  );
}

