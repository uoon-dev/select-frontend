import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { FetchStatusFlag, RoutePaths } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { GridArticleList } from 'app/components/GridArticleList';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { Actions, ArticleListType } from 'app/services/articleList';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { articleListToPath } from 'app/utils/toPath';

interface ArticleHomeSectionProps {
  title: string;
  order: number;
  articleListType: ArticleListType;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

export const ArticleHomeListSection: React.FunctionComponent<ArticleHomeSectionProps> = props => {
  const { title, order, articleListType } = props;
  const ArticleCount = articleListType && articleListType === ArticleListType.RECENT ? 8 : 4;
  const articles = useSelector((state: RidiSelectState) => state.articlesById);
  const sectionItemList = useSelector((state: RidiSelectState) => {
    const itemList = state.articleList[articleListType].itemListByPage[1]?.itemList;
    return itemList?.length > ArticleCount ? itemList.slice(0, ArticleCount) : itemList;
  });
  const sectionDataFetchStatus = useSelector(
    (state: RidiSelectState) => state.articleList[articleListType].itemListByPage[1]?.fetchStatus,
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (sectionItemList !== undefined || sectionDataFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(
      Actions.loadArticleListRequest({ type: articleListType, page: 1, size: ArticleCount }),
    );
  }, []);

  return (
    <section className="ArticleHomeSection">
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
            articles={sectionItemList.map(id => articles[id].article!)}
          />
        </>
      )}
    </section>
  );
};
