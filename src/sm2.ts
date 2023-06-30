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

function calculateInterval(count: number, efactor: number): number {
  if (count === 1) return 1;
  if (count === 2) return 6;

  return Math.round(Math.pow(efactor, count - 2) * 6);
}

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
    nextItem.interval = calculateInterval(nextItem.count, efactor);
  }

  return { item: nextItem, needRepeat };
}

export default sm2;
