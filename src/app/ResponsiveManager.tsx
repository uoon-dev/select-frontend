import React from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { MAX_WIDTH } from 'app/constants';
import { Actions as CommonUIActions } from 'app/services/commonUI';

const ResponsiveManager: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: MAX_WIDTH });
  React.useEffect(() => {
    dispatch(CommonUIActions.updateIsMobile({ isMobile }));
  }, [isMobile]);
  return null;
};

export default ResponsiveManager;
