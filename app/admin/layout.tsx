import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
        <div className="absolute -bottom-48 right-[-140px] h-[620px] w-[620px] rounded-full bg-ss-bg-soft blur-3xl" />
      </div>
      {children}
    </div>
  );
}
