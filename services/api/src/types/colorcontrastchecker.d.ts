// https://github.com/bbc/color-contrast-checker/issues/17#issuecomment-1432392449
declare class ColorContrastChecker {
  fontSize: number;
  rgbClass: {
    toString: () => string;
  };
  isValidSixDigitColorCode(hex: string): boolean;
  isValidThreeDigitColorCode(hex: string): boolean;
  isValidColorCode(hex: string): boolean;
  isValidRatio(ratio: number): boolean;
  convertColorToSixDigit(hex: string): string;
  hexToLuminance(color: string): number;
  check(
    colorA: string,
    colorB: string,
    fontSize?: number,
    customRatio?: number,
  ): {
    WCAG_AA: boolean;
    WCAG_AAA: boolean;
  };
  checkPairs(
    pairs: Array<{
      colorA: string;
      colorB: string;
      fontSize?: number;
    }>,
    customRatio?: number,
  ): boolean[];
  calculateLuminance(lRGB: { r: number; g: number; b: number }): number;
  isLevelAA(colorA: string, colorB: string, fontSize?: number): boolean;
  isLevelAAA(colorA: string, colorB: string, fontSize?: number): boolean;
  isLevelCustom(colorA: string, colorB: string, ratio: number): boolean;
  getRGBFromHex(color: string): {
    r: number;
    g: number;
    b: number;
    toString: () => string;
  };
  calculateSRGB(rgb: { r: number; g: number; b: number }): {
    r: number;
    g: number;
    b: number;
    toString: () => string;
  };
  calculateLRGB(rgb: { r: number; g: number; b: number }): {
    r: number;
    g: number;
    b: number;
    toString: () => string;
  };
  getContrastRatio(lumA: number, lumB: number): number;
  verifyContrastRatio(ratio: number): {
    WCAG_AA: boolean;
    WCAG_AAA: boolean;
  };
  verifyCustomContrastRatio(
    inputRatio: number,
    checkRatio: number,
  ): {
    customRatio: boolean;
  };
}

declare module "color-contrast-checker" {
  export = ColorContrastChecker;
}
