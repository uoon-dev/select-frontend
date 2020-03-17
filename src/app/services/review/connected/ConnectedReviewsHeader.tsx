import React from 'react';
import { connect, useSelector } from 'react-redux';

import { BuyerRatingSummaryBlock } from 'app/services/review/components';
import { ConnectedCommentForm } from 'app/services/review/connected/ConnectedCommentForm';
import { ConnectedCommentList } from 'app/services/review/connected/ConnectedCommentList';
import { ConnectedMyReview } from 'app/services/review/connected/ConnectedMyReview';
import { ConnectedStarRatingForm } from 'app/services/review/connected/ConnectedStarRatingForm';
import { ReviewSummary } from 'app/services/review/reducer.state';
import { getMyReview, getReviewSummary } from 'app/services/review/selectors';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';
import { getIsMobile } from 'app/services/commonUI/selectors';

interface ReviewsHeaderProps {
  bookId: number;
  myReviewId: number;
  reviewSummary: ReviewSummary;
  checkAuth: () => boolean;
}

export type ReviewsHeaderStateProps = Pick<ReviewsHeaderProps, 'reviewSummary' | 'myReviewId'>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<ReviewsHeaderProps, keyof ReviewsHeaderStateProps>,
): ReviewsHeaderStateProps {
  return {
    reviewSummary: getReviewSummary(state, ownProps),
    myReviewId: getMyReview(state, ownProps).id,
  };
}

export const ReviewsHeader: React.SFC<ReviewsHeaderProps> = props => {
  const { bookId, myReviewId, reviewSummary, checkAuth } = props;
  const isMobile = useSelector(getIsMobile);

  return isMobile ? (
    <>
      <BuyerRatingSummaryBlock summary={reviewSummary} />
      <div className="ReviewsHeader_Dark">
        <ConnectedStarRatingForm bookId={bookId} checkAuth={checkAuth} />
        <ConnectedMyReview bookId={bookId} checkAuth={checkAuth}>
          <div className="Comments">
            <ConnectedCommentList bookId={bookId} reviewId={myReviewId} />
            <ConnectedCommentForm bookId={bookId} reviewId={myReviewId} checkAuth={checkAuth} />
          </div>
        </ConnectedMyReview>
      </div>
    </>
  ) : (
    <div className="ReviewsHeader">
      <BuyerRatingSummaryBlock summary={reviewSummary} />
      <div className="ReviewsHeader_Right">
        <ConnectedStarRatingForm bookId={bookId} checkAuth={checkAuth} />
        <ConnectedMyReview bookId={bookId} checkAuth={checkAuth}>
          <div className="Comments">
            <ConnectedCommentList bookId={bookId} reviewId={myReviewId} />
            <ConnectedCommentForm bookId={bookId} reviewId={myReviewId} checkAuth={checkAuth} />
          </div>
        </ConnectedMyReview>
      </div>
    </div>
  );
};

export const ConnectedReviewsHeader = connect(mapStateToProps)(ReviewsHeader);
