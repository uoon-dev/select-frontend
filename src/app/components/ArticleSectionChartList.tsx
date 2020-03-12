import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ImageSize } from 'app/constants';
import { RidiSelectState } from 'app/store';
import SlideArrow from 'app/components/SlideArrow';
import { articleChannelToPath } from 'app/utils/toPath';
import { getArticleKeyFromData } from 'app/utils/utils';
import { useScrollSlider } from 'app/hooks/useScrollSlider';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import * as styles from 'app/components/ArticleHome/articleHomeChartSectionStyles';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking, mixedMiscTracking } from 'app/services/tracking/utils';

const CHART_GROUPING_COUNT = 5;

interface ArticleSectionChartListProps {
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  miscTracking?: string;
  articleList?: ArticleResponse[];
}

export const ArticleSectionChartList: React.FunctionComponent<ArticleSectionChartListProps> = props => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);

  const {
    articleList,
    serviceTitleForTracking,
    pageTitleForTracking,
    uiPartTitleForTracking,
    miscTracking,
  } = props;
  const { articleChannelById } = useSelector((state: RidiSelectState) => ({
    articleChannelById: state.articleChannelById,
  }));
  const section =
    !!serviceTitleForTracking && !!pageTitleForTracking
      ? getSectionStringForTracking(
          serviceTitleForTracking,
          pageTitleForTracking,
          uiPartTitleForTracking,
        )
      : undefined;
  const dispatch = useDispatch();
  const groupChartActicles = (articles: ArticleResponse[], groupingUnitCount: number) => {
    const groupedArticles: ArticleResponse[][] = [];
    articles.map((article, idx) => {
      if (idx % groupingUnitCount === 0) {
        groupedArticles.push([article]);
      } else {
        groupedArticles[groupedArticles.length - 1].push(article);
      }
    });

    return groupedArticles;
  };

  const trackingClick = (index: number, id: number | string, misc?: string) => {
    if (!section) {
      return;
    }
    const trackingParams: DefaultTrackingParams = { section, index, id };

    if (misc) {
      let miscParam = misc;
      if (miscTracking && misc) {
        miscParam = mixedMiscTracking(miscTracking, misc);
      }
      trackingParams.misc = miscParam;
    }

    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  return (
    <div css={styles.articleChartListWrapper}>
      <div css={styles.articleChartGroupContainer} className="scrollBarHidden" ref={ref}>
        {articleList &&
          groupChartActicles(articleList, CHART_GROUPING_COUNT).map((groupedArticles, groupIdx) => (
            <ol
              css={styles.articleChartGroup}
              start={groupIdx * CHART_GROUPING_COUNT + 1}
              key={groupIdx}
            >
              {groupedArticles.map((article, idxInGroup) => {
                const index = groupIdx * CHART_GROUPING_COUNT + idxInGroup;
                const articleUrl = `/article/${getArticleKeyFromData(article)}`;
                const channelMeta = articleChannelById[article.channelName]?.channelMeta;
                return (
                  <li key={idxInGroup} css={styles.articleChartListArticle}>
                    <ConnectedTrackImpression
                      section={section}
                      index={index}
                      id={article.id}
                      misc={miscTracking}
                    >
                      <span css={styles.articleChartListRank}>{index + 1}</span>
                      <ArticleThumbnail
                        linkUrl={articleUrl}
                        imageUrl={article.thumbnailUrl}
                        articleTitle={article.title}
                        thumbnailShape={ThumbnailShape.SQUARE}
                        imageSize={ImageSize.HEIGHT_100}
                        onLinkClick={() =>
                          trackingClick(
                            index,
                            article.id,
                            JSON.stringify({ sect_ch: `ch:${channelMeta && channelMeta.id}` }),
                          )
                        }
                      />
                      <div css={styles.articleChartListMeta}>
                        <Link
                          css={styles.articleChartListMetaLink}
                          to={articleUrl}
                          onClick={() =>
                            trackingClick(
                              index,
                              article.id,
                              JSON.stringify({ sect_ch: `ch:${channelMeta && channelMeta.id}` }),
                            )
                          }
                        >
                          <span css={styles.articleChartListMetaTitle}>{article.title}</span>
                        </Link>
                        {channelMeta ? (
                          <Link
                            css={styles.articleChartListMetaLink}
                            to={articleChannelToPath({ channelName: channelMeta.name })}
                            onClick={() => trackingClick(index, `ch:${channelMeta.id}`)}
                          >
                            <span css={styles.articleChartListMetaChannel}>
                              {channelMeta.displayName}
                            </span>
                          </Link>
                        ) : null}
                      </div>
                    </ConnectedTrackImpression>
                  </li>
                );
              })}
            </ol>
          ))}
      </div>
      <SlideArrow label="이전" side="left" onClickHandler={moveLeft} isHidden={!isOnTheLeft} />
      <SlideArrow label="다음" side="right" onClickHandler={moveRight} isHidden={!isOnTheRight} />
    </div>
  );
};
