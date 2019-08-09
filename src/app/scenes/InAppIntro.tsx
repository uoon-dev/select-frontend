import * as React from 'react';

import { Icon } from '@ridi/rsg';
import { ConnectedBookListPreview } from 'app/components/BookListPreview';
import { GoToSubscribeButton } from 'app/components/GoToSubscribeButton';
import { setDisableScroll } from 'app/utils/utils';

export class InAppIntro extends React.Component {
  private onClickSubscribeButton() {
    if (window.inApp && window.inApp.openBrowser) {
      window.inApp.openBrowser('//select.ridibooks.com');
    } else if (window.android && window.android.openBrowser) {
      // TODO: 추후 안드로이드 앱에서 버전 제한 시점 이후 window.android 사용처 제거.
      window.android.openBrowser('//select.ridibooks.com');
    }
  }
  public componentDidMount() {
    setDisableScroll(true);
    if (window.inApp && window.inApp.initialRendered) {
      window.inApp.initialRendered();
    }
  }
  public componentWillUnmount() {
    setDisableScroll(false);
  }

  public render() {
    return (
      <>
        <ConnectedBookListPreview />
        <div className="InAppIntro_Overlay">
          <div className="InAppIntro_Overlay_BG" />
          <div className="InAppIntro_Overlay_Main">
            <h2 className="InAppIntro_Overlay_Header">
              <Icon
                name="logo_ridiselect_1"
                className="InAppIntro_Overlay_Logo"
              />
              <span className="a11y">리디 셀렉트</span>
            </h2>
            <p className="InAppIntro_Overlay_Description">
              도서 월정액 서비스 리디셀렉트를 구독하여<br />
              앱에서 바로 사용해보세요.
            </p>
            <GoToSubscribeButton
              className="InAppIntro_Overlay_Button"
              onClick={() => this.onClickSubscribeButton()}
            />
          </div>
        </div>
      </>
    );
  }
}
