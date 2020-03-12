import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { articleListToPath } from 'app/utils/toPath';
import { ArticleResponse } from 'app/services/article/requests';
import { GridArticleList } from 'app/components/GridArticleList';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { Actions, ArticleListType } from 'app/services/articleList';
import * as styles from 'app/components/ArticleHome/articleHomeSectionStyles';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import {
  FetchStatusFlag,
  ARTICLE_HOME_SECTION_COUNT,
  ARTICLE_HOME_RECENT_SECTION_COUNT,
} from 'app/constants';
import {
  getHomeRecentArticleList,
  getHomeRecommendArticleList,
  getRecentArticleListFetchStatus,
  getRecommendArticleListFetchStatus,
} from 'app/services/articleList/selectors';
import { Article } from 'app/services/article';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeListSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  let sectionItemList: Article[];
  let sectionDataFetchStatus: FetchStatusFlag;
  let articleCount: number;

  switch (articleListType) {
    case ArticleListType.RECENT:
      sectionItemList = useSelector(getHomeRecentArticleList);
      sectionDataFetchStatus = useSelector(getRecentArticleListFetchStatus);
      articleCount = ARTICLE_HOME_RECENT_SECTION_COUNT;
      break;
    case ArticleListType.RECOMMEND:
    default:
      sectionItemList = useSelector(getHomeRecommendArticleList);
      sectionDataFetchStatus = useSelector(getRecommendArticleListFetchStatus);
      articleCount = ARTICLE_HOME_SECTION_COUNT;
  }

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (sectionItemList !== undefined || sectionDataFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(Actions.loadArticleList({ type: articleListType, page: 1, size: articleCount }));
  }, []);

  return (
    <section css={styles.articleSection}>
      {!sectionItemList ? (
        <>
          <ArticleSectionHeaderPlaceholder />
          <GridArticleListPlaceholder />
        </>
      ) : (
        <>
          <SectionHeader
            title={title}
            link={
              articleListType === ArticleListType.RECENT
                ? articleListToPath({ listType: 'recent' })
                : undefined
            }
          />
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="home"
            uiPartTitleForTracking={`${articleListType.replace('ArticleList', '')}`}
            miscTracking={JSON.stringify({ sect_order: order })}
            renderChannelMeta
            renderAuthor
            articles={sectionItemList}
          />
        </>
      )}
    </section>
  );
};
