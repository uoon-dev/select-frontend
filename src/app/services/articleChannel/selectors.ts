import { createSelector } from 'reselect';

import { RidiSelectState } from 'app/store';

const channelListSelector = (state: RidiSelectState) => state.articleChannels;
const channelByIdSelector = (state: RidiSelectState) => state.articleChannelById;

export const getChannelList = createSelector(
  [channelListSelector, channelByIdSelector],
  (channelItems, channelById) => {
    const { channelList } = channelItems;
    return channelList.map(channelName => channelById[channelName].channelMeta);
  },
);
