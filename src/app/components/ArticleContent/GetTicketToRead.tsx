import * as React from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';
import * as classNames from 'classnames';

export const ArticleContentGetTicketToRead: React.FunctionComponent<{ contentKey: string }> = (props) => {
  const { isLoggedIn, BASE_URL_STORE, articleState } = useSelector((state: RidiSelectState) => ({
    BASE_URL_STORE: state.environment.STORE_URL,
    articleState: state.articlesById[props.contentKey],
    isLoggedIn: state.user.isLoggedIn,
  }));

  if (!articleState || !articleState.article) {
    return null;
  }

  const paymentUrl = `${BASE_URL_STORE}/select/payments?return_url=${encodeURIComponent(location.origin + location.pathname)}`;

  return (
    <div
      className={classNames(
        'ArticleContent_GetTicketToReadButtonWrapper',
        articleState.article.isPublic && 'ArticleContent_GetTicketToReadButtonWrapper-publicContent',
      )}
    >
      <Button
        size="large"
        color="blue"
        className="ArticleContent_GetTicketToReadButton"
        onClick={() => {
          if (isLoggedIn) {
            window.location.replace(paymentUrl);
            return;
          }
          moveToLogin(paymentUrl);
        }}
      >
        리디셀렉트 구독하고 무료로 보기
      </Button>
    </div>
  );
};
