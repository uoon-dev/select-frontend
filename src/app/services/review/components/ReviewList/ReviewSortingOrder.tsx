import React from 'react';
import { useSelector } from 'react-redux';

import { PipeDelimitedListMenu } from 'app/hocs';
import { ReviewSortingCriteria, reviewSortingCriteriaMap } from 'app/services/review';
import { RSGTab } from 'app/services/review/components';
import { getIsMobile } from 'app/services/commonUI/selectors';

export interface ReviewSortingOrderProps {
  sortingCriteriaList: ReviewSortingCriteria[];
  sortBy: ReviewSortingCriteria;
  onClick: (sortingCriteria: string) => void;
}

export const ReviewSortingOrder: React.SFC<ReviewSortingOrderProps> = props => {
  const { sortingCriteriaList, sortBy, onClick } = props;
  const isMobile = useSelector(getIsMobile);

  return isMobile ? (
    <RSGTab
      tabList={sortingCriteriaList.map((key: ReviewSortingCriteria) => ({
        name: key,
        displayName: reviewSortingCriteriaMap[key],
      }))}
      selectedTabName={sortBy}
      onClick={itemName => onClick(itemName)}
      justify
    />
  ) : (
    <PipeDelimitedListMenu
      list={sortingCriteriaList.map((key: ReviewSortingCriteria) => ({ type: key }))}
      activeItemType={sortBy}
    >
      {item => (
        <button type="button" onClick={() => onClick(item.type)}>
          {reviewSortingCriteriaMap[item.type as ReviewSortingCriteria]}
          <span className="a11y">리스트 보기</span>
        </button>
      )}
    </PipeDelimitedListMenu>
  );
};
