import * as React from 'react';
import { RouteProps } from 'react-router';
import { Route } from 'react-router-dom';

import { ConnectedSplashScreen } from 'app/components';
import history from 'app/config/history';
import { RoutePaths } from 'app/constants';

export interface PrivateRouteProps extends RouteProps {
  isRidiApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
}

export const PrivateRoute: React.SFC<PrivateRouteProps> = (props) => {
  const {
    isFetching,
    isSubscribing,
    ...restProps
  } = props;

  if (isFetching) {
    return <ConnectedSplashScreen {...props} />;
  }

  if (!isSubscribing) {
    history.replace(`${RoutePaths.HOME}/${window.location.search}`);
  }

  return <Route {...restProps} />;
};
