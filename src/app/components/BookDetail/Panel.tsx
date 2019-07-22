import { BookDetailSectionPlaceholder } from 'app/services/book/components/BookDetailSectionPlaceholder';
import { Expander } from 'app/services/book/components/Expander';
import { TextTruncate } from 'app/services/book/components/TextTruncate';
import { TextWithLF } from 'app/types';
import * as classNames from 'classnames';
import * as React from 'react';

interface BookDetailPanelWrapperProps {
  className?: string;
  renderCondition?: boolean;
}

export const BookDetailPanelWrapper: React.FunctionComponent<BookDetailPanelWrapperProps> = (props) => {
  const {
    className,
    renderCondition = true,
    children,
  } = props;

  if (!children) {
    return null;
  }

  return renderCondition ? (
    <section
      className={classNames(
        'PageBookDetail_Panel',
        className,
      )}
    >
      {children}
    </section>
  ) : (
    <>
      {children}
    </>
  );
};

interface BookDetailPanelProps {
  title: string;
  imageUrl?: string;
  contents?: TextWithLF;
  isMobile?: boolean;
}

export const BookDetailPanel: React.FunctionComponent<BookDetailPanelProps> = ({ title, contents, isMobile = false, imageUrl }) => {
  return contents ? (
    <BookDetailPanelWrapper>
      <h2 className="PageBookDetail_PanelTitle">{title}</h2>
      <div className="PageBookDetail_PanelContent">
        <TextTruncate
          lines={9}
          text={`${imageUrl ? `<img src="${imageUrl}" /><br /><br />` : ''}${contents}`}
          lineHeight={isMobile ? 23 : 25}
          renderExpander={(({ expand, isExpanded, isTruncated }) => !isTruncated || isExpanded ? null : (
            <div className="BookDetail_ContentTruncWrapper">
              <Expander
                onClick={expand}
                text="계속 읽기"
                isExpanded={false}
              />
            </div>
          ))}
        />
      </div>
    </BookDetailPanelWrapper>
  ) : <BookDetailSectionPlaceholder />;
};
