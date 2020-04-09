import classNames from 'classnames';
import * as React from 'react';

import { Orientation, widthWrapperStyle } from './components';

export interface GroupProps {
  className?: string;
  orientation?: Orientation;
  component?: React.ReactType;
}

export const Group: React.FunctionComponent<GroupProps> = props => {
  const { className, orientation = Orientation.VERTICAL, component } = props;

  const Wrapper = widthWrapperStyle(component || 'div');

  const children = React.Children.map(
    props.children,
    (child: React.ReactElement<{ className: string }>) =>
      React.isValidElement(child) && typeof child.type !== 'string'
        ? React.cloneElement(child, {
            className: classNames(child.props.className, 'RSGGroup_Element'),
          })
        : child,
  );

  return (
    <Wrapper className={className} orientation={orientation}>
      {children}
    </Wrapper>
  );
};
