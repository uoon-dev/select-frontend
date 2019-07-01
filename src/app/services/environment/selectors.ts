import { RoutePaths } from 'app/constants';
import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';
import { Intro } from './../../scenes/Intro';

export const selectIsIos = (state: RidiSelectState): boolean => state.environment.platform.isIos;
export const selectIsAndroid = (state: RidiSelectState): boolean => state.environment.platform.isAndroid;
export const selectIsInApp = (state: RidiSelectState): boolean => state.environment.platform.isRidibooks;
export const selectPathname = (state: RidiSelectState): string => state.router.location!.pathname;

export const getIsIosInApp = createSelector(
  [selectIsIos, selectIsInApp],
  (isIos: boolean, isInApp: boolean): boolean => isIos && isInApp,
);

export const getIsAndroidInApp = createSelector(
  [selectIsAndroid, selectIsInApp],
  (isAndroid: boolean, isInApp: boolean): boolean => isAndroid && isInApp,
);

export const getIsInAppIntro = createSelector(
  [selectIsInApp, selectPathname],
  (isInApp: boolean, pathname: string): boolean => isInApp && (pathname === RoutePaths.INTRO),
);

export const getIsIntro = createSelector(
  [selectPathname],
  (pathname: string): boolean => (pathname === RoutePaths.INTRO),
);
