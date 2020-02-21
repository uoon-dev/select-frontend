import React from 'react';

import { Book } from 'app/services/book';
import { Omit } from 'app/types';
import { CoverSize } from 'app/constants';
import getResponsiveCoverImageSrc from 'app/utils/getResponsiveCoverImageSrc';

import { BookThumbnail, BookThumbnailProps } from './BookThumbnail';

export interface DTOBookThumbnailProps
  extends Omit<BookThumbnailProps, 'bookTitle' | 'imageUrl' | 'coverImageSrc'> {
  book: Book;
  coverSize?: CoverSize;
}

export const DTOBookThumbnail: React.SFC<DTOBookThumbnailProps> = props => {
  const { book, coverSize = CoverSize.SIZE_120, ...restProps } = props;
  const coverImageUrl = book.thumbnail.large ? book.thumbnail.large.split('/large')[0] : '';
  const coverImageSrc = getResponsiveCoverImageSrc(coverImageUrl, coverSize);

  return <BookThumbnail coverImageSrc={coverImageSrc} bookTitle={book.title.main} {...restProps} />;
};
