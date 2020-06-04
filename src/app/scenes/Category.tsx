import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, LinkProps, useHistory, useParams } from 'react-router-dom';

import { GridBookList, HelmetWithTitle } from 'app/components';
import { PageTitleText, RoutePaths } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Actions as categoryActions, Categories, CategoryItem } from 'app/services/category';
import { isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import { Pagination } from 'app/components/Pagination';
import { getPageQuery } from 'app/services/routing/selectors';
import SelectDialog from 'app/components/SelectDialog';
import TabList, { SC as TabListSC } from 'app/components/TabList';
import Media from 'app/styles/mediaQuery';
import SelectBox from 'app/components/SelectBox';
import { SortOptionList, DefaultSortOption } from 'app/services/category/constants';
import { Scene } from 'app/styles/globals';
import {
  getSort,
  getIsCategoryListFetched,
  getCategoryList,
  getTotalPages,
  getIsCategoryItemFetched,
  getCategoryBooks,
} from 'app/services/category/selectors';
import CategoryEmpty from 'app/components/Empty/CategoryEmpty';

const SC = {
  SceneWrapper: styled.main`
    ${Scene.Wrapper}
    ${Scene.WithGNB}
    ${Scene.WithLNB}
  `,
  CategoryWrapper: styled.div`
    @media ${Media.MOBILE} {
      padding: 10px 0 0 20px;
    }
    @media ${Media.PC} {
      width: 800px;
      margin: 0 auto;
      padding: 40px 0 0 0;
    }
  `,
  Sort: styled.div`
    padding-bottom: 6px;
  `,
};

const Styles = {
  tabList: css`
    @media ${Media.MOBILE} {
      margin-left: -20px;
      ${TabListSC.TabList} {
        padding-left: 20px;
      }
    }
  `,
  selectBox: css`
    margin-top: 15px;
  `,
};

interface LocationToParams {
  categoryId?: number;
  sort?: string;
  page?: number;
}

const Category: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const categoryId = Number(useParams<{ categoryId: string }>().categoryId);
  const sort = useSelector(getSort) || DefaultSortOption.value;
  const page = useSelector(getPageQuery) || 1;

  const categoryList = useSelector(getCategoryList) || [];
  const totalPages = useSelector((state: RidiSelectState) => getTotalPages(state, { categoryId }));
  const isCategoryListFetched = useSelector(getIsCategoryListFetched);
  const isCategoryItemFetched = useSelector((state: RidiSelectState) =>
    getIsCategoryItemFetched(state, { categoryId, page }),
  );
  const categoryBooks = useSelector((state: RidiSelectState) =>
    getCategoryBooks(state, { categoryId, page }),
  );

  const isValidCategoryId = isValidNumber(categoryId);
  const [firstCategory, setFirstCategory] = useState<Categories | undefined>(undefined);
  const [secondCategoryList, setSecondCategoryList] = useState<CategoryItem[] | undefined>(
    undefined,
  );
  const [secondCategory, setSecondCategory] = useState<CategoryItem | undefined>(undefined);

  const initializeCategoryInfo = () => {
    dispatch(
      categoryActions.initializeCategoriesWhole({
        shouldFetchCategoryList: !isCategoryListFetched,
        shouldInitializeCategoryId: !isValidCategoryId,
      }),
    );
  };

  useEffect(() => {
    initializeCategoryInfo();
  }, []);

  useEffect(() => {
    if (isValidCategoryId && isCategoryListFetched && categoryList) {
      let selectedSecondCategory;
      const selectedFirstCategory = categoryList.find(firstCategoryItem => {
        selectedSecondCategory = firstCategoryItem.children.find(
          secondCategoryItem => secondCategoryItem.id === categoryId,
        );
        return selectedSecondCategory;
      });
      setFirstCategory(selectedFirstCategory);
      setSecondCategoryList(selectedFirstCategory?.children);
      setSecondCategory(selectedSecondCategory);
    } else {
      initializeCategoryInfo();
    }
  }, [categoryId, isCategoryListFetched, categoryList]);

  useEffect(() => {
    if (isValidCategoryId) {
      dispatch(categoryActions.cacheCategoryId({ categoryId }));
      dispatch(
        categoryActions.loadCategoryBooksRequest({
          categoryId,
          page,
          sort,
        }),
      );
    }
  }, [categoryId, page, sort]);

  const getLocationTo = (params: LocationToParams) => {
    const {
      categoryId: newCategoryId = categoryId,
      sort: newSort = DefaultSortOption.value,
      page: newPage = 1,
    } = params;
    return `${RoutePaths.CATEGORY}/${newCategoryId}?sort=${newSort}&page=${newPage}`;
  };

  const handleSortOptionChange = (clickedSort: string) => {
    history.push(getLocationTo({ sort: clickedSort }));
  };

  const handleCategoryChange = (clickedCategoryId: number) => {
    history.push(getLocationTo({ categoryId: clickedCategoryId, sort }));
  };

  const renderBooks = () => {
    if (!isCategoryListFetched || !isValidCategoryId || !isCategoryItemFetched) {
      return <GridBookListSkeleton />;
    }
    if (categoryBooks.length === 0) {
      return <CategoryEmpty />;
    }
    return (
      <>
        <GridBookList
          serviceTitleForTracking="select-book"
          pageTitleForTracking="category"
          uiPartTitleForTracking="book-list"
          miscTracking={JSON.stringify({
            sect_cat_id: categoryId,
            sect_page: page,
          })}
          books={categoryBooks}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          item={{
            el: Link,
            getProps: (pageNum): LinkProps => ({
              to: getLocationTo({ sort, page: pageNum }),
            }),
          }}
        />
      </>
    );
  };

  return (
    <SC.SceneWrapper>
      <HelmetWithTitle titleName={PageTitleText.CATEGORY} />
      <SC.CategoryWrapper>
        <SelectDialog
          dialogTitle="카테고리"
          items={categoryList}
          selectedItem={firstCategory}
          onClickItem={handleCategoryChange}
        />
        <TabList
          tabTitle="2차 카테고리"
          items={secondCategoryList}
          selectedItem={secondCategory}
          onClickItem={handleCategoryChange}
          styles={Styles.tabList}
        />
        <SC.Sort>
          <SelectBox
            selectLabel="도서 정렬"
            selectId="CategoryOrder"
            selectList={SortOptionList}
            value={sort}
            onChangeSelect={handleSortOptionChange}
            styles={Styles.selectBox}
          />
        </SC.Sort>
      </SC.CategoryWrapper>
      {renderBooks()}
    </SC.SceneWrapper>
  );
};

export default Category;
