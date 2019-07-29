import * as pathToRegexp from 'path-to-regexp';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { ConnectedFooter, ConnectedGNB, ConnectedLNB } from 'app/components';
import { ErrorResponseStatus } from 'app/services/serviceStatus';

import history from 'app/config/history';
import {
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
} from 'app/scenes';

import { RoutePaths } from 'app/constants';
import {
  ConnectedScrollManager,
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
          <PrivateRoute
            path={RoutePaths.MANAGE_SUBSCRIPTION}
            component={ConnectedManageSubscription}
            {...props}
          />
          <Route
            component={ConnectedErrorPage}
            {...props}
          />
        </Switch>
        {!props.isRidiApp && <ConnectedFooter />}
      </ConnectedScrollManager>
    </ConnectedRouter>
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
