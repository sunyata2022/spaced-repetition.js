import { SM2Result } from './../src/sm2';
import { SMFactory, SMType, SMResult } from "../src";

function randomSMData(smtype: SMType): string {
    return [smtype, randomEfactor(), randomCount()].join(',');
}

function randomCount() : number {
    return Math.floor((Math.random()*8) + 1);
}

function randomEfactor(): string {
    return (Math.floor((Math.random()*13) + 13) / 10).toFixed(1);
}

function randomQuality(start: number = 0, end: number = 6): number {
    return Math.floor((Math.random()*(end + 1 - start)) + start);
}

function printMatrix(matrix: string) {
    const m = JSON.parse(matrix);
    for(let i = 1.3; i <= 2.6; i += 0.1) {
        console.log(`${i.toFixed(1)}\t${m[i.toFixed(1)].join('\t')}`);
    }

    console.log('\n');
}

function testMatrixChanging() {
    const sm4 = SMFactory.getSuperMemo(SMType.SM4);
    
    const counts = 1000;
    let matrix = '';

    for(let i = 0; i < counts; i++) {
        matrix = sm4!.getMatrix();

        const quality = randomQuality();
        const smdata = randomSMData(SMType.SM4);

        printMatrix(matrix);

        const result = sm4?.evaluate(quality,smdata);
        console.log(quality, result?.repeat, result?.interval, result?.smdata);
    }
}

function testIntervalChanging() {
    const sm5 = SMFactory.getSuperMemo(SMType.SM5); 

    const counts = 100;
    let smdata : string|undefined = '5,1.8,0';

    for(let i = 0; i < counts; i++) {
        const quality = randomQuality();
        const result: SMResult | undefined = sm5?.evaluate(quality, smdata);    
        smdata = result?.smdata;

        console.log(quality, result?.repeat, result?.interval, result?.smdata);
    }
}

testIntervalChanging();