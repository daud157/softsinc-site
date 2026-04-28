"use client";

import { ProductCard } from "@/components/ProductCard";
import type { Service } from "@/lib/services";

export function ServiceCard({
  service,
}: {
  service: Service;
}) {
  return <ProductCard product={service} />;
}

