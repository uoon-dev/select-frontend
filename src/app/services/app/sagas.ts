import { select, take } from 'redux-saga/effects';

import { Actions, AppStatus } from 'app/services/app';
import { RidiSelectState } from 'app/store';

const KEY_LOCAL_STORAGE = 'rs.home';
export const localStorageManager = {
  load: (): AppStatus => {
    const data: AppStatus = (localStorage.getItem(KEY_LOCAL_STORAGE) || AppStatus.Books) as AppStatus;
    return Object.values(AppStatus).includes(data) ? data : AppStatus.Books;
  },
  save: (value: AppStatus) => {
    localStorage.setItem(KEY_LOCAL_STORAGE, value);
  },
};

export function* watchAppState() {
  while (true) {
    yield take(Actions.updateAppStatus.getType());
    const appStatus = yield select((state: RidiSelectState) => state.app.appStatus);
    if ([AppStatus.Books, AppStatus.Articles].includes(appStatus)) {
      localStorageManager.save(appStatus);
    }
  }
}
