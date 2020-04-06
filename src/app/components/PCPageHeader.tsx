import React from 'react';
import { useSelector } from 'react-redux';

import { getIsMobile } from 'app/services/commonUI/selectors';

import { ConnectedPageHeader, PageHeaderOwnProps } from './PageHeader';

export const PCPageHeader: React.SFC<PageHeaderOwnProps> = props => {
  const isMobile = useSelector(getIsMobile);
  return isMobile ? (
    <h1 className="a11y">{props.pageTitle}</h1>
  ) : (
    <ConnectedPageHeader {...props} />
  );
};
