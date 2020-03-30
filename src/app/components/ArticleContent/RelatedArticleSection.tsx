import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ArticleKey } from 'app/types';
import { RidiSelectState } from 'app/store';
import { getArticleKeyFromData } from 'app/utils/utils';
import { ImageSize } from 'app/constants';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import * as styles from 'app/components/ArticleContent/relatedArticleSectionStyles';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';

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
  const channelMeta = useSelector(
    (state: RidiSelectState) => state.articleChannelById[channelName]?.channelMeta,
  );

  const section = getSectionStringForTracking('select-article', 'related-article', 'article-list');
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
      <h3 css={styles.relatedArticleSectionHeader}>
        {channelMeta?.displayName || '이 채널'}의 다른 아티클
      </h3>
      <ul css={styles.relatedArticleList}>
        {relatedArticles.map((article, idx) => (
          <li css={styles.relatedArticleList_Item} key={article!.id}>
            <ConnectedTrackImpression section={section} index={idx} id={article!.id}>
              <div css={styles.relatedArticleList_Link}>
                <ArticleThumbnail
                  linkUrl={`/article/${getArticleKeyFromData(article)}`}
                  imageUrl={article!.thumbnailUrl}
                  thumbnailShape={ThumbnailShape.SQUARE}
                  articleTitle={article!.title}
                  imageSize={ImageSize.HEIGHT_100}
                  thumbnailStyle={styles.relatedArticleList_Thumbnail}
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
                  css={styles.relatedArticleList_Meta}
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
                  <h3 css={styles.relatedArticleList_Title}>{article!.title}</h3>
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
