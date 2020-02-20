import { ImageSize } from 'app/constants';

interface ImageSrc {
  src: string;
  srcset: string;
}

const getSelectResponsiveImageSrc = (url: string, size: ImageSize): ImageSrc => {
  const [sizeTarget, sizeNumber] = size.split('=');
  const doubleSize = `${sizeTarget}=${parseInt(sizeNumber, 10) * 2}`;
  return {
    src: `${url}?${size}`,
    srcset: `${url}?${size} 1x, ${url}?${doubleSize} 2x`,
  };
};

export default getSelectResponsiveImageSrc;
