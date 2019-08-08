import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { FetchStatusFlag, RoutePaths } from 'app/constants';
import { BookOwnershipStatus } from 'app/services/book';
import { EnvironmentState } from 'app/services/environment';
import { getIsAndroidInApp, selectIsInApp } from 'app/services/environment/selectors';
import { Actions as MySelectActions, MySelectState } from 'app/services/mySelect';
import { RidiSelectState } from 'app/store';
import { BookId } from 'app/types';
import { downloadBooksInRidiselect, readBooksInRidiselect } from 'app/utils/downloadUserBook';
import { Link } from 'react-router-dom';

interface BookDetailDownloadButtonProps {
  bookId: number;
}

interface BookDetailDownloadButtonStateProps {
  isLoggedIn: boolean;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  env: EnvironmentState;
  isInApp: boolean;
  isAndroidInApp: boolean;
  ownershipFetchStatus?: FetchStatusFlag;
  ownershipStatus?: BookOwnershipStatus;
  mySelect: MySelectState;
}

type Props = ReturnType<typeof mapDispatchToProps> & BookDetailDownloadButtonProps & BookDetailDownloadButtonStateProps;

const BookDetailDownloadButton: React.FunctionComponent<Props> = (props) => {
  const {
    bookId,
    isLoggedIn,
    isSubscribing,
    hasSubscribedBefore,
    env,
    isInApp,
    isAndroidInApp,
    ownershipStatus,
    ownershipFetchStatus,
    mySelect,
    dispatchAddMySelect,
  } = props;

  const { STORE_URL: BASE_URL_STORE } = env;

  const checkCanDownload = () => !!ownershipStatus && ownershipStatus.isDownloadAvailable;
  const checkShouldDisplaySpinnerOnDownload = () => (isLoggedIn && !ownershipStatus) ||
    ownershipFetchStatus === FetchStatusFlag.FETCHING ||
    mySelect.additionFetchStatus === FetchStatusFlag.FETCHING;
  const checkCurrentBookExistsInMySelect = () =>
    !!ownershipStatus && ownershipStatus.isCurrentlyUsedRidiSelectBook;

  const shouldDisplaySpinnerOnDownload = checkShouldDisplaySpinnerOnDownload();

  const handleDownloadButtonClick = () => {

    if (checkShouldDisplaySpinnerOnDownload()) {
      return;
    }
    if (checkCanDownload()) {
      if (isInApp) {
        readBooksInRidiselect(bookId);
        return;
      }
      if (!checkCurrentBookExistsInMySelect() && !confirm('리디북스에서 이미 구매/대여한 책입니다.\n다운로드하시겠습니까?')) {
        return;
      }
      downloadBooksInRidiselect([bookId]);
    } else {
      dispatchAddMySelect(bookId);
    }
  };

  if (checkCanDownload()) {
    return (
      <Button
        color="blue"
        size="large"
        spinner={shouldDisplaySpinnerOnDownload}
        className="PageBookDetail_DownloadButton"
        onClick={handleDownloadButtonClick}
      >
        {isInApp ? '읽기' : '다운로드'}
      </Button>
    );
  } else if (isSubscribing) {
    return (
      <Button
        color="blue"
        size="large"
        spinner={shouldDisplaySpinnerOnDownload}
        className="PageBookDetail_DownloadButton"
        onClick={handleDownloadButtonClick}
      >
        {!shouldDisplaySpinnerOnDownload && <Icon name="check_6" />}
        마이 셀렉트에 추가
      </Button>
    );
  } else if (isAndroidInApp && !isLoggedIn) {
    return (
      <Button
        color="blue"
        size="large"
        className="PageBookDetail_DownloadButton PageBookDetail_DownloadButton-large"
        component={Link}
        to={RoutePaths.INAPP_LOGIN_REQUIRED}
      >
        구독하고 무료로 읽어보기
      </Button>
    );
  } else {
    // TODO: refactor to external utility function
    const queryString = qs.stringify(qs.parse(location.search, { ignoreQueryPrefix: true }), {
      filter: (prefix, value) => {
        if (prefix.includes('utm_')) {
          return;
        }
        return value;
      },
      addQueryPrefix: true,
    });

    const paymentsUrl = `${BASE_URL_STORE}/select/payments?return_url=${location.origin + location.pathname + encodeURIComponent(queryString)}`;
    const paymentsWithAuthorizeUrl = `${BASE_URL_STORE}/account/oauth-authorize?fallback=signup&return_url=${paymentsUrl}`;
    return (
      <Button
        color="blue"
        size="large"
        spinner={shouldDisplaySpinnerOnDownload}
        className="PageBookDetail_DownloadButton PageBookDetail_DownloadButton-large"
        component="a"
        href={isLoggedIn ? paymentsUrl : paymentsWithAuthorizeUrl}
      >
        {hasSubscribedBefore ? '리디셀렉트 구독하기' : '구독하고 무료로 읽어보기'}
      </Button>
    );
  }
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailDownloadButtonProps): BookDetailDownloadButtonStateProps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];

  return {
    isSubscribing: state.user.isSubscribing,
    isLoggedIn: state.user.isLoggedIn,
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    env: state.environment,
    isInApp: selectIsInApp(state),
    isAndroidInApp: getIsAndroidInApp(state),
    mySelect: state.mySelect,
    ownershipFetchStatus: stateExists ? bookState.ownershipFetchStatus : undefined,
    ownershipStatus: stateExists ? bookState.ownershipStatus : undefined,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchAddMySelect: (bookId: BookId) => dispatch(MySelectActions.addMySelectRequest({ bookId })),
  };
};
export const ConnectedBookDetailDownloadButton = connect(mapStateToProps, mapDispatchToProps)(BookDetailDownloadButton);
