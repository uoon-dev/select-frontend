export interface CoverSize {
  readonly width: number;
  readonly qs: string;
}

export const CoverSizes: {
  readonly [sizeName: string]: CoverSize;
} = {
  SIZE_50: { width: 50, qs: '/small' },
  SIZE_90: { width: 90, qs: '/small' },
  SIZE_120: { width: 120, qs: '/small?dpi=xhdpi' },
  SIZE_165: { width: 165, qs: '/large' },
  SIZE_180: { width: 180, qs: '/small?dpi=xxhdpi' },
  SIZE_220: { width: 220, qs: '/large?dpi=xhdpi' },
  SIZE_225: { width: 225, qs: '/xlarge' },
  SIZE_300: { width: 300, qs: '/xlarge?dpi=xhdpi' },
  SIZE_330: { width: 330, qs: '/large?dpi=xxhdpi' },
  SIZE_450: { width: 450, qs: '/xlarge?dpi=xxhdpi' },
  SIZE_480: { width: 480, qs: '/xxlarge' },
  SIZE_640: { width: 640, qs: '/xxlarge?dpi=xhdpi' },
  SIZE_960: { width: 960, qs: '/xxlarge?dpi=xxhdpi' },
};
