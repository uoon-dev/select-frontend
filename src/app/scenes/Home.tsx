import classNames from 'classnames';
import React, { useEffect } from 'react';
import { forceCheck } from 'react-lazyload';
import { useSelector, useDispatch } from 'react-redux';
import differenceInHours from 'date-fns/differenceInHours';

import { Actions } from 'app/services/home';
import { RidiSelectState } from 'app/store';
import { PageTitleText } from 'app/constants';
import { HelmetWithTitle } from 'app/components';
import HomeSectionList from 'app/components/Home/HomeSectionList';
import BigBanner from 'app/components/Home/BigBanner';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';
import { Actions as CollectionActions, ReservedCollectionIds } from 'app/services/collection';

const Home: React.FunctionComponent = () => {
  let initialDispatchTimeout: number | null;

  const fetchedAt = useSelector((state: RidiSelectState) => state.home.fetchedAt);
  const isUserFetching = useSelector((state: RidiSelectState) => state.user.isFetching);
  const collections = useSelector((state: RidiSelectState) => state.collectionsById);

  const dispatch = useDispatch();

  useEffect(() => {
    initialDispatchTimeout = window.setTimeout(() => {
      sendPostRobotInitialRendered();
      if (!fetchedAt || Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3) {
        dispatch(Actions.loadHomeRequest());
        dispatch(
          CollectionActions.loadCollectionRequest({
            collectionId: ReservedCollectionIds.SPOTLIGHT,
            page: 1,
          }),
        );
      }

      initialDispatchTimeout = null;
      forceCheck();
    });

    return () => {
      if (initialDispatchTimeout) {
        window.clearTimeout(initialDispatchTimeout);
        initialDispatchTimeout = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isUserFetching) {
      return;
    }
    if (!collections.popular?.itemListByPage[1]?.itemList) {
      dispatch(CollectionActions.loadPopularBooksRequest({ page: 1 }));
    }
  }, [isUserFetching]);

  return (
    <main
      className={classNames(
        'PageHome',
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.HOME} />
      <h1 className="a11y">리디셀렉트 홈</h1>
      <BigBanner />
      <HomeSectionList />
    </main>
  );
};

export default Home;
