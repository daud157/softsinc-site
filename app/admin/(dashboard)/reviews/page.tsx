import type { Metadata } from "next";

import { AdminReviewsPanel } from "@/components/admin/AdminReviewsPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Reviews",
};

export const dynamic = "force-dynamic";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Admin"
        title="Manage Reviews"
        subtitle="Upload review screenshots, attach service and customer details, and curate what shows on the public Reviews page."
      />
      <AdminReviewsPanel />
    </div>
  );
}
