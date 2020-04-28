import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

import ProfileIcon from 'svgs/People.svg';
import DocumentIcon from 'svgs/Document.svg';
import Colors from 'app/styles/colors';

export interface ArticleEmptyProps {
  iconName: string;
  description: string;
  renderButton?: () => JSX.Element;
}

const iconDefaultStyle = css`
  margin: 0 auto;
  display: block;
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  fill: ${Colors.slategray_10};
`;

const SC = {
  Empty: styled.div`
    margin: 116px 0;
    padding: 20px 0;
  `,
  ProfileIcon: styled(ProfileIcon)`
    ${iconDefaultStyle}
    padding: 4px;
    border-radius: 999px;
  `,
  DocumentIcon: styled(DocumentIcon)`
    ${iconDefaultStyle}
    padding: 12.5px 10px;
  `,
  Description: styled.p`
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: ${Colors.slategray_60};
  `,
};

export const ArticleEmpty: React.FunctionComponent<ArticleEmptyProps> = props => {
  const { iconName, description, renderButton } = props;

  return (
    <SC.Empty>
      {iconName === 'profile' && <SC.ProfileIcon />}
      {iconName === 'document' && <SC.DocumentIcon />}
      <SC.Description>{description}</SC.Description>
      {renderButton ? renderButton() : null}
    </SC.Empty>
  );
};
