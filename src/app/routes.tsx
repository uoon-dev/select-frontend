import { ConnectedRouter } from 'connected-react-router';
import * as pathToRegexp from 'path-to-regexp';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { ConnectedFooter, ConnectedGNB, ConnectedLNB } from 'app/components';
import { ErrorResponseStatus } from 'app/services/serviceStatus';

import history from 'app/config/history';
import {
  ArticleChannelDetail,
  ArticleChannelList,
  ArticleFavorite,
  ArticleFollowing,
  BookDetail,
  Category,
  Charts,
  ClosingReservedBooks,
  Collection,
  ErrorPage,
  Home,
  ManageSubscription,
  MySelect,
  MySelectHistory,
  NewReleases,
  OrderHistory,
  SearchResult,
  Settings,
  Intro,
  NotAvailableBook,
  Voucher,
  WrongLocation,
  ArticleContent,
  ArticleHome,
} from 'app/scenes';
import ArticleList from 'app/scenes/ArticleList';

import { RidiSelectState } from 'app/store';
import { AppStatus } from 'app/services/app';
import { FetchStatusFlag, RoutePaths } from 'app/constants';
import { selectIsInApp } from 'app/services/environment/selectors';
import { AlertForNonSubscriber } from 'app/components/AlertForNonSubscriber';
import { ConnectedAppManager, ConnectedPrivateRoute, RouteBlockLevel } from 'app/hocs';

export interface Props {
  isRidiApp: boolean;
  isFetching: boolean;
  isLoggedIn: boolean;
  appStatus: AppStatus;
  hasAvailableTicket: boolean;
  BASE_URL_STORE: string;
  errorResponseState?: ErrorResponseStatus;
  ticketFetchStatus: FetchStatusFlag;
}

export const HomeRoutes = [RoutePaths.HOME, RoutePaths.ARTICLE_HOME];

export const inAppGnbRoutes = [
  RoutePaths.HOME,
  RoutePaths.NEW_RELEASE,
  RoutePaths.CATEGORY,
  RoutePaths.MY_SELECT,
  RoutePaths.SEARCH_RESULT,
  RoutePaths.INTRO,
  // Article
  RoutePaths.ARTICLE_HOME,
  RoutePaths.ARTICLE_FOLLOWING,
  RoutePaths.ARTICLE_CHANNELS,
  RoutePaths.ARTICLE_FAVORITE,
];

export const LNBRoutes = [
  RoutePaths.HOME,
  RoutePaths.NEW_RELEASE,
  RoutePaths.CATEGORY,
  RoutePaths.MY_SELECT,
  /* 셀렉트 2.0 - 아티클 */
  RoutePaths.ARTICLE_HOME,
  RoutePaths.ARTICLE_FOLLOWING,
  RoutePaths.ARTICLE_CHANNELS,
  RoutePaths.ARTICLE_FAVORITE,
];

// 도서, 아티클에 포함되지 않고 공통으로 쓰이는 페이지들
export const CommonRoutes = [
  RoutePaths.SETTING,
  RoutePaths.VOUCHER,
  RoutePaths.MY_SELECT_HISTORY,
  RoutePaths.ORDER_HISTORY,
  RoutePaths.MANAGE_SUBSCRIPTION,
];

export const PrimaryRoutes = [RoutePaths.CHARTS, pathToRegexp.parse(RoutePaths.COLLECTION)[0]];

