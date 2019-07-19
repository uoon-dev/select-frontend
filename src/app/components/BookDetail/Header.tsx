import * as React from 'react';
import { connect } from 'react-redux';

import { BookDetailResponse } from 'app/services/book/requests';
import { GNBColorLevel } from 'app/services/commonUI';
import {
  getBackgroundColorGradientToLeft,
  getBackgroundColorGradientToRight,
  getSolidBackgroundColorRGBString,
  getTransparentBackgroundColorRGBString,
} from 'app/services/commonUI/selectors';
import { RidiSelectState } from 'app/store';

interface BookDetailHeaderPorps {
  bookId: number;
  isMobile: boolean;
  children?: React.ReactNode;
}

interface BookDetailHeaderStatePorps {
  bookDetail?: BookDetailResponse;

  gnbColorLevel: GNBColorLevel;
  solidBackgroundColorRGBString: string;
  backgroundColorGradientToLeft: string;
  backgroundColorGradientToRight: string;
  transparentBackgroundColorRGBString: string;
}

const BookDetailHeader: React.FunctionComponent<BookDetailHeaderStatePorps & BookDetailHeaderPorps> = (props) => {
  const {
    bookDetail,
    gnbColorLevel,
    solidBackgroundColorRGBString,
    backgroundColorGradientToLeft,
    backgroundColorGradientToRight,
    transparentBackgroundColorRGBString,
    children,
  } = props;

  if (bookDetail === undefined) {
    return null;
  }

  const { thumbnail, title } = bookDetail;

  return (
    <div
      className={`PageBookDetail_Header PageBookDetail_Header-${gnbColorLevel}`}
      style={{ background: solidBackgroundColorRGBString }}
    >
      <span
        className="PageBookDetail_HeaderBackground"
        style={{
          backgroundImage: `url(${
            thumbnail ? `${thumbnail.xxlarge}?dpi=xxhdpi` : ''
          })`,
        }}
      >
        <span
          className="Left_GradientOverlay"
          style={{ background: backgroundColorGradientToRight }}
        />
        <span
          className="Right_GradientOverlay"
          style={{ background: backgroundColorGradientToLeft }}
        />
      </span>
      <div
        className="PageBookDetail_HeaderMask"
        style={{ backgroundColor: transparentBackgroundColorRGBString }}
      >
        <div className="PageBookDetail_HeaderContent">
          <div className="PageBookDetail_ThumbnailWrapper">
            <button
              className="PageBookDetail_ThumbnailButton"
              onClick={() => this.setState({ thumbnailExapnded: true })}
            >
              {thumbnail && (
                <img
                  className="PageBookDetail_Thumbnail"
                  src={`${thumbnail.xxlarge}?dpi=xxhdpi`}
                  alt={title!.main}
                />
              )}
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailHeaderPorps): BookDetailHeaderStatePorps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const bookDetail = stateExists ? bookState.bookDetail : undefined;

  return {
    bookDetail,
    gnbColorLevel: state.commonUI.gnbColorLevel,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    transparentBackgroundColorRGBString: getTransparentBackgroundColorRGBString(
      state,
    ),
    backgroundColorGradientToLeft: getBackgroundColorGradientToLeft(state),
    backgroundColorGradientToRight: getBackgroundColorGradientToRight(state),
  };
};

export const ConnectedBookDetailHeader = connect(mapStateToProps, null)(BookDetailHeader);
