import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, LinkProps } from 'react-router-dom';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { GridArticleList } from 'app/components/GridArticleList';
import { FetchStatusFlag, PageTitleText, RoutePaths } from 'app/constants';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { Actions } from 'app/services/articleFavorite';
import { getFavoriteArticleList } from 'app/services/articleFavorite/selectors';
import { Actions as ArticleFollowingActions } from 'app/services/articleFollowing';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { checkCorrectPath } from 'app/utils/utils';
import { Scene } from 'app/styles/globals';

const FavoriteWrapper = styled.main`
  ${Scene.Wrapper}
  ${Scene.WithGNB}
  ${Scene.WithLNB}
  padding-bottom: 60px;
`;

const FavoriteArticleList = styled.div`
  max-width: 840px;
  margin: 0 auto;
`;

const ArticleFavorite: React.FunctionComponent = () => {
  const ItemCountPerPage = 12;

  const articleItems = useSelector(getFavoriteArticleList);
  const page = useSelector(getPageQuery);
  const {
    isFetched,
    favoriteArticleFetchStatus,
    itemCount,
    hasAvailableTicket,
    unseenFeedsFetchStatus,
  } = useSelector((state: RidiSelectState) => ({
    isFetched: state.favoriteArticle.itemListByPage[page]
      ? state.favoriteArticle.itemListByPage[page].isFetched
      : false,
    favoriteArticleFetchStatus: state.favoriteArticle.itemListByPage[page]
      ? state.favoriteArticle.itemListByPage[page].fetchStatus
      : FetchStatusFlag.IDLE,
    itemCount:
      state.favoriteArticle && state.favoriteArticle.itemCount
        ? state.favoriteArticle.itemCount
        : 1,
    hasAvailableTicket: state.user.hasAvailableTicket,
    unseenFeedsFetchStatus: state.articleFollowing.unseenFeedsFetchStatus,
  }));

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      (favoriteArticleFetchStatus === FetchStatusFlag.IDLE || !isFetched) &&
      checkCorrectPath(RoutePaths.ARTICLE_FAVORITE)
    ) {
      dispatch(Actions.loadFavoriteArticleListRequest({ page }));
    }
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [page]);

  React.useEffect(() => {
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <FavoriteWrapper>
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FAVORITE} />
      <h1 className="a11y">리디셀렉트 좋아한 아티클</h1>
      <FavoriteArticleList>
        {articleItems ? (
          articleItems.length > 0 ? (
            <>
              <GridArticleList
                serviceTitleForTracking="select-article"
                pageTitleForTracking="favorite"
                uiPartTitleForTracking="article-list"
                miscTracking={JSON.stringify({ sect_page: page })}
                articles={articleItems}
                renderChannelThumbnail
                renderChannelMeta
                renderPublishDate
                renderFavoriteButton
                isFullWidthAvailable
                gridListSizeClassNames="GridArticleList-large"
              />
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(itemCount / ItemCountPerPage)}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `${RoutePaths.ARTICLE_FAVORITE}?page=${p}`,
                  }),
                }}
              />
            </>
          ) : (
            <ArticleEmpty iconName="document" description="좋아한 아티클이 없습니다." />
          )
        ) : (
          <GridArticleListPlaceholder gridSize="large" />
        )}
      </FavoriteArticleList>
    </FavoriteWrapper>
  );
};

export default ArticleFavorite;
