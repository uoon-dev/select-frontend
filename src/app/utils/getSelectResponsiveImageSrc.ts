import { ImageSize } from 'app/constants';

interface ImageSrc {
  src: string;
  sizes: string;
  srcSet: string;
}

const getSelectResponsiveImageSrc = (url: string, size: ImageSize): ImageSrc => {
  const [axis, value] = size.split('=');
  const doubleSize = `${axis}=${parseInt(value, 10) * 2}`;
  return {
    src: `${url}?${size}`,
    sizes: `${value}px`,
    srcSet: `${url}?${size} 1x, ${url}?${doubleSize} 2x`,
  };
};

export default getSelectResponsiveImageSrc;
