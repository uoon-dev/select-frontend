import { css } from '@emotion/core';

import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

export const articleHomePanel = css`
  border-bottom: 4px solid ${Colors.slategray_10};

  @media ${Media.PC} {
    border-bottom: 0;
    margin-top: 0;
  }
`;

export const articleSection = css`
  padding: 30px 0;
  background-color: white;

  & .HomeSection_Header {
    padding: 0 20px;
  }

  @media ${Media.PC} {
    padding: 60px 0 0;
    margin: 0 auto;
    width: 840px;
  }
`;
