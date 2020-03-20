import React from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { MOBILE_MAX_WIDTH, CAROUSEL_MIN_WIDTH } from 'app/constants';
import { Actions as CommonUIActions } from 'app/services/commonUI';

const ResponsiveManager: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: MOBILE_MAX_WIDTH });
  const isCarousel = useMediaQuery({ minWidth: CAROUSEL_MIN_WIDTH });
  React.useEffect(() => {
    dispatch(CommonUIActions.updateIsMobile({ isMobile }));
  }, [isMobile]);
  React.useEffect(() => {
    dispatch(CommonUIActions.updateIsCarousel({ isCarousel }));
  }, [isCarousel]);
  return null;
};

export default ResponsiveManager;
