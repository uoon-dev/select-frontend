import { EnvironmentState } from 'app/services/environment';
import { sendPostRobotOpenBrowser } from 'app/utils/inAppMessageEvents';
import { isRidiselectUrl } from 'app/utils/regexHelper';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface BigBannerItemProps {
  onClick: () => {};
  linkUrl: string;
  isInApp: boolean;
}

export const BigBannerItem: React.SFC<BigBannerItemProps> = (props) => {
  const { onClick, linkUrl, isInApp, children } = props;
  const compProps = {
    className: 'BigBanner_Item',
    onClick,
    children,
  };
  if (isRidiselectUrl(linkUrl)) {
    const linkProps = { ...compProps, to: linkUrl };
    return <Link {...linkProps}/>;
  }
  if (isInApp) {
    const buttonProps = { ... compProps, onClick: () => {
      sendPostRobotOpenBrowser(linkUrl);
      onClick();
    }};
    return <button {...buttonProps} />;
  }
  const anchorProps = { ...compProps, href: linkUrl };
  return <a {...anchorProps}/>;
};
