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
}> = ({
  channelName,
  channelId,
  className
}) => {

  const isChannelFollowing = useSelector((state: RidiSelectState) => state.articleChannelById[channelName]?.channelMeta?.isFollowing);
  const followFetchStatus = useSelector((state: RidiSelectState) => state.articleChannelById[channelName].followFetchStatus);

  const checkIsFetching = () => followFetchStatus === FetchStatusFlag.FETCHING;

  const dispatch = useDispatch();
  const handleButtonClick = (method: Method) => {
    if (followFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId, channelName, method }));
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
      disabled={checkIsFetching()}
      spinner={typeof isChannelFollowing !== 'boolean' || checkIsFetching()}
    >
      {typeof isChannelFollowing === 'boolean' && !checkIsFetching()
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
