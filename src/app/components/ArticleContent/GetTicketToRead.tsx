import React from 'react';
import { Button } from '@ridi/rsg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import throttle from 'lodash-es/throttle';

import { RidiSelectState } from 'app/store';
import * as styles from 'app/scenes/ArticleContent/styles';
import { ArticleItemState } from 'app/services/article';

export const ArticleContentGetTicketToRead: React.FunctionComponent<{
  articleState: ArticleItemState;
}> = props => {
  const { articleState } = props;

  if (!articleState || !articleState.article || !articleState.article.isTeaser) {
    return null;
  }

  const getTicketToReadContainer = React.useRef<HTMLDivElement>(null);

  const [windowInnerHeight, setWindowInnerHeight] = React.useState(window.innerHeight);
  const [isSticky, setIsSticky] = React.useState(false);

  const isLoggedIn = useSelector((state: RidiSelectState) => state.user.isLoggedIn);
  const hasSubscribedBefore = useSelector(
    (state: RidiSelectState) => state.user.hasSubscribedBefore,
  );

  let targetPosY = 0;

  const scrollFunction = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isTargetOutOfScreen = currentScrollTop + windowInnerHeight < targetPosY;

    setIsSticky(isTargetOutOfScreen);
  };

  const resizeFunction = () => setWindowInnerHeight(window.innerHeight);

  const throttledScrollFunction = throttle(scrollFunction, 100);
  const throttledResizeFunction = throttle(resizeFunction, 100);

  React.useEffect(() => {
    window.addEventListener('resize', throttledResizeFunction);

    return () => {
      window.removeEventListener('resize', throttledResizeFunction);
    };
  }, []);

  React.useEffect(() => {
    window.removeEventListener('scroll', throttledScrollFunction);

    if (!articleState?.content || !getTicketToReadContainer?.current?.parentElement) {
      return;
    }

    targetPosY =
      getTicketToReadContainer.current.offsetTop +
      getTicketToReadContainer.current.offsetHeight +
      getTicketToReadContainer.current.parentElement.offsetTop;

    if (windowInnerHeight < targetPosY) {
      window.addEventListener('scroll', throttledScrollFunction);
      scrollFunction();
    }

    return () => {
      window.removeEventListener('scroll', throttledScrollFunction);
    };
  }, [articleState, windowInnerHeight]);

  return (
    <div css={styles.ArticleContent_GetTicketToReadButtonContainer} ref={getTicketToReadContainer}>
      <div
        className={isSticky ? 'sticky' : ''}
        css={styles.ArticleContent_GetTicketToReadButtonWrapper}
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
    </div>
  );
};
