import React from 'react';

export const ArticleSectionChartPlaceholder: React.FunctionComponent = () => (
  <li className="ArticleChartList_Article">
    <span className="ArticleChartList_Rank_Skeleton Skeleton" />
    <div className="ArticleThumbnail_Wrapper">
      <div className="ArticleChartThumbnail_Skeleton Skeleton" />
    </div>
    <div className="ArticleChartList_Meta">
      <div className="ArticleChartList_Meta_Title_Skeleton Skeleton" />
      <div className="ArticleChartList_Meta_Channel_Skeleton Skeleton" />
    </div>
  </li>
);

export const ArticleSectionChartListContainerPlaceholder: React.FunctionComponent = () => (
  <div className="ArticleChartList_Wrapper">
    <div className="ArticleChartGroup_Container">
      <ol className="ArticleChartGroup">
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
      </ol>
      <ol className="ArticleChartGroup">
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
        <ArticleSectionChartPlaceholder />
      </ol>
    </div>
  </div>
);
