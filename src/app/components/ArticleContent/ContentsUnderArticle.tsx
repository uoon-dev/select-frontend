import React from 'react';
import { useSelector } from 'react-redux';
import throttle from 'lodash-es/throttle';

import { ArticleKey } from 'app/types';
import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { ArticleItemState } from 'app/services/article';
import * as styles from 'app/scenes/ArticleContent/styles';
import RelatedArticleSection from 'app/components/ArticleContent/RelatedArticleSection';
import { ArticleContentBottomButtons } from 'app/components/ArticleContent/BottomButtons';
import { ArticleContentGetTicketToRead } from 'app/components/ArticleContent/GetTicketToRead';
import { ArticleChannelInfoHeader } from 'app/components/ArticleChannels/ArticleChannelInfoHeader';

const ContentsUnderArticle: React.FunctionComponent<{
  contentKey: ArticleKey;
  channelId?: number;
  channelName: string;
  articleState: ArticleItemState;
  hasAvailableTicket: boolean;
}> = props => {
  const { contentKey, channelId, channelName, articleState, hasAvailableTicket } = props;

  const ticketFetchStatus = useSelector((state: RidiSelectState) => state.user.ticketFetchStatus);

  const [windowInnerHeight, setWindowInnerHeight] = React.useState(window.innerHeight);
  const [targetPos, setTargetPos] = React.useState(0);
  const [isSticky, setIsSticky] = React.useState(true);

  let prevScrollPos = 0;

  const contentButtonsContainer = React.useRef<HTMLDivElement>(null);
  const getTicketToReadContainer = React.useRef<HTMLDivElement>(null);

  const scrollFunction = () => {
    if (!windowInnerHeight || !targetPos) {
      return;
    }
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (prevScrollPos > currentScrollTop && currentScrollTop + windowInnerHeight < targetPos) {
      setIsSticky(false);
    } else {
      setIsSticky(true);
    }
    prevScrollPos = currentScrollTop;
  };
  const resizeFunction = () => {
    setWindowInnerHeight(window.innerHeight);
  };
  const throttledScrollFunction = throttle(scrollFunction, 100);
  const throttledResizeFunction = throttle(resizeFunction, 100);

  React.useEffect(() => {
    window.addEventListener('resize', throttledResizeFunction);

    return () => {
      window.removeEventListener('resize', throttledResizeFunction);
    };
  }, []);

  React.useLayoutEffect(() => {
    const targetRef = !hasAvailableTicket ? contentButtonsContainer : getTicketToReadContainer;
    if (!targetRef?.current?.parentElement) {
      return;
    }
    setTargetPos(
      targetRef.current.offsetTop +
        targetRef.current.parentElement.offsetTop +
        targetRef.current.offsetHeight,
    );
  }, [hasAvailableTicket, articleState?.article]);

  React.useEffect(() => {
    window.removeEventListener('scroll', throttledScrollFunction);

    if (
      windowInnerHeight < targetPos ||
      (articleState?.content && ticketFetchStatus === FetchStatusFlag.IDLE)
    ) {
      window.addEventListener('scroll', throttledScrollFunction);
      scrollFunction();
    }

    return () => {
      window.removeEventListener('scroll', throttledScrollFunction);
    };
  }, [targetPos, windowInnerHeight]);

  if (!articleState || !articleState.content || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return null;
  }

  return !hasAvailableTicket ? (
    <>
      <div
        css={styles.ArticleContent_ButtonsContainer}
        className={isSticky ? 'sticky' : ''}
        ref={contentButtonsContainer}
      >
        <ArticleContentBottomButtons articleState={articleState} />
      </div>
      {channelName && channelId && (
        <ArticleChannelInfoHeader
          channelId={channelId}
          channelName={channelName}
          contentKey={contentKey}
        />
      )}
      <RelatedArticleSection contentKey={contentKey} channelName={channelName} />
    </>
  ) : (
    <div
      css={styles.ArticleContent_GetTicketToReadButtonContainer}
      className={isSticky ? 'sticky' : ''}
      ref={getTicketToReadContainer}
    >
      <ArticleContentGetTicketToRead articleState={articleState} />
    </div>
  );
};

export default ContentsUnderArticle;
