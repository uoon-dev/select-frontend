import * as classNames from 'classnames';
import * as qs from 'qs';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { HelmetWithTitle, TitleType } from 'app/components';
import { PageTitleText } from 'app/constants';
import { Actions as CommonUIActions, FooterTheme, GNBTransparentType } from 'app/services/commonUI';
import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';

export const Intro: React.FunctionComponent = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const {
    isLoggedIn,
    hasSubscribedBefore,
    BASE_URL_STORE,
    FREE_PROMOTION_MONTHS,
  } = useSelector((state: RidiSelectState) => ({
    isLoggedIn: state.user.isLoggedIn,
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    BASE_URL_STORE: state.environment.STORE_URL,
    FREE_PROMOTION_MONTHS: state.environment.FREE_PROMOTION_MONTHS,
  }));

  React.useEffect(() => {
    dispatch(CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.transparent }));
    dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.dark }));
    return () => {
      dispatch(CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.default }));
      dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.default }));
    };
  }, []);

  const elevenMonthVoucherEventStartDate = new Date();
  elevenMonthVoucherEventStartDate.setUTCSeconds(0);
  elevenMonthVoucherEventStartDate.setUTCMinutes(0);
  elevenMonthVoucherEventStartDate.setUTCHours(11 - 9);
  elevenMonthVoucherEventStartDate.setUTCDate(18);
  elevenMonthVoucherEventStartDate.setUTCMonth(12 - 1);
  elevenMonthVoucherEventStartDate.setUTCFullYear(2019);

  const elevenMonthVoucherEventEndDate = new Date();
  elevenMonthVoucherEventEndDate.setUTCSeconds(59);
  elevenMonthVoucherEventEndDate.setUTCMinutes(59);
  elevenMonthVoucherEventEndDate.setUTCHours(23 - 9);
  elevenMonthVoucherEventEndDate.setUTCDate(17);
  elevenMonthVoucherEventEndDate.setUTCMonth(1 - 1);
  elevenMonthVoucherEventEndDate.setUTCFullYear(2020);

  const currentDate = new Date();

  const isInEventTerm = elevenMonthVoucherEventStartDate <= currentDate && elevenMonthVoucherEventEndDate >= currentDate;
  const queryString = qs.parse(location.search, { ignoreQueryPrefix: true });

  return (
    <main className="SceneWrapper">
      <HelmetWithTitle
        titleName={PageTitleText.INTRO}
        titleType={TitleType.PREFIXED}
      />
      {isLoaded ? null : (
        <>
          <img
            className="Load_Trigger_Image"
            src={require('images/intro/hero_bg.jpg')}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="SceneLoadingCover" />
        </>
      )}
      <h1 className="a11y">리디셀렉트 인트로</h1>
      <section
        className={classNames([
          'SectionMain',
          isLoaded && 'active',
        ])}
      >
        <div className="SectionMain_Content">
          <h2 className="SectionMain_MainCopy">
            베스트셀러부터<br />
            프리미엄 아티클까지
          </h2>
          <p className="SectionMain_Description">
            1개월 무료
          </p>
          {isInEventTerm ? (
            <>
              <Button
                type="button"
                className={classNames([
                  'SectionMain_Button',
                  'Intro_Subscription_Button',
                ])}
                color="gray"
                size="large"
                onClick={() => {
                  if (isLoggedIn) {
                    window.location.replace(`${BASE_URL_STORE}/select/payments`);
                    return;
                  }
                  moveToLogin(`${BASE_URL_STORE}/select/payments`);
                }}
              >
                <span className="SectionMain_Button_MainLabel">매월 정기 결제</span>
                <span className="SectionMain_Button_SubLabel">월 9,900원</span>
              </Button>
              <Button
                component="a"
                target="_self"
                className={classNames([
                  'SectionMain_Button',
                  'Intro_GetVoucher_Button',
                ])}
                color="blue"
                size="large"
                href={`https://ridibooks.com/event/18707?utm_source=operation&utm_medium=button&utm_campaign=inhouse&utm_content=10m_half${
                  queryString.utm_source ? `&utm_term=${queryString.utm_source}` : ''}`
                }
              >
                <span className="SectionMain_Button_MainLabel">11개월치 반값 결제</span>
                <span className="SectionMain_Button_SubLabel">월 4,500원</span>
              </Button>
              <p className="SectionMain_ButtonCaption">반값 결제 이벤트 2020.01.17.까지</p>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="SectionMain_Button"
                color="blue"
                size="large"
                onClick={() => {
                  if (isLoggedIn) {
                    window.location.replace(`${BASE_URL_STORE}/select/payments`);
                    return;
                  }
                  moveToLogin(`${BASE_URL_STORE}/select/payments`);
                }}
              >
                {!hasSubscribedBefore ?
                  '무료로 시작하기' :
                  '다시 시작하기'
                }
                <Icon name="arrow_5_right" className="RSGIcon-arrow5Right" />
              </Button>
              <p className="SectionMain_ButtonCaption">
                {`${FREE_PROMOTION_MONTHS}개월 후 월 9,900원. 언제든 원클릭으로 해지`}
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
};
