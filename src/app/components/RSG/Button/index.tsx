import { SerializedStyles } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

import * as buttonStyles from './styles';

export enum RSGButtonColor {
  GRAY = 'gray',
  BLUE = 'blue',
  BROWN = 'brown',
}

export enum RSGButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export interface ButtonProps {
  color?: RSGButtonColor;
  size?: RSGButtonSize;
  outline?: boolean;
  thickBorderWidth?: boolean;
  noneBorder?: boolean;
  disabled?: boolean;
  spinner?: boolean;
  component?: React.ReactType;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.SyntheticEvent<any>) => void;
  styles?: SerializedStyles;
  [extraKey: string]: any;
}

export const Button: React.FunctionComponent<ButtonProps> = props => {
  const {
    color = 'gray',
    size = 'medium',
    outline,
    thickBorderWidth,
    noneBorder,
    spinner,
    disabled,
    component,
    className,
    children,
    onClick,
    styles,
    ...extraProps
  } = props;

  const Wrapper = component || 'button';

  return (
    <Wrapper
      css={[
        buttonStyles.common,
        size && buttonStyles[size],
        outline && buttonStyles.outline,
        spinner && buttonStyles.spinner,
        noneBorder && buttonStyles.noneBorder,
        thickBorderWidth && buttonStyles.thickBorder,
        styles,
      ]}
      className={classNames([color, className])}
      disabled={disabled}
      onClick={onClick}
      {...extraProps}
    >
      {children}
    </Wrapper>
  );
};
