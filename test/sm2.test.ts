import sm2, { SM2Item, SM2Result } from '../src/sm2';

function newEFactor(efactor: number, quality: number) {
  efactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);

  if (efactor < 1.3) efactor = 1.3;
  if (efactor > 2.5) efactor = 2.5;

  return Math.round(efactor * 10) / 10;
}

function newInterval(efactor: number, interval: number) {
  return Math.round(interval * efactor);
}

describe('sm2', () => {
  test('export "sm2"', () => {
    expect(!sm2).toBe(false);
  });

  test('calling with default value ', () => {
    const result = sm2({ quality: 5 });

    expect(result.item.interval).toBe(1);
    expect(result.item.count).toBe(1);
    expect(result.item.efactor).toBe(2.5);
    expect(result.needRepeat).toBe(false);
  });

  const firstTimeItem: SM2Item = {
    interval: 1,
    count: 1,
    efactor: 2.5,
    quality: 5,
  };

  test('first time with quality = 5', () => {
    const result = sm2(firstTimeItem);

    expect(result.item.interval).toBe(6);
    expect(result.item.count).toBe(2);
    expect(result.item.efactor).toBe(2.5);
    expect(result.needRepeat).toBe(false);
  });

  test('first time with quality = 3', () => {
    firstTimeItem.quality = 3;
    const result = sm2(firstTimeItem);

    expect(result.item.interval).toBe(6);
    expect(result.item.count).toBe(2);
    expect(result.item.efactor).toBe(newEFactor(2.5, 3));
    expect(result.needRepeat).toBe(true);
  });

  test('first time with quality = 1', () => {
    firstTimeItem.quality = 1;
    const result = sm2(firstTimeItem);

    expect(result.item.interval).toBe(0);
    expect(result.item.count).toBe(0);
    expect(result.item.efactor).toBe(newEFactor(2.5, 1));
    expect(result.needRepeat).toBe(true);
  });

  const secondTimeItem: SM2Item = {
    interval: 1,
    count: 2,
    efactor: 1.3,
    quality: 5,
  };

  test('second time with quality = 5', () => {
    const result = sm2(secondTimeItem);

    expect(result.item.interval).toBe(
      newInterval(secondTimeItem!.efactor!, secondTimeItem!.interval!),
    );
    expect(result.item.count).toBe(3);
    expect(result.item.efactor).toBe(1.4);
    expect(result.needRepeat).toBe(false);
  });

  test('second time with quality = 4', () => {
    secondTimeItem.quality = 4;
    const result = sm2(secondTimeItem);

    expect(result.item.interval).toBe(
      newInterval(secondTimeItem!.efactor!, secondTimeItem!.interval!),
    );
    expect(result.item.count).toBe(3);
    expect(result.item.efactor).toBe(1.3);
    expect(result.needRepeat).toBe(false);
  });

  test('second time with quality = 1', () => {
    secondTimeItem.quality = 1;
    const result = sm2(secondTimeItem);

    expect(result.item.interval).toBe(0);
    expect(result.item.count).toBe(0);
    expect(result.item.efactor).toBe(newEFactor(1.3, 1));
    expect(result.needRepeat).toBe(true);
  });

  const otherItem = {
    interval: 6,
    count: 3,
    efactor: 1.4,
    quality: 5,
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

    expect(result.item.interval).toBe(0);
    expect(result.item.count).toBe(0);
    expect(result.item.efactor).toBe(newEFactor(1.4, 1));
    expect(result.needRepeat).toBe(true);
  });
});
