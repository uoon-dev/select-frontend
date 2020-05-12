import styled from '@emotion/styled';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { checkCorrectPath } from 'app/utils/utils';
import { Actions } from 'app/services/articleFollowing';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { HelmetWithTitle, Pagination } from 'app/components';
import { getPageQuery } from 'app/services/routing/selectors';
import { GridArticleList } from 'app/components/GridArticleList';
import { SlideChannelList } from 'app/components/SlideChannelList';
import { FetchStatusFlag, PageTitleText, RoutePaths } from 'app/constants';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { SlideChannelListPlaceholder } from 'app/placeholder/SlideChannelListPlaceholder';
import { getArticleItems, getChannelItems } from 'app/services/articleFollowing/selectors';
import { Scene } from 'app/styles/globals';
import Colors from 'app/styles/colors';

const SC = {
  FollowingWrapper: styled.main`
    ${Scene.Wrapper}
    ${Scene.WithGNB}
    ${Scene.WithLNB}
    padding-bottom: 60px;
  `,
  FollowingList: styled.div`
    max-width: 840px;
    margin: 0 auto;
  `,
  AllChannelButton: styled(Link)`
    display: block;
    color: white;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.35px;
    line-height: 38px;
    text-decoration: none;
    width: 120px;
    height: 40px;
    border-radius: 3px;
    border: solid 1px ${Colors.dodgerblue_60};
    background-color: ${Colors.dodgerblue_50};
    margin: 20px auto;
    text-align: center;
    &:hover,
    &:active {
      background-color: ${Colors.dodgerblue_60};
      transition: background 0.2s, color 0.2s;
    }
  `,
};

const ArticleFollowing: React.FunctionComponent = () => {
  const ItemCountPerPage = 12;

  const dispatch = useDispatch();
  const page = useSelector(getPageQuery);
  const channelFetchStatus = useSelector(
    (state: RidiSelectState) => state.articleFollowing.fetchStatus,
  );
  const articleFetchStatus = useSelector((state: RidiSelectState) => {
    const followingArticleListByPage =
      state.articleFollowing.followingArticleList &&
      state.articleFollowing.followingArticleList.itemListByPage[page]
        ? state.articleFollowing.followingArticleList.itemListByPage[page]
        : null;
    return followingArticleListByPage
      ? followingArticleListByPage.fetchStatus
      : FetchStatusFlag.IDLE;
  });
  const itemCount = useSelector((state: RidiSelectState) =>
    state.articleFollowing.followingArticleList &&
    state.articleFollowing.followingArticleList.itemCount
      ? state.articleFollowing.followingArticleList.itemCount
      : 1,
  );
  const channelItems = useSelector(getChannelItems);
  const articleItems = useSelector(getArticleItems);
  const hasAvailableTicket = useSelector((state: RidiSelectState) => state.user.hasAvailableTicket);

  React.useLayoutEffect(() => {
    if (channelFetchStatus === FetchStatusFlag.IDLE) {
      dispatch(Actions.loadFollowingChannelListRequest());
    }
    if (
      articleFetchStatus === FetchStatusFlag.IDLE &&
      checkCorrectPath(RoutePaths.ARTICLE_FOLLOWING)
    ) {
      dispatch(Actions.loadFollowingArticleListRequest({ page }));
    }
  }, [page]);

  React.useEffect(() => {
    if (hasAvailableTicket) {
      dispatch(Actions.setUnseenFollowingFeedsToSeenRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <SC.FollowingWrapper>
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FOLLOWING} />
      <h1 className="a11y">리디셀렉트 아티클 팔로잉</h1>
      {channelItems ? (
        channelItems.length > 0 ? (
          <>
            <SlideChannelList channels={channelItems} />
            <SC.FollowingList>
              {articleItems && articleItems.length > 0 ? (
                <GridArticleList
                  serviceTitleForTracking="select-article"
                  pageTitleForTracking="following"
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
              ) : (
                <GridArticleListPlaceholder gridSize="large" />
              )}
            </SC.FollowingList>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(itemCount / ItemCountPerPage)}
              item={{
                el: Link,
                getProps: (p): LinkProps => ({
                  to: `${RoutePaths.ARTICLE_FOLLOWING}?page=${p}`,
                }),
              }}
            />
          </>
        ) : (
          <ArticleEmpty
            iconName="profile"
            description="팔로잉 중인 채널이 없습니다."
            renderButton={() => (
              <SC.AllChannelButton to={RoutePaths.ARTICLE_CHANNELS}>
                전체 채널 보기
              </SC.AllChannelButton>
            )}
          />
        )
      ) : (
        <>
          <SlideChannelListPlaceholder />
          <SC.FollowingList>
            <GridArticleListPlaceholder gridSize="large" />
          </SC.FollowingList>
        </>
      )}
    </SC.FollowingWrapper>
  );
};

export default ArticleFollowing;
