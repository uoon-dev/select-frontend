import React from 'react';
import { useSelector } from 'react-redux';

import { RSGTab, ScopedTab, ScopedTabProps } from 'app/services/review/components';
import { getIsMobile } from 'app/services/commonUI/selectors';

export type ReviewListTabProps = ScopedTabProps;

export const ReviewListTab: React.SFC<ReviewListTabProps> = props => {
  const { tabList, selectedTabName, onClick } = props;
  const isMobile = useSelector(getIsMobile);

  return isMobile ? (
    <ScopedTab tabList={tabList} selectedTabName={selectedTabName} onClick={onClick} />
  ) : (
    <RSGTab tabList={tabList} selectedTabName={selectedTabName} onClick={onClick} />
  );
};
