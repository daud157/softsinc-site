import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";

export const metadata: Metadata = {
  title: "Products",
};

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Admin"
        title="Manage Products"
        subtitle="Add new products, upload logos, set top-level pricing, configure plans with their own pricing, and disable items without deleting them."
      />
      <AdminProductsPanel />
    </div>
  );
}
