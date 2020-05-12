import * as React from 'react';

import {
  RSGEmpty,
  EmptyTitle,
  EmptryDescription,
  EmptyInlineLink,
  EmptyLinkArrowIcon,
  withIconStyle,
  EmptyIconType,
} from './components';

export interface EmptyProps {
  title?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  className?: string;
  svgIcon?: EmptyIconType;
  onLinkClick?: (e: React.SyntheticEvent<any>) => void;
}

export const Empty: React.FunctionComponent<EmptyProps> = props => {
  const { title, description, linkText, linkUrl, onLinkClick, className, svgIcon } = props;
  const shouldDisplayLink = !!linkText && !!linkUrl;
  const renderEmptyIcon = () => (svgIcon ? withIconStyle(svgIcon) : null);
  return (
    <RSGEmpty className={className}>
      {svgIcon && renderEmptyIcon()}
      {title && <EmptyTitle>{title}</EmptyTitle>}
      {description && (
        <EmptryDescription>
          {description}
          {shouldDisplayLink && (
            <>
              <br />
              <EmptyInlineLink onClick={onLinkClick} href={linkUrl}>
                {linkText} <EmptyLinkArrowIcon className="linkArrowIcon" />
              </EmptyInlineLink>
            </>
          )}
        </EmptryDescription>
      )}
    </RSGEmpty>
  );
};
