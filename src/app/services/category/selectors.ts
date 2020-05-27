import qs from 'qs';
import { createSelector } from 'reselect';

import { RidiSelectState } from 'app/store';

import { ItemCountPerPage } from './constants';
import { getBooksById } from '../book/selectors';

export const getSort = (state: RidiSelectState) =>
  qs.parse(state.router.location.search, { ignoreQueryPrefix: true }).sort;

export const getIsCategoryListFetched = (state: RidiSelectState) => state.categories.isFetched;

export const getCategoryList = (state: RidiSelectState) => state.categories.itemList;

export const getCategoryInfoById = (
  state: RidiSelectState,
  { categoryId }: { categoryId: number },
) => state.categoriesById[categoryId];

export const getTotalPages = createSelector(getCategoryInfoById, categoryInfo =>
  categoryInfo?.itemCount ? Math.ceil(categoryInfo?.itemCount / ItemCountPerPage) : 0,
);

export const getItemListByPage = (
  state: RidiSelectState,
  { categoryId, page }: { categoryId: number; page: number },
) => state.categoriesById[categoryId]?.itemListByPage[page];

export const getIsCategoryItemFetched = createSelector(
  getItemListByPage,
  itemListByPage => itemListByPage?.isFetched,
);

export const getCategoryBooks = createSelector(
  [getItemListByPage, getBooksById],
  (itemListByPage, books) => itemListByPage?.itemList.map(id => books[id].book!),
);
