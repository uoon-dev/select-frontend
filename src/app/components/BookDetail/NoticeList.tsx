import { NoticeResponse } from 'app/services/book/requests';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { isInNotAvailableConvertList } from 'app/utils/expiredDate';
import { buildKoreanDayDateFormat } from 'app/utils/formatDate';
import { isWithinRange } from 'date-fns';
import * as React from 'react';
import { connect } from 'react-redux';
import { Notice } from '../Notice';
import { BookDetailPanel } from './Panel';

interface BookDetailNoticeListProps {
  isMobile: boolean;
  bookId: number;
}

interface BookDetailNoticeListStateProps {
  isIosInApp: boolean;
  bookEndDateTime: string;
  noticeList?: NoticeResponse[];
}

type Props = BookDetailNoticeListProps & BookDetailNoticeListStateProps;

const BookDetailNoticeList: React.FunctionComponent<Props> = (props) => {
  const {
    isMobile,
    isIosInApp,
    noticeList,
    bookEndDateTime,
  } = props;

  return (
    <>
      <BookDetailPanel className="PageBookDetail_Panel-notice" renderCondition={!isMobile}>
        {noticeList && noticeList.length > 0 && (
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
        )}
      </BookDetailPanel>
      <BookDetailPanel className="PageBookDetail_Panel-notice" renderCondition={!isMobile}>
        {isInNotAvailableConvertList(bookEndDateTime) && (
          <Notice
            mainText={`이 책은 출판사 또는 저작권자와의 계약 만료로 <strong>${buildKoreanDayDateFormat(bookEndDateTime)}</strong>까지 마이 셀렉트에 추가할 수 있습니다.`}
            detailLink={!isIosInApp ? 'https://help.ridibooks.com/hc/ko/articles/360022565173' : undefined}
          />
        )}
      </BookDetailPanel>
    </>
  );
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailNoticeListProps): BookDetailNoticeListStateProps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const bookDetail = stateExists ? bookState.bookDetail : undefined;
  return {
    isIosInApp: getIsIosInApp(state),
    bookEndDateTime: !!bookDetail ? bookDetail.endDatetime : '',
    noticeList: !!bookDetail && !!bookDetail.notices && Array.isArray(bookDetail.notices) ?
      bookDetail.notices.filter((notice) =>
        notice.isVisible && isWithinRange(new Date(), notice.beginDatetime, notice.endDatetime),
      ) : undefined,
  };
};

export const ConnectBookDetailNoticeList = connect(mapStateToProps, null)(BookDetailNoticeList);
