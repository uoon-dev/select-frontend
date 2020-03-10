import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { FetchStatusFlag, RoutePaths } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { Actions as PopularArticleActions, ArticleListType } from 'app/services/articleList';
import { ArticleSectionChartListContainerPlaceholder } from 'app/placeholder/ArticleSectionChartListPlaceholder';
import { articleListToPath } from 'app/utils/toPath';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeChartSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const popularArticle = useSelector(
    (state: RidiSelectState) => state.articleList[ArticleListType.POPULAR].itemListByPage[1],
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      popularArticle?.itemList !== undefined ||
      popularArticle?.fetchStatus === FetchStatusFlag.FETCHING
    ) {
      return;
    }
    dispatch(
      PopularArticleActions.loadArticleListRequest({ type: ArticleListType.POPULAR, page: 1 }),
    );
  }, []);

  if (popularArticle?.fetchStatus === FetchStatusFlag.FETCHING) {
    return (
      <section className="ArticleHomeSection">
        <ArticleSectionHeaderPlaceholder />
        <ArticleSectionChartListContainerPlaceholder />
      </section>
    );
  }

  return popularArticle?.itemList ? (
    <section className="ArticleHomeSection">
      <SectionHeader title={title} link={articleListToPath({ listType: 'popular' })} />
      <ArticleSectionChartList
        articleList={popularArticle?.itemList.map(id => articles[id].article!)}
        serviceTitleForTracking="select-article"
        pageTitleForTracking="home"
        uiPartTitleForTracking={`${articleListType.replace('ArticleList', '')}`}
        miscTracking={JSON.stringify({ sect_order: order })}
      />
    </section>
  ) : null;
};
