import { css } from '@emotion/core';
import styled from '@emotion/styled';

export enum Orientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

const verticalStyle = css`
  & > .RSGGroup_Element {
    display: block;
    margin: -1px 0 0 0;
    border-radius: 0;
  }
  & > .RSGGroup_Element:first-of-type {
    margin-top: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  & > .RSGGroup_Element:last-of-type {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const horizontalStyle = css`
  white-space: nowrap;
  & > .RSGGroup_Element {
    margin: 0 0 0 -1px;
    border-radius: 0;
  }
  & > .RSGGroup_Element:first-of-type {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  & > .RSGGroup_Element:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const widthWrapperStyle = (component: React.ReactType) => styled(component)`
  position: relative;
  z-index: 1;
  &:not(:disabled):focus,
  &:not(:disabled):active {
    z-index: 2;
  }

  ${(props: { orientation: Orientation }) =>
    props.orientation === Orientation.VERTICAL ? verticalStyle : horizontalStyle}
`;
