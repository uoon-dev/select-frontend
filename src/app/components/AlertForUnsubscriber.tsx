import * as React from 'react';

import history from 'app/config/history';
import { GoToSubscribeButton } from './GoToSubscribeButton';

export const AlertForNonSubscriber: React.FunctionComponent = () => {
  const [isIgnored, setIgnoreAlert] = React.useState(false);

  return isIgnored ? null : (
    <div className="AlertForNonSubscriber">
      <p className="AlertForNonSubscriber_MainText">신간도 베스트셀러도<br/>월정액으로 제한없이</p>
      <p className="AlertForNonSubscriber_SubText">1개월 무료 후 월 6,500원, 언제든 원클릭으로 해지</p>
      <GoToSubscribeButton
        className="AlertForNonSubscriber_SubscribeButton"
        onClick={() => history.push('/intro')}
      />
      <button
        className="AlertForNonSubscriber_CloseButton"
        type="button"
        onClick={() => setIgnoreAlert(true)}
      >
        <span className="a11y">닫기</span>
      </button>
    </div>
  );
};
