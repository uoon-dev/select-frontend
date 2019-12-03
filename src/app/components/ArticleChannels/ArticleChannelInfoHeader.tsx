import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ArticleChannelInfoHeaderPlaceholder } from 'app/placeholder/ArticleChannelInfoHeaderPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import { articleChannelToPath } from 'app/utils/toPath';
import { ArticleChannelFollowButton } from './ArticleChannelFollowButton';
import { ArticleChannelThumbnail } from './ArticleChannelThumbnail';

export const ArticleChannelInfoHeader: React.FunctionComponent<{ channelId?: number, channelName?: string, contentKey: string }> = (props) => {
  const { channelState, articleState, authorName, isChannelFollowing } = useSelector((state: RidiSelectState) => {
    if (!props.channelName) {
      return {};
    }
    const articleById = state.articlesById[props.contentKey];
    const channelById = state.articleChannelById[props.channelName];
    return {
      articleState: articleById,
      channelState: channelById,
      authorName: articleById.article!.authors
        ? articleById.article!.authors!.map((author) => author.name).join(', ')
        : undefined,
      isChannelFollowing:
        channelById &&
        channelById.isMetaFetched &&
        typeof channelById.channelMeta!.isFollowing === 'boolean'
          ? channelById.channelMeta!.isFollowing
          : undefined,
    };
  });

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!props.channelName || typeof isChannelFollowing === 'boolean') {
      return;
    }
    dispatch(Actions.loadArticleChannelDetailRequest({ channelName: props.channelName }));
  }, []);

  if (
    !props.channelId ||
    !props.channelName ||
    !articleState ||
    !articleState.article ||
    !channelState ||
    !channelState.channelMeta
  ) {
    return <ArticleChannelInfoHeaderPlaceholder />;
  }

  return (
    <div className="ChannelInfoHeader_Wrapper">
      <ArticleChannelThumbnail
        imageUrl={channelState.channelMeta.thumbnailUrl}
        thumbnailClassName="ChannelInfoHeader_ChannelLink"
        linkUrl={articleChannelToPath({channelName: channelState.channelMeta.name})}
        channelName={channelState.channelMeta.name}
      />
      <div className="ChannelInfoHeader_Meta">
        <Link
          className="ChannelInfoHeader_ChannelLink"
          to={articleChannelToPath({channelName: channelState.channelMeta.name})}
        >
          <span className="ChannelInfoHeader_Title">{channelState.channelMeta.displayName}</span>
        </Link>
        <p className="ChannelInfoHeader_Desc">
          {authorName ? (
            <span className="ChannelInfoHeader_Desc_AuthorName">{authorName}</span>
          ) : null}
          <span className="ChannelInfoHeader_Desc_PublishDate">
            {buildOnlyDateFormat(articleState.article.publishDate)}
          </span>
        </p>
      </div>
      <ArticleChannelFollowButton
        channelId={props.channelId}
        channelName={props.channelName}
      />
    </div>
  );
};
