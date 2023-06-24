
import { calculateEFactor } from "./common";

export interface OFMatrix {
    [key: string]: number[]
}

export interface SM5Item {
    count?: number,
    efactor?: number,
    quality: number,
    matrix?: OFMatrix,
    interval: number,
    fraction?: number,
}

export interface SM5Result {
    item: SM5Item,
    needRepeat: boolean,
}

function createMatrixEntry(efactor: string, count: number = 20): number[] {
    const entrys: number[] = [];
    for (let i = 0; i < count; i++) {
        if (i === 0) {
            entrys.push(4);
        } else {
            entrys.push(Number(efactor))
        }
    }
    return entrys;
}

function initMatrix(): OFMatrix {
    const matrix: OFMatrix = {};

    for (let i = 1.3; i < 2.6; i += 0.1) {
        const efactor = i.toFixed(1);
        matrix[efactor] = createMatrixEntry(efactor);
    }

    return matrix;
}

function updateMetrix(matrix: OFMatrix, efactor: number, count: number, quality: number, fraction: number): void {
    let entryValue = matrix[efactor][count - 1];
    let tempValue = entryValue * (0.72 + quality * 0.07);
    entryValue = (1 - fraction) * entryValue + fraction * tempValue;

    matrix[efactor][count - 1] = entryValue;
}

function sm5(item: SM5Item): SM5Result {
    let { interval = 4, count = 1, efactor = 2.5, quality, matrix = initMatrix(), fraction = 1 } = item;
    
    if (efactor < 1.3) efactor = 1.3;
    if (efactor > 2.5) efactor = 2.5;
    if (quality < 0) quality = 0;
    if (quality > 5) quality = 5;

    const needRepeat: boolean = quality < 4;

    if (quality >= 3) {
        updateMetrix(matrix, efactor, count, quality, fraction);
        efactor = Number((Math.round(calculateEFactor(efactor, quality) * 10) / 10).toFixed(1));
        count += 1;
    }

    const nextItem = {
        count,
        efactor,
        quality,
        matrix,
        fraction,
        interval,
    };

    nextItem.interval = getInterval(nextItem);

    return {
        item: nextItem,
        needRepeat
    }
}

export function getInterval(item: SM5Item): number {
    const { efactor = 2.5, count = 1, matrix = initMatrix()} = item;

    if (count === 1) return matrix[efactor][count - 1];

    const entryValue = matrix[efactor][count - 1];

    return 0;
}

export default sm5;