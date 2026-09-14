"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { getMachineImageAlt, PLACEHOLDER_MACHINE_IMAGE, resolveBikeImage } from "@/lib/images";
import type { Bike } from "@/lib/types";
import { buttonClassName } from "@/components/ui/Button";
import { CountUp } from "@/components/motion/CountUp";
import { duration, easePrecise } from "@/lib/motion";

export function Hero({ bike }: { bike?: Bike }) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const machine = bike
    ? {
        brand: bike.brand,
        model: bike.model,
        horsepower: bike.performance.horsepower,
        displacement: bike.engine.displacement,
        topSpeed: bike.performance.topSpeed,
        image: resolveBikeImage(bike),
      }
    : null;
  const specs = machine
    ? [
        { value: machine.horsepower ?? 0, suffix: "HP", missing: machine.horsepower == null },
        { value: machine.displacement ?? 0, suffix: "CC", missing: machine.displacement == null },
        { value: machine.topSpeed ?? 0, suffix: "KM/H", missing: machine.topSpeed == null },
      ]
    : [];

  return (
    <section
      className="relative min-h-[100svh] overflow-x-clip"
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        setOffset({ x, y });
      }}
    >
      <p className="pointer-events-none absolute left-1/2 top-[18%] z-0 -translate-x-1/2 font-display text-[28vw] leading-none text-foreground/[0.035] md:top-[8%] md:text-[18vw]">
        APEX
      </p>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1600px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-28 md:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:pb-20 lg:pt-24">
        <div className="min-w-0">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easePrecise }}
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted"
          >
            Digital showroom
          </motion.p>

          <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(2.5rem,11vw,5.75rem)] leading-[0.95] tracking-tight text-foreground sm:max-w-none">
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePrecise, delay: 0.08 }}
            >
              Performance,
            </motion.span>
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePrecise, delay: 0.16 }}
            >
              Engineered<span className="text-accent">.</span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 max-w-sm text-sm leading-relaxed text-muted md:text-base"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, delay: 0.35, ease: easePrecise }}
          >
            {machine
              ? `${machine.brand} ${machine.model} — live catalog from the performance archive.`
              : "Explore the world's most iconic performance motorcycles."}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, delay: 0.48, ease: easePrecise }}
          >
            <Link href="/explore" className={buttonClassName("solid")}>
              Explore machines
            </Link>
            <Link href="/compare" className={buttonClassName("outline")}>
              Compare machines
            </Link>
          </motion.div>
        </div>

        <div className="relative min-w-0">
          <motion.div
            className="relative mx-auto aspect-[16/10] w-full max-w-4xl lg:aspect-[16/11]"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easePrecise, delay: 0.2 }}
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: reduced ? undefined : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                transition: reduced ? undefined : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Image
                src={machine?.image ?? PLACEHOLDER_MACHINE_IMAGE}
                alt={machine ? getMachineImageAlt(machine.brand, machine.model) : "APEX performance motorcycle"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain object-center"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-8 top-4 hidden h-px bg-foreground/10 lg:block" />
            <div className="pointer-events-none absolute inset-y-8 left-4 hidden w-px bg-foreground/10 lg:block" />
          </motion.div>

          {specs.length > 0 ? (
            <motion.aside
              className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3 lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:w-36 lg:-translate-y-1/2 lg:grid-cols-1 xl:right-2"
              initial={reduced ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: duration.slow, delay: 0.55, ease: easePrecise }}
            >
              {specs.map((spec) => (
                <div key={spec.suffix} className="min-w-0 border border-line bg-surface/80 px-2 py-3 sm:px-3">
                  <p className="font-display text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl">
                    {spec.missing ? "—" : <CountUp value={spec.value} />}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:text-[10px] sm:tracking-[0.24em]">
                    {spec.suffix}
                  </p>
                </div>
              ))}
            </motion.aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
