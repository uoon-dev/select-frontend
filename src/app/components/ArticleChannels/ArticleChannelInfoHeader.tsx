import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ArticleChannelInfoHeaderPlaceholder } from 'app/placeholder/ArticleChannelInfoHeaderPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import { articleChannelToPath } from 'app/utils/toPath';

import { ArticleChannelFollowButton } from './ArticleChannelFollowButton';
import { ArticleChannelThumbnail } from './ArticleChannelThumbnail';

export const ArticleChannelInfoHeader: React.FunctionComponent<{
  channelId?: number;
  channelName?: string;
  contentKey: string;
  isRenderDescription?: boolean;
}> = props => {
  const { channelId, channelName, contentKey, isRenderDescription = false } = props;
  const { channelState, articleState, authorName, isChannelFollowing } = useSelector(
    (state: RidiSelectState) => {
      if (!channelName) {
        return {};
      }
      const articleById = state.articlesById[contentKey];
      const channelById = state.articleChannelById[channelName];
      return {
        articleState: articleById,
        channelState: channelById,
        authorName: articleById.article!.authors
          ? articleById.article!.authors.map(author => author.name).join(', ')
          : undefined,
        isChannelFollowing:
          channelById &&
          channelById.isMetaFetched &&
          typeof channelById.channelMeta!.isFollowing === 'boolean'
            ? channelById.channelMeta!.isFollowing
            : undefined,
      };
    },
  );

  const dispatch = useDispatch();
  const section = getSectionStringForTracking('select-article', 'content', 'channel');

  React.useEffect(() => {
    if (!channelName || typeof isChannelFollowing === 'boolean') {
      return;
    }
    dispatch(Actions.loadArticleChannelDetailRequest({ channelName }));
  }, []);

  const trackingClick = (index: number, id: string) => {
    if (!section) {
      return;
    }

    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  if (
    !channelId ||
    !channelName ||
    !articleState ||
    !articleState.article ||
    !channelState ||
    !channelState.channelMeta
  ) {
    return <ArticleChannelInfoHeaderPlaceholder />;
  }

  const renderDescription = () => {
    if (!articleState.article || !channelState.channelMeta) {
      return null;
    }

    return isRenderDescription ? (
      <p className="ChannelInfoHeader_Desc">{channelState.channelMeta.description}</p>
    ) : (
      <p className="ChannelInfoHeader_Desc">
        {authorName ? (
          <span className="ChannelInfoHeader_Desc_AuthorName">{authorName}</span>
        ) : null}
        <span
          className={classNames(
            'ChannelInfoHeader_Desc_PublishDate',
            authorName && 'ChannelInfoHeader_Desc_PublishDate-hasDivider',
          )}
        >
          {buildOnlyDateFormat(articleState.article.publishDate)}
        </span>
      </p>
    );
  };

  return (
    <div className="ChannelInfoHeader_Wrapper">
      <ArticleChannelThumbnail
        imageUrl={channelState.channelMeta.thumbnailUrl}
        thumbnailClassName="ChannelInfoHeader_ChannelThumbnailLink"
        linkUrl={articleChannelToPath({ channelName: channelState.channelMeta.name })}
        channelName={channelState.channelMeta.name}
        onLinkClick={() => trackingClick(0, `ch:${channelState.channelMeta!.id}`)}
      />
      <div className="ChannelInfoHeader_Meta">
        <Link
          className="ChannelInfoHeader_ChannelLink"
          to={articleChannelToPath({ channelName: channelState.channelMeta.name })}
          onClick={() => trackingClick(0, `ch:${channelState.channelMeta!.id}`)}
        >
          <span className="ChannelInfoHeader_Title">{channelState.channelMeta.displayName}</span>
        </Link>
        {renderDescription()}
      </div>
      <ArticleChannelFollowButton channelId={channelId} channelName={channelName} />
    </div>
  );
};
