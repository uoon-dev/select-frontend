import * as classNames from 'classnames';
import * as React from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
// tslint:disable-next-line
const Vibrant = require('node-vibrant');
import { Palette as VibrantPalette } from 'node-vibrant/lib/color';

import { Icon } from '@ridi/rsg';
import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { ConnectedBookDetailHeader } from 'app/components/BookDetail/Header';
import { ConnectedBookDetailMetaContents } from 'app/components/BookDetail/MetaContents';
import { ConnectBookDetailMovieTrailer } from 'app/components/BookDetail/MovieTrailer';
import { ConnectBookDetailNoticeList } from 'app/components/BookDetail/NoticeList';
import { BookDetailPanel, BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { ExpandableBookList } from 'app/components/ExpandableBookList';
import { FetchStatusFlag } from 'app/constants';
import { BookDetailPlaceholder } from 'app/placeholder/BookDetailPlaceholder';
import {
  Book,
  BookOwnershipStatus,
  BookThumbnailUrlMap,
  BookTitle,
} from 'app/services/book';
import { Actions as BookActions } from 'app/services/book';
import { BookDetailPublishingDate } from 'app/services/book/requests';
import { Actions as CommonUIActions, GNB_DEFAULT_COLOR, RGB } from 'app/services/commonUI';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { EnvironmentState } from 'app/services/environment';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { ConnectedReviews } from 'app/services/review';
import { RidiSelectState } from 'app/store';
import { BookId, TextWithLF } from 'app/types';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import { withThumbnailQuery } from 'app/utils/withThumbnailQuery';

interface BookDetailStateProps {
  bookId: BookId;
  fetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;

  title?: BookTitle;
  thumbnail?: BookThumbnailUrlMap;

  bookEndDateTime: string;

  seriesBookList?: Book[];
  publisherReview?: TextWithLF;
  authorIntroduction?: TextWithLF;
  introduction?: TextWithLF;
  introImageUrl?: string;
  tableOfContents?: TextWithLF;
  publishingDate?: BookDetailPublishingDate;
  dominantColor?: RGB;

  bookToBookRecommendationFetchStatus: FetchStatusFlag;
  recommendedBooks?: Book[];

  env: EnvironmentState;
  solidBackgroundColorRGBString: string;

  ownershipStatus?: BookOwnershipStatus;
}

type RouteProps = RouteComponentProps<{
  bookId: string;
}>;

type OwnProps = RouteProps & {};

type Props = ReturnType<typeof mapDispatchToProps> & BookDetailStateProps & OwnProps;

interface State {
  thumbnailExapnded: boolean;
  isAuthorsExpanded: boolean;
}

export class BookDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.checkAuth = this.checkAuth.bind(this);
  }

  public state = {
    thumbnailExapnded: false,
    isAuthorsExpanded: false,
  };

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

  private renderOverlays() {
    const { thumbnail, title, fetchStatus } = this.props;
    const { thumbnailExapnded } = this.state;

    return fetchStatus === FetchStatusFlag.IDLE && thumbnail ? (
      <>
        {thumbnailExapnded && (
          <div
            className="PageBookDetail_ThumbnailPopup"
            onClick={() => this.setState({ thumbnailExapnded: false })}
          >
            <div className="PageBookDetail_ThumbnailPopupContent">
              <button
                className="PageBookDetail_ThumbnailPopupCloseBtn"
                onClick={() => this.setState({ thumbnailExapnded: false })}
              >
                <Icon name="close_2" />
              </button>
              <img
                className="PageBookDetail_ThumbnailPopupImg"
                src={`${thumbnail!.xxlarge}?dpi=xxhdpi`}
                alt={title!.main}
              />
            </div>
          </div>
        )}
      </>
    ) : null;
  }

  public componentDidMount() {
    this.fetchBookDetailPageData(this.props);
    this.updateDominantColor(this.props);
    requestAnimationFrame(forceCheck);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.bookId !== nextProps.bookId) {
      this.updateDominantColor(nextProps);
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

  public checkAuth() {
    if (this.props.isLoggedIn) {
      return true;
    }
    if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
      window.location.replace(`${ this.props.env.STORE_URL }/account/oauth-authorize?fallback=login&return_url=${window.location.href}`);
    }
    return false;
  }
  public render() {
    const {
      bookId,
      tableOfContents,
      authorIntroduction,
      publishingDate,
      introduction,
      introImageUrl,
      title,
      publisherReview,
      seriesBookList,
      env,
      solidBackgroundColorRGBString,
      recommendedBooks,
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
            <ConnectedBookDetailHeader bookId={bookId} isMobile={isMobile}>
              {!isMobile && <ConnectedBookDetailMetaContents
                isMobile={false}
                bookId={bookId}
              />}
            </ConnectedBookDetailHeader>
            <BookDetailPanelWrapper renderCondition={isMobile}>
              {isMobile && (
                <ConnectedBookDetailMetaContents
                  isMobile={isMobile}
                  bookId={bookId}
                />
              )}
              <ConnectBookDetailNoticeList
                isMobile={isMobile}
                bookId={bookId}
              />
            </BookDetailPanelWrapper>
            <ConnectBookDetailMovieTrailer bookId={bookId} isMobile={isMobile} />
            <BookDetailPanel
              title="책 소개"
              imageUrl={introImageUrl}
              isMobile={isMobile}
              useSkeleton={true}
            >
              {introduction}
            </BookDetailPanel>
            <ExpandableBookList
              books={seriesBookList}
              className="PageBookDetail_Panel"
              listTitle="이 책의 시리즈"
              pageTitleForTracking="book-detail"
              uiPartTitleForTracking="series-list"
            />
            <BookDetailPanel title="출판사 서평" isMobile={isMobile}>{publisherReview}</BookDetailPanel>
            <BookDetailPanel title="저자 소개" isMobile={isMobile}>{authorIntroduction}</BookDetailPanel>
            <BookDetailPanel title="목차" isMobile={isMobile}>{tableOfContents}</BookDetailPanel>
            <BookDetailPanel title="출간일" useTruncate={false}>
              {publishingDate && (publishingDate.ebookPublishDate || publishingDate.paperBookPublishDate) && (
                publishingDate.ebookPublishDate === publishingDate.paperBookPublishDate
                  ? `${buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책, 종이책 동시 출간` : (
                    <>
                      {publishingDate.ebookPublishDate && <>{buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책 출간<br /></>}
                      {publishingDate.paperBookPublishDate && `${buildOnlyDateFormat(publishingDate.paperBookPublishDate)} 종이책 출간`}
                    </>
                  )
              )}
            </BookDetailPanel>
            <ExpandableBookList
              books={recommendedBooks}
              className="PageBookDetail_Panel"
              listTitle="'마이 셀렉트'에 함께 추가된 책"
              pageTitleForTracking="book-detail"
              uiPartTitleForTracking="book-to-book-recommendation"
            />
            <BookDetailPanelWrapper className="Reviews_Wrapper">
              <LazyLoad height={200} once={true} offset={400}>
                <ConnectedReviews
                  bookId={bookId}
                  checkAuth={this.checkAuth}
                />
              </LazyLoad>
            </BookDetailPanelWrapper>
            {this.renderOverlays()}
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

    introduction: !!bookDetail ? bookDetail.introduction : undefined,
    introImageUrl: !!bookDetail ? bookDetail.introImageUrl : undefined,
    authorIntroduction: !!bookDetail ? bookDetail.authorIntroduction : undefined,
    tableOfContents: !!bookDetail ? bookDetail.tableOfContents : undefined,
    seriesBookList: !!bookDetail ? bookDetail.seriesBooks : undefined,
    publisherReview: !!bookDetail ? bookDetail.publisherReview : undefined,
    publishingDate: !!bookDetail ? bookDetail.publishingDate : undefined,

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
