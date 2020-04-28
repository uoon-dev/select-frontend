import styled from '@emotion/styled';
import React from 'react';

import { ChannelList } from 'app/components/SlideChannelList';
import { skeleton } from 'app/styles/skeleton';

const ChannelThumbnail = styled.div`
  ${skeleton}
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  border: 1px solid #eee;
  border-radius: 999px;
  box-sizing: border-box;
`;

const ChannelName = styled.div`
  ${skeleton}
  width: 55px;
  height: 17px;
`;

const placeholders = Array.from({ length: 3 }, (_, index) => index);

export const SlideChannelListPlaceholder: React.FunctionComponent = () => (
  <ChannelList.Wrapper>
    <ChannelList.List>
      {placeholders.map(v => (
        <ChannelList.ListItem key={`SlideChannelListPlaceholder${v}`}>
          <ChannelList.ItemContentsWrapper>
            <ChannelThumbnail />
            <ChannelName />
          </ChannelList.ItemContentsWrapper>
        </ChannelList.ListItem>
      ))}
    </ChannelList.List>
  </ChannelList.Wrapper>
);
