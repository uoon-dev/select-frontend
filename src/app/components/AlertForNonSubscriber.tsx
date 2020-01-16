import { css } from '@emotion/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { GoToSubscribeButton } from 'app/components/GoToSubscribeButton';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';

const backdropFilter = css`
  backdrop-filter: blur(3px);
`;

export const AlertForNonSubscriber: React.FunctionComponent = () => {
  const [isIgnored, setIgnoreAlert] = React.useState(false);
  const { hasSubscribedBefore, isUserFetching, hasAvailableTicket, isIosInApp } = useSelector((state: RidiSelectState) => ({
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    hasAvailableTicket: state.user.hasAvailableTicket,
    isUserFetching: state.user.isFetching,
    isIosInApp: getIsIosInApp(state),
  }));

  return !isIgnored &&
    !isIosInApp &&
    !isUserFetching &&
    !hasAvailableTicket ? (
      <div className="AlertForNonSubscriber" css={backdropFilter}>
        <p className="AlertForNonSubscriber_MainText">베스트셀러부터<br/>프리미엄 아티클까지</p>
        <p className="AlertForNonSubscriber_SubText">
          {hasSubscribedBefore ? '모두 무제한으로' : '1개월 무료'}
        </p>
        <GoToSubscribeButton
          className="AlertForNonSubscriber_SubscribeButton"
          component={Link}
          to="/intro"
        />
        <button
          className="AlertForNonSubscriber_CloseButton"
          type="button"
          onClick={() => setIgnoreAlert(true)}
        >
          <svg
            className="AlertForNonSubscriber_CloseButton_Icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fillRule="nonzero"
          >
            <path d="M5.636 4.222l14.142 14.142-1.414 1.414L4.222 5.636z"/>
            <path d="M18.364 4.222l1.414 1.414L5.636 19.778l-1.414-1.414z"/>
          </svg>
          <span className="a11y">닫기</span>
        </button>
      </div>
    ) : null;
};
