import * as classNames from 'classnames';
import * as isWithinRange from 'date-fns/is_within_range';
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
import { ExpandableBookList } from 'app/components/ExpandableBookList';
import { Notice } from 'app/components/Notice';
import { FetchStatusFlag } from 'app/constants';
import { BookDetailPlaceholder } from 'app/placeholder/BookDetailPlaceholder';
import { Actions as BookActions } from 'app/services/book';
import {
  Book,
  BookOwnershipStatus,
  BookThumbnailUrlMap,
  BookTitle,
} from 'app/services/book';
import { BookDetailSectionPlaceholder } from 'app/services/book/components/BookDetailSectionPlaceholder';
import { Expander } from 'app/services/book/components/Expander';
import { TextTruncate } from 'app/services/book/components/TextTruncate';
import { BookDetailPublishingDate, NoticeResponse } from 'app/services/book/requests';
import { Actions as CommonUIActions, GNB_DEFAULT_COLOR, RGB } from 'app/services/commonUI';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { EnvironmentState } from 'app/services/environment';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { ConnectedReviews } from 'app/services/review';
import { RidiSelectState } from 'app/store';
import { BookId, TextWithLF } from 'app/types';
import { isInNotAvailableConvertList } from 'app/utils/expiredDate';
import { buildKoreanDayDateFormat, buildOnlyDateFormat } from 'app/utils/formatDate';
import { withThumbnailQuery } from 'app/utils/withThumbnailQuery';

interface BookDetailStateProps {
  bookId: BookId;
  fetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;
  isIosInApp: boolean;

  title?: BookTitle;
  thumbnail?: BookThumbnailUrlMap;

  bookEndDateTime: string;

  seriesBookList?: Book[];
  publisherReview?: TextWithLF;
  authorIntroduction?: TextWithLF;
  introduction?: TextWithLF;
  introImageUrl?: string;
  introVideoUrl?: string;
  tableOfContents?: TextWithLF;
  noticeList?: NoticeResponse[];
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

