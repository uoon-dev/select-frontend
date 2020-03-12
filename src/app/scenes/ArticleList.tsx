import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PageTitleText, FetchStatusFlag, COUNT_PER_PAGE, ARTICLE_CHART_COUNT } from 'app/constants';
import { ArticleListType, Actions } from 'app/services/articleList';
import ArticleGridList from 'app/components/ArticleList/GridList';
import ArticleChartList from 'app/components/ArticleList/ChartList';
import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { useSelector, useDispatch } from 'react-redux';
import { getPageQuery } from 'app/services/routing/selectors';
import { Article } from 'app/services/article';
import {
  getPopularArticleListFetchStatus,
  getRecentArticleList,
  getPopularArticleList,
  getRecentArticleListFetchStatus,
  getPopularArticleListItemCount,
  getRecentArticleListItemCount,
} from 'app/services/articleList/selectors';

type RouteProps = RouteComponentProps<{ listType: string }>;

type OwnProps = RouteProps & {};

const ArticleList: React.FunctionComponent<OwnProps> = props => {
  const { listType } = props.match.params;
  const page = useSelector(getPageQuery);
  const articleListType = `${listType}ArticleList` as ArticleListType;
  const itemCountPerPage =
    articleListType === ArticleListType.POPULAR ? ARTICLE_CHART_COUNT : COUNT_PER_PAGE;
  let pageTitle: string;
  let articles: Article[];
  let fetchStatus: FetchStatusFlag;
  let itemCount: number;

  switch (articleListType) {
    case ArticleListType.POPULAR:
      pageTitle = PageTitleText.ARTICLE_POPULAR;
      articles = useSelector(getPopularArticleList);
      itemCount = useSelector(getPopularArticleListItemCount);
      fetchStatus = useSelector(getPopularArticleListFetchStatus);
      break;
    case ArticleListType.RECENT:
    default:
      pageTitle = PageTitleText.ARTICLE_RECENT;
      articles = useSelector(getRecentArticleList);
      itemCount = useSelector(getRecentArticleListItemCount);
      fetchStatus = useSelector(getRecentArticleListFetchStatus);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !articles ||
      fetchStatus !== FetchStatusFlag.FETCHING ||
      articles.length < itemCountPerPage
    ) {
      dispatch(
        Actions.loadArticleList({
          type: articleListType,
          page,
          size: itemCountPerPage,
        }),
      );
    }
  }, [page]);

  return (
    <main className="SceneWrapper">
      <HelmetWithTitle titleName={pageTitle} />
      <ConnectedPageHeader pageTitle={pageTitle} />
      {listType === 'popular' ? (
        <ArticleChartList fetchStatus={fetchStatus} popularArticles={articles} />
      ) : (
        <ArticleGridList
          page={page}
          itemCount={itemCount}
          articleListType={articleListType}
          itemCountPerPage={itemCountPerPage}
          fetchStatus={fetchStatus}
          articleList={articles}
        />
      )}
    </main>
  );
};

export default ArticleList;
