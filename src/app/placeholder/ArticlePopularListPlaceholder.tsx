import React from 'react';

import * as styles from 'app/scenes/ArticlePopular/styles';

export const ArticlePopularElementPlaceholder: React.FunctionComponent = () => (
  <li css={styles.popularArticleElement}>
    <div css={styles.popularArticleElementLink}>
      <span css={styles.popularArticleElementRank} className="Skeleton" />
      <div className="ArticleList_Thumbnail Skeleton" />
      <div css={styles.popularArticleElementMeta}>
        <div css={styles.popularArticleElementTitle} className="Skeleton" />
        <div css={styles.popularArticleElementChannel} className="Skeleton" />
      </div>
    </div>
  </li>
);

export const ArticlePopularListPlaceholder: React.FunctionComponent = () => (
  <ul css={styles.popularArticleList}>
    <ArticlePopularElementPlaceholder />
    <ArticlePopularElementPlaceholder />
    <ArticlePopularElementPlaceholder />
    <ArticlePopularElementPlaceholder />
    <ArticlePopularElementPlaceholder />
    <ArticlePopularElementPlaceholder />
    <ArticlePopularElementPlaceholder />
  </ul>
);
