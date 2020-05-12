import classNames from 'classnames';
import * as React from 'react';

import { Button, RSGButtonColor, RSGButtonSize } from 'app/components/RSG';
import CloseIcon from 'svgs/CloseWidthNormal.svg';
import Exclamation from 'svgs/ExclamationCircleFill.svg';

import {
  RSGPopup,
  RSGPopupDimmedBG,
  RSGPopupContents,
  RSGPopupHeader,
  RSGPopupHeaderNav,
  RSGPopupTitle,
  RSGPopupCloseButton,
  RSGPopupAlert,
  RSGPopupHeaderTabList,
  RSGPopupHeaderTab,
  RSGPopupHeaderTabButton,
  RSGPopupBody,
  RSGPopupParagraph,
  RSGPopupFooter,
  RSGPopupHr,
  RSGPopupButtonList,
  RSGPopupButtonItem,
} from './components';

export interface PopupProps {
  title: string;
  active: boolean;
  caution?: React.ReactType;
  tabs?: Array<{
    name: string;
    content: React.ReactElement<any>;
  }>;
  activeTabIndex?: number;
  onTabClick?: (index: number) => void;
  useButtons?: boolean;
  showFooterHr?: boolean;
  cancelButtonName?: string;
  onCancel: () => void;
  confirmButtonName?: string;
  onConfirm?: () => void;
  bodyHeight?: number;
  isSubmitting?: boolean;
  wrapperClassName?: string;
  contentClassName?: string;
}

const noop = (): any => null;

export const Popup: React.FunctionComponent<PopupProps> = props => {
  const {
    title,
    active,
    children,
    caution,
    activeTabIndex = 0,
    tabs = [],
    onTabClick = noop,
    useButtons = false,
    showFooterHr = true,
    cancelButtonName,
    onCancel = noop,
    confirmButtonName,
    onConfirm = noop,
    bodyHeight,
    isSubmitting,
    wrapperClassName,
    contentClassName,
  } = props;

  const renderContentsHeader = () => (
    <RSGPopupHeader>
      <RSGPopupHeaderNav>
        <RSGPopupTitle>{title}</RSGPopupTitle>
        <RSGPopupCloseButton type="button" onClick={onCancel}>
          <CloseIcon className="RSGPopupCloseIcon" />
          <span className="a11y">닫기</span>
        </RSGPopupCloseButton>
      </RSGPopupHeaderNav>
      {caution && (
        <RSGPopupAlert>
          <Exclamation className="RSGPopupAlertIcon" />
          {caution}
        </RSGPopupAlert>
      )}
      {tabs && tabs.length > 0 && (
        <RSGPopupHeaderTabList>
          {tabs.map((tab, idx) => (
            <RSGPopupHeaderTab key={`tabList_${idx}`} onClick={() => onTabClick(idx)}>
              <RSGPopupHeaderTabButton className={idx === activeTabIndex ? 'active' : ''}>
                {tab.name}
              </RSGPopupHeaderTabButton>
            </RSGPopupHeaderTab>
          ))}
        </RSGPopupHeaderTabList>
      )}
    </RSGPopupHeader>
  );

  const renderContentsBody = () => (
    <RSGPopupBody style={{ height: Number(bodyHeight) ? `${bodyHeight}px` : 'auto' }}>
      {tabs.length > 0 ? (
        tabs[activeTabIndex].content
      ) : (
        <RSGPopupParagraph>{children}</RSGPopupParagraph>
      )}
    </RSGPopupBody>
  );

  const renderButtons = () => (
    <RSGPopupFooter>
      {showFooterHr && <RSGPopupHr />}
      <RSGPopupButtonList>
        {cancelButtonName && (
          <RSGPopupButtonItem>
            <Button
              className="RSGPopupButton"
              type="button"
              color={RSGButtonColor.GRAY}
              size={RSGButtonSize.MEDIUM}
              onClick={onCancel}
              outline
            >
              {cancelButtonName}
            </Button>
          </RSGPopupButtonItem>
        )}
        {confirmButtonName && (
          <RSGPopupButtonItem>
            <Button
              className="RSGPopupButton"
              type="button"
              color={RSGButtonColor.BLUE}
              size={RSGButtonSize.MEDIUM}
              disabled={isSubmitting}
              spinner={isSubmitting}
              onClick={onConfirm}
            >
              {confirmButtonName}
            </Button>
          </RSGPopupButtonItem>
        )}
      </RSGPopupButtonList>
    </RSGPopupFooter>
  );
  return (
    <RSGPopup className={`${wrapperClassName} ${active ? 'active' : ''}`}>
      <RSGPopupDimmedBG onClick={onCancel} />
      <RSGPopupContents className={classNames(['RUIPopup_Contents', contentClassName])}>
        {renderContentsHeader()}
        {renderContentsBody()}
        {useButtons && renderButtons()}
      </RSGPopupContents>
    </RSGPopup>
  );
};
