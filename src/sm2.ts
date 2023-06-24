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
  let { interval = 0, count = 0, efactor = 2.5, quality } = item;
  const nextItem: SM2Item = { interval, count, efactor, quality };

  const needRepeat: boolean = quality < 4;
  nextItem.efactor = calculateEFactor(efactor, quality);

  if (quality < 3) {
    nextItem.interval = 0;
    nextItem.count = 0;
  } else {
    nextItem.count = count + 1;

    switch (nextItem.count) {
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
  }

  return { item: nextItem, needRepeat };
}

export default sm2;
