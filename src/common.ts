/**
 * Calculates the E-factor of a given quality.
 *
 * @param {number} efactor - The E-factor to calculate.
 * @param {number} quality - The quality to use in the calculation.
 * @return {number} The calculated E-factor.
 */
export function calculateEFactor(efactor: number, quality: number): number {
    let nextEFactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (nextEFactor > 2.5) return 2.5;
    else if (nextEFactor < 1.3) return 1.3;
    else return Number(nextEFactor.toFixed(3));
}