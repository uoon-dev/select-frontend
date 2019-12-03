import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { ArticleResponse } from 'app/services/article/requests';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { articleChannelToPath } from 'app/utils/toPath';
import { getArticleKeyFromData } from 'app/utils/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThumbnailShape } from './ArticleThumbnail/types';

const CHART_GROUPING_COUNT = 5;

interface ArticleSectionChartListProps {
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  filterForTracking?: string;
  articleList?: ArticleResponse[];
}

export const ArticleSectionChartList: React.FunctionComponent<ArticleSectionChartListProps> = (props) => {
  const {
    articleList,
    serviceTitleForTracking,
    pageTitleForTracking,
    uiPartTitleForTracking,
    filterForTracking,
  } = props;
  const { articleChannelById } = useSelector((state: RidiSelectState) => ({ articleChannelById: state.articleChannelById }));
  const section = !!serviceTitleForTracking && !!pageTitleForTracking
    ? getSectionStringForTracking(serviceTitleForTracking, pageTitleForTracking, uiPartTitleForTracking, filterForTracking)
    : undefined;

  const groupChartActicles = (articles: ArticleResponse[], groupingUnitCount: number) => {
    const groupedArticles: ArticleResponse[][] = [];
    articles.slice(0, 10).map((article, idx) => {
      if (idx % groupingUnitCount === 0) {
        groupedArticles.push([article]);
      } else {
        groupedArticles[groupedArticles.length - 1].push(article);
      }
    });

    return groupedArticles;
  };

  return (
    <div className="ArticleChartList_Wrapper">
      {articleList && articleList && groupChartActicles(articleList, CHART_GROUPING_COUNT)
        .map((groupedArticles, groupIdx) => (
          <ol className="ArticleChartGroup" start={groupIdx * 5 + 1} key={groupIdx}>
            {groupedArticles.map((article, idxInGroup) => {
              const index = groupIdx * CHART_GROUPING_COUNT + idxInGroup;
              const articleUrl = `/article/${getArticleKeyFromData(article)}`;
              const channelMeta = articleChannelById &&
                articleChannelById[article.channelName] &&
                articleChannelById[article.channelName].channelMeta;
              return (
                <li
                  key={idxInGroup}
                  className="ArticleChartList_Article"
                >
                  <ConnectedTrackImpression
                    section={section}
                    index={index}
                    id={article.id}
                  >
                    <span className="ArticleChartList_Rank">{index + 1}</span>
                    <ArticleThumbnail
                      linkUrl={articleUrl}
                      imageUrl={article.thumbnailUrl}
                      articleTitle={article.title}
                      thumbnailShape={ThumbnailShape.SQUARE}
                    />
                    <Link
                      className="ArticleChartList_Meta"
                      to={articleUrl}
                    >
                      <span className="ArticleChartList_Meta_Title">{article.title}</span>
                      {channelMeta ? (
                        <Link
                          className="ArticleChartList_Channel_Link"
                          to={articleChannelToPath({channelName: channelMeta.name})}
                        >
                          <span className="ArticleChartList_Meta_Channel">{channelMeta.displayName}</span>
                        </Link>
                      ) : null}
                    </Link>
                  </ConnectedTrackImpression>
                </li>
              );
            })}
          </ol>
        ),
      )}
    </div>
  );
};
