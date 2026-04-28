"use client";

import { motion } from "framer-motion";

import { ServiceCard } from "@/components/ServiceCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { Service } from "@/lib/services";

export function ServicesCatalog({ services }: { services: Service[] }) {
  return (
    <motion.div
      className="mt-10 space-y-6"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px 100px 0px" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-ss-text/70">
          Showing <span className="font-semibold text-ss-text">{services.length}</span>{" "}
          service{services.length === 1 ? "" : "s"}
        </div>
        <div className="hidden sm:block">
          <WhatsAppButton variant="ghost" />
        </div>
      </div>

      {services.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          {services.map((s) => (
            <motion.div key={s.slug} variants={fadeUp}>
              <ServiceCard service={s} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={fadeUp}>
          <Card className="p-10 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ss-bg-soft text-ss-primary ring-1 ring-ss-primary/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M3 7l9-4 9 4-9 4-9-4z" />
              <path d="M3 7v10l9 4 9-4V7" />
            </svg>
          </div>
          <div className="mt-4 text-base font-semibold tracking-tight">
            Catalog coming soon
          </div>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ss-text/65">
            Our team is curating premium digital tools and subscriptions.
            Message us on WhatsApp and we&apos;ll help you find what you need.
          </p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
