import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { RoutePaths } from 'app/constants';
import hoverStyles from 'app/styles/hover';
import { Publisher as PublisherProps } from 'app/services/book/requests';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';

const PublisherLink = styled(Link)`
  font-size: inherit;
  color: inherit;
  text-decoration: none;
  font-weight: 700;
  line-height: inherit;

  ${hoverStyles(css`
    text-decoration: underline;
  `)}
`;

const Publisher: React.FunctionComponent<{ publisher?: PublisherProps }> = props => {
  const publisherName = props.publisher?.name;

  if (!publisherName) {
    return null;
  }

  const dispatch = useDispatch();
  const dispatchTrackClick = (name: string) => {
    if (name) {
      const trackingParams: DefaultTrackingParams = {
        section: 'select-book.detail.publisher',
        index: 0,
        id: name,
      };
      dispatch(TrackingActions.trackClick({ trackingParams }));
    }
  };

  return (
    <span>
      {' · '}
      <PublisherLink
        to={`${RoutePaths.SEARCH_RESULT}?q=${publisherName}&type=Books`}
        onClick={() => {
          dispatchTrackClick(publisherName);
        }}
      >
        {publisherName}
      </PublisherLink>
      {' 출판'}
    </span>
  );
};

export default Publisher;
