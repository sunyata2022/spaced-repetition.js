import sm2, { SM2Item,SM2Result } from "../src/sm2";

describe('sm2', () => {
    test('export "sm2"', () => {
        expect(!sm2).toBe(false);
    });

    test('calling with default value ', () => {
        const result = sm2({quality: 5});

        expect(result.item.interval).toBe(1);
        expect(result.item.count).toBe(2);
        expect(result.item.efactor).toBe(2.5);
        expect(result.needRepeat).toBe(false);
    });

    const firstTimeItem: SM2Item = {
        interval: 0,
        count: 1,
        efactor: 2.5,
        quality: 5
    };

    test('first time with quality = 5', () => {
        const result = sm2(firstTimeItem);

        expect(result.item.interval).toBe(1);
        expect(result.item.count).toBe(2);
        expect(result.item.efactor).toBe(2.5);
        expect(result.needRepeat).toBe(false);
    });

    test('first time with quality = 3', () => {
        firstTimeItem.quality = 3;
        const result = sm2(firstTimeItem);


        expect(result.item.interval).toBe(1);
        expect(result.item.count).toBe(2);
        expect(result.item.efactor).toBe(2.36);
        expect(result.needRepeat).toBe(true);
    });

    test('first time with quality = 1', () => {
        firstTimeItem.quality = 1;
        const result = sm2(firstTimeItem);

        expect(result.item.interval).toBe(1);
        expect(result.item.count).toBe(1);
        expect(result.item.efactor).toBe(2.5);
        expect(result.needRepeat).toBe(true);
    });

    const secondTimeItem: SM2Item = {
        interval: 1,
        count: 2,
        efactor: 1.3,
        quality: 5
    };

    test('second time with quality = 5', () => {
        const result = sm2(secondTimeItem);

        expect(result.item.interval).toBe(6);
        expect(result.item.count).toBe(3);
        expect(result.item.efactor).toBe(1.4);
        expect(result.needRepeat).toBe(false);
    });

    test('second time with quality = 4', () => {
        secondTimeItem.quality = 4;
        const result = sm2(secondTimeItem);

        expect(result.item.interval).toBe(6);
        expect(result.item.count).toBe(3);
        expect(result.item.efactor).toBe(1.3);
        expect(result.needRepeat).toBe(false);
    });

    test('second time with quality = 1', () => {
        secondTimeItem.quality = 1;
        const result = sm2(secondTimeItem);

        expect(result.item.interval).toBe(1);
        expect(result.item.count).toBe(1);
        expect(result.item.efactor).toBe(2.5);
        expect(result.needRepeat).toBe(true);
    });

    const otherItem = {
        interval: 6,
        count: 3,
        efactor: 1.4,
        quality: 5
    };

    test('some time with quality = 5', () => {
        const result = sm2(otherItem);

        expect(result.item.interval).toBe(8);
        expect(result.item.count).toBe(4);
        expect(result.item.efactor).toBe(1.5);
        expect(result.needRepeat).toBe(false);
    });

    test('some time with quality = 4', () => {
        otherItem.quality = 4;
        const result = sm2(otherItem);

        expect(result.item.interval).toBe(8);
        expect(result.item.count).toBe(4);
        expect(result.item.efactor).toBe(1.4);
        expect(result.needRepeat).toBe(false);
    });

    test('some time with quality = 3', () => {
        otherItem.quality = 3;
        const result = sm2(otherItem);

        expect(result.item.interval).toBe(8);
        expect(result.item.count).toBe(4);
        expect(result.item.efactor).toBe(1.3);
        expect(result.needRepeat).toBe(true);
    });

    test('some time with quality = 1', () => {
        otherItem.quality = 1;
        const result = sm2(otherItem);

        expect(result.item.interval).toBe(1);
        expect(result.item.count).toBe(1);
        expect(result.item.efactor).toBe(2.5);
        expect(result.needRepeat).toBe(true);
    });
});

