import * as classNames from 'classnames';
import * as React from 'react';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';

import history from 'app/config/history';
import { FetchStatusFlag } from 'app/constants';
import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { ConnectedBookDetailHeader } from 'app/components/BookDetail/Header';
import { BookDetailPlaceholder } from 'app/placeholder/BookDetailPlaceholder';
import { ConnectBookDetailNoticeList } from 'app/components/BookDetail/NoticeList';
import { ConnectBookDetailMovieTrailer } from 'app/components/BookDetail/MovieTrailer';
import { ConnectedBookDetailMetaContents } from 'app/components/BookDetail/MetaContents';
import { ConnectedBookDetailContentPanels } from 'app/components/BookDetail/ContentPanels';
import {
  Actions as BookActions,
  Book,
  BookOwnershipStatus,
  BookTitle,
} from 'app/services/book';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { EnvironmentState } from 'app/services/environment';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { RidiSelectState } from 'app/store';
import { BookId } from 'app/types';
import { bookDetailToPath } from 'app/utils/toPath';

interface BookDetailStateProps {
  bookId: BookId;
  status?: number;
  location?: string;
  fetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;
  title?: BookTitle;
  bookEndDateTime: string;
  bookToBookRecommendationFetchStatus: FetchStatusFlag;
  recommendedBooks?: Book[];
  env: EnvironmentState;
  solidBackgroundColorRGBString: string;
  ownershipStatus?: BookOwnershipStatus;
}

type RouteProps = RouteComponentProps<{ bookId: string; }>;

type OwnProps = RouteProps & {};

type Props = ReturnType<typeof mapDispatchToProps> & BookDetailStateProps & OwnProps;

export class BookDetail extends React.Component<Props> {
  private fetchBookDetailPageData = (props: Props) => {
    if (props.fetchStatus !== FetchStatusFlag.FETCHING && !props.bookEndDateTime) {
      props.dispatchLoadBookRequest(props.bookId);
    }
  }

  private fetchBookDetailAdditionalData = (props: Props) => {
    if (!props.isFetched) {
      return;
    }
    if (props.ownershipFetchStatus !== FetchStatusFlag.FETCHING && !props.ownershipStatus && props.isLoggedIn) {
      props.dispatchLoadBookOwnershipRequest(props.bookId);
    }
    if (props.bookToBookRecommendationFetchStatus !== FetchStatusFlag.FETCHING && !props.recommendedBooks) {
      props.dispatchLoadBookToBookRecommendation(props.bookId);
    }
  }

  public componentDidMount() {
    this.fetchBookDetailPageData(this.props);
    requestAnimationFrame(forceCheck);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.status === 301) {
      const correctedBookId = nextProps.location.replace('/api/books/', '');
      history.replace(bookDetailToPath({ bookId: correctedBookId }));
    }
    if (this.props.bookId !== nextProps.bookId) {
      this.fetchBookDetailPageData(nextProps);
    } else {
      this.fetchBookDetailAdditionalData(nextProps);
    }
  }

  public render() {
    const {
      bookId,
      title,
      env,
      solidBackgroundColorRGBString,
    } = this.props;

    if (!title || !title.main) {
      return <BookDetailPlaceholder />;
    }
    return (
      <MediaQuery maxWidth={840}>
        {(isMobile) => (
          <main
            className={classNames(
              'SceneWrapper',
              'PageBookDetail',
            )}
          >
            <HelmetWithTitle
              titleName={title && title.main ? title.main : null}
              meta={[{
                name: 'theme-color',
                content: solidBackgroundColorRGBString,
              }]}
            />
            {env.platform.isRidibooks && <ConnectedPageHeader pageTitle={title.main} />}
            <ConnectedBookDetailHeader bookId={bookId}>
              {!isMobile && (
                <ConnectedBookDetailMetaContents bookId={bookId} isMobile={false} />
              )}
            </ConnectedBookDetailHeader>
            <BookDetailPanelWrapper renderCondition={isMobile}>
              {isMobile && (
                <>
                  <ConnectedBookDetailMetaContents bookId={bookId} isMobile={isMobile} />
                  <ConnectBookDetailMovieTrailer bookId={bookId} isMobile={isMobile} />
                </>
              )}
              <ConnectBookDetailNoticeList bookId={bookId} isMobile={isMobile} />
            </BookDetailPanelWrapper>
            {!isMobile && <ConnectBookDetailMovieTrailer bookId={bookId} isMobile={isMobile} />}
            <ConnectedBookDetailContentPanels bookId={bookId} isMobile={isMobile} />
          </main>
        )}
      </MediaQuery>
    );
  }
}

const mapStateToProps = (state: RidiSelectState, ownProps: OwnProps): BookDetailStateProps => {
  const bookId = Number(ownProps.match.params.bookId);
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const book = stateExists ? bookState.book : undefined;
  const bookDetail = stateExists ? bookState.bookDetail : undefined;
  const fetchStatus = stateExists ? bookState.detailFetchStatus : FetchStatusFlag.IDLE;

  return {
    bookId,
    fetchStatus,
    status: !!bookDetail ? bookDetail.status : undefined,
    location: !!bookDetail ? bookDetail.location : undefined,
    isLoggedIn: state.user.isLoggedIn,
    ownershipStatus: stateExists ? bookState.ownershipStatus : undefined,
    bookEndDateTime: !!bookDetail ? bookDetail.endDatetime : '',
    env: state.environment,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    bookToBookRecommendationFetchStatus: !!bookDetail ? bookState.bookToBookRecommendationFetchStatus : FetchStatusFlag.IDLE,
    recommendedBooks: !!bookDetail && bookState.recommendedBooks ? bookState.recommendedBooks : undefined,
    // Data that can be pre-fetched in home
    title: !!bookDetail ? bookDetail.title : !!book ? book.title : undefined,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadBookRequest: (bookId: number) => dispatch(BookActions.loadBookDetailRequest({ bookId })),
    dispatchLoadBookToBookRecommendation: (bookId: number) => dispatch(BookActions.loadBookToBookRecommendationRequest({ bookId })),
    dispatchLoadBookOwnershipRequest: (bookId: number) =>
      dispatch(BookActions.loadBookOwnershipRequest({ bookId })),
    dispatchAddMySelect: (bookId: BookId) => dispatch(MySelectActions.addMySelectRequest({ bookId })),
  };
};

export const ConnectedBookDetail = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookDetail),
);