export const Routes: React.SFC<Props> = props => {
  const { errorResponseState } = props;
  return !errorResponseState ? (
    <ConnectedRouter history={history}>
      <ConnectedAppManager>
        <Route
          render={({ location }) =>
            (!props.isRidiApp || inAppGnbRoutes.includes(location.pathname as RoutePaths)) && (
              <ConnectedGNB />
            )
          }
        />
        <Route
          render={({ location }) =>
            LNBRoutes.includes(location.pathname as RoutePaths) && <ConnectedLNB />
          }
        />
        <Switch>
          <Route path={RoutePaths.ROOT} exact>
            {props.appStatus !== AppStatus.Articles ? (
              <Redirect to={RoutePaths.HOME} />
            ) : (
              <Redirect to={RoutePaths.ARTICLE_HOME} />
            )}
          </Route>
          <Redirect exact from={RoutePaths.ARTICLE_ROOTE} to={RoutePaths.ARTICLE_HOME} />
          <Route path={RoutePaths.HOME} component={Home} {...props} />
          <Route path={RoutePaths.NEW_RELEASE} component={NewReleases} {...props} />
          <Route path={RoutePaths.CHARTS} component={Charts} {...props} />
          <Route path={RoutePaths.COLLECTION} component={Collection} {...props} />
          <Route path={RoutePaths.CATEGORY} component={Category} {...props} />
          <Route path={RoutePaths.MY_SELECT} component={MySelect} {...props} />
          <Route path={RoutePaths.BOOK_DETAIL} component={BookDetail} {...props} />
          <ConnectedPrivateRoute
            path={RoutePaths.SETTING}
            component={Settings}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.ORDER_HISTORY}
            component={OrderHistory}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.MY_SELECT_HISTORY}
            component={MySelectHistory}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <Route path={RoutePaths.SEARCH_RESULT} component={SearchResult} {...props} />
          <Route path={RoutePaths.NOT_AVAILABLE_BOOK} component={NotAvailableBook} {...props} />
          <Route
            path={RoutePaths.CLOSING_RESERVED_BOOKS}
            component={ClosingReservedBooks}
            {...props}
          />

          {/* 셀렉트 2.0 - Article */}
          <Route path={RoutePaths.ARTICLE_HOME} component={ArticleHome} {...props} />
          <Route path={RoutePaths.ARTICLE_CHANNELS} component={ArticleChannelList} {...props} />
          <Route
            path={RoutePaths.ARTICLE_CHANNEL_DETAIL}
            component={ArticleChannelDetail}
            {...props}
          />
          <Route path={RoutePaths.ARTICLE_CONTENT} component={ArticleContent} {...props} />
          <ConnectedPrivateRoute
            path={RoutePaths.ARTICLE_FOLLOWING}
            component={ArticleFollowing}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.ARTICLE_FAVORITE}
            component={ArticleFavorite}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <Route path={RoutePaths.ARTICLE_LIST} component={ArticleList} {...props} />

          <Route path={RoutePaths.INTRO} exact component={Intro} {...props} />
          <Route path={RoutePaths.VOUCHER} exact component={Voucher} {...props} />
          <ConnectedPrivateRoute
            path={RoutePaths.MANAGE_SUBSCRIPTION}
            component={ManageSubscription}
            routeBlockLevel={RouteBlockLevel.HAS_AVAILABLE_TICKET}
            {...props}
          />
          <Route component={WrongLocation} {...props} />
        </Switch>
        <Route
          render={({ location }) =>
            HomeRoutes.includes(location.pathname as RoutePaths) && <AlertForNonSubscriber />
          }
        />
        {!props.isRidiApp && <ConnectedFooter />}
      </ConnectedAppManager>
    </ConnectedRouter>
  ) : (
    <ErrorPage />
  );
};

const mapStateToProps = (rootState: RidiSelectState): Props => ({
  isLoggedIn: rootState.user.isLoggedIn,
  isRidiApp: selectIsInApp(rootState),
  appStatus: rootState.app.appStatus,
  isFetching: rootState.user.isFetching,
  BASE_URL_STORE: rootState.environment.STORE_URL,
  hasAvailableTicket: rootState.user.hasAvailableTicket,
  errorResponseState: rootState.serviceStatus.errorResponseState,
  ticketFetchStatus: rootState.user.ticketFetchStatus,
});

export const ConnectedRoutes = connect(mapStateToProps)(Routes);
