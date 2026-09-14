export const easePrecise: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const duration = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easePrecise },
  },
};
