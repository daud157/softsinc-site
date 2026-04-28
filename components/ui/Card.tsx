import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/80 shadow-[0_10px_30px_-18px_rgba(17,24,39,0.35)] ring-1 ring-black/5 backdrop-blur dark:bg-zinc-900/75 dark:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] dark:ring-white/10",
        className
      )}
      {...props}
    />
  );
}

