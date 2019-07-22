import * as classNames from 'classnames';
import * as React from 'react';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
// tslint:disable-next-line
const Vibrant = require('node-vibrant');
import { Palette as VibrantPalette } from 'node-vibrant/lib/color';

import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { ConnectedBookDetailContentPanels } from 'app/components/BookDetail/ContentPanels';
import { ConnectedBookDetailHeader } from 'app/components/BookDetail/Header';
import { ConnectedBookDetailMetaContents } from 'app/components/BookDetail/MetaContents';
import { ConnectBookDetailNoticeList } from 'app/components/BookDetail/NoticeList';
import { BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { FetchStatusFlag } from 'app/constants';
import { BookDetailPlaceholder } from 'app/placeholder/BookDetailPlaceholder';
import { Actions as BookActions } from 'app/services/book';
import {
  Book,
  BookOwnershipStatus,
  BookThumbnailUrlMap,
  BookTitle,
} from 'app/services/book';
import { Actions as CommonUIActions, GNB_DEFAULT_COLOR, RGB } from 'app/services/commonUI';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { EnvironmentState } from 'app/services/environment';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { RidiSelectState } from 'app/store';
import { BookId } from 'app/types';
import { withThumbnailQuery } from 'app/utils/withThumbnailQuery';

interface BookDetailStateProps {
  bookId: BookId;
  fetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;

  title?: BookTitle;
  thumbnail?: BookThumbnailUrlMap;

  bookEndDateTime: string;
  dominantColor?: RGB;

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
  private updateDominantColor = (props: Props) => {
    const {
      dominantColor,
      thumbnail,
      dispatchUpdateDominantColor,
      dispatchUpdateGNBColor,
      bookId,
    } = props;

    if (dominantColor && dominantColor.r && dominantColor.g && dominantColor.b) {
      dispatchUpdateGNBColor(dominantColor);
      return;
    }

    if (thumbnail) {
      try {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = withThumbnailQuery(thumbnail.large!);
        Vibrant
          .from(image)
          .getPalette()
          .then((palette: VibrantPalette) => {
            const rgb =
              palette.DarkVibrant ||
              palette.Vibrant ||
              palette.LightMuted ||
              GNB_DEFAULT_COLOR;
            dispatchUpdateGNBColor(rgb);
            dispatchUpdateDominantColor(bookId, rgb);
          });
      } catch (e) {
        dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
      }
    } else {
      dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
    }
  }

  private fetchBookDetailPageData = (props: Props) => {
    if (props.fetchStatus !== FetchStatusFlag.FETCHING && !props.bookEndDateTime) {
      props.dispatchLoadBookRequest(props.bookId);
    }
    if (!props.ownershipStatus && props.isLoggedIn) {
      props.dispatchLoadBookOwnershipRequest(props.bookId);
    }
    if (props.bookToBookRecommendationFetchStatus === FetchStatusFlag.IDLE && !props.recommendedBooks) {
      props.dispatchLoadBookToBookRecommendation(props.bookId);
    }
  }

  public componentDidMount() {
    this.fetchBookDetailPageData(this.props);
    this.updateDominantColor(this.props);
    requestAnimationFrame(forceCheck);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.bookId !== nextProps.bookId) {
      this.fetchBookDetailPageData(nextProps);
    }
    if (
      (!this.props.thumbnail && nextProps.thumbnail) ||
      (
        (this.props.fetchStatus !== FetchStatusFlag.FETCHING && !this.props.bookEndDateTime) &&
        (nextProps.fetchStatus !== FetchStatusFlag.FETCHING && !nextProps.bookEndDateTime)
      )
    ) {
      this.updateDominantColor(nextProps);
    }
  }
  public componentWillUnmount() {
    this.props.dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
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
                <ConnectedBookDetailMetaContents bookId={bookId} isMobile={isMobile} />
              )}
              <ConnectBookDetailNoticeList bookId={bookId} isMobile={isMobile} />
            </BookDetailPanelWrapper>
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
    isLoggedIn: state.user.isLoggedIn,
    ownershipStatus: stateExists ? bookState.ownershipStatus : undefined,
    dominantColor: stateExists ? bookState.dominantColor : undefined,
    // Data that can be pre-fetched in home

    title: !!bookDetail ? bookDetail.title : !!book ? book.title : undefined,
    thumbnail: !!bookDetail ? bookDetail.thumbnail : !!book ? book.thumbnail : undefined,
    bookEndDateTime: !!bookDetail ? bookDetail.endDatetime : '',

    env: state.environment,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    bookToBookRecommendationFetchStatus: !!bookDetail ? bookState.bookToBookRecommendationFetchStatus : FetchStatusFlag.IDLE,
    recommendedBooks: !!bookDetail && bookState.recommendedBooks ? bookState.recommendedBooks : undefined,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadBookRequest: (bookId: number) => dispatch(BookActions.loadBookDetailRequest({ bookId })),
    dispatchLoadBookToBookRecommendation: (bookId: number) => dispatch(BookActions.loadBookToBookRecommendationRequest({ bookId })),
    dispatchUpdateGNBColor: (color: RGB) => dispatch(CommonUIActions.updateGNBColor({ color })),
    dispatchUpdateDominantColor: (bookId: number, color: RGB) =>
      dispatch(BookActions.updateDominantColor({ bookId, color })),
    dispatchLoadBookOwnershipRequest: (bookId: number) =>
      dispatch(BookActions.loadBookOwnershipRequest({ bookId })),
    dispatchAddMySelect: (bookId: BookId) => dispatch(MySelectActions.addMySelectRequest({ bookId })),
  };
};

export const ConnectedBookDetail = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookDetail),
);
