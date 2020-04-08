import { css, keyframes } from '@emotion/core';

import { resetLayout } from './customProperties';
import Media from './mediaQuery';

const skeletonSlider = keyframes`
  0% {
    left: -20%;
    width: 60px;
  }
  60% {
    width: 300px;
  }
  100% {
    left: 120%;
    width: 60px;
  }
`;

export const skeleton = css`
  ${resetLayout}
  background: #f1f1f3;
`;

export const skeletonWrapper = css`
  position: relative;
  min-height: 450px;
  overflow: hidden;

  @media ${Media.PC} {
    min-height: 900px;
  }

  &::before {
    animation-delay: 0.3s;
  }
  &::before,
  &::after {
    display: block;
    position: absolute;
    top: -10%;
    left: 0;
    width: 60px;
    height: 120%;
    transform: rotate(15deg);
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation-name: ${skeletonSlider};
    animation-duration: 1.2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    content: '';
    opacity: 0.2;
    z-index: 100;
  }
`;

export const skeletonBigBanner = css`
  display: block;
  width: 100%;
  height: 100px;
`;

export const skeletonBookComponent = css`
  width: 100px;
  height: 300px;
  margin: 10px;
`;
