import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Colors from 'app/styles/colors';
import Media from 'app/styles/mediaQuery';

export const RSGFetchRetry = styled.div`
  width: 100%;
  padding: 70px 0;
  text-align: center;

  @media ${Media.MOBILE} {
    padding: 60px 0;
  }
`;

export const RSGFetchRetryTitle = styled.p`
  margin-bottom: 12px;
  color: ${Colors.slategray_90};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 21px;
  text-align: center;

  @media ${Media.MOBILE} {
    margin-bottom: 11px;
    font-size: 16px;
    line-height: 19px;
  }
`;

export const RSGFetchRetryDescription = styled.p`
  margin-bottom: 20px;
  color: ${Colors.slategray_60};
  font-size: 16px;
  letter-spacing: -0.3px;
  line-height: 19px;
  text-align: center;

  @media ${Media.MOBILE} {
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 17px;
    font-weight: 400;
    color: ${Colors.slategray_60};
  }
`;

export const buttonStyle = css`
  box-sizing: border-box;
  display: inline-block;
  width: 115px;
  padding-right: 0;
  padding-left: 0;
  color: ${Colors.slategray_50};
  font-size: 14px;
`;

export const retryIconStyle = css`
  width: 14px;
  height: 14px;
  margin-right: 5px;
  fill: ${Colors.slategray_50};
`;
