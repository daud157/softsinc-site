import Link from "next/link";

import { Container } from "@/components/Container";
import type { BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (items.length <= 1) return null;

  return (
    <Container className={className}>
      <nav aria-label="Breadcrumb" className="text-xs text-ss-text/55">
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex min-w-0 items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="min-w-0 truncate font-medium text-ss-text/75"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-ss-text">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
