import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import NewBadge from 'svgs/NewBadge.svg';
import { CAROUSEL_MIN_WIDTH } from 'app/constants';
import { Book } from 'app/services/book';
import { stringifyAuthors } from 'app/utils/utils';
import { SliderControls } from 'app/components/Home/SliderControls';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { CollectionId, ReservedCollectionIds } from 'app/services/collection';
import { ConnectedInlineHorizontalBookList, DTOBookThumbnail } from 'app/components';

interface HomeSpotlightSectionProps {
  books: Book[];
  collectionId: CollectionId;
  title?: string;
}

const HomeSpotlightSection: React.FunctionComponent<HomeSpotlightSectionProps> = props => {
  const sliderRef = React.useRef<Slider>(null);
  const { books, collectionId, title } = props;
  const section = getSectionStringForTracking(
    'select-book',
    'home',
    ReservedCollectionIds.SPOTLIGHT,
  );

  const setSliderImpression = (sliderIdx: number) => {
    const trackingStartIdx = sliderIdx > 0 ? sliderIdx - 1 : 0;
    const trackingEndIdx =
      trackingStartIdx + 5 > books.length ? books.length : trackingStartIdx + 5;
    for (let idx = trackingStartIdx; idx < trackingEndIdx; idx += 1) {
      if (books[idx]) {
        trackImpression({
          section,
          index: idx,
          id: books[idx].id,
          misc: JSON.stringify({ sect_collection_id: collectionId }),
        });
      }
    }
  };
  const dispatch = useDispatch();
  const trackClick = (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackClick({ trackingParams }));
  const trackImpression = (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackImpression({ trackingParams }));

  const isCarousel = useMediaQuery({ minWidth: CAROUSEL_MIN_WIDTH });
  return (
    <div className="HomeSection_Spotlight">
      <div className="HomeSection_Spotlight_Contents">
        <div className="HomeSection_Spotlight_Title">
          {title || '한 주간 별점 베스트'}
          <NewBadge className="HomeSection_Spotlight_NewBadge" />
        </div>
        {isCarousel ? (
          <div className="HomeSection_Spotlight_Slider">
            <Slider
              ref={sliderRef}
              dots
              infinite={books.length > 5}
              adaptiveHeight={false}
              arrows={false}
              speed={200}
              slidesToShow={5}
              slidesToScroll={5}
              dotsClass="Spotlight_Navigator"
              onInit={() => setSliderImpression(0)}
              afterChange={currentIdx => setSliderImpression(currentIdx)}
            >
              {books.map((book: Book, idx: number) => (
                <div
                  className="HomeSection_Spotlight_Book"
                  style={{
                    width: '165px',
                  }}
                  key={`spotlight-book-${idx}`}
                >
                  <DTOBookThumbnail
                    book={book}
                    width={140}
                    linkUrl={`/book/${book.id}`}
                    linkType="Link"
                    onLinkClick={() =>
                      section &&
                      trackClick({
                        section,
                        index: idx,
                        id: book.id,
                      })
                    }
                    imageClassName="InlineHorizontalBookList_Thumbnail"
                    lazyload
                  />
                  <Link
                    to={`/book/${book.id}`}
                    className="HomeSection_Spotlight_Book_Link"
                    onClick={() =>
                      section &&
                      trackClick({
                        section,
                        index: idx,
                        id: book.id,
                      })
                    }
                  >
                    <span className="HomeSection_Spotlight_Book_Title">{book.title.main}</span>
                    <span className="HomeSection_Spotlight_Book_Author">
                      {stringifyAuthors(book.authors, 2)}
                    </span>
                  </Link>
                </div>
              ))}
            </Slider>
            {sliderRef && books.length > 5 && (
              <SliderControls
                onPrevClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.slickPrev();
                  }
                }}
                onNextClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.slickNext();
                  }
                }}
              />
            )}
          </div>
        ) : (
          <ConnectedInlineHorizontalBookList
            books={books}
            serviceTitleForTracking="select-book"
            pageTitleForTracking="home"
            uiPartTitleForTracking="spotlight"
            miscTracking={JSON.stringify({ sect_collection_id: collectionId })}
            renderAuthor
            bookThumbnailSize={140}
          />
        )}
      </div>
    </div>
  );
};

export default HomeSpotlightSection;
