import styled from '@emotion/styled';

import Colors from 'app/styles/colors';
import { resetLayout, resetFontUnlimited, resetAppearance } from 'app/styles/customProperties';

export const RSGPopup = styled.div`
  z-index: 99999;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  height: 0;
  &.active {
    height: auto;
  }
`;

export const RSGPopupDimmedBG = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: ${Colors.bluegray_100} left top repeat;
  transition: opacity 0.3s;
  opacity: 0;

  .active & {
    opacity: 0.3;
  }
`;

export const RSGPopupContents = styled.div`
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  width: 300px;
  margin-left: -153px;
  border: 3px solid black;
  background: black;
  border-radius: 5px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.4s, opacity 0.4s;
  opacity: 0;

  .active & {
    transform: translateY(-50%);
    opacity: 1;
  }
`;

export const RSGPopupHeader = styled.div`
  background: ${Colors.slategray_80};
`;

export const RSGPopupHeaderNav = styled.div`
  position: relative;
  height: 34px;
  padding: 0 10px;
  border-radius: 3px 3px 0 0;
`;

export const RSGPopupTitle = styled.h3`
  ${resetLayout}
  ${resetFontUnlimited}
  padding: 9px 0 10px 0;
  color: ${Colors.slategray_20};
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
`;

export const RSGPopupCloseButton = styled.button`
  ${resetLayout}
  ${resetAppearance}
  position: absolute;
  right: 0;
  top: 0;
  width: 33px;
  height: 33px;
  padding: 10px 8px 11px 13px;
  background: none;
  cursor: pointer;

  .RSGPopupCloseIcon {
    fill: ${Colors.slategray_30};
    width: 12px;
    height: 12px;
    display: block;
    transition: filter 0.2s;
  }

  &:hover .RSGPopupCloseIcon {
    filter: hue-rotate(2deg) saturate(56%) brightness(119%);
  }
`;

export const RSGPopupAlert = styled.div`
  ${resetLayout}
  position: relative;
  padding: 12px 12px 12px 30px;
  background: ${Colors.brown_5};
  font-size: 12px;
  color: ${Colors.brown_70};
  border-bottom: 1px solid ${Colors.brown_10};

  .RSGPopupAlertIcon {
    position: absolute;
    top: 11px;
    left: 10px;
    width: 13px;
    height: 13px;
    margin-right: 2px;
    vertical-align: -13%;
    fill: ${Colors.brown_70};
  }
`;

export const RSGPopupHeaderTabList = styled.ul`
  ${resetLayout}
  list-style: none;
  border-top: 1px solid ${Colors.slategray_20};
`;

export const RSGPopupHeaderTab = styled.li`
  ${resetLayout}
  width: 50%;
  display: inline-block;

  &:last-of-type {
    border-left: 1px solid ${Colors.slategray_20};
    margin-left: -1px;
  }
`;

export const RSGPopupHeaderTabButton = styled.button`
  ${resetLayout}
  ${resetAppearance}
  ${resetFontUnlimited}
  width: 100%;
  text-align: center;
  height: 34px;
  line-height: 34px;
  font-size: 12px;
  color: ${Colors.slategray_50};
  font-weight: normal;
  background: ${Colors.lightsteelblue_5};
  border-bottom: 1px solid ${Colors.slategray_20};
  .count {
    color: ${Colors.slategray_50};
  }
  &.active {
    color: black;
    background: white;
    border-bottom: 1px solid ${Colors.slategray_5};
    .count {
      color: ${Colors.slategray_60};
    }
  }
`;

export const RSGPopupBody = styled.div`
  background: white;
  overflow-y: auto;
`;

export const RSGPopupParagraph = styled.div`
  ${resetFontUnlimited}
  ${resetLayout}
  font-size: 13px;
`;

export const RSGPopupFooter = styled.div`
  background: white;
  border-radius: 0 0 3px 3px;
`;

export const RSGPopupHr = styled.hr`
  display: block;
  margin: 0 10px;
  border-style: solid;
  border-color: ${Colors.slategray_20};
  border-width: 1px 0 0 0;
`;

export const RSGPopupButtonList = styled.ul`
  ${resetLayout}
  list-style: none;
  text-align: center;
  padding: 8px 10px;
`;

export const RSGPopupButtonItem = styled.li`
  ${resetLayout}
  display: inline-block;
  padding: 0 2px;
  & .RSGPopupButton {
    width: 100px;
    height: 40px;
    padding-left: 0;
    padding-right: 0;
  }
`;
