export interface SM2Item {
    interval?: number,
    count?: number,
    efactor?: number,
    quality: number,
}

export interface SM2Result {
    item: SM2Item,
    needRepeat: boolean,
}

/**
 * Calculates the E-factor of a given quality.
 *
 * @param {number} efactor - The E-factor to calculate.
 * @param {number} quality - The quality to use in the calculation.
 * @return {number} The calculated E-factor.
 */
function calculateEFactor(efactor: number, quality: number): number {
    let nextEFactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (nextEFactor > 2.5) return 2.5;
    else if (nextEFactor < 1.3) return 1.3;
    else return Number(nextEFactor.toFixed(3));
}

/**
 * Calculates the result of multiplying an interval by an efactor.
 *
 * @param {number} interval - The interval to be multiplied.
 * @param {number} efactor - The efactor to multiply the interval by.
 * @return {number} The result of the multiplication.
 */
function calculateInterval(interval: number, efactor: number): number {
    return Math.round(interval * efactor);
}

/**
 * Calculates the next interval and other values for a given SM2Item, based on its
 * current values. If the quality is less than 4, the item is marked for repetition.
 *
 * @param {SM2Item} item - the SM2Item to calculate the next interval for
 * @return {SM2Result} an object with the next SM2Item and a boolean indicating if the item needs to be repeated
 */
function sm2(item: SM2Item): SM2Result {
    const { interval = 1, count = 1, efactor = 2.5, quality } = item;
    const needRepeat: boolean = quality < 4;
    const nextItem: SM2Item = {
        interval,
        count,
        efactor,
        quality,
    };

    if (quality < 3) {
        nextItem.interval = 1;
        nextItem.count = 1;
        nextItem.efactor = 2.5;
    } else {
        switch (count) {
            case 1:
                nextItem.interval = 1;
                break;
            case 2:
                nextItem.interval = 6;
                break;
            default:
                nextItem.interval = calculateInterval(interval, efactor);
                break;
        }

        nextItem.count = count + 1;
        nextItem.efactor = calculateEFactor(efactor, quality);
    }

    return { item: nextItem, needRepeat }
}

export default sm2;