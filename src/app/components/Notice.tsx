import styled from '@emotion/styled';
import React from 'react';

import { sendPostRobotOpenBrowser } from 'app/utils/inAppMessageEvents';
import Media from 'app/styles/mediaQuery';
import ExclamationIcon from 'svgs/ExclamationCircleFill.svg';
import Colors from 'app/styles/colors';
import { resetButton } from 'app/styles/customProperties';
import ArrowIcon from 'svgs/ArrowNoneDashRight.svg';

export interface NoticeProps {
  isInApp: boolean;
  type?: string;
  icon?: string;
  mainText: string;
  subText?: string;
  subTextType?: string;
  detailLink?: string;
}

const DetailButton = styled.button`
  ${resetButton}
  font-size: 13px;
  line-height: 20px;
  color: ${Colors.slategray_70};
  font-weight: 700;
  text-decoration: underline;
`;

const DetailLink = DetailButton.withComponent('a');

const SC = {
  Notice: styled.div`
    position: relative;
    border-radius: 4px;
    background-color: ${Colors.slategray_5};
    padding: 12px;
    margin-top: 15px;
    margin-bottom: -5px;

    @media ${Media.PC} {
      margin: 0;
    }
  `,
  ExclamationIcon: styled(ExclamationIcon)`
    display: block;
    position: absolute;
    top: 11px;
    left: 16px;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    margin-top: 3px;
    float: left;
    fill: ${Colors.slategray_40};
  `,
  Wrapper: styled.div`
    padding-left: 28px;
    box-sizing: border-box;
  `,
  MainText: styled.p`
    margin: 0;
    font-size: 13px;
    font-weight: normal;
    line-height: 20px;
    color: ${Colors.slategray_70};
    overflow: hidden;
  `,
  SubText: styled.span`
    display: block;
    overflow: hidden;
    margin-top: 2px;
    font-size: 12px;
    line-height: 20px;
    color: ${Colors.slategray_70};
  `,
  DetailButton,
  DetailLink,
  LinkIcon: styled(ArrowIcon)`
    width: 4.7px;
    height: 8px;
    margin-left: 4px;
    fill: ${Colors.slategray_30};
  `,
};

export const Notice: React.SFC<NoticeProps> = props => {
  const { isInApp, mainText, subText, detailLink } = props;

  return (
    <SC.Notice>
      <SC.ExclamationIcon />
      <SC.Wrapper>
        <SC.MainText dangerouslySetInnerHTML={{ __html: mainText }} />
        {subText && <SC.SubText dangerouslySetInnerHTML={{ __html: subText }} />}
        {detailLink &&
          (isInApp ? (
            <SC.DetailButton type="button" onClick={() => sendPostRobotOpenBrowser(detailLink)}>
              자세히 보기 <SC.LinkIcon />
            </SC.DetailButton>
          ) : (
            <SC.DetailLink href={detailLink}>
              자세히 보기 <SC.LinkIcon />
            </SC.DetailLink>
          ))}
      </SC.Wrapper>
    </SC.Notice>
  );
};
