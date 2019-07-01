import * as React from 'react';
import { RouteProps } from 'react-router';
import { Route } from 'react-router-dom';

import history from 'app/config/history';
import { RoutePaths } from 'app/constants';

export interface NonSubscriberOnlyRouteProps extends RouteProps {
  isFetching: boolean;
  isSubscribing: boolean;
}

export const NonSubscriberOnlyRoute: React.SFC<NonSubscriberOnlyRouteProps> = (props) => {
  const {
    isFetching,
    isSubscribing,
    ...restProps
  } = props;

  if (isFetching) {
    return null;
  }

  if (isSubscribing) {
    history.replace(RoutePaths.HOME + window.location.search);
  }

  return <Route {...restProps} />;
};
