import * as classNames from 'classnames';
import * as React from 'react';

interface BookDetailPanelProps {
  className?: string;
  renderCondition?: boolean;
}

export const BookDetailPanel: React.FunctionComponent<BookDetailPanelProps> = (props) => {
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
