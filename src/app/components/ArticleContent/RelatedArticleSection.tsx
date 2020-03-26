import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ArticleKey } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { RidiSelectState } from 'app/store';
import { ImageSize, FetchStatusFlag } from 'app/constants';

interface RelatedArticleSectionState {
  contentKey: ArticleKey;
  channelName: string;
}

const RelatedArticleSection: React.FunctionComponent<RelatedArticleSectionState> = props => {
  const { contentKey, channelName } = props;

  const relatedArticles = useSelector((state: RidiSelectState) => {
    const articleKeys = state.articlesById[contentKey]?.relatedArticles?.articles;
    if (!articleKeys) {
      return [];
    }
    return articleKeys.map((key: string) => state.articlesById[key]?.article);
  });
  const relatedArticleFetchStatus = useSelector(
    (state: RidiSelectState) =>
      state.articlesById[contentKey]?.relatedArticles?.fetchStatus || FetchStatusFlag.IDLE,
  );
  const channelMeta = useSelector(
    (state: RidiSelectState) => state.articleChannelById[channelName]?.channelMeta,
  );

  const section = getSectionStringForTracking('select-article', 'search-result', 'article-list');
  const dispatch = useDispatch();

  const trackingClick = (index: number, id: number, misc?: string) => {
    if (!section) {
      return;
    }
    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id,
      misc,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  return relatedArticles ? (
    <section>
      <SectionHeader title={`${channelMeta?.displayName || '이 채널'}의 다른 아티클`} />
      <ul className="SearchResultArticleList">
        {relatedArticles.map((article, idx) => (
          <li className="SearchResultArticleList_Item" key={article!.id}>
            <ConnectedTrackImpression section={section} index={idx} id={article!.id}>
              <div className="SearchResultArticleList_Link">
                <ArticleThumbnail
                  linkUrl={`/article/${getArticleKeyFromData(article)}`}
                  imageUrl={article!.thumbnailUrl}
                  thumbnailShape={ThumbnailShape.SQUARE}
                  thumbnailClassName="SearchResultArticleList_Thumbnail"
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
                  to={`/article/${getArticleKeyFromData(article)}`}
                  className="SearchResultArticleList_Meta"
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
                  <h3 className="SearchResultArticleList_Title">{article!.title}</h3>
                </Link>
              </div>
            </ConnectedTrackImpression>
          </li>
        ))}
      </ul>
    </section>
  ) : null;
};

export default RelatedArticleSection;
