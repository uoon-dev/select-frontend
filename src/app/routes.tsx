import * as pathToRegexp from 'path-to-regexp';
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { ConnectedFooter, ConnectedGNB, ConnectedLNB } from 'app/components';
import { ConnectedSplashScreen } from 'app/components/SplashScreen';
import { ErrorResponseStatus } from 'app/services/serviceStatus';

import history from 'app/config/history';
import {
  ConnectedAvailableBooks,
  ConnectedBookDetail,
  ConnectedCategory,
  ConnectedCharts,
  ConnectedClosingReservedBooks,
  ConnectedCollection,
  ConnectedErrorPage,
  ConnectedGuide,
  ConnectedHome,
  ConnectedIntro,
  ConnectedManageSubscription,
  ConnectedMySelect,
  ConnectedMySelectHistory,
  ConnectedNewReleases,
  ConnectedOrderHistory,
  ConnectedSearchResult,
  ConnectedSetting,
  InAppIntro,
  NotAvailableBook,
  WrongLocation,
} from 'app/scenes';

import { RoutePaths } from 'app/constants';
import {
  ConnectedPublicRoute,
  ConnectedScrollManager,
  NonSubscriberOnlyRoute,
  PrivateRoute,
} from 'app/hocs';
import { RidiSelectState } from 'app/store';
import { getIsAndroidInApp, selectIsInApp } from './services/environment/selectors';

export interface Props {
  isRidiApp: boolean;
  IsAndroidInApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
  errorResponseState?: ErrorResponseStatus;
}

export const inAppGnbRoutes = [
  RoutePaths.HOME,
  RoutePaths.NEW_RELEASE,
  RoutePaths.CATEGORY,
  RoutePaths.MY_SELECT,
  RoutePaths.SEARCH_RESULT,
  RoutePaths.INTRO,
];

export const LNBRoutes = [
  RoutePaths.HOME,
  RoutePaths.NEW_RELEASE,
  RoutePaths.CATEGORY,
  RoutePaths.MY_SELECT,
];

export const PrimaryRoutes = [
  RoutePaths.CHARTS,
  pathToRegexp.parse(RoutePaths.COLLECTION)[0],
];

export const Routes: React.SFC<Props> = (props) => {
  const { errorResponseState } = props;

  return !errorResponseState ? (
<<<<<<< HEAD
    <>
      <ConnectedSplashScreen {...props} />
      {!props.isFetching ? (
        <ConnectedRouter history={history}>
          <ConnectedScrollManager>
            <Route
              render={({ location }) => (
                (!props.isRidiApp || (inAppGnbRoutes.includes(location.pathname as RoutePaths))) && <ConnectedGNB />
              )}
            />
            <Route
              render={({ location }) => (
                (LNBRoutes.includes(location.pathname as RoutePaths)) && <ConnectedLNB />
              )}
            />
            <Switch>
              <PrivateRoute
                path={RoutePaths.HOME}
                component={ConnectedHome}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.NEW_RELEASE}
                component={ConnectedNewReleases}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.CHARTS}
                component={ConnectedCharts}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.COLLECTION}
                component={ConnectedCollection}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.CATEGORY}
                component={ConnectedCategory}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.MY_SELECT}
                component={ConnectedMySelect}
                {...props}
              />
              <ConnectedPublicRoute
                path={RoutePaths.BOOK_DETAIL}
                component={ConnectedBookDetail}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.SETTING}
                component={ConnectedSetting}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.MANAGE_SUBSCRIPTION}
                component={ConnectedManageSubscription}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.ORDER_HISTORY}
                component={ConnectedOrderHistory}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.MY_SELECT_HISTORY}
                component={ConnectedMySelectHistory}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.SEARCH_RESULT}
                component={ConnectedSearchResult}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.NOT_AVAILABLE_BOOK}
                component={NotAvailableBook}
                {...props}
              />
              <ConnectedPublicRoute
                path={RoutePaths.GUIDE}
                component={ConnectedGuide}
                {...props}
              />
              <ConnectedPublicRoute
                path={RoutePaths.AVAILABLE_BOOKS}
                component={ConnectedAvailableBooks}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.CLOSING_RESERVED_BOOKS}
                component={ConnectedClosingReservedBooks}
                {...props}
              />
              <NonSubscriberOnlyRoute
                path={RoutePaths.INTRO}
                exact={true}
                component={props.isRidiApp ? InAppIntro : ConnectedIntro}
                {...props}
              />
              <ConnectedPublicRoute
                component={ConnectedErrorPage}
                {...props}
              />
            </Switch>
            {!props.isRidiApp && <ConnectedFooter />}
          </ConnectedScrollManager>
        </ConnectedRouter>
      ) : null}
    </>
