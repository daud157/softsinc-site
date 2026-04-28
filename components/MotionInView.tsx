"use client";

import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/cn";

export function MotionInView({
  children,
  variants,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variants: Variants;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px 100px 0px" }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

