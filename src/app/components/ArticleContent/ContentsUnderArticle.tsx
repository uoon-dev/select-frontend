import React from 'react';
import { useSelector } from 'react-redux';

import { ArticleKey } from 'app/types';
import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { ArticleContentBottomButtons } from './BottomButtons';
import RelatedArticleSection from './RelatedArticleSection';
import { ArticleContentGetTicketToRead } from './GetTicketToRead';

const ContentsUnderArticle: React.FunctionComponent<{
  contentKey: ArticleKey;
  channelName: string;
}> = ({ contentKey, channelName }) => {
  const articleState = useSelector((state: RidiSelectState) => state.articlesById[contentKey]);
  const hasAvailableTicket = useSelector((state: RidiSelectState) => state.user.hasAvailableTicket);
  const ticketFetchStatus = useSelector((state: RidiSelectState) => state.user.ticketFetchStatus);

  if (!articleState || !articleState.content || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return null;
  }

  return hasAvailableTicket ? (
    <>
      <ArticleContentBottomButtons contentKey={contentKey} />
      <RelatedArticleSection contentKey={contentKey} channelName={channelName} />
    </>
  ) : (
    <ArticleContentGetTicketToRead contentKey={contentKey} />
  );
};

export default ContentsUnderArticle;
