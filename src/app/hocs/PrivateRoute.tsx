import * as React from 'react';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { RoutePaths } from 'app/constants';

export interface PrivateRouteProps extends RouteProps {
  isRidiApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
}

export const PrivateRoute: React.SFC<PrivateRouteProps & RouteComponentProps> = (props) => {
  const {
    isFetching,
    isSubscribing,
    ...restProps
  } = props;

  if (isFetching) {
    return <div className="SplashScreen SplashScreen-whiteScreen" />;
  }

  if (!isSubscribing) {
    props.history.replace({
      pathname: RoutePaths.HOME,
      search: props.location.search,
    });
  }

  return <Route {...restProps} />;
};

export const ConnectedPrivateRoute = withRouter(PrivateRoute);
