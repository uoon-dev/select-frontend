import * as React from 'react';
import { Link } from 'react-router-dom';

import { ArticleChannelThumbnail } from 'app/components/ArticleChannels/ArticleChannelThumbnail';
import { ArticleChannel } from 'app/services/articleChannel';
import { articleChannelToPath } from 'app/utils/toPath';

interface SlideChannelListProps {
  channels: ArticleChannel[];
}

export const SlideChannelList: React.FunctionComponent<SlideChannelListProps> = (props) => {
  const { channels } = props;
  return (
    <section>
      <ul className="FollowingChannel_List">
        {
          channels.map((channel, idx) => (
            <li key={idx} className="FollowingChannel_Item">
              <div className="FollowingChannel_Item_InnerWrapper">
                <ArticleChannelThumbnail
                  imageUrl={channel.thumbnailUrl}
                  channelName={channel.displayName}
                  linkUrl={articleChannelToPath({channelName: channel.name})}
                />
                <Link
                  to={articleChannelToPath({channelName: channel.name})}
                  className="FollowingChannel_Item_Link"
                >
                  {channel.displayName}
                </Link>
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  );
};
