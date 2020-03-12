import { all, call, put, takeEvery } from 'redux-saga/effects';

import { ArticleRequestType } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { ErrorStatus, COUNT_PER_PAGE, ARTICLE_HOME_CHART_SECTION_COUNT } from 'app/constants';
import showMessageForRequestError from 'app/utils/toastHelper';
import { Actions, ArticleListType } from 'app/services/articleList';
import { Actions as ArticleActions, Article } from 'app/services/article';
import {
  requestArticles,
  ArticleListResponse,
  requestPopularArticleList,
  PopularArticleListResponse,
} from 'app/services/articleList/requests';

function* loadArticleList({ payload }: ReturnType<typeof Actions.loadArticleList>) {
  const { type, page, size } = payload;
  try {
    let response: ArticleListResponse & PopularArticleListResponse;
    let articles: Article[];

    if (type === ArticleListType.POPULAR) {
      response = yield call(requestPopularArticleList, {
        page,
        countPerPage: size || ARTICLE_HOME_CHART_SECTION_COUNT,
      });
      articles = response.articles.filter(article => article.id);
    } else {
      response = yield call(
        requestArticles,
        {
          type: type === ArticleListType.RECOMMEND ? ArticleRequestType.RECOMMEND : undefined,
          exceptRidiChannel: type === ArticleListType.RECENT,
        },
        {
          page,
          size: size || COUNT_PER_PAGE,
        },
      );
      articles = response.results.filter(article => article.id);
    }
    yield all([
      put(ArticleActions.updateArticles({ articles })),
      put(
        Actions.afterLoadArticleList({
          articles: articles.map(article => getArticleKeyFromData(article)),
          totalCount: response.totalCount,
          page,
          type,
        }),
      ),
    ]);
  } catch (e) {
    yield put(
      Actions.afterLoadArticleList({
        type,
        page,
      }),
    );
    if (
      e?.response?.data?.status === ErrorStatus.MAINTENANCE ||
      (type === ArticleListType.POPULAR && size === ARTICLE_HOME_CHART_SECTION_COUNT)
    ) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* articleListRootSaga() {
  yield takeEvery(Actions.loadArticleList.getType(), loadArticleList);
}
