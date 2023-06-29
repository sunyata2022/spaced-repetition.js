import { calculateEFactor } from './common';

export interface OFMatrix {
  [key: string]: number[];
}

export interface SM5Item {
  count?: number;
  efactor?: number;
  quality: number;
  matrix?: OFMatrix;
  fraction?: number;
}

export interface SM5Result {
  item: SM5Item;
  needRepeat: boolean;
}

function createMatrixEntry(efactor: string, count: number = 20): number[] {
  const entrys: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      entrys.push(4);
    } else {
      entrys.push(Number(efactor));
    }
  }
  return entrys;
}

export function initMatrix(): OFMatrix {
  const matrix: OFMatrix = {};

  for (let i = 1.3; i < 2.6; i += 0.1) {
    const efactor = i.toFixed(1);
    matrix[efactor] = createMatrixEntry(efactor);
  }

  return matrix;
}

function updateMetrix(
  matrix: OFMatrix,
  efactor: number,
  count: number,
  quality: number,
  fraction: number,
): void {
  let entryValue = matrix[efactor.toFixed(1)][count - 1];
  let tempValue = entryValue * (0.72 + quality * 0.07);
  entryValue = (1 - fraction) * entryValue + fraction * tempValue;

  matrix[efactor.toFixed(1)][count - 1] = Math.round(entryValue * 100) / 100;
}

function sm5(item: SM5Item): SM5Result {
  let {
    count = 0,
    efactor = 2.5,
    quality,
    matrix = initMatrix(),
    fraction = 1,
  } = item;

  const needRepeat: boolean = quality < 4;
  const nextItem = { count, efactor, quality, matrix, fraction };
  nextItem.efactor = calculateEFactor(efactor, quality);
  updateMetrix(matrix, efactor, count, quality, fraction);
  nextItem.count = quality >= 3 ? count + 1 : 0;

  return {
    item: nextItem,
    needRepeat,
  };
}

function getInterval_internal(item: SM5Item): number {
  const { efactor, count, matrix } = item;

  if (item == null || matrix == null || efactor == null || !count || count < 1) return 0;

  if (count === 1) return matrix[efactor.toFixed(1)][count - 1];

  return (
    matrix[efactor.toFixed(1)][count - 1] * getInterval_internal({ ...item, count: count - 1 })
  );
}

export function getInterval(item: SM5Item): number {
  return Math.round(getInterval_internal(item));
}

export default sm5;
