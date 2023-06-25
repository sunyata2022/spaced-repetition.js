import sm5, { OFMatrix, getInterval, SM5Item, SM5Result } from './../src/sm5';

function newEFactor(efactor: number, quality: number) {
  efactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);

  if (efactor < 1.3) efactor = 1.3;
  if (efactor > 2.5) efactor = 2.5;

  return Math.round(efactor * 10) / 10;
}

function testGetInterval(item: SM5Item, start: boolean = true): number {
  const { efactor, count, matrix } = item;
  
  if(count === 1) return matrix![efactor!][count! - 1];

  const interval =
    matrix![efactor!][count! - 1] *
    testGetInterval({ ...item, count: count! - 1 }, false);

  return start ? Math.round(interval) : interval;
}

describe('sm5', () => {
  test('export "sm5"', () => {
    expect(!sm5).toBe(false);
  });

  test('calling with default value ', () => {
    const result = sm5({ quality: 5 });
    const matrix = result.item.matrix;

    expect(result.item.count).toBe(1);
    expect(result.item.efactor).toBe(newEFactor(2.5, 5));
    expect(result.needRepeat).toBe(false);

    expect(!matrix).toBe(false);
  });

  test('OI Matrix change', () => {
    const {
      item: { matrix: originMatrix },
    } = sm5({ quality: 4 });
    let result = sm5({ quality: 5, efactor: 2.5, count: 1 });

    expect(result.item.matrix![2.5][0]).not.toBe(originMatrix![2.5][0]);
    expect(result.item.matrix![2.5][1]).toBe(originMatrix![2.5][1]);

    result = sm5({ quality: 3, efactor: 1.5, count: 2 });
    expect(result.item.matrix![1.5][1]).not.toBe(originMatrix![1.5][1]);
    expect(result.item.matrix![1.5][2]).toBe(originMatrix![1.5][2]);
  });

  test('getInterval', () => {
    let result = sm5({ quality: 5, efactor: 2.5, count: 1 });
    console.log(result.item)
    expect(testGetInterval(result.item)).toBe(getInterval(result.item));

    result = sm5({ quality: 4, efactor: 2.1, count: 5 });
    expect(testGetInterval(result.item)).toBe(getInterval(result.item));

    result = sm5({ quality: 3, efactor: 1.5, count: 2 });
    expect(testGetInterval(result.item)).toBe(getInterval(result.item));
    expect(result.needRepeat).toBe(true);

    result = sm5({ quality: 2, efactor: 1.5, count: 2 });
    expect(result.needRepeat).toBe(true);
  });
});
