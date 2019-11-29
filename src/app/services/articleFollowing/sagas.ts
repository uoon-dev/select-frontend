import { Actions as ArticleActions } from 'app/services/article';
import { Actions as ArticleChannelActions } from 'app/services/articleChannel';
import { Actions } from 'app/services/articleFollowing';
import {
  FollowingArticleListResponse,
  FollowingChannelListResponse,
  requestFollowingArticleList,
  requestFollowingChannelList,
  requestUnseenFollowingFeeds,
  requestUnseenFollowingFeedsToSeen,
  SetAllFollowingFeedsToSeenResponse,
  UnseenFollowingFeedsResponse,
} from 'app/services/articleFollowing/requests';
import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { ArticleRequestIncludableData } from 'app/types';
import showMessageForRequestError from 'app/utils/toastHelper';

function* loadFollowingChannelList() {
  try {
    const response: FollowingChannelListResponse = yield call(requestFollowingChannelList, { includes: [ArticleRequestIncludableData.CHANNEL] });
    yield put(ArticleChannelActions.updateChannelDetail({ channels: response.results.map((res) => res.channel) }));
    yield put(Actions.loadFollowingChannelListSuccess({response}));
  } catch (e) {
    yield put(Actions.loadFollowingChannelListFailure());
    if (e
      && e.response
      && e.response.data
      && e.response.data.status === ErrorStatus.MAINTENANCE
    ) {
      return;
    }
    showMessageForRequestError();
  }
}

function* loadFollowingArticleList({ payload }: ReturnType<typeof Actions.loadFollowingArticleListRequest>) {
  const { page } = payload;
  try {
    const response: FollowingArticleListResponse = yield call(requestFollowingArticleList, page);
    yield put(ArticleActions.updateArticles({ articles: response.results.map((res) => res)}));
    yield put(Actions.loadFollowingArticleListSuccess({page, response}));
  } catch (e) {
    yield put(Actions.loadFollowingArticleListFailure({page}));
    if (e
      && e.response
      && e.response.data
      && e.response.data.status === ErrorStatus.MAINTENANCE
    ) {
      return;
    }
    showMessageForRequestError();
  }
}

function* loadUnseenFollowingFeedsRequest() {
  try {
    const response: UnseenFollowingFeedsResponse = yield call(requestUnseenFollowingFeeds);
    yield put(Actions.loadUnseenFollowingFeedsSuccess({ unSeenFeedList: response }));
  } catch (e) {
    yield put(Actions.setUnseenFollowingFeedsToSeenFailure());
  }
}

function* setUnseenFollowingFeedsToSeen() {
  try {
    const response: SetAllFollowingFeedsToSeenResponse = yield call(requestUnseenFollowingFeedsToSeen);
    yield put(Actions.setUnseenFollowingFeedsToSeenSuccess(response));
  } catch (e) {
    yield put(Actions.setUnseenFollowingFeedsToSeenFailure());
  }
}

export function* watchFollowingChannelListRequest() {
  yield takeLeading(Actions.loadFollowingChannelListRequest.getType(), loadFollowingChannelList);
}

export function* watchFollowingArticleListRequest() {
  yield takeLeading(Actions.loadFollowingArticleListRequest.getType(), loadFollowingArticleList);
}

export function* watchLoadUnseenFollowingFeedsRequest() {
  yield takeLatest(Actions.loadUnseenFollowingFeedsRequest.getType(), loadUnseenFollowingFeedsRequest);
}

export function* watchSetUnseenFollowingFeedsToSeen() {
  yield takeLatest(Actions.setUnseenFollowingFeedsToSeenRequest.getType(), setUnseenFollowingFeedsToSeen);
}

export function* articleFollowingRootSaga() {
  yield all([
    watchFollowingChannelListRequest(),
    watchFollowingArticleListRequest(),
    watchLoadUnseenFollowingFeedsRequest(),
    watchSetUnseenFollowingFeedsToSeen(),
  ]);
}
