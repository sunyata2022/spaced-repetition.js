import SMFactory, { SMType, SMResult } from '../src/factory';

describe('class SMFactory', () => {
    it('should be defined', () => {
        expect(SMFactory).toBeDefined();
    });

    it('all algrothem should be defined', () => {
        expect(SMFactory.getSuperMemo(SMType.SM2)).toBeDefined();
        expect(SMFactory.getSuperMemo(SMType.SM4)).toBeDefined();
        expect(SMFactory.getSuperMemo(SMType.SM5)).toBeDefined();
    });
});

describe('class SuperMemo2', () => {
    const sm2 = SMFactory.getSuperMemo(SMType.SM2);
    
    it('should be defined', () => {
        expect(sm2).toBeDefined();
    });

    it('getMatrix should return empty string', () => {
        expect(sm2?.getMatrix()).toBe('');
    })

    it('evaluate should throw error', () => {
        expect(() => sm2?.evaluate(4, '1,3,4')).toThrow();
    })

    it('evaluate should worked', () => {
        const result = sm2?.evaluate(4, '2,2.5,1');
        expect(result).toBeDefined();

        expect(result?.repeat).toBe(false);
        expect(result?.interval).toBe(6);
        expect(result?.smdata).toBe('2,2.5,2');
    });
});

describe('class SuperMemo4', () => {
    const sm4 = SMFactory.getSuperMemo(SMType.SM4);
    
    it('should be defined', () => {
        expect(sm4).toBeDefined();
    });

    it('getMatrix should return non-empty string', () => {
        expect(sm4?.getMatrix().length).toBeGreaterThan(0);
    })

    it('evaluate should throw error', () => {
        expect(() => sm4?.evaluate(4, '1,3,4')).toThrow();
    })

    it('evaluate should worked', () => {
        const result = sm4?.evaluate(4, '4,2.5,1');
        expect(result).toBeDefined();

        expect(result?.repeat).toBe(false);
        expect(result?.interval).toBe(6);
        expect(result?.smdata).toBe('4,2.5,2');
    });
});

describe('class SuperMemo5', () => {
    const sm4 = SMFactory.getSuperMemo(SMType.SM5);
    
    it('should be defined', () => {
        expect(sm4).toBeDefined();
    });

    it('getMatrix should return non-empty string', () => {
        expect(sm4?.getMatrix().length).toBeGreaterThan(0);
    })

    it('evaluate should throw error', () => {
        expect(() => sm4?.evaluate(4, '1,3,4')).toThrow();
    })

    it('evaluate should worked', () => {
        const result = sm4?.evaluate(4, '5,2.5,1');
        expect(result).toBeDefined();

        expect(result?.repeat).toBe(false);
        expect(result?.interval).toBe(10);
        expect(result?.smdata).toBe('5,2.5,2');
    });
});