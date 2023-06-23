import { calculateEFactor } from "./common";

export interface OIMatrix {
    [key: string]: number[]
}

export interface SM4Item {
    interval?: number,
    count?: number,
    efactor?: number,
    quality: number,
    matrix: OIMatrix,
}

export interface SM4Result {
    item: SM4Item,
    needRepeat: boolean,
}

// function createMatrixEntry(efactor: string, count: number = 20): number[] {
//     const entrys: number[] = [];
//     for (let i = 0; i < count; i++) {
//         if (i === 0) {
//             entrys.push(1);
//         } else if (i === 1) {
//             entrys.push(6);
//         } else {
//             const lastEntry = entrys.at(-1);
//             entrys.push(lastEntry! * Number(efactor));
//         }
//     }
//     return entrys;
// }

// function initMatrix(): OIMatrix {
//     const matrix: OIMatrix = {};

//     for (let i = 1.3; i < 2.6; i += 0.1) {
//         const efactor = i.toFixed(1);
//         matrix[efactor] = createMatrixEntry(efactor);
//     }

//     return matrix;
// }

function updateMetrix(matrix: OIMatrix, count: number, efactor: number): void {
    if (matrix[efactor] == null) {
        matrix[efactor] = [];
    }

    for (let i = matrix[efactor].length - 1; i < count; i++) {
        for (let i = 0; i < count; i++) {
            if (i === 0) {
                matrix[efactor].push(1);
            } else if (i === 1) {
                matrix[efactor].push(6);
            } else {
                const lastEntry = matrix[efactor].at(-1);
                matrix[efactor].push(lastEntry! * Number(efactor));
            }
        }
    }
}

function sm4(item: SM4Item): SM4Result {
    let { interval = 1, count = 1, efactor = 2.5, quality, matrix } = item;

    if (interval < 1) interval = 1;
    if (count < 1) count = 1;
    if (efactor < 1.3) efactor = 1.3;
    if (efactor > 2.5) efactor = 2.5;
    if (quality < 0) quality = 0;
    if (quality > 5) quality = 5;

    const needRepeat: boolean = quality < 4;

    if (quality > 3) {
        updateMetrix(matrix, count, efactor);
        efactor = calculateEFactor(efactor, quality);
        count += 1;
    }

    return {
        item,
        needRepeat
    }
}


export default sm4;