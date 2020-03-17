import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Book } from 'app/services/book';
import { CoverSizes } from 'app/constants';
import { StarRating } from 'app/services/review';
import { DTOBookThumbnail } from 'app/components';
import { groupChartBooks } from 'app/services/home/uitls';
import { getIsMobile } from 'app/services/commonUI/selectors';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { CollectionId, ReservedCollectionIds } from 'app/services/collection';

interface HomeChartBooksSectionProps {
  books: Book[];
  title?: string;
  collectionId: CollectionId;
  order?: number;
}

export const HomeChartBooksSection: React.FunctionComponent<HomeChartBooksSectionProps> = props => {
  const { books, order, title } = props;
  const isMobile = useSelector(getIsMobile);
  const dispatch = useDispatch();

  const trackClick = (trackingParams: DefaultTrackingParams) => {
    dispatch(Actions.trackClick({ trackingParams }));
  };

  const renderCharts = () => {
    const contentsCount = isMobile ? 24 : 12;
    const section = getSectionStringForTracking(
      'select-book',
      'home',
      ReservedCollectionIds.POPULAR,
    );
    return (
      <div className="HomeSection_Chart">
        {books
          .slice(0, contentsCount)
          .reduce(groupChartBooks(4), [])
          .map((groupedBooks, groupIdx) => (
            <ol className="HomeSection_ChartGroup" start={groupIdx * 4 + 1} key={groupIdx}>
              {groupedBooks.map((book, idxInGroup) => {
                const index = groupIdx * 4 + idxInGroup;
                return (
                  <li className="HomeSection_ChartBook" key={String(groupIdx) + idxInGroup}>
                    <ConnectedTrackImpression
                      section={section}
                      index={index}
                      id={book.id}
                      misc={order ? JSON.stringify({ sect_order: order }) : undefined}
                    >
                      <span className="HomeSection_ChartBookRanking">{index + 1}</span>
                      <DTOBookThumbnail
                        book={book}
                        width={50}
                        coverSize={CoverSizes.SIZE_50}
                        linkUrl={`/book/${book.id}`}
                        linkType="Link"
                        onLinkClick={() =>
                          trackClick({
                            section,
                            index,
                            id: book.id,
                          })
                        }
                        imageClassName="HomeSection_ChartBookThumbnail"
                        linkWrapperClassName="HomeSection_BookLink"
                      />
                      <Link
                        to={`/book/${book.id}`}
                        className="HomeSection_BookLink"
                        onClick={() =>
                          trackClick({
                            section,
                            index,
                            id: book.id,
                          })
                        }
                      >
                        <div className="HomeSection_ChartBookMeta">
                          <span className="HomeSection_ChartBookTitle">{book.title.main}</span>
                          {book.reviewSummary ? (
                            <span className="HomeSection_ChartBookRating">
                              <StarRating rating={book.reviewSummary.buyerRatingAverage} />
                              <span className="HomeSection_ChartBookRatingCount">
                                {thousandsSeperator(book.reviewSummary.buyerRatingCount)}
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    </ConnectedTrackImpression>
                  </li>
                );
              })}
            </ol>
          ))}
      </div>
    );
  };

  return (
    <div className="HomeSection HomeSection-horizontal-pad">
      <SectionHeader title={title || '인기 도서'} link="/charts" isMobile={isMobile} />
      {renderCharts()}
    </div>
  );
};
