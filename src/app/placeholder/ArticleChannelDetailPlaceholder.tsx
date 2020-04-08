import styled from '@emotion/styled';
import React from 'react';

import { MetaWrapper, Meta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { skeleton } from 'app/styles/skeleton';

const Thumbnail = styled.div`
  ${skeleton}
  margin-right: 18px;
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
  box-sizing: border-box;
  border-radius: 999px;
`;

const MetaTitle = styled.div`
  ${skeleton}
  width: 180px;
  height: 34px;
`;

const MetaDesc = styled.div`
  ${skeleton}
  width: 240px;
  height: 16px;
  margin-top: 10px;
`;

const MetaSerial = styled.div`
  ${skeleton}
  width: 90px;
  height: 16px;
  margin-top: 10px;
`;

const FollowButton = styled.div`
  ${skeleton}
  width: 100px;
  height: 30px;
  margin-top: 10px;
`;

export const ArticleChannelDetailPlaceholder: React.FunctionComponent = () => (
  <MetaWrapper>
    <Thumbnail />
    <Meta>
      <MetaTitle />
      <MetaDesc />
      <MetaSerial />
      <FollowButton />
    </Meta>
  </MetaWrapper>
);
