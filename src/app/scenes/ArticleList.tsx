import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PageTitleText, FetchStatusFlag } from 'app/constants';
import { ArticleListType, Actions } from 'app/services/articleList';
import ArticleGridList from 'app/components/ArticleList/GridList';
import ArticleChartList from 'app/components/ArticleList/ChartList';
import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { useSelector, useDispatch } from 'react-redux';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { COUNT_PER_PAGE } from 'app/services/collection';
import { ArticleKey } from 'app/types';

type RouteProps = RouteComponentProps<{ listType: string }>;

type OwnProps = RouteProps & {};

const ArticleList: React.FunctionComponent<OwnProps> = props => {
  const { listType } = props.match.params;
  const page = useSelector(getPageQuery);
  const articleListType = `${listType}ArticleList` as ArticleListType;
  const itemCountPerPage = articleListType === ArticleListType.POPULAR ? 100 : COUNT_PER_PAGE;
  let pageTitle: string;
  switch (articleListType) {
    case ArticleListType.POPULAR:
      pageTitle = PageTitleText.ARTICLE_POPULAR;
      break;
    case ArticleListType.RECENT:
      pageTitle = PageTitleText.ARTICLE_RECENT;
      break;
    default:
      pageTitle = '아티클 리스트';
  }
  const articleList = useSelector(
    (state: RidiSelectState) => state.articleList[articleListType]?.itemListByPage[page],
  );
  const fetchStatus = useSelector(
    (state: RidiSelectState) =>
      state.articleList[articleListType]?.itemListByPage[page]?.fetchStatus || FetchStatusFlag.IDLE,
  );
  const itemCount = useSelector(
    (state: RidiSelectState) => state.articleList[articleListType]?.itemCount,
  );
  const articles = useSelector((state: RidiSelectState) =>
    articleList?.itemList?.map((key: ArticleKey) => state.articlesById[key].article!),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !articleList ||
      (!articles && fetchStatus !== FetchStatusFlag.FETCHING) ||
      articles.length < itemCountPerPage
    ) {
      dispatch(
        Actions.loadArticleListRequest({
          type: articleListType,
          page,
          size: itemCountPerPage,
        }),
      );
    }
  }, [page]);

  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB">
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
