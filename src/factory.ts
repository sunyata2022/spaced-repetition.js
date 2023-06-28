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

export type SMQuality = 0 | 1 | 2 | 3 | 4 | 5;

abstract class SuperMemo {
  protected readonly smtype: SMType = SMType.None;
  abstract evaluate(quality: SMQuality, smdata: string): SMResult;
  abstract getMatrix(): string;

  protected parseSMData(smdata: string): SMItem {
    if (smdata == null || smdata === '') {
      return { count: 0, efactor: 2.5 };
    }

    const [smtype, efactor, count] = smdata.split(',').map(Number);

    if (smtype === this.smtype) {
      return { efactor, count };
    } else {
      throw new SMTypeError(
        `smdata's type is SMType.SM${smtype}, it should be SMType.SM${this.smtype}`,
      );
    }
  }

  protected encodeSMData(efactor: number, count: number): string {
    return [this.smtype, efactor, count].join(',');
  }
}

class SuperMemo2 extends SuperMemo {
  protected readonly smtype: SMType = SMType.SM2;

  evaluate(quality: SMQuality, smdata: string = ''): SMResult {
    const { efactor, count } = this.parseSMData(smdata);
    const { needRepeat: repeat, item } = sm2({ efactor, count, quality });
    const nextSMData = this.encodeSMData(item!.efactor!, item!.count!);
    return { repeat, interval: item!.interval!, smdata: nextSMData };
  }

  getMatrix(): string {
    return '';
  }
}

class SuperMemo4 extends SuperMemo {
  protected readonly smtype: SMType = SMType.SM4;
  private matrix: OIMatrix;

  constructor(matrix: string) {
    super();
    if (matrix == null || matrix.length === 0) {
      this.matrix = initOIMatrix();
    } else {
      this.matrix = JSON.parse(matrix);
    }
  }

  getMatrix(): string {
    return JSON.stringify(this.matrix);
  }

  evaluate(quality: SMQuality, smdata: string = ''): SMResult {
    const { efactor, count } = this.parseSMData(smdata);
    const { needRepeat: repeat, item } = sm4({ efactor, count, quality });
    const nextSMData = this.encodeSMData(item!.efactor!, item!.count!);
    return {
      repeat,
      interval: getOIMInterval({
        efactor,
        count,
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

  constructor(matrix: string) {
    super();
    if (matrix == null || matrix.length === 0) {
      this.matrix = initOFMatrix();
    } else {
      this.matrix = JSON.parse(matrix);
    }
  }

  getMatrix(): string {
    return JSON.stringify(this.matrix);
  }

  evaluate(quality: SMQuality, smdata: string = ''): SMResult {
    const { efactor, count } = this.parseSMData(smdata);
    const { needRepeat: repeat, item } = sm5({ efactor, count, quality });
    const nextSMData = this.encodeSMData(item!.efactor!, item!.count!);
    return {
      repeat,
      interval: getOFInterval({ efactor, count, matrix: this.matrix, quality }),
      smdata: nextSMData,
    };
  }
}

export default class SMFactory {
  static getSuperMemo(type: SMType, metrix: string = ''): SuperMemo | null {
    switch (type) {
      case SMType.SM2:
        return new SuperMemo2();
      case SMType.SM4:
        return new SuperMemo4(metrix);
      case SMType.SM5:
        return new SuperMemo5(metrix);
      default:
        return null;
    }
  }
}
