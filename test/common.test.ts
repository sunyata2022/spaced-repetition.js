import { calculateEFactor } from "../src/common";

describe("common", () => {
    test("export 'common'", () => {
        expect(!calculateEFactor).toBe(false);
    });
});