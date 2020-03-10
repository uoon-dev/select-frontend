import React from 'react';
import { ArticleSectionChartPlaceholder } from './ArticleSectionChartPlaceholder';

export const ArticleChartListPlaceholder: React.FunctionComponent = () => (
  <ul>
    <ArticleSectionChartPlaceholder />
    <ArticleSectionChartPlaceholder />
    <ArticleSectionChartPlaceholder />
    <ArticleSectionChartPlaceholder />
    <ArticleSectionChartPlaceholder />
  </ul>
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
