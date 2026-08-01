/** Spec: 90ms stagger between siblings, capped at 5 steps. */
export function staggerDelay(index: number) {
  return Math.min(index, 5) * 0.09;
}
