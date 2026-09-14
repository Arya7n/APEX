"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { duration, easePrecise } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: duration.base, ease: easePrecise, delay }}
    >
      {children}
    </motion.div>
  );
}