  private getVideoSrc = (videoUrl: string): string | null => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const token = videoUrl.match(/[\w-_]{10,}/);
      if (token) {
        return `//www.youtube-nocookie.com/embed/${token[0]}?rel=0`;
      }
    } else if (videoUrl.includes('vimeo')) {
      const token = videoUrl.match(/\d[\w-_]{7,}/);
      if (token) {
        return `//player.vimeo.com/video/${token[0]}?byline=0&amp;portrait=0&amp;badge=0`;
      }
    }
    return null;
  }

  private renderMovieTrailer = (videoUrl: string, isMobile: boolean) => {
    const videoSrc = this.getVideoSrc(videoUrl);
    return videoSrc ? (
      <section
        className={classNames(
          'PageBookDetail_Panel',
          { 'PageBookDetail_Panel-inMeta': isMobile },
        )}
      >
        <h2 className={isMobile ? 'a11y' : 'PageBookDetail_PanelTitle'}>북 트레일러</h2>
        <div className="PageBookDetail_PanelContent PageBookDetail_PanelContent-trailer">
          <iframe
            src={videoSrc}
            width={isMobile ? 300 : 800}
            height={isMobile ? 225 : 450}
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      </section>
    ) : null;
  }

  private renderNoticeList = (noticeList?: NoticeResponse[]) => {
    if (!noticeList || !noticeList.length) {
      return null;
    }

    return (
      <>
        <h2 className="a11y">도서 운영 정보</h2>
        <ul className="PageBookDetail_NoticeList">
          {noticeList.map((noticeItem) => {
            let { content } = noticeItem;
            if (this.props.isIosInApp) {
              content = content.replace(/<a(\s[^>]*)?>.*?<\/a>/ig, '');
            }

            return (
              <li className="PageBookDetail_NoticeItem" key={noticeItem.id}>
                <p
                  className="PageBookDetail_NoticeParagraph"
                  dangerouslySetInnerHTML={{ __html: content.split('\n').join('<br />') }}
                />
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  private renderPanelContent = (text: TextWithLF, isMobile: boolean) => {
    return (
      <TextTruncate
        lines={9}
        text={text}
        lineHeight={isMobile ? 23 : 25}
        renderExpander={(({ expand, isExpanded, isTruncated }) => !isTruncated || isExpanded ? null : (
          <div className="BookDetail_ContentTruncWrapper">
            <Expander
              onClick={expand}
              text="계속 읽기"
              isExpanded={false}
            />
          </div>
        ))}
      />
    );
  }

  private renderBookWillBeNotAvailableNotice() {
    const { bookEndDateTime, isIosInApp } = this.props;
    return isInNotAvailableConvertList(bookEndDateTime) && (
      <Notice
        mainText={`이 책은 출판사 또는 저작권자와의 계약 만료로 <strong>${buildKoreanDayDateFormat(bookEndDateTime)}</strong>까지 마이 셀렉트에 추가할 수 있습니다.`}
        detailLink={!isIosInApp ? 'https://help.ridibooks.com/hc/ko/articles/360022565173' : undefined}
      />
    );
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
      noticeList,
      introduction,
      introImageUrl,
      introVideoUrl,
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
              meta={[
                {
                  name: 'theme-color',
                  content: solidBackgroundColorRGBString,
                },
              ]}
            />
            {env.platform.isRidibooks && <ConnectedPageHeader pageTitle={title.main} />}
            <ConnectedBookDetailHeader
              bookId={bookId}
              isMobile={isMobile}
            >
              {!isMobile && <ConnectedBookDetailMetaContents
                isMobile={false}
                bookId={bookId}
              />}
            </ConnectedBookDetailHeader>
            {isMobile ? (
              <section className="PageBookDetail_Panel">
                <ConnectedBookDetailMetaContents
                  isMobile={true}
                  bookId={bookId}
                />
                {this.renderNoticeList(noticeList)}
                {this.renderBookWillBeNotAvailableNotice()}
                {introVideoUrl && this.renderMovieTrailer(introVideoUrl, isMobile)}
              </section>
            ) : (
              <>
                {!!noticeList && !!noticeList.length && (
                  <section className="PageBookDetail_Panel PageBookDetail_Panel-notice">
                    {this.renderNoticeList(noticeList)}
                  </section>
                )}
                <section className="PageBookDetail_Panel PageBookDetail_Panel-notice">
                  {this.renderBookWillBeNotAvailableNotice()}
                </section>
                {introVideoUrl && this.renderMovieTrailer(introVideoUrl, isMobile)}
              </>
            )}
            {introduction ? (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">책 소개</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(`${introImageUrl ? `<img src="${introImageUrl}" /><br /><br />` : ''}${introduction}`, isMobile)}
                </div>
              </section>
            ) : <BookDetailSectionPlaceholder />}
            <ExpandableBookList
              books={seriesBookList}
              className="PageBookDetail_Panel"
              listTitle="이 책의 시리즈"
              pageTitleForTracking="book-detail"
              uiPartTitleForTracking="series-list"
            />
            {publisherReview && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">출판사 서평</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(publisherReview, isMobile)}
                </div>
              </section>
            )}
            {authorIntroduction && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">저자 소개</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(authorIntroduction, isMobile)}
                </div>
              </section>
            )}
            {tableOfContents && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">목차</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(tableOfContents, isMobile)}
                </div>
              </section>
            )}
            {publishingDate && (publishingDate.ebookPublishDate || publishingDate.paperBookPublishDate) && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">출간일</h2>
                <div className="PageBookDetail_PanelContent">
                  {publishingDate.ebookPublishDate === publishingDate.paperBookPublishDate
                    ? (
                      `${buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책, 종이책 동시 출간`
                    )
                    : <>
                      {publishingDate.ebookPublishDate && <>{buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책 출간<br /></>}
                      {publishingDate.paperBookPublishDate && `${buildOnlyDateFormat(publishingDate.paperBookPublishDate)} 종이책 출간`}
                    </>
                  }
                </div>
              </section>
            )}
            <ExpandableBookList
              books={recommendedBooks}
              className="PageBookDetail_Panel"
              listTitle="'마이 셀렉트'에 함께 추가된 책"
              pageTitleForTracking="book-detail"
              uiPartTitleForTracking="book-to-book-recommendation"
            />
            <section className="PageBookDetail_Panel Reviews_Wrapper">
              <h2 className="a11y">리뷰</h2>
              <LazyLoad height={200} once={true} offset={400}>
                <ConnectedReviews
                  bookId={bookId}
                  checkAuth={this.checkAuth}
                />
              </LazyLoad>
            </section>
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
    introVideoUrl: !!bookDetail ? bookDetail.introVideoUrl : undefined,
    authorIntroduction: !!bookDetail ? bookDetail.authorIntroduction : undefined,
    tableOfContents: !!bookDetail ? bookDetail.tableOfContents : undefined,
    seriesBookList: !!bookDetail ? bookDetail.seriesBooks : undefined,
    publisherReview: !!bookDetail ? bookDetail.publisherReview : undefined,
    publishingDate: !!bookDetail ? bookDetail.publishingDate : undefined,
    noticeList: !!bookDetail && !!bookDetail.notices && Array.isArray(bookDetail.notices) ?
      bookDetail.notices.filter((notice) =>
        notice.isVisible && isWithinRange(new Date(), notice.beginDatetime, notice.endDatetime),
      ) : undefined,

    env: state.environment,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    isIosInApp: getIsIosInApp(state),
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
