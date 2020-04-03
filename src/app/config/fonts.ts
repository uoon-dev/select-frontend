import * as WebFont from 'webfontloader';

import 'css/font.css';

export const loadFonts = () => {
  WebFont.load({
    custom: {
      families: ['review_num'],
    },
  });
};
