import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Pagination } from 'app/components';
import { Article } from 'app/services/article';
import { FetchStatusFlag } from 'app/constants';
import { articleListToPath } from 'app/utils/toPath';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { ArticleListType } from 'app/services/articleList';
import { GridArticleList } from 'app/components/GridArticleList';
import * as styles from 'app/components/ArticleList/gridListStyle.ts';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'app/services/commonUI/selectors';

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
  const isMobile = useSelector(getIsMobile);

  if (!articleList || !itemCount || fetchStatus === FetchStatusFlag.FETCHING) {
    return (
      <div css={styles.gridArticleListContainer}>
        <GridArticleListPlaceholder />
      </div>
    );
  }

  return (
    <div css={styles.gridArticleListContainer}>
      {articleList?.length > 0 ? (
        <>
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="channel-detail"
            uiPartTitleForTracking="article-list"
            renderChannelMeta
            miscTracking={JSON.stringify({ sect_page: page })}
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
