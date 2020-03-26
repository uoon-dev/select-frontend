import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import throttle from 'lodash-es/throttle';

import { Button } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';
import * as styles from 'app/scenes/ArticleContent/styles';

export const ArticleContentGetTicketToRead: React.FunctionComponent<{
  contentKey: string;
}> = props => {
  const articleState = useSelector(
    (state: RidiSelectState) => state.articlesById[props.contentKey],
  );
  const isLoggedIn = useSelector((state: RidiSelectState) => state.user.isLoggedIn);
  const hasSubscribedBefore = useSelector(
    (state: RidiSelectState) => state.user.hasSubscribedBefore,
  );

  const [isSticky, setIsSticky] = React.useState(true);
  const getTicketToReadButtonWrapper = React.useRef<HTMLDivElement>(null);
  const scrollFunction = () => {
    if (
      !getTicketToReadButtonWrapper ||
      !getTicketToReadButtonWrapper.current ||
      !getTicketToReadButtonWrapper.current.parentElement
    ) {
      return;
    }
    const { parentElement } = getTicketToReadButtonWrapper.current;
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (
      window.innerHeight >= parentElement.offsetTop + parentElement.offsetHeight ||
      currentScrollTop + window.innerHeight >= parentElement.offsetTop + parentElement.offsetHeight
    ) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };
  const throttledScrollFunction = throttle(scrollFunction, 100);

  React.useEffect(() => {
    window.addEventListener('scroll', throttledScrollFunction);
    scrollFunction();
    return () => {
      window.removeEventListener('scroll', throttledScrollFunction);
    };
  }, []);

  if (!articleState || !articleState.article || !articleState.article.isTeaser) {
    return null;
  }

  return (
    <div
      css={styles.ArticleContent_GetTicketToReadButtonWrapper}
      className={isSticky ? 'sticky' : ''}
      ref={getTicketToReadButtonWrapper}
    >
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
