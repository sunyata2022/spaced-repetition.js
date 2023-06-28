import { calculateEFactor } from './common';

export interface SM2Item {
  interval?: number;
  count?: number;
  efactor?: number;
  quality: number;
}

export interface SM2Result {
  item: SM2Item;
  needRepeat: boolean;
}

/**
 * Calculates the interval based on the count and efactor.
 *
 * @param {number} count - The count parameter.
 * @param {number} efactor - The efactor parameter.
 * @return {number} The calculated interval.
 */
function calculateInterval(count: number, efactor: number): number {
  if (count === 1) return 1;
  if (count === 2) return 6;

  return Math.round(Math.pow(efactor, count - 2) * 6);
}

/**
 * Calculates the next interval and other values for a given SM2Item, based on its
 * current values. If the quality is less than 4, the item is marked for repetition.
 *
 * @param {SM2Item} item - the SM2Item to calculate the next interval for
 * @return {SM2Result} an object with the next SM2Item and a boolean indicating if the item needs to be repeated
 */
function sm2(item: SM2Item): SM2Result {
  let { count = 0, efactor = 2.5, quality } = item;

  const nextItem: SM2Item = { count, efactor, quality };
  const needRepeat: boolean = quality < 4;
  nextItem.efactor = calculateEFactor(efactor, quality);

  if (quality < 3) {
    nextItem.interval = 0;
    nextItem.count = 0;
  } else {
    nextItem.count = count + 1;
    nextItem.interval = calculateInterval(count, efactor);
  }

  return { item: nextItem, needRepeat };
}

export default sm2;
