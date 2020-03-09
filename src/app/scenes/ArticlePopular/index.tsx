import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { getArticleKeyFromData } from 'app/utils/utils';
import { articleChannelToPath } from 'app/utils/toPath';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { Actions as TrackingActions } from 'app/services/tracking';
import { Actions, ArticleListType } from 'app/services/articleList';
import { HelmetWithTitle, ConnectedPageHeader } from 'app/components';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { PageTitleText, FetchStatusFlag, ImageSize } from 'app/constants';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ArticlePopularListPlaceholder } from 'app/placeholder/ArticlePopularListPlaceholder';

import * as styles from 'app/scenes/ArticlePopular/styles';

const ArticlePopular: React.FunctionComponent = () => {
  const popularArticles = useSelector(
    (state: RidiSelectState) => state.articleList[ArticleListType.POPULAR].itemListByPage[1],
  );
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const articleChannelById = useSelector((state: RidiSelectState) => state.articleChannelById);
  const section = getSectionStringForTracking('select-article', 'popular', 'article-list');
  const dispatch = useDispatch();

  const trackingClick = (index: number, id: number | string, misc?: string) => {
    if (!section) {
      return;
    }
    dispatch(TrackingActions.trackClick({ trackingParams: { section, index, id, misc } }));
  };

  useEffect(() => {
    if (
      !popularArticles ||
      (!popularArticles?.itemList && popularArticles.fetchStatus !== FetchStatusFlag.FETCHING) ||
      popularArticles.itemList.length < 100
    ) {
      dispatch(
        Actions.loadArticleListRequest({ type: ArticleListType.POPULAR, page: 1, size: 100 }),
      );
    }
  }, []);

  return (
    <main
      className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB"
      css={styles.pageArticlePopular}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_POPULAR} />
      <ConnectedPageHeader pageTitle={PageTitleText.ARTICLE_POPULAR} />
      {!popularArticles ||
      (popularArticles.fetchStatus === FetchStatusFlag.FETCHING && !popularArticles.itemList) ? (
        <ArticlePopularListPlaceholder />
      ) : (
        <ul css={styles.popularArticleList}>
          {popularArticles?.itemList && popularArticles?.itemList.length > 0 ? (
            popularArticles.itemList.map((articleKey, idx) => {
              const { article } = articles[articleKey];
              const articleUrl = `/article/${getArticleKeyFromData(article)}`;
              const channelMeta = articleChannelById[article!.channelName]?.channelMeta;

              return (
                <li key={`popular_article_${idx}`} css={styles.popularArticleElement}>
                  <ConnectedTrackImpression
                    section={section}
                    index={idx}
                    id={article!.id}
                    misc={JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` })}
                  >
                    <div css={styles.popularArticleElementLink}>
                      <span css={styles.popularArticleElementRank}>{idx + 1}</span>
                      <ArticleThumbnail
                        linkUrl={articleUrl}
                        imageUrl={article!.thumbnailUrl}
                        thumbnailShape={ThumbnailShape.SQUARE}
                        thumbnailClassName="ArticleList_Thumbnail"
                        articleTitle={article!.title}
                        imageSize={ImageSize.HEIGHT_100}
                        onLinkClick={() =>
                          trackingClick(
                            idx,
                            article!.id,
                            JSON.stringify({
                              sect_ch: `ch:${channelMeta!.id}`,
                            }),
                          )
                        }
                      />
                      <Link
                        to={articleUrl}
                        css={styles.popularArticleElementMeta}
                        onClick={() =>
                          trackingClick(
                            idx,
                            article!.id,
                            JSON.stringify({
                              sect_ch: `ch:${channelMeta!.id}`,
                            }),
                          )
                        }
                      >
                        <h3 css={styles.popularArticleElementTitle}>{article!.title}</h3>
                        <Link
                          css={styles.popularArticleElementChannel}
                          to={articleChannelToPath({ channelName: channelMeta!.name })}
                          onClick={() => trackingClick(idx, `ch:${channelMeta!.id}`)}
                        >
                          {channelMeta!.displayName}
                        </Link>
                      </Link>
                    </div>
                  </ConnectedTrackImpression>
                </li>
              );
            })
          ) : (
            <ArticleEmpty iconName="document" description="인기 아티클이 없습니다." />
          )}
        </ul>
      )}
    </main>
  );
};

export default ArticlePopular;
