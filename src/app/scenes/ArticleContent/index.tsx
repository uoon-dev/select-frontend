import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { ArticleContentBottomButtons } from 'app/components/ArticleContent/BottomButtons';
import { ArticleContentComponent } from 'app/components/ArticleContent/ContentComponent';
import { ArticleContentGetTicketToRead } from 'app/components/ArticleContent/GetTicketToRead';
import { ArticleContentHeader } from 'app/components/ArticleContent/Header';
import { HelmetWithTitle } from 'app/components';
import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/article';
import { RidiSelectState } from 'app/store';
import { ArticleRequestIncludableData } from 'app/types';
import RelatedArticleSection from 'app/components/ArticleContent/RelatedArticleSection';
import * as styles from 'app/scenes/ArticleContent/styles';

type RouteProps = RouteComponentProps<{ channelName: string; contentIndex: string }>;

type OwnProps = RouteProps & {};

const ArticleContent: React.FunctionComponent<OwnProps> = props => {
  const { channelName, contentIndex } = props.match.params;
  const contentKey = `@${channelName}/${Number(contentIndex)}`;
  const dispatch = useDispatch();

  const articleState = useSelector((state: RidiSelectState) => state.articlesById[contentKey]);
  const relatedArticles = useSelector(
    (state: RidiSelectState) => state.articlesById[contentKey]?.relatedArticles,
  );
  const hasAvailableTicket = useSelector((state: RidiSelectState) => state.user.hasAvailableTicket);
  const ticketFetchStatus = useSelector((state: RidiSelectState) => state.user.ticketFetchStatus);
  const relatedArticleFetchStatus = useSelector(
    (state: RidiSelectState) =>
      state.articlesById[contentKey]?.relatedArticles?.fetchStatus || FetchStatusFlag.IDLE,
  );
  const articleTitle = articleState?.article?.title;

  useEffect(() => {
    if (articleState?.contentFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }

    dispatch(
      Actions.loadArticleRequest({
        channelName,
        contentIndex: Number(contentIndex),
        requestQueries: {
          includes: [
            ArticleRequestIncludableData.CONTENT,
            ArticleRequestIncludableData.AUTHORS,
            ArticleRequestIncludableData.IS_FAVORITE,
            ArticleRequestIncludableData.FAVORITES_COUNT,
          ],
        },
      }),
    );
  }, [hasAvailableTicket, contentKey]);

  useEffect(() => {
    const articleId = articleState?.article?.id;
    if (
      !articleId ||
      relatedArticles?.articles ||
      relatedArticleFetchStatus !== FetchStatusFlag.IDLE
    ) {
      return;
    }
    dispatch(Actions.loadRelatedArticles({ contentKey, articleId }));
  }, [articleState]);

  return (
    <main className="SceneWrapper" css={styles.PageArticleContent}>
      <HelmetWithTitle
        titleName={articleTitle}
        meta={[
          {
            property: 'og:title',
            content: articleTitle,
          },
        ]}
      />
      <ArticleContentHeader contentKey={contentKey} />
      <div css={styles.ArticleContent_ContentWrapper}>
        <ArticleContentComponent contentKey={contentKey} />
        {!articleState ||
        !articleState.content ||
        ticketFetchStatus === FetchStatusFlag.FETCHING ? null : hasAvailableTicket ? (
          <>
            <ArticleContentBottomButtons contentKey={contentKey} />
            <RelatedArticleSection contentKey={contentKey} channelName={channelName} />
          </>
        ) : (
          <ArticleContentGetTicketToRead contentKey={contentKey} />
        )}
      </div>
    </main>
  );
};

export default ArticleContent;
