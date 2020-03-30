import React from 'react';

import * as articleThumbnailStyles from 'app/components/ArticleThumbnail/styles';
import * as styles from 'app/components/ArticleHome/articleHomeChartSectionStyles';

export const ArticleSectionChartPlaceholder: React.FunctionComponent = () => (
  <li css={styles.articleChartListArticle}>
    <span className="ArticleChartList_Rank_Skeleton Skeleton" />
    <div css={articleThumbnailStyles.ArticleThumbnail_Wrapper}>
      <div className="ArticleChartThumbnail_Skeleton Skeleton" />
    </div>
    <div css={styles.articleChartListMeta}>
      <div className="ArticleChartList_Meta_Title_Skeleton Skeleton" />
      <div className="ArticleChartList_Meta_Channel_Skeleton Skeleton" />
    </div>
  </li>
);

export const ArticleSectionChartListContainerPlaceholder: React.FunctionComponent = () => (
  <div css={styles.articleChartListWrapper}>
    <div css={styles.articleChartGroupContainer}>
      <ol css={styles.articleChartGroup}>
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
      </ol>
      <ol css={styles.articleChartGroup}>
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
      </ol>
    </div>
  </div>
);
