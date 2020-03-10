import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { Article } from 'app/services/article';
import { getArticleKeyFromData } from 'app/utils/utils';
import { articleChannelToPath } from 'app/utils/toPath';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { FetchStatusFlag, ImageSize } from 'app/constants';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ArticleChartListPlaceholder } from 'app/placeholder/ArticleChartListPlaceholder';

import * as styles from 'app/components/ArticleList/chartListStyle';

interface ArticleChartListProps {
  popularArticles?: Article[];
  fetchStatus?: FetchStatusFlag;
}

const ArticleChartList: React.FunctionComponent<ArticleChartListProps> = props => {
  const { popularArticles, fetchStatus } = props;
  const articleChannelById = useSelector((state: RidiSelectState) => state.articleChannelById);
  const section = getSectionStringForTracking('select-article', 'popular', 'article-list');

  return !popularArticles || fetchStatus === FetchStatusFlag.FETCHING ? (
    <ArticleChartListPlaceholder />
  ) : (
    <ul css={styles.popularArticleList}>
      {popularArticles.length > 0 ? (
        popularArticles.map((article, idx) => {
          const articleUrl = `/article/${getArticleKeyFromData(article)}`;
          const channelMeta = articleChannelById[article.channelName]?.channelMeta;

          return (
            <li key={`popular_article_${idx}`} css={styles.popularArticleElement}>
              <ConnectedTrackImpression
                section={section}
                index={idx}
                id={article.id}
                misc={JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` })}
              >
                <div css={styles.popularArticleElementLink}>
                  <span css={styles.popularArticleElementRank}>{idx + 1}</span>
                  <ArticleThumbnail
                    linkUrl={articleUrl}
                    imageUrl={article.thumbnailUrl}
                    thumbnailShape={ThumbnailShape.SQUARE}
                    thumbnailClassName="ArticleList_Thumbnail"
                    articleTitle={article.title}
                    imageSize={ImageSize.HEIGHT_100}
                    onLinkClick={() =>
                      trackingClick(
                        idx,
                        article.id,
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
                        article.id,
                        JSON.stringify({
                          sect_ch: `ch:${channelMeta!.id}`,
                        }),
                      )
                    }
                  >
                    <h3 css={styles.popularArticleElementTitle}>{article.title}</h3>
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
  );
};

export default ArticleChartList;
