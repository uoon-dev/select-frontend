import { ArticleChannelFollowButton } from 'app/components/ArticleChannels/ArticleChannelFollowButton';
import { Method } from 'axios';
import * as React from 'react';

interface ArticleChannelMetaProps {
  id: number;
  name: string;
  displayName: string;
  thumbnailUrl?: string;
  description?: string;
  subDescription?: string | null;
  followersCount?: number;
  isFollowing?: boolean;
}

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannelMetaProps> = (props) => {
  const {
    id,
    name,
    displayName,
    thumbnailUrl,
    description,
    subDescription,
    followersCount = 0,
  } = props;
  const [followCount, setFollowCount] = React.useState(followersCount);

  const setChannelFollowCount = (method: Method) => {
    if (method === 'POST') {
      setFollowCount(followCount + 1);
    } else {
      setFollowCount(followCount - 1);
    }
  };

  return (
    <section>
      <div className="ArticleChannelMeta_Wrap">
        <div className="ArticleChannel_Thumbnail">
          <img src={thumbnailUrl} className={'ArticleChannel_Image'} />
        </div>
        <div className="ArticleChannel_Meta">
          <h2 className="ArticleChannel_Meta_Title">{displayName}</h2>
          <p className="ArticleChannel_Meta_Desc">{description}</p>
          <span className="ArticleChannel_Meta_Serial">{subDescription}</span>
          <span className="ArticleChannel_Meta_Following">팔로잉 <strong className="ArticleChannel_Meta_FollowingNumber">{followCount}</strong></span>
          <ArticleChannelFollowButton
            channelId={id}
            channelName={name}
            afterAction={setChannelFollowCount}
          />
        </div>
      </div>
    </section>
  );
};
