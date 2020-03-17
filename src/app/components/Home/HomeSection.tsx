import React from 'react';
import { useSelector } from 'react-redux';

import { ConnectedInlineHorizontalBookList } from 'app/components/InlineHorizontalBookList';
import { FetchStatusFlag } from 'app/constants';

import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import { Book } from 'app/services/book';
import {
  DefaultCollectionState,
  SpotlightCollectionState,
  CollectionType,
} from 'app/services/collection';
import { getIsMobile } from 'app/services/commonUI/selectors';
import { RidiSelectState } from 'app/store';
import { collectionToPath } from 'app/utils/toPath';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import HomeSpotlightSection from 'app/components/Home/HomeSpotlightSection';
import { HomeChartBooksSection } from 'app/components/Home/HomeChartBooksSection';

interface HomeSectionProps {
  collection: DefaultCollectionState | SpotlightCollectionState;
  onScreen: boolean;
  order?: number;
}

interface SectionHeaderProps {
  title: string;
  link: string;
  isMobile: boolean;
}

const HomeSection: React.FunctionComponent<HomeSectionProps> = props => {
  const isMobile = useSelector(getIsMobile);
  const books = useSelector((state: RidiSelectState) => state.booksById);
  const { collection, onScreen, order } = props;
  const { type, title, id, itemListByPage } = collection;
  const collectionBooks: Book[] = itemListByPage[1]?.itemList?.map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (bookId: number) => books[bookId]?.book!,
  );

  if (
    !itemListByPage[1] ||
    (itemListByPage[1].fetchStatus === FetchStatusFlag.IDLE &&
      itemListByPage[1].itemList.length < 1) ||
    itemListByPage[1].fetchStatus === FetchStatusFlag.FETCH_ERROR
  ) {
    return null;
  }

  if (!onScreen || itemListByPage[1].fetchStatus === FetchStatusFlag.FETCHING) {
    return <HomeSectionPlaceholder type={collection.type} key={`${collection.id}_skeleton`} />;
  }

  if (type === CollectionType.SPOTLIGHT) {
    return (
      <HomeSpotlightSection books={collectionBooks} title={title} collectionId={collection.id} />
    );
  }

  if (type === CollectionType.CHART) {
    return (
      <HomeChartBooksSection
        books={collectionBooks}
        title={title}
        collectionId={id}
        order={order}
      />
    );
  }

  return (
    <section className="HomeSection">
      <SectionHeader title={title || ''} link={collectionToPath({ collectionId: id })} />
      <ConnectedInlineHorizontalBookList
        books={collectionBooks}
        serviceTitleForTracking="select-book"
        pageTitleForTracking="home"
        uiPartTitleForTracking="collection-list"
        miscTracking={JSON.stringify({ sect_collection_id: id, sect_order: order })}
        bookThumbnailSize={isMobile ? 110 : 120}
      />
    </section>
  );
};

export default HomeSection;
