import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

import { Pagination } from 'app/components';
import { Article } from 'app/services/article';
import { articleListToPath } from 'app/utils/toPath';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { MAX_WIDTH, FetchStatusFlag } from 'app/constants';
import { ArticleListType } from 'app/services/articleList';
import { GridArticleList } from 'app/components/GridArticleList';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';

interface ArticleGridListProps {
  page: number;
  articleList?: Article[];
  fetchStatus?: FetchStatusFlag;
  articleListType: ArticleListType;
  itemCountPerPage: number;
  itemCount?: number;
}

const ArticleGridList: React.FunctionComponent<ArticleGridListProps> = props => {
  const { page, articleList, fetchStatus, articleListType, itemCountPerPage, itemCount } = props;

  const isMobile = useMediaQuery({ query: `(max-width: ${MAX_WIDTH}px)` });

  return (
    <div
      css={{
        maxWidth: '840px',
        margin: '0 auto',
      }}
    >
      {!articleList || !itemCount || fetchStatus === FetchStatusFlag.FETCHING ? (
        <GridArticleListPlaceholder />
      ) : articleList?.length > 0 ? (
        <>
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="channel-detail"
            uiPartTitleForTracking="article-list"
            renderChannelMeta
            miscTracking={JSON.stringify({ sect_page: page })}
            renderAuthor={false}
            articles={articleList}
          />
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(itemCount / itemCountPerPage)}
            isMobile={isMobile}
            item={{
              el: Link,
              getProps: (p): LinkProps => ({
                to: `${articleListToPath({
                  listType: articleListType.replace('ArticleList', ''),
                })}?page=${p}`,
              }),
            }}
          />
        </>
      ) : (
        <ArticleEmpty iconName="document" description="아티클이 없습니다." />
      )}
    </div>
  );
};

export default ArticleGridList;
