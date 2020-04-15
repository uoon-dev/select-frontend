import React from 'react';
import { Button } from '@ridi/rsg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import * as styles from 'app/scenes/ArticleContent/styles';
import { ArticleItemState } from 'app/services/article';

export const ArticleContentGetTicketToRead: React.FunctionComponent<{
  articleState: ArticleItemState;
}> = props => {
  const { articleState } = props;

  const isLoggedIn = useSelector((state: RidiSelectState) => state.user.isLoggedIn);
  const hasSubscribedBefore = useSelector(
    (state: RidiSelectState) => state.user.hasSubscribedBefore,
  );

  if (!articleState || !articleState.article || !articleState.article.isTeaser) {
    return null;
  }

  return (
    <div className="StickyElement" css={styles.ArticleContent_GetTicketToReadButtonWrapper}>
      <Button
        size="large"
        color="blue"
        component={Link}
        css={styles.ArticleContent_GetTicketToReadButton}
        to="/intro"
      >
        {`리디셀렉트 구독하고 ${isLoggedIn && hasSubscribedBefore ? '바로' : '무료로'} 보기`}
      </Button>
    </div>
  );
};
