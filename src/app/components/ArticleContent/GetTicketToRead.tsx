import * as React from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';

export const ArticleContentGetTicketToRead: React.FunctionComponent<{ contentKey: string }> = (props) => {
  const { isLoggedIn, BASE_URL_STORE, articleState } = useSelector((state: RidiSelectState) => ({
    BASE_URL_STORE: state.environment.STORE_URL,
    articleState: state.articlesById[props.contentKey],
    isLoggedIn: state.user.isLoggedIn,
  }));

  if (!articleState || !articleState.article || articleState.article.isPublic) {
    return null;
  }

  return (
    <div className="ArticleContent_GetTicketToReadButtonWrapper">
      <Button
        size="large"
        color="blue"
        className="ArticleContent_GetTicketToReadButton"
        onClick={() => {
          if (isLoggedIn) {
            window.location.replace(`${BASE_URL_STORE}/select/payments`);
            return;
          }
          moveToLogin(`${BASE_URL_STORE}/select/payments`);
        }}
      >
        리디셀렉트 구독하고 무료로 보기
      </Button>
    </div>
  );
};
