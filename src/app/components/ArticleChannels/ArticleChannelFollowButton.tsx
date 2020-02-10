import { Method } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import classNames from 'classnames';

export const ArticleChannelFollowButton: React.FunctionComponent<{
  channelId: number;
  channelName: string;
}> = ({ channelName, channelId }) => {
  const isChannelFollowing = useSelector(
    (state: RidiSelectState) => state.articleChannelById[channelName]?.channelMeta?.isFollowing,
  );
  const followFetchStatus = useSelector(
    (state: RidiSelectState) => state.articleChannelById[channelName].followFetchStatus,
  );

  const isFetching = React.useMemo(() => followFetchStatus === FetchStatusFlag.FETCHING, [
    followFetchStatus,
  ]);

  const dispatch = useDispatch();
  const handleButtonClick = () => {
    if (followFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(
      Actions.articleChannelFollowingActionRequest({
        channelId,
        channelName,
        method: isChannelFollowing ? 'DELETE' : 'POST',
      }),
    );
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
      onClick={handleButtonClick}
      disabled={isFetching}
      spinner={typeof isChannelFollowing !== 'boolean' || isFetching}
    >
      {typeof isChannelFollowing === 'boolean' && !isFetching ? (
        isChannelFollowing ? (
          '팔로잉'
        ) : (
          <>
            <Icon name="plus_1" className="Channel_FollowButton_Icon" />
            팔로우
          </>
        )
      ) : null}
    </Button>
  );
};
