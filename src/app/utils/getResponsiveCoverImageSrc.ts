import { CoverSize } from 'app/constants';

export interface CoverImageSrc {
  src: string;
  srcset: string;
}

const getResponsiveCoverImageSrc = (url: string, size: CoverSize): CoverImageSrc => {
  let doubleSize = size;
  switch (size) {
    case CoverSize.SIZE_960:
      doubleSize = CoverSize.SIZE_960;
      break;
    case CoverSize.SIZE_640:
      doubleSize = CoverSize.SIZE_960;
      break;
    case CoverSize.SIZE_480:
      doubleSize = CoverSize.SIZE_960;
      break;
    case CoverSize.SIZE_450:
      doubleSize = CoverSize.SIZE_960;
      break;
    case CoverSize.SIZE_330:
      doubleSize = CoverSize.SIZE_640;
      break;
    case CoverSize.SIZE_300:
      doubleSize = CoverSize.SIZE_640;
      break;
    case CoverSize.SIZE_225:
      doubleSize = CoverSize.SIZE_450;
      break;
    case CoverSize.SIZE_220:
      doubleSize = CoverSize.SIZE_450;
      break;
    case CoverSize.SIZE_180:
      doubleSize = CoverSize.SIZE_330;
      break;
    case CoverSize.SIZE_165:
      doubleSize = CoverSize.SIZE_330;
      break;
    case CoverSize.SIZE_120:
      doubleSize = CoverSize.SIZE_225;
      break;
    case CoverSize.SIZE_90:
      doubleSize = CoverSize.SIZE_180;
      break;
    case CoverSize.SIZE_50:
      doubleSize = CoverSize.SIZE_90;
      break;
    default:
      doubleSize = size;
      break;
  }

  return {
    src: `${url}${size}`,
    srcset: `
      ${url}${CoverSize.SIZE_90} 90w,
      ${url}${CoverSize.SIZE_120} 120w,
      ${url}${CoverSize.SIZE_165} 165w,
      ${url}${CoverSize.SIZE_180} 180w,
      ${url}${CoverSize.SIZE_220} 220w,
      ${url}${CoverSize.SIZE_225} 225w,
      ${url}${CoverSize.SIZE_300} 300w,
      ${url}${CoverSize.SIZE_330} 330w,
      ${url}${CoverSize.SIZE_450} 450w,
      ${url}${CoverSize.SIZE_480} 480w,
      ${url}${CoverSize.SIZE_640} 640w,
      ${url}${CoverSize.SIZE_960} 960w,
      ${url}${size} 1x,
      ${url}${doubleSize} 2x,
      ${url}${size},
    `,
  };
};

export default getResponsiveCoverImageSrc;
