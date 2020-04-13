import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { resetLayout, customMedia, resetList, resetButton } from 'app/styles/customProperties';

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

    @media (${customMedia.pcLayout}) {
      min-height: 660px;
    }
  }
`;

const ArticleContent_StickyWrapper = css`
  position: fixed;
  display: block;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 50;

  &.sticky {
    position: absolute;
  }
`;

export const ArticleContent_UnderArticleWrapper = css`
  padding-top: 70px;

  &.sticky {
    padding-top: 0;
  }
`;

export const ArticleContent_ButtonsContainer = css`
  ${ArticleContent_StickyWrapper}

  padding: 0;

  &.sticky {
    position: relative;
    bottom: initial;
    left: initial;
    padding: 0 0 20px;
    @media (max-width: 700px) {
      padding: 0 20px 20px;
    }
  }
`;

export const ArticleContent_ButtonsWrapper = css`
  ${resetList}

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  background: white;
  border-top: 1px solid ${Colors.slategray_10};
  border-bottom: 1px solid ${Colors.slategray_10};
`;

export const ArticleContent_ButtonElement = css`
  position: relative;
  width: 50%;
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
  color: ${Colors.slategray_60};
  line-height: 48px;
  vertical-align: top;
`;

export const ArticleContent_LikeButton_Icon = css`
  width: 12px;
  height: 10px;
  margin-right: 4px;
  fill: ${Colors.slategray_30};
  vertical-align: top;
  margin-top: 19px;

  &.active {
    fill: ${Colors.red_40};
  }
`;

export const ArticleContent_ShareButton_Icon = css`
  width: 14px;
  height: 14px;
  margin-right: 3px;
  fill: ${Colors.slategray_60};
  vertical-align: top;
  margin-top: 17px;
`;

export const ArticleContent_GetTicketToReadButtonContainer = css`
  ${ArticleContent_StickyWrapper}
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
