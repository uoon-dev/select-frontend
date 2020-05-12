import { css } from '@emotion/core';

import Media from './mediaQuery';

export const Scene = {
  Wrapper: css`
    min-height: 500px;
    @media ${Media.PC} {
      min-height: 900px;
    }
  `,
  WithLNB: css`
    .iosApp & {
      padding-top: 47px;
    }
    @media ${Media.MOBILE} {
      .iosApp & {
        padding-top: 47px;
      }
    }
  `,
  WithGNB: css`
    .iosApp & {
      margin-top: 57px;
      @media ${Media.PC} {
        margin-top: 58px;
      }
    }
  `,
};
