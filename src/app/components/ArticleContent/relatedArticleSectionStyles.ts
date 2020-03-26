import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { customMedia, resetLayout } from 'app/styles/customProperties';

export const relatedArticleSectionHeader = css`
  display: block;
  margin: 0;
  padding: 30px 20px 15px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  text-decoration: unset;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-top: 1px solid ${Colors.slategray_10};

  @media ${customMedia.pcScreen} {
    padding: 30px 0 15px;
  }
`;

export const relatedArticleList = css`
  margin: 0;
  padding: 0 20px 60px 20px;

  @media ${customMedia.pcScreen} {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 0 100px 0;
  }
`;

export const relatedArticleList_Meta = css`
  flex: 1;
  flex-direction: column;
  margin-left: 15px;
  text-decoration: none;
`;

export const relatedArticleList_Item = css`
  padding: 15px 0;
  list-style: none;
  border-bottom: 1px solid ${Colors.slategray_10};

  & > .relatedArticleList_Link {
    flex-direction: row;
  }

  .relatedArticleList_Thumbnail {
    height: auto !important;
    min-height: 100px !important;
    width: 100px !important;
    align-items: center;
    overflow: hidden;
  }
`;

export const relatedArticleList_Link = css`
  display: flex;
  color: inherit;
  text-decoration: inherit;
  align-items: center;
  justify-content: center;
`;

export const relatedArticleList_Title = css`
  ${resetLayout}

  display: block;
  margin: 0;
  color: #000;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  word-wrap: break-word;
`;
