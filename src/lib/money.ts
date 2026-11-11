/** $160 for whole dollars (compact), $160.00 when `cents` is set, and always cents for fractional prices ($123.45). */
export function money(n: number, opts: { cents?: boolean } = {}) {
  const whole = Number.isInteger(n) && !opts.cents;
  return `$${n.toLocaleString("en-US", whole ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
