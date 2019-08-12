import toast from 'app/utils/toast';
import * as React from 'react';

import history from 'app/config/history';
import { RoutePaths } from 'app/constants';
import { BigBannerPlaceholder } from 'app/placeholder/BigBannerPlaceholder';
import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import { CollectionType } from 'app/services/home';

export const WrongLocation: React.FunctionComponent = () => {
  React.useEffect(() => {
    toast.failureMessage('잘못된 주소입니다.');
    history.replace(RoutePaths.HOME);
  });

  return (
    <main className="ScenWrapper">
      <BigBannerPlaceholder />
      <div className="PageHome_Content Skeleton_Wrapper">
        <div className="PageHome_Panel">
          <HomeSectionPlaceholder
            type={CollectionType.SPOTLIGHT}
          />
        </div>
        <div className="PageHome_Panel">
          <HomeSectionPlaceholder />
          <HomeSectionPlaceholder />
        </div>
      </div>
    </main>
  );
};
