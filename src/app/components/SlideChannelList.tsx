import { ArticleChannelThumbnail } from 'app/components/ArticleChannels/ArticleChannelThumbnail';
import { ArticleChannel } from 'app/services/articleChannel';
import { Actions } from 'app/services/articleChannel';
import { Actions as FollowingActions } from 'app/services/articleFollowing';
import { articleChannelToPath } from 'app/utils/toPath';
import { Method } from 'axios';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import toast from 'app/utils/toast';

interface SlideChannelListProps {
  channels: ArticleChannel[];
}

const BlockIconComponent = (props: any) => (
  <svg width={24} height={24} className="ArticleFollowing_BlockIcon" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12zm16.3 4.9L7.1 5.7C8.4 4.6 10.1 4 12 4c4.4 0 8 3.6 8 8 0 1.9-.6 3.6-1.7 4.9zM4 12c0-1.9.6-3.6 1.7-4.9l11.2 11.2c-1.3 1.1-3 1.7-4.9 1.7-4.4 0-8-3.6-8-8z" />
  </svg>
);

export const SlideChannelList: React.FunctionComponent<SlideChannelListProps> = (props) => {
  const { channels } = props;
  const dispatch = useDispatch();

  const handleBlockChannelClick = (channelId: number, channelName: string) => {
    const method: Method = 'DELETE';
    const toastButton = {
      callback: () => {
        dispatch(Actions.articleChannelFollowingActionRequest({ channelId, channelName, method }));
        dispatch(FollowingActions.loadFollowingChannelListRequest());
      },
      label: '팔로잉 취소',
    };
    toast.failureMessage('이용할 수 없는 채널입니다. 팔로잉을 취소하시겠습니까?', {
      button: {
        showArrowIcon: true,
        ...toastButton,
      },
    });
  };

  return (
    <section>
      <ul className="FollowingChannel_List">
        {
          channels.map((channel, idx) => (
            <li key={idx} className="FollowingChannel_Item">
              <div className="FollowingChannel_Item_InnerWrapper">
                { channel.isEnabled ?
                  <>
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
                  </> :
                  <>
                    <button
                      type="button"
                      className="ArticleFollowing_BlockButton"
                      onClick={() => handleBlockChannelClick(channel.id, channel.name)}
                    >
                      <BlockIconComponent />
                    </button>
                    <div className="FollowingChannel_Block_Title">{channel.displayName}</div>
                  </>
                }
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  );
};
