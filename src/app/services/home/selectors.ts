import { createSelector } from 'reselect';

import { RidiSelectState } from 'app/store';
import { getCollections } from 'app/services/collection/selectors';
import { groupCollections } from 'app/services/home/uitls';

export const getBooksBannerCurrentIdx = (state: RidiSelectState): number => state.home.currentIdx;
export const getArticlesBannerCurrentIdx = (state: RidiSelectState): number =>
  state.articleHome.currentIdx;
export const getFetchedAt = (state: RidiSelectState) => state.home.fetchedAt;
export const getCollectionIdList = (state: RidiSelectState) => state.home.collectionIdList;
export const getCollectionGrouops = createSelector(
  [getCollections, getCollectionIdList],
  (collections, collectionIdList) =>
    collectionIdList.map(collectionId => collections[collectionId]).reduce(groupCollections, []),
);
