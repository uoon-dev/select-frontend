import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { articleListToPath } from 'app/utils/toPath';
import { ArticleResponse } from 'app/services/article/requests';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import * as styles from 'app/components/ArticleHome/articleHomeSectionStyles';
import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { Actions as PopularArticleActions, ArticleListType } from 'app/services/articleList';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { ArticleSectionChartListContainerPlaceholder } from 'app/placeholder/ArticleSectionChartListPlaceholder';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeChartSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const popularArticle = useSelector((state: RidiSelectState) => {
    const itemList = state.articleList[ArticleListType.POPULAR].itemListByPage[1]?.itemList;
    return itemList?.length > 20 ? itemList.slice(0, 20) : itemList;
  });
  const articleFetchStatus = useSelector(
    (state: RidiSelectState) =>
      state.articleList[ArticleListType.POPULAR].itemListByPage[1]?.fetchStatus,
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (popularArticle !== undefined || articleFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(
      PopularArticleActions.loadArticleListRequest({ type: ArticleListType.POPULAR, page: 1 }),
    );
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
        articleList={popularArticle.map(id => articles[id].article!)}
        serviceTitleForTracking="select-article"
        pageTitleForTracking="home"
        uiPartTitleForTracking={`${articleListType.replace('ArticleList', '')}`}
        miscTracking={JSON.stringify({ sect_order: order })}
      />
    </section>
  ) : null;
};
