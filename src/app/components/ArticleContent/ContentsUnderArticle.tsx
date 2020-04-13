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

  const [isSticky, setIsSticky] = React.useState(true);
  const contentButtonsContainer = React.useRef<HTMLDivElement>(null);
  const getTicketToReadContainer = React.useRef<HTMLDivElement>(null);

  let ContainerOffsetTop: number;
  let ContainerOffsetHeight: number;
  let ElementOffsetHeight: number;
  let windowInnerHeight: number;
  let targetRef: React.RefObject<HTMLDivElement>;

  const scrollFunction = () => {
    if (!windowInnerHeight || !ContainerOffsetTop || !ElementOffsetHeight) {
      return;
    }
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop + windowInnerHeight >= ContainerOffsetTop + ContainerOffsetHeight) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };
  const throttledScrollFunction = throttle(scrollFunction, 100);

  React.useEffect(() => {
    window.removeEventListener('scroll', throttledScrollFunction);
    targetRef = hasAvailableTicket ? contentButtonsContainer : getTicketToReadContainer;
    if (!targetRef?.current?.parentElement) {
      return;
    }
    const { current } = targetRef;
    const { parentElement } = targetRef.current;

    ContainerOffsetTop = parentElement.offsetTop;
    ContainerOffsetHeight = parentElement.offsetHeight;
    ElementOffsetHeight = current.offsetHeight;
    windowInnerHeight = window.innerHeight;

    if (
      windowInnerHeight < ContainerOffsetTop + ContainerOffsetHeight ||
      (articleState?.content && ticketFetchStatus === FetchStatusFlag.IDLE)
    ) {
      window.addEventListener('scroll', throttledScrollFunction);
      scrollFunction();
    }

    return () => {
      window.removeEventListener('scroll', throttledScrollFunction);
    };
  }, [hasAvailableTicket, articleState?.article, window.innerHeight]);

  if (!articleState || !articleState.content || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return null;
  }

  return hasAvailableTicket ? (
    <div css={styles.ArticleContent_UnderArticleWrapper} className={isSticky ? 'sticky' : ''}>
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
    </div>
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
