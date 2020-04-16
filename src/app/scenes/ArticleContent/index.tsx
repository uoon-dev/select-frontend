import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { RidiSelectState } from 'app/store';
import { Actions } from 'app/services/article';
import { FetchStatusFlag } from 'app/constants';
import { HelmetWithTitle } from 'app/components';
import { ArticleRequestIncludableData } from 'app/types';
import * as styles from 'app/scenes/ArticleContent/styles';
import { ArticleContentHeader } from 'app/components/ArticleContent/Header';
import ContentsUnderArticle from 'app/components/ArticleContent/ContentsUnderArticle';
import { ArticleContentComponent } from 'app/components/ArticleContent/ContentComponent';

type RouteProps = RouteComponentProps<{ channelName: string; contentIndex: string }>;

type OwnProps = RouteProps & {};

const ArticleContent: React.FunctionComponent<OwnProps> = props => {
  const { channelName, contentIndex } = props.match.params;
  const contentKey = `@${channelName}/${Number(contentIndex)}`;
  const dispatch = useDispatch();

  const articleState = useSelector((state: RidiSelectState) => state.articlesById[contentKey]);
  const channelId = useSelector(
    (state: RidiSelectState) => state.articlesById[contentKey]?.article?.channelId,
  );
  const relatedArticles = useSelector(
    (state: RidiSelectState) => state.articlesById[contentKey]?.relatedArticles,
  );
  const hasAvailableTicket = useSelector((state: RidiSelectState) => state.user.hasAvailableTicket);
  const relatedArticleFetchStatus = useSelector(
    (state: RidiSelectState) =>
      state.articlesById[contentKey]?.relatedArticles?.fetchStatus || FetchStatusFlag.IDLE,
  );
  const articleTitle = articleState?.article?.title;

  React.useEffect(() => {
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

  React.useEffect(() => {
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
        <ContentsUnderArticle
          contentKey={contentKey}
          channelId={channelId}
          channelName={channelName}
          articleState={articleState}
          hasAvailableTicket={hasAvailableTicket}
        />
      </div>
    </main>
  );
};

export default ArticleContent;
