import * as React from 'react';

export const SlideChannelListPlaceholder: React.FunctionComponent = () => (
  <ul className="FollowingChannelList">
    <li className="FollowingChannel">
      <div className="ChannelItem">
        <div className="ChannelThumbnail_Skeleton Skeleton" />
        <span className="ChannelName_Skeleton Skeleton" />
      </div>
    </li>
    <li className="FollowingChannel">
      <div className="ChannelItem">
        <div className="ChannelThumbnail_Skeleton Skeleton" />
        <span className="ChannelName_Skeleton Skeleton" />
      </div>
    </li>
    <li className="FollowingChannel">
      <div className="ChannelItem">
        <div className="ChannelThumbnail_Skeleton Skeleton" />
        <span className="ChannelName_Skeleton Skeleton" />
      </div>
    </li>
  </ul>
);
