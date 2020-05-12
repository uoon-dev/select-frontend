import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { resetAppearance, resetLayout, resetFontUnlimited } from 'app/styles/customProperties';

const InputSize = 1.38;

const inputLabelCommon = css`
  ${resetAppearance}
  display: inline-block;
  position: relative;
  padding-left: ${InputSize + 0.6}em;
  color: ${Colors.slategray_60};
  font-size: 13px;
  font-weight: 400;
  line-height: ${InputSize}em;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: color 0.2s;
`;

const iconWrapper = css`
  box-sizing: border-box;
  display: block;
  position: absolute;
  top: -0.1em;
  left: 0;
  width: ${InputSize}em;
  height: ${InputSize}em;
  border: 1px solid ${Colors.slategray_20};
  background: white;
  content: '';
  transition: border-color 0.2s;
`;

export const checkboxWrapper = css`
  ${resetAppearance}
  ${resetLayout}
  ${resetFontUnlimited}
`;

export const inputLabel = css`
  vertical-align: top;
  ${inputLabelCommon};
  .RSGCheckBox .CheckBoxInput:checked + & {
    color: ${Colors.slategray_90};
  }
  .RSGCheckBox .CheckBoxInput:disabled + & {
    color: ${Colors.slategray_20};
    cursor: default;
  }
  .RSGCheckBox .CheckBoxInput:focus + &,
  .RSGCheckBox .CheckBoxInput:hover + & {
    &::before {
      border-color: ${Colors.dodgerblue_50};
    }
  }
  .RSGCheckBox .CheckBoxInput:focus + & {
    &::before {
      border-color: ${Colors.dodgerblue_50};
    }
  }
  .RSGCheckBox .CheckBoxInput:checked + & {
    &::before {
      border-color: ${Colors.dodgerblue_60};
      background: ${Colors.dodgerblue_50};
    }
  }
  .RSGCheckBox .CheckBoxInput:disabled + & {
    &::before {
      border-color: ${Colors.slategray_20};
      background: ${Colors.slategray_5};
      color: ${Colors.slategray_20};
    }
  }
  &::before {
    border-radius: 3px;
    ${iconWrapper};
  }
`;

export const checkIcon = css`
  display: block;
  width: 0.77em;
  height: 0.77em;
  fill: white;
  position: absolute;
  top: ${InputSize / 2 - 0.1}em;
  left: ${InputSize / 2}em;
  transform: translate(-50%, -50%);
  visibility: hidden;

  .RSGCheckBox .CheckBoxInput:checked + .RSGCheckBox_Label & {
    visibility: visible;
  }
  .RSGCheckBox .CheckBoxInput:disabled + .RSGCheckBox_Label & {
    visibility: visible;
    fill: ${Colors.slategray_20};
  }
`;
