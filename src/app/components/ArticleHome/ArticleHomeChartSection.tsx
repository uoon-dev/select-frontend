import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FetchStatusFlag } from 'app/constants';
import { articleListToPath } from 'app/utils/toPath';
import { ArticleResponse } from 'app/services/article/requests';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import * as styles from 'app/components/ArticleHome/articleHomeSectionStyles';
import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { Actions as PopularArticleActions, ArticleListType } from 'app/services/articleList';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { ArticleSectionChartListContainerPlaceholder } from 'app/placeholder/ArticleSectionChartListPlaceholder';
import {
  getHomePopularArticleList,
  getPopularArticleListFetchStatus,
} from 'app/services/articleList/selectors';
import { Article } from 'app/services/article';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeChartSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  const popularArticle: Article[] = useSelector(getHomePopularArticleList);
  const articleFetchStatus: FetchStatusFlag = useSelector(getPopularArticleListFetchStatus);

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (popularArticle !== undefined || articleFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(PopularArticleActions.loadArticleList({ type: ArticleListType.POPULAR, page: 1 }));
  }, []);

  if (articleFetchStatus === FetchStatusFlag.FETCHING) {
    return (
      <section css={styles.articleSection}>
        <ArticleSectionHeaderPlaceholder />
        <ArticleSectionChartListContainerPlaceholder />
      </section>
    );
  }

  return popularArticle ? (
    <section css={styles.articleSection}>
      <SectionHeader title={title} link={articleListToPath({ listType: 'popular' })} />
      <ArticleSectionChartList
        articleList={popularArticle}
        serviceTitleForTracking="select-article"
        pageTitleForTracking="home"
        uiPartTitleForTracking={`${articleListType.replace('ArticleList', '')}`}
        miscTracking={JSON.stringify({ sect_order: order })}
      />
    </section>
  ) : null;
};
