import { css } from '@emotion/core';

import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';
import { resetLayout, resetList, resetButton } from 'app/styles/customProperties';

export const PageArticleContent = css`
  display: block;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;

  & .ChannelInfoHeader_Wrapper {
    padding: 10px 0 30px;
  }

  @media (max-width: 700px) {
    & .ChannelInfoHeader_Wrapper {
      padding: 10px 20px 30px;
    }
  }
`;

export const ArticleContent_Title = css`
  ${resetLayout}

  padding-top: 60px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.33em;
  letter-spacing: -0.68px;
  color: ${Colors.gray_100};

  @media (max-width: 700px) {
    padding: 30px 20px 0;
  }
`;

export const ArticleContent_ContentWrapper = css`
  position: relative;

  & .RidiselectArticle {
    position: relative;
    padding-bottom: 60px;
    z-index: 10;

    @media (${Media.PC}) {
      min-height: 660px;
    }
  }
`;

export const ArticleContent_ButtonsContainer = css`
  position: relative;
  padding: 0;
  min-height: 70px;
  @media (max-width: 700px) {
    padding: 0 20px 20px;
  }
`;

export const ArticleContent_ButtonsWrapper = css`
  ${resetList}

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  text-align: center;
  background: white;
  border-top: 1px solid ${Colors.slategray_10};
  border-bottom: 1px solid ${Colors.slategray_10};

  &.sticky {
    position: fixed;
    display: block;
    width: 100%;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    z-index: 50;
    transition: transform 0.2s;
    transform: translateY(0);
    border-bottom: 1px solid white;
  }
  &.hideDown {
    transform: translateY(100%);
  }
`;

export const ArticleContent_ButtonElement = css`
  position: relative;
  display: inline-block;
  width: 50%;
  max-width: 350px;
  padding: 0 4px;
  box-sizing: border-box;

  &::before {
    position: absolute;
    left: 0;
    top: 12px;
    width: 1px;
    height: 24px;
    content: '';
    background: ${Colors.slategray_10};
  }

  &:first-of-type {
    &::before {
      content: none;
    }
  }
`;

export const ArticleContent_Button = css`
  ${resetButton}

  display: block;
  width: 100%;
  height: 48px;
  font-size: 13px;
  font-weight: 500;
  color: ${Colors.slategray_60};
  line-height: 48px;
  vertical-align: top;
`;

export const ArticleContent_Button_Number = css`
  font-family: Roboto, Sans-serif;
`;

export const ArticleContent_LikeButton_Icon = css`
  width: 16px;
  height: 16px;
  margin-top: 17px;
  margin-right: 6px;
  fill: ${Colors.slategray_30};
  vertical-align: top;

  &.active {
    fill: ${Colors.red_40};
  }
`;

export const ArticleContent_ShareButton_Icon = css`
  width: 16px;
  height: 16px;
  margin-top: 16px;
  margin-right: 6px;
  fill: ${Colors.slategray_30};
  vertical-align: top;
`;

export const ArticleContent_GetTicketToReadButtonContainer = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 50;
`;

export const ArticleContent_GetTicketToReadButtonWrapper = css`
  display: block;
  width: 100%;
  height: 180px;
  text-align: center;
  padding: 120px 0 0;
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 68%);

  @media (max-width: 700px) {
    padding: 120px 20px 0;
  }

  &.sticky {
    position: fixed;
    display: block;
    width: 100%;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    z-index: 50;
  }
`;

export const ArticleContent_GetTicketToReadButton = css`
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 700px;
  font-size: 16px;
  height: 50px;
  line-height: 48px;
`;
