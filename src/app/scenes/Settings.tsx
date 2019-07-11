import { ConnectedPageHeader } from 'app/components';
import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Icon } from '@ridi/rsg';
import { HelmetWithTitle } from 'app/components';
import {
  CardIconComponent,
  CoinBoldComponent,
  SettingMenu,
  SettingMenuItem,
} from 'app/components/Settings/SettingMenu';
import { ConnectedSubscriptionInfo } from 'app/components/Settings/SubscriptionInfo';
import env from 'app/config/env';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { SettingPlaceholder } from 'app/placeholder/SettingPlaceholder';
import { EnvironmentState } from 'app/services/environment';
import {
  getIsIosInApp,
  selectIsInApp,
} from 'app/services/environment/selectors';
import { Actions, SubscriptionState } from 'app/services/user';
import { RidiSelectState } from 'app/store';
import { Link } from 'react-router-dom';

interface SettingStateProps {
  isFetching: boolean;
  isAccountMeRetried: boolean;
  isLoggedIn: boolean;
  subscriptionFetchStatus: FetchStatusFlag;
  subscriptionState?: SubscriptionState | null;
  environment: EnvironmentState;
  isInApp: boolean;
  isIosInApp: boolean;
}

type SettingProps = SettingStateProps & ReturnType<typeof mapDispatchToProps>;

export class Settings extends React.PureComponent<SettingProps> {

  private renderPurchaseMenus() {
    const { subscriptionState, isIosInApp } = this.props;
    return (
      <SettingMenu key="Menus About Purchase">
        <SettingMenuItem linkComponent={Link} to="/manage-subscription" key="ManageSubscription">
          <Icon
            name="invoice_1"
            className="SettingMenu_Icon SettingMenu_Invoice_Icon"
          />
          구독 관리
        </SettingMenuItem>
        <SettingMenuItem linkComponent={Link} to="/order-history" key="PaymentHistory">
          <CoinBoldComponent className="SettingMenu_Icon SettingMenu_Payment_Icon" />
          결제 내역
        </SettingMenuItem>
        <SettingMenuItem
          href={`${env.PAY_URL}`}
          renderCondition={
            !!subscriptionState &&
            !!subscriptionState.isUsingRidipay &&
            !isIosInApp
          }
          key="ManageCard"
        >
          <CardIconComponent className="SettingMenu_Icon SettingMenu_Card_Icon" />
          셀렉트 카드 관리
        </SettingMenuItem>
      </SettingMenu>
    );
  }

  private renderUsingHistoryMenus() {
    const {
      environment,
      isIosInApp,
    } = this.props;
    const {
      STORE_URL: BASE_URL_STORE,
    } = environment;

    return (
      <SettingMenu key="Menus About UsingHistory">
        <SettingMenuItem linkComponent={Link} to="/my-select-history" key="ReadHistory">
          <Icon
            name="history_1"
            className="SettingMenu_Icon SettingMenu_History_Icon"
          />
          도서 이용 내역
        </SettingMenuItem>
        <SettingMenuItem
          href={`${BASE_URL_STORE}/review/`}
          target="_self"
          renderCondition={!isIosInApp}
        >
          <Icon
            name="pencil_2"
            className="SettingMenu_Icon SettingMenu_Review_Icon"
            key="ManageReview"
          />
          내 리뷰 관리
        </SettingMenuItem>
      </SettingMenu>
    );
  }

  private renderSettingServiceMenus() {
    const {
      environment,
      isInApp,
      isIosInApp,
    } = this.props;
    const {
      STORE_URL: BASE_URL_STORE,
      SELECT_URL: BASE_URL_RIDISELECT,
    } = environment;

    return (
      <SettingMenu key="Menus About SettingService">
        <SettingMenuItem
          href="https://ridihelp.zendesk.com/hc/ko/requests/new"
          target="_blank"
          renderCondition={!isIosInApp}
          key="FAQ"
        >
          <Icon
            name="speechbubble_5"
            className="SettingMenu_Icon SettingMenu_FAQ_Icon"
          />
          1:1 문의하기
        </SettingMenuItem>
        <SettingMenuItem
          href={`${BASE_URL_STORE}/account/modify`}
          target="_self"
          renderCondition={!isIosInApp}
          key="ModifyInfo"
        >
          <Icon
            name="identity_1"
            className="SettingMenu_Icon SettingMenu_ModifyInfo_Icon"
          />
          정보 변경
        </SettingMenuItem>
        <SettingMenuItem
          href={`${BASE_URL_STORE}/account/logout?return_url=${BASE_URL_RIDISELECT}/`}
          target="_self"
          renderCondition={!isInApp}
          key="Logout"
        >
          <Icon
            name="exit_1"
            className="SettingMenu_Icon SettingMenu_Logout_Icon"
          />
          로그아웃
        </SettingMenuItem>
      </SettingMenu>
    );
  }

  private renderMenus() {
    return [
      this.renderPurchaseMenus(),
      this.renderUsingHistoryMenus(),
      this.renderSettingServiceMenus(),
    ];
  }
  public componentDidMount() {
    const {
      isAccountMeRetried,
      isLoggedIn,
      isFetching,
      dispatchLoadAccountMeRequest,
      dispatchLoadOrderHistory,
      dispatchLoadSubscriptionRequest,
    } = this.props;

    if (!isLoggedIn && !isFetching && !isAccountMeRetried) {
      dispatchLoadAccountMeRequest();
    }

    dispatchLoadSubscriptionRequest();
    dispatchLoadOrderHistory(1);
  }

  public render() {
    const {
      subscriptionFetchStatus,
    } = this.props;

    return (
      <main className={classNames('SceneWrapper', 'PageSetting')}>
        <HelmetWithTitle titleName={PageTitleText.SETTING} />
        <ConnectedPageHeader pageTitle={PageTitleText.SETTING} />
        {subscriptionFetchStatus === FetchStatusFlag.IDLE ? (
          <ConnectedSubscriptionInfo />
        ) : (
          <SettingPlaceholder />
        )}
        {this.renderMenus()}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): SettingStateProps => {
  return {
    isFetching: state.user.isFetching,
    isAccountMeRetried: state.user.isAccountMeRetried,
    isLoggedIn: state.user.isLoggedIn,
    subscriptionFetchStatus: state.user.subscriptionFetchStatus,
    subscriptionState: state.user.subscription,
    environment: state.environment,
    isInApp: selectIsInApp(state),
    isIosInApp: getIsIosInApp(state),
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchLoadAccountMeRequest: () => dispatch(Actions.loadAccountsMeRequest()),
  dispatchLoadSubscriptionRequest: () =>
    dispatch(Actions.loadSubscriptionRequest()),
  dispatchLoadOrderHistory: (page: number) =>
    dispatch(Actions.loadPurchasesRequest({ page })),
});

export const ConnectedSetting = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
