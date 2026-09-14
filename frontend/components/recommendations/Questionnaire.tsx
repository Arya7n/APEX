"use client";

import { useState } from "react";
import { getRecommendations } from "@/lib/api";
import type { Questionnaire as Answers, Recommendation } from "@/lib/types";
import { BikeCard } from "@/components/bike/BikeCard";

const steps: Array<{ key: keyof Answers; title: string; options: string[] }> = [
  { key: "purpose", title: "Where will you ride?", options: ["street", "track", "superbike", "naked"] },
  { key: "engine", title: "Preferred engine?", options: ["single", "twin", "triple", "four", "v4"] },
  { key: "performance", title: "Performance level?", options: ["low", "medium", "high"] },
  { key: "weight", title: "Weight preference?", options: ["light", "medium", "heavy"] },
  { key: "experience", title: "Rider experience?", options: ["beginner", "intermediate", "expert"] },
];

export function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const choose = async (value: string) => {
    const next = { ...answers, [steps[step]!.key]: value } as Answers;
    setAnswers(next);
    if (step < steps.length - 1) setStep(step + 1);
    else {
      setLoading(true);
      try {
        setResults(await getRecommendations(next));
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <section className="px-5 pb-24 md:px-10">
        <p className="animate-pulse font-display text-3xl sm:text-4xl">Calculating match…</p>
      </section>
    );
  }

  if (results.length) {
    return (
      <section className="px-5 pb-24 md:px-10">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item, index) => (
            <div key={item.bike.slug} className="min-w-0">
              <div className="border border-line border-b-0 bg-surface p-4 sm:p-5">
                <strong className="font-display text-3xl text-accent sm:text-4xl">{item.match}%</strong>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.reasons.join(" · ") || "Closest available profile"}
                </p>
              </div>
              <BikeCard bike={item.bike} index={index + 1} className="min-w-0" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setResults([]);
            setStep(0);
            setAnswers({});
          }}
          className="mt-8 border border-line px-5 py-3 text-xs uppercase tracking-widest"
        >
          Start again
        </button>
      </section>
    );
  }

  const current = steps[step]!;
  return (
    <section className="px-5 pb-24 md:px-10">
      <p className="font-mono text-xs text-muted">
        STEP {step + 1} / {steps.length}
      </p>
      <h2 className="mt-5 font-display text-3xl sm:text-4xl">{current.title}</h2>
      <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
        {current.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            className="border border-line bg-surface p-5 text-left font-display text-xl capitalize hover:border-accent sm:p-6 sm:text-2xl"
          >
            {option}
          </button>
        ))}
      </div>
      {step > 0 ? (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-6 text-xs uppercase tracking-widest text-muted"
        >
          ← Back
        </button>
      ) : null}
    </section>
  );
}
