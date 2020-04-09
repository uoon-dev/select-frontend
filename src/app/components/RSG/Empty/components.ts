import styled from '@emotion/styled';

import { resetLayout, resetFontUnlimited } from 'app/styles/customProperties';
import Colors from 'app/styles/colors';
import ArrowIcon from 'svgs/ArrowDoubleHeadRight.svg';

export const RSGEmpty = styled.div`
  ${resetLayout}
  ${resetFontUnlimited}

  padding: 20px 0;
  text-align: center;
`;

export type EmptyIconType = React.FunctionComponent<React.SVGProps<SVGElement>>;
export const withIconStyle = (component: EmptyIconType) => styled(component)`
  ${resetLayout}

  display: block;
  margin: 0 auto;
  width: 84px;
  height: 80px;
  padding-bottom: 15px;
  fill: ${Colors.slategray_10};
`;

export const EmptyTitle = styled.h3`
  ${resetLayout}
  ${resetFontUnlimited}

  font-size: 18px;
  font-weight: bold;
  color: ${Colors.gray_80};
  line-height: 1.5em;
`;

export const EmptryDescription = styled.p`
  ${resetLayout}
  ${resetFontUnlimited}

  font-size: 13px;
  color: ${Colors.slategray_60};
  line-height: 1.5em;
  cursor: default;
`;

export const EmptyInlineLink = styled.a`
  text-decoration: none;
  margin-top: 5px;
  font-weight: bold;
  display: inline-block;
  padding: 5px 15px 5px 0;
  position: relative;
  font-size: 13px;
  color: ${Colors.slategray_60};
  transition: color 0.2s;

  &:hover {
    color: ${Colors.dodgerblue_50};
    .linkArrowIcon {
      right: -4px;
    }
  }
`;

export const EmptyLinkArrowIcon = styled(ArrowIcon)`
  fill: ${Colors.dodgerblue_50};
  width: 6px;
  height: 7px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -4px;
  transition: right 0.2s;
`;
