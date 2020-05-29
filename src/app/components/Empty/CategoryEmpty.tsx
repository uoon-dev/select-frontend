import styled from '@emotion/styled';
import React from 'react';

import EmptyBookIcon from 'svgs/BookOutline.svg';
import { resetLayout } from 'app/styles/customProperties';
import Colors from 'app/styles/colors';

const SC = {
  Empty: styled.section`
    ${resetLayout}
    padding: 80px 0;
    text-align: center;
  `,
  EmptyIcon: styled(EmptyBookIcon)`
    display: inline-block;
    width: 60px;
    height: 60px;
    fill: ${Colors.slategray_10};
  `,
  Description: styled.p`
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    line-height: 21px;
    color: ${Colors.slategray_60};
  `,
};

const CategoryEmpty: React.FunctionComponent = () => (
  <SC.Empty>
    <SC.EmptyIcon />
    <SC.Description>책이 없는 카테고리입니다.</SC.Description>
  </SC.Empty>
);

export default CategoryEmpty;
