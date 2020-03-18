import { RidiSelectState } from 'app/store';

export const getBooksBannerCurrentIdx = (state: RidiSelectState): number => state.home.currentIdx;
export const getArticlesBannerCurrentIdx = (state: RidiSelectState): number =>
  state.articleHome.currentIdx;
