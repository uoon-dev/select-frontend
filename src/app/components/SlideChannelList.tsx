import { ArticleChannelThumbnail } from 'app/components/ArticleChannels/ArticleChannelThumbnail';
import { BlockIconComponent } from 'app/components/ArticleThumbnail';
import { ArticleChannel } from 'app/services/articleChannel';
import { Actions } from 'app/services/articleFollowing';
import toast from 'app/utils/toast';
import { articleChannelToPath } from 'app/utils/toPath';
import { Method } from 'axios';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface SlideChannelListProps {
  channels: ArticleChannel[];
}

export const SlideChannelList: React.FunctionComponent<SlideChannelListProps> = (props) => {
  const { channels } = props;
  const dispatch = useDispatch();

  const handleBlockChannelClick = (channelId: number, channelName: string) => {
    const method: Method = 'DELETE';
    const toastButton = {
      callback: () => {
        dispatch(Actions.loadUnFollowChannelRequest({channelId, channelName, method}));
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
                      <BlockIconComponent width={24} height={24} className={'ArticleFollowing_BlockIcon'} />
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
