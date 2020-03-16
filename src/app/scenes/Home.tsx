import classNames from 'classnames';
import differenceInHours from 'date-fns/differenceInHours';
import React, { useState, useEffect } from 'react';
import { forceCheck } from 'react-lazyload';
import { connect, useSelector, useDispatch } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import BigBanner from 'app/components/Home/BigBanner';
import { ConnectedHomeSectionList } from 'app/components/Home/HomeSectionList';
import { PageTitleText } from 'app/constants';
import {
  Actions as CollectionActions,
  CollectionId,
  CollectionsState,
  ReservedCollectionIds,
} from 'app/services/collection';
import { Actions } from 'app/services/home';
import { RidiSelectState } from 'app/store';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';

interface HomeStateProps {
  fetchedAt: number | null;
  isUserFetching: boolean;
  collections: CollectionsState;
}
interface State {
  isInitialized: boolean;
}

export const Home: React.FunctionComponent<HomeStateProps> = props => {
  let initialDispatchTimeout: number | null;

  const fetchedAt = useSelector((state: RidiSelectState) => state.home.fetchedAt);
  const isUserFetching = useSelector((state: RidiSelectState) => state.user.isFetching);
  const collections = useSelector((state: RidiSelectState) => state.collectionsById);

  const [isInitialized, setIsInitialized] = useState(false);

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
      setIsInitialized(true);
      forceCheck();
    });
    return () => {
      if (initialDispatchTimeout) {
        window.clearTimeout(initialDispatchTimeout);
        initialDispatchTimeout = null;
        setIsInitialized(true);
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
      <div className="a11y">
        <h1>리디셀렉트 홈</h1>
      </div>
      <BigBanner />
      <ConnectedHomeSectionList />
    </main>
  );
};

export default Home;
