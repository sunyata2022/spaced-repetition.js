import sm2 from './sm2';
import sm4, {
  OIMatrix,
  initMatrix as initOIMatrix,
  getInterval as getOIMInterval,
} from './sm4';
import sm5, {
  OFMatrix,
  initMatrix as initOFMatrix,
  getInterval as getOFInterval,
} from './sm5';

export enum SMType {
  None = 0,
  SM2 = 2,
  SM4 = 4,
  SM5 = 5,
}

export interface SMResult {
  repeat: boolean;
  interval: number;
  smdata: string;
}

interface SMItem {
  count: number;
  efactor: number;
}

abstract class SuperMemo {
  protected readonly smtype: SMType = SMType.None;
  abstract evaluate(quality: number, smdata: string | undefined): SMResult;
  abstract getMatrix(): string;

  protected parseSMData(smdata: string): SMItem {
    if (smdata == null || smdata === '') {
      return { count: 0, efactor: 2.5 };
    }

    const [smtype, efactor, count] = smdata.split(',').map(Number);

    if (smtype === this.smtype) {
      return { efactor, count };
    } else {
      throw new Error(
        `smdata's type is SMType.SM${smtype}, it should be SMType.SM${this.smtype}`,
      );
    }
  }

  protected encodeSMData(efactor: number, count: number): string {
    return [this.smtype, efactor.toFixed(1), count].join(',');
  }
}

class SuperMemo2 extends SuperMemo {
  protected readonly smtype: SMType = SMType.SM2;

  evaluate(quality: number, smdata: string = ''): SMResult {
    const { efactor, count } = this.parseSMData(smdata);
    const { needRepeat: repeat, item } = sm2({ efactor, count, quality });
    const nextSMData = this.encodeSMData(
      item!.efactor!,
      repeat ? 0 : item!.count!,
    );
    return {
      repeat,
      interval: repeat ? 0 : item!.interval!,
      smdata: nextSMData,
    };
  }

  getMatrix(): string {
    return '';
  }
}

class SuperMemo4 extends SuperMemo {
  protected readonly smtype: SMType = SMType.SM4;
  private matrix: OIMatrix;
  private fraction: number;

  constructor(matrix: string | undefined | null, fraction: number) {
    super();

    if (matrix == null || matrix.length === 0) {
      this.matrix = initOIMatrix();
    } else {
      this.matrix = JSON.parse(matrix);
    }

    this.fraction = fraction;
  }

  getMatrix(): string {
    return JSON.stringify(this.matrix);
  }

  evaluate(quality: number, smdata: string = ''): SMResult {
    const { efactor, count } = this.parseSMData(smdata);
    const { needRepeat: repeat, item } = sm4({
      efactor,
      count,
      quality,
      matrix: this.matrix,
      fraction: this.fraction,
    });
    const nextSMData = this.encodeSMData(
      item!.efactor!,
      repeat ? 0 : item!.count!,
    );
    return {
      repeat,
      interval: repeat
        ? 0
        : getOIMInterval({
            efactor,
            count: item.count,
            matrix: this.matrix,
            quality,
          }),
      smdata: nextSMData,
    };
  }
}

class SuperMemo5 extends SuperMemo {
  protected readonly smtype: SMType = SMType.SM5;
  private matrix: OFMatrix;
  private fraction: number;

  constructor(matrix: string | undefined | null, fraction: number) {
    super();

    if (matrix == null || matrix.length === 0) {
      this.matrix = initOFMatrix();
    } else {
      this.matrix = JSON.parse(matrix);
    }

    this.fraction = fraction;
  }

  getMatrix(): string {
    return JSON.stringify(this.matrix);
  }

  evaluate(quality: number, smdata: string = ''): SMResult {
    const { efactor, count } = this.parseSMData(smdata);
    const { needRepeat: repeat, item } = sm5({
      efactor,
      count,
      quality,
      matrix: this.matrix,
      fraction: this.fraction,
    });
    const nextSMData = this.encodeSMData(
      item!.efactor!,
      repeat ? 0 : item!.count!,
    );
    return {
      repeat,
      interval: repeat
        ? 0
        : getOFInterval({ efactor, count:item.count, matrix: this.matrix, quality }),
      smdata: nextSMData,
    };
  }
}

export default class SMFactory {
  static getSuperMemo(
    type: SMType,
    metrix: string | undefined | null = null,
    fraction: number = 1,
  ): SuperMemo | null {
    switch (type) {
      case SMType.SM2:
        return new SuperMemo2();
      case SMType.SM4:
        return new SuperMemo4(metrix, fraction);
      case SMType.SM5:
        return new SuperMemo5(metrix, fraction);
      default:
        return null;
    }
  }
}
