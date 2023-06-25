import sm4, { OIMatrix, getInterval, SM4Item, SM4Result } from './../src/sm4';

function newEFactor(efactor: number, quality: number) {
  efactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);

  if (efactor < 1.3) efactor = 1.3;
  if (efactor > 2.5) efactor = 2.5;

  return Math.round(efactor * 10) / 10;
}

describe('sm4', () => {
  function getEntryValue(
    matrix: OIMatrix,
    efactor: number,
    count: number,
    quality: number,
    fraction: number,
  ) {
    let entryValue = matrix[efactor][count - 1];
    let tempValue =
      entryValue +
      ((entryValue * (1 - 1 / efactor)) / 2) * (0.25 * quality - 1);
    entryValue = (1 - fraction) * entryValue + fraction * tempValue;

    return entryValue;
  }

  test('export "sm4"', () => {
    expect(!sm4).toBe(false);
  });

  test('calling with default value ', () => {
    const result = sm4({ quality: 5 });
    const matrix = result.item.matrix;

    expect(result.item.count).toBe(1);
    expect(result.item.efactor).toBe(newEFactor(2.5, 5));
    expect(result.needRepeat).toBe(false);

    expect(!matrix).toBe(false);
  });

  test('OI Matrix change', () => {
    const {
      item: { matrix: originMatrix },
    } = sm4({ quality: 4 });
    let result = sm4({ quality: 5, efactor: 2.5, count: 1 });

    expect(result.item.matrix![2.5][0]).toBe(
      getEntryValue(originMatrix!, 2.5, 1, 5, 1),
    );
    expect(result.item.matrix![2.5][1]).toBe(originMatrix![2.5][1]);

    result = sm4({ quality: 3, efactor: 1.5, count: 2 });
    expect(result.item.matrix![1.5][1]).toBe(
      getEntryValue(originMatrix!, 1.5, 2, 3, 1),
    );
  });

  test('getInterval', () => {
    let result = sm4({ quality: 5, efactor: 2.5, count: 1 });
    expect(
      result.item.matrix![result!.item!.efactor!][result!.item!.count! - 1],
    ).toBe(getInterval(result.item));

    result = sm4({ quality: 4, efactor: 2.1, count: 5 });
    expect(
      result.item.matrix![result!.item!.efactor!][result!.item!.count! - 1],
    ).toBe(getInterval(result.item));

    result = sm4({ quality: 3, efactor: 1.5, count: 2 });
    expect(
      result.item.matrix![result!.item!.efactor!][result!.item!.count! - 1],
    ).toBe(getInterval(result.item));
    expect(result.needRepeat).toBe(true);

    result = sm4({ quality: 2, efactor: 1.5, count: 2 });
    expect(result.needRepeat).toBe(true);
  });
});
