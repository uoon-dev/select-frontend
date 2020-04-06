import { css } from '@emotion/core';

import { customMedia } from 'app/styles/customProperties';
import Colors from 'app/styles/colors';

export const sectionTitle = css`
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  max-width: 100%;
  height: 19px;
  margin: 0;
  padding-right: 13px;
  overflow: hidden;
  color: #000;
  font-size: 16px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media ${customMedia.pcScreen} {
    display: block;
    width: 100%;
    padding-right: 80px;
    font-size: 17px;
  }
`;

export const sectionTitleArrowIcon = css`
  position: absolute;
  top: 4px;
  right: 0;
  width: 6px;
  height: 10px;
  transition: fill 0.2s;
  fill: ${Colors.slategray_60};

  @media ${customMedia.pcScreen} {
    position: relative;
    top: initial;
    right: initial;
    fill: ${Colors.slategray_30};
    margin-left: 7px;
  }
`;

export const sectionTitleLink = css`
  float: right;
  color: ${Colors.slategray_50};
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;

  @media ${customMedia.pcScreen} {
    position: absolute;
    top: 0;
    right: 0;
  }

  @media (hover: hover) {
    &:hover {
      color: ${Colors.slategray_70};
      & .Section_TitleArrowIcon {
        fill: ${Colors.slategray_50};
      }
    }
  }

  @media (hover: none) {
    &:active {
      color: ${Colors.slategray_70};
      & .Section_TitleArrowIcon {
        fill: ${Colors.slategray_50};
      }
    }
  }
`;
