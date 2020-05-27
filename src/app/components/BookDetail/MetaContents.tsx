import { Button, Icon } from '@ridi/rsg';
import styled from '@emotion/styled';
import classNames from 'classnames';
import some from 'lodash-es/some';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ConnectedBookDetailDownloadButton } from 'app/components/BookDetail/DownloadButton';
import { BookAuthor, BookTitle, formatFileCount, formatFileSize } from 'app/services/book';
import { BookDetailResponse } from 'app/services/book/requests';
import { GNBColorLevel } from 'app/services/commonUI';
import { StarRating } from 'app/services/review';
import { RidiSelectState } from 'app/store';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { stringifyAuthors } from 'app/utils/utils';
import { RoutePaths } from 'app/constants';
import Colors from 'app/styles/colors';
import ArrowRightIcon from 'svgs/ArrowNoneDashRight.svg';
import Media from 'app/styles/mediaQuery';

interface BookDetailMetaContentsPorps {
  bookId: number;
  isMobile?: boolean;
}

interface BookDetailMetaContentsStatePorps {
  title?: BookTitle;
  bookDetail?: BookDetailResponse;
  gnbColorLevel: GNBColorLevel;
  hasAvailableTicket: boolean;
}

type Props = BookDetailMetaContentsStatePorps & BookDetailMetaContentsPorps;

const SC = {
  CategoryLink: styled(Link)`
    text-decoration: none;
    font-weight: 400;
    font-size: inherit;
    color: ${Colors.slategray_60};
    @media ${Media.PC} {
      color: inherit;
    }
  `,
  CategoryDepthIcon: styled(ArrowRightIcon)`
    margin: 0 4px;
    width: 5px;
    height: 8px;
    fill: ${Colors.slategray_40};
    @media ${Media.PC} {
      fill: inherit;
    }
  `,
};

const BookDetailMetaContents: React.FunctionComponent<Props> = props => {
  const { title, bookId, isMobile = false, bookDetail, gnbColorLevel, hasAvailableTicket } = props;

  const [isAuthorsExpanded, setAuthorExpanded] = React.useState(false);

  const {
    file,
    publisher,
    reviewSummary,
    categories,
    authors,
    previewAvailable,
    hasPreview,
    previewBId,
  } = bookDetail || {};

  const hasMoreAuthors = some(authors, (people: BookAuthor[]) => people && people.length > 2);

  return (
    <div className="PageBookDetail_Meta">
      <ul className="PageBookDetail_Categories">
        {categories &&
          categories.map((categoryGroup, key) => (
            <li className="PageBookDetail_CategoryItem" key={key}>
              {categoryGroup.map((category, idx) => (
                <span key={`${category.name}${idx}`}>
                  <SC.CategoryLink to={`${RoutePaths.CATEGORY}/${category.id}`}>
                    {category.name}
                  </SC.CategoryLink>
                  {idx !== categoryGroup.length - 1 && <SC.CategoryDepthIcon />}
                </span>
              ))}
            </li>
          ))}
      </ul>
      <h1 className="PageBookDetail_BookTitle">{title ? title.main : ''}</h1>
      <p className="PageBookDetail_BookElements">
        {authors && (
          <span className="PageBookDetail_Authors">
            {isAuthorsExpanded || !hasMoreAuthors ? (
              stringifyAuthors(authors)
            ) : (
              <button
                className="PageBookDetail_ExpandAuthors_Button"
                onClick={() => setAuthorExpanded(true)}
              >
                {stringifyAuthors(authors, 2)}
                <Icon name="arrow_1_down" className="PageBookDetail_ExpandAuthors_Button_Icon" />
              </button>
            )}
          </span>
        )}
        {publisher && (
          <span className="PageBookDetail_Publisher">{` · ${publisher.name} 출판`}</span>
        )}
        {file && file.format && file.format !== 'bom' && (
          <span className="PageBookDetail_FileType">{`${file.format.toUpperCase()}`}</span>
        )}
        {file && file.size && (
          <span
            className={classNames(
              'PageBookDetail_FileSize',
              file.format && file.format === 'bom' && 'PageBookDetail_FileSize-noFileType',
            )}
          >
            {file.format && file.format !== 'bom' && ' · '}
            {formatFileSize(file.size)}
          </span>
        )}
        {file && file.format && file.format !== 'bom' && (
          <span className={classNames('PageBookDetail_FileCount')}>
            {file.format === 'pdf' && file.pageCount && ` · ${file.pageCount}쪽`}
            {file.format === 'epub' &&
              file.characterCount &&
              ` · ${formatFileCount(file.characterCount)}`}
          </span>
        )}
      </p>
      <p className="PageBookDetail_RatingSummary">
        {reviewSummary && (
          <>
            <StarRating
              rating={reviewSummary.buyerRatingAverage}
              width={74}
              darkBackground={!isMobile && gnbColorLevel !== GNBColorLevel.BRIGHT}
            />
            <span className="PageBookDetail_RatingSummaryAverage">
              {`${reviewSummary.buyerRatingAverage}점`}
            </span>
            <span className="PageBookDetail_RatingSummaryCount">
              {`(${thousandsSeperator(reviewSummary.buyerRatingCount)}명)`}
            </span>
          </>
        )}
      </p>
      <div className="PageBookDetail_DownloadWrapper">
        {hasAvailableTicket && previewAvailable && hasPreview && (
          <Button
            color={isMobile ? 'blue' : undefined}
            outline
            size="large"
            className="PageBookDetail_PreviewButton"
            component="a"
            href={`https://preview.ridibooks.com/books/${previewBId}?s=ridi_select`}
          >
            <Icon name="book_1" />
            <span className="PageBookDetail_PreviewButtonLabel">미리보기</span>
          </Button>
        )}
        <ConnectedBookDetailDownloadButton bookId={bookId} />
      </div>
    </div>
  );
};

const mapStateToProps = (
  state: RidiSelectState,
  ownProps: BookDetailMetaContentsPorps,
): BookDetailMetaContentsStatePorps => {
  const { bookId } = ownProps;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const book = stateExists ? bookState.book : undefined;
  const bookDetail = stateExists ? bookState.bookDetail : undefined;

  return {
    bookDetail,
    hasAvailableTicket: state.user.hasAvailableTicket,
    gnbColorLevel: state.commonUI.gnbColorLevel,

    // Data that can be pre-fetched in home
    title: bookDetail ? bookDetail.title : book ? book.title : undefined,
  };
};

export const ConnectedBookDetailMetaContents = connect(
  mapStateToProps,
  null,
)(BookDetailMetaContents);
