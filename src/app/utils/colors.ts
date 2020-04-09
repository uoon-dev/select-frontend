export const rgba = (rgbHex: string, alphaPercentage: number) =>
  `${rgbHex}${Math.round((alphaPercentage * 255) / 100)
    .toString(16)
    .padStart(2, '0')}`;
