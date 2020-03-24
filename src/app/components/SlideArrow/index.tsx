import React from 'react';
import { useSelector } from 'react-redux';

import * as styles from 'app/components/SlideArrow/styles';
import { getIsCarousel } from 'app/services/commonUI/selectors';

interface ArrowProps {
  side?: 'left' | 'right';
  renderGradient?: boolean;
  label: string;
  isHidden?: boolean;
  onClickHandler: (e: React.FormEvent) => void;
}

const ArrowV = (props: any) => (
  <svg width={11} height={14} {...props}>
    <path d="M1.78 13.013L7.68 7 1.78.987 2.75 0l6.875 7-6.875 7z" />
  </svg>
);

const SlideArrow: React.FunctionComponent<ArrowProps> = props => {
  const { side, onClickHandler, renderGradient, isHidden } = props;
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    onClickHandler(e);
  };

  const isButtonVisible = useSelector(getIsCarousel);
  return isHidden ? null : (
    <>
      {renderGradient && (
        <div
          className={isHidden ? 'hidden' : ''}
          css={side === 'left' ? styles.ArrowButtonGradient_Left : styles.ArrowButtonGradient_Right}
        />
      )}
      {isButtonVisible && !isHidden && (
        <button
          type="button"
          className="SlideArrowButton"
          onClick={handleClick}
          css={side === 'left' ? styles.SlideArrowButton_Left : styles.SlideArrowButton_Right}
        >
          <ArrowV
            css={
              side === 'left' ? styles.SlideArrowButtonIcon_Left : styles.SlideArrowButtonIcon_Right
            }
          />
          <span className="a11y">{props.label}</span>
        </button>
      )}
    </>
  );
};

export default React.memo(SlideArrow);
