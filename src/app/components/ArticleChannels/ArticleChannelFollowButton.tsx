import { Method } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import classNames from 'classnames';
import { debounce } from 'lodash-es';

export const ArticleChannelFollowButton: React.FunctionComponent<{
  className?: string;
  channelId: number;
  channelName: string;
}> = (props) => {
  const isChannelFollowing = useSelector((state: RidiSelectState) => {
    const channelById = state.articleChannelById[props.channelName];
    return channelById && channelById.channelMeta && typeof channelById.channelMeta.isFollowing === 'boolean'
      ? channelById.channelMeta.isFollowing
      : undefined;
  });
  const followFetchStatus = useSelector((state: RidiSelectState) => state.articleChannelById[props.channelName].followFetchStatus);

  const dispatch = useDispatch();
  const handleButtonClick = (method: Method) => {
    if (followFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: props.channelId, channelName: props.channelName, method }));
  };

  return (
    <Button
      size="small"
      color="blue"
      outline={isChannelFollowing}
      className={classNames(
        'Channel_FollowButton',
        isChannelFollowing && 'Channel_FollowButton-active',
      )}
      onClick={debounce(() => {
        handleButtonClick(isChannelFollowing ? 'DELETE' : 'POST');
      }, 100)}
      disabled={followFetchStatus === FetchStatusFlag.FETCHING}
      spinner={typeof isChannelFollowing !== 'boolean' || followFetchStatus === FetchStatusFlag.FETCHING}
    >
      {typeof isChannelFollowing === 'boolean' && followFetchStatus !== FetchStatusFlag.FETCHING
        ? isChannelFollowing
          ?  '팔로잉'
          : (
            <>
              <Icon name="plus_1" className="Channel_FollowButton_Icon" />
              팔로우
            </>
          )
        : null}
    </Button>
  );
};
