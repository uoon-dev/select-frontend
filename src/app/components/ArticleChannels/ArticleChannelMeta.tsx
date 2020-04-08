import styled from '@emotion/styled';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { ArticleChannelFollowButton } from 'app/components/ArticleChannels/ArticleChannelFollowButton';
import { ArticleChannel } from 'app/services/articleChannel';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { articleChannelToPath } from 'app/utils/toPath';
import Colors from 'app/styles/colors';

import { ArticleChannelThumbnail } from './ArticleChannelThumbnail';

export interface SectionProps {
  section?: string;
  idx?: number;
}

const Meta = {
  Wrapper: styled.div`
    display: flex;
    align-items: center;
  `,
  Link: styled(Link)`
    flex: 1;
    min-width: 0;
    text-decoration: none;
    padding-right: 10px;
    box-sizing: border-box;
  `,
  Title: styled.span`
    font-size: 14px;
    font-weight: 500;
    color: ${Colors.gray_100};
  `,
  Description: styled.span`
    margin-top: 2px;
    display: block;
    font-size: 12px;
    color: ${Colors.slategray_60};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
};

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannel & SectionProps> = props => {
  const { id, name, thumbnailUrl, displayName, description, section, idx = 0 } = props;
  const dispatch = useDispatch();

  const trackingClick = (index: number, trackingId: string) => {
    if (!section) {
      return;
    }

    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id: trackingId,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  return (
    <Meta.Wrapper>
      <ArticleChannelThumbnail
        channelName={name}
        imageUrl={thumbnailUrl}
        linkUrl={articleChannelToPath({ channelName: name })}
        onLinkClick={() => trackingClick(idx, `ch:${id}`)}
      />
      <Meta.Link
        to={articleChannelToPath({ channelName: name })}
        onClick={() => trackingClick(idx, `ch:${id}`)}
      >
        <Meta.Title>{displayName}</Meta.Title>
        <Meta.Description>{description}</Meta.Description>
      </Meta.Link>
      <ArticleChannelFollowButton channelId={id} channelName={name} />
    </Meta.Wrapper>
  );
};
