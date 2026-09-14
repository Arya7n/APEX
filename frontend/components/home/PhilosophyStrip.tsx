import { Reveal } from "@/components/motion/Reveal";

const pillars = [
  {
    index: "01",
    title: "Explore the machine",
    body: "Read a motorcycle as an engineering object — geometry, power, and restraint.",
  },
  {
    index: "02",
    title: "Understand the machine",
    body: "Translate specification into meaning. Displacement, torque, and electronics, without the brochure.",
  },
  {
    index: "03",
    title: "Compare the machine",
    body: "Measure difference. Power-to-weight, speed, and mass — calculated, never claimed as best.",
  },
];

export function PhilosophyStrip() {
  return (
    <section className="border-t border-line px-5 py-20 md:px-10 md:py-28">
      <div className="grid md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <Reveal
            key={pillar.index}
            delay={index * 0.08}
            className="border-t border-line py-10 md:border-l md:border-t-0 md:px-8 md:py-2 md:first:border-l-0 md:first:pl-0"
          >
            <article>
              <p className="font-mono text-[11px] tracking-[0.28em] text-accent">{pillar.index}</p>
              <h3 className="mt-5 max-w-xs font-display text-2xl leading-tight tracking-tight md:text-3xl">
                {pillar.title}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{pillar.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
