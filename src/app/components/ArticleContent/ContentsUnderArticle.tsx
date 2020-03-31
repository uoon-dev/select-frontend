import React from 'react';
import { useSelector } from 'react-redux';

import { ArticleKey } from 'app/types';
import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { ArticleItemState } from 'app/services/article';
import RelatedArticleSection from 'app/components/ArticleContent/RelatedArticleSection';
import { ArticleContentBottomButtons } from 'app/components/ArticleContent/BottomButtons';
import { ArticleContentGetTicketToRead } from 'app/components/ArticleContent/GetTicketToRead';

const ContentsUnderArticle: React.FunctionComponent<{
  contentKey: ArticleKey;
  channelName: string;
  articleState: ArticleItemState;
  hasAvailableTicket: boolean;
}> = props => {
  const { contentKey, channelName, articleState, hasAvailableTicket } = props;

  const ticketFetchStatus = useSelector((state: RidiSelectState) => state.user.ticketFetchStatus);

  if (!articleState || !articleState.content || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return null;
  }

  return hasAvailableTicket ? (
    <>
      <ArticleContentBottomButtons articleState={articleState} />
      <RelatedArticleSection contentKey={contentKey} channelName={channelName} />
    </>
  ) : (
    <ArticleContentGetTicketToRead articleState={articleState} />
  );
};

export default ContentsUnderArticle;
