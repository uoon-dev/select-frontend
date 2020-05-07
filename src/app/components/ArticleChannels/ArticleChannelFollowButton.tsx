import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Colors from 'app/styles/colors';
import PlusIcon from 'svgs/Plus.svg';
import { Button, RSGButtonSize, RSGButtonColor } from 'app/components/RSG';
import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';

const FollowButton = styled(Button)`
  display: inline-block;
  margin-left: auto;
  margin-top: 10px;
  min-width: 76px;
  width: 100px;
  height: 30px;
  line-height: 28px;
  box-shadow: none;
  font-size: 12px;
  font-weight: 700;
  border-radius: 3px;
  border: 1px solid ${Colors.dodgerblue_50};
`;

const ButtonIcon = styled(PlusIcon)`
  width: 10px;
  height: 10px;
  fill: white;
  margin-right: 4px;
`;

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
    <FollowButton
      size={RSGButtonSize.SMALL}
      color={RSGButtonColor.BLUE}
      outline={isChannelFollowing}
      className={isChannelFollowing ? 'active' : ''}
      onClick={handleButtonClick}
      disabled={isFetching}
      spinner={typeof isChannelFollowing !== 'boolean' || isFetching}
    >
      {typeof isChannelFollowing === 'boolean' && !isFetching ? (
        isChannelFollowing ? (
          '팔로잉'
        ) : (
          <>
            <ButtonIcon />
            팔로우
          </>
        )
      ) : null}
    </FollowButton>
  );
};
