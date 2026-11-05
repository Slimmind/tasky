type TimeUnit = "w" | "d" | "h" | "m";

const MINUTES_IN_UNIT: Record<TimeUnit, number> = {
  w: 5 * 8 * 60,
  d: 8 * 60,
  h: 60,
  m: 1,
};

export const estimationToMinutes = (str: string): number => {
  let total = 0;
  for (const [, quantity, unit] of str.matchAll(/(\d+)\s*([wdhm])/g)) {
    total += Number(quantity) * MINUTES_IN_UNIT[unit as TimeUnit];
  }
  return total;
};
