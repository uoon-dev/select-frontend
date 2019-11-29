import * as React from 'react';
import { Link } from 'react-router-dom';

import { ArticleChannelFollowButton } from 'app/components/ArticleChannels/ArticleChannelFollowButton';
import { ArticleChannel } from 'app/services/articleChannel';
import { articleChannelToPath } from 'app/utils/toPath';
import { ArticleChannelThumbnail } from './ArticleChannelThumbnail';

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannel> = (props) => {
  const { id, name, thumbnailUrl, displayName, description } = props;

  return (
    <div className="ArticleChannelMeta_Wrapper">
      <ArticleChannelThumbnail
        channelName={name}
        imageUrl={thumbnailUrl}
        linkUrl={articleChannelToPath({ channelName: name })}
      />
      <Link className="ArticleChannelMeta_Link" to={articleChannelToPath({ channelName: name })}>
        <span className="ArticleChannelMeta_Title">{displayName}</span>
        <span className="ArticleChannelMeta_Desc">{description}</span>
      </Link>
      <div className="ArticleChannelMeta_FollowButton">
        <ArticleChannelFollowButton
          channelId={id}
          channelName={name}
        />
      </div>
    </div>
  );
};
