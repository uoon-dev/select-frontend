import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { customMedia, defaultFontFamily } from 'app/styles/customProperties';

export const articleChartListWrapper = css`
  position: relative;
  & .SlideArrowButton {
    margin-top: -50px;
  }
  @media ${customMedia.pcScreen} {
    padding: 0 10px;
  }
`;

export const articleChartGroupContainer = css`
  display: block;
  margin-top: 20px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  @media ${customMedia.mobileScreen} {
    padding: 0 10px;
  }
`;

export const articleChartGroup = css`
  display: inline-block;
  vertical-align: top;
  margin: 0;
  padding: 0 10px;
  @media ${customMedia.pcScreen} {
    margin: 0 10px;
    padding: 0;
  }
`;

export const articleChartListArticle = css`
  display: flex;
  align-items: start;
  color: inherit;
  text-decoration: inherit;
  height: 70px;
  list-style: none;
  margin-top: 30px;

  &:first-child {
    margin-top: 0;
  }

  & .ArticleThumbnail_Wrapper {
    width: 60px;
    align-self: center;
  }
`;

export const articleChartListRank = css`
  width: 16px;
  text-align: center;
  align-self: center;
  font-family: Roboto, Sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.64px;
  color: ${Colors.gray_100};
  margin-right: 10px;
`;

export const articleChartListMeta = css`
  width: 182px;
  color: ${Colors.slategray_80};
  padding-left: 10px;
  font-size: 13px;
  text-decoration: none;
  align-self: center;
  box-sizing: border-box;

  @media (min-width: 601px) {
    width: 304px;
  }
`;

export const articleChartListMetaTitle = css`
  display: block;
  display: -webkit-box;
  font-family: ${defaultFontFamily};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.53;
  letter-spacing: -0.5px;
  color: ${Colors.gray_100};
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
`;

export const articleChartListMetaLink = css`
  text-decoration: none;
`;

export const articleChartListMetaChannel = css`
  margin-top: 4px;
  display: block;
  font-family: var(--defaultFontFamily);
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${Colors.slategray_60};
`;