=======
    <ConnectedRouter history={history}>
      <ConnectedScrollManager>
        <Route
          render={({ location }) => (
            (!props.isRidiApp || (inAppGnbRoutes.includes(location.pathname as RoutePaths))) && <ConnectedGNB />
          )}
        />
        <Route
          render={({ location }) => (
            (LNBRoutes.includes(location.pathname as RoutePaths)) && <ConnectedLNB />
          )}
        />
        <Switch>
          <Redirect exact={true} from={RoutePaths.ROOT} to={RoutePaths.HOME} />
          <Redirect exact={true} from={RoutePaths.INAPP_LOGIN_REQUIRED} to={RoutePaths.HOME} />
          <Route
            path={RoutePaths.HOME}
            component={ConnectedHome}
            {...props}
          />
          <Route
            path={RoutePaths.NEW_RELEASE}
            component={ConnectedNewReleases}
            {...props}
          />
          <Route
            path={RoutePaths.CHARTS}
            component={ConnectedCharts}
            {...props}
          />
          <Route
            path={RoutePaths.COLLECTION}
            component={ConnectedCollection}
            {...props}
          />
          <Route
            path={RoutePaths.CATEGORY}
            component={ConnectedCategory}
            {...props}
          />
          <Route
            path={RoutePaths.MY_SELECT}
            component={ConnectedMySelect}
            {...props}
          />
          <Route
            path={RoutePaths.BOOK_DETAIL}
            component={ConnectedBookDetail}
            {...props}
          />
          <Route
            path={RoutePaths.SETTING}
            component={ConnectedSetting}
            {...props}
          />
          <Route
            path={RoutePaths.ORDER_HISTORY}
            component={ConnectedOrderHistory}
            {...props}
          />
          <Route
            path={RoutePaths.MY_SELECT_HISTORY}
            component={ConnectedMySelectHistory}
            {...props}
          />
          <Route
            path={RoutePaths.SEARCH_RESULT}
            component={ConnectedSearchResult}
            {...props}
          />
          <Route
            path={RoutePaths.NOT_AVAILABLE_BOOK}
            component={NotAvailableBook}
            {...props}
          />
          <Route
            path={RoutePaths.GUIDE}
            component={ConnectedGuide}
            {...props}
          />
          <Route
            path={RoutePaths.CLOSING_RESERVED_BOOKS}
            component={ConnectedClosingReservedBooks}
            {...props}
          />
          <Route
            path={RoutePaths.INTRO}
            exact={true}
            component={props.isRidiApp ? InAppIntro : ConnectedIntro}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.MANAGE_SUBSCRIPTION}
            component={ConnectedManageSubscription}
            {...props}
          />
          <Route
            component={WrongLocation}
            {...props}
          />
        </Switch>
        {!props.isRidiApp && <ConnectedFooter />}
      </ConnectedScrollManager>
    </ConnectedRouter>
>>>>>>> 370bffb... 잘못된 주소로 접근했을 경우 토스트로 안내 후 홈으로 리다이렉트.
  ) : <ConnectedErrorPage />;
};

const mapStateToProps = (rootState: RidiSelectState): Props => ({
  isRidiApp: selectIsInApp(rootState),
  IsAndroidInApp: getIsAndroidInApp(rootState),
  isFetching: rootState.user.isFetching,
  isSubscribing: rootState.user.isSubscribing,
  errorResponseState: rootState.serviceStatus.errorResponseState,
});

export const ConnectedRoutes = connect(mapStateToProps)(Routes);
