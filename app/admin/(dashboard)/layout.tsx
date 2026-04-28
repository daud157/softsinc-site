import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Container } from "@/components/Container";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-8 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <AdminSidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </Container>
  );
}
