import { calculateEFactor } from './common';

export interface OIMatrix {
  [key: string]: number[];
}

export interface SM4Item {
  count?: number;
  efactor?: number;
  quality: number;
  matrix?: OIMatrix;
  fraction?: number;
}

export interface SM4Result {
  item: SM4Item;
  needRepeat: boolean;
}

function createMatrixEntry(efactor: string, count: number = 20): number[] {
  const entrys: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      entrys.push(1);
    } else if (i === 1) {
      entrys.push(6);
    } else {
      const lastEntry = entrys.at(-1);
      entrys.push(Math.round(lastEntry! * Number(efactor)));
    }
  }
  return entrys;
}

function initMatrix(): OIMatrix {
  const matrix: OIMatrix = {};

  for (let i = 1.3; i < 2.6; i += 0.1) {
    const efactor = i.toFixed(1);
    matrix[efactor] = createMatrixEntry(efactor);
  }

  return matrix;
}

function updateMetrix(
  matrix: OIMatrix,
  efactor: number,
  count: number,
  quality: number,
  fraction: number,
): void {
  let entryValue = matrix[efactor][count - 1];
  let tempValue = entryValue + ((entryValue * (1 - 1 / efactor)) / 2) * (0.25 * quality - 1);
  entryValue = (1 - fraction) * entryValue + fraction * tempValue;

  matrix[efactor][count - 1] = entryValue;
}

function sm4(item: SM4Item): SM4Result {
  let { count = 0, efactor = 2.5, quality, matrix = initMatrix(), fraction = 1 } = item;

  const nextItem = { count, efactor, quality, matrix, fraction };
  const needRepeat: boolean = quality < 4;

  nextItem.efactor = calculateEFactor(efactor, quality);
  updateMetrix(matrix, efactor, count, quality, fraction);
  nextItem.count = quality >= 3 ? count + 1 : 0;

  return {
    item: nextItem,
    needRepeat,
  };
}

export function getInterval(item: SM4Item): number {
  const { efactor, count, matrix } = item;
  if (item == null || matrix == null || efactor == null || count == null) {
    return -1;
  }

  return matrix[efactor][count - 1];
}

export default sm4;
