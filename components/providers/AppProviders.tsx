"use client";

import { MotionConfig } from "framer-motion";

import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
