import { CoverSize, CoverSizes } from 'app/constants';

export interface CoverImageSrc {
  src: string;
  sizes: string;
  srcSet: string;
}

const getResponsiveCoverImageSrc = (url: string, size: CoverSize): CoverImageSrc => ({
  src: `${url}${size.qs}`,
  sizes: `${size.width}px`,
  srcSet: Object.values(CoverSizes)
    .map(({ qs, width }: CoverSize) => `${url}${qs} ${width}w`)
    .join(','),
});

export default getResponsiveCoverImageSrc;
