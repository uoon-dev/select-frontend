import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

import { objectfit } from 'modernizr';
import { ArticleChannelFollowButton } from 'app/components/ArticleChannels/ArticleChannelFollowButton';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

interface ArticleChannelMetaProps {
  id: number;
  name: string;
  displayName: string;
  thumbnailUrl?: string;
  description?: string;
  subDescription?: string | null;
  followersCount?: number;
  isFollowing?: boolean;
}

export const MetaWrapper = styled.div`
  padding: 30px 20px 10px;

  @media ${Media.PC} {
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 12px 40px;
  }

  @media (min-width: 600px) {
    display: flex;
  }
`;

const Thumbnail = styled.div`
  position: relative;
  margin-right: 18px;
`;

const ThumbnailCommonStyle = css`
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  border-radius: 80px;
  background-color: gray;
`;

const ThumbnailImage = styled.img`
  ${ThumbnailCommonStyle}
  object-fit: cover;
`;

const ThumbnailPolyFill = styled.div`
  ${ThumbnailCommonStyle}
  background-image: ${(props: { thumbnailUrl?: string }) =>
    props.thumbnailUrl ? `url(${props.thumbnailUrl})` : ''};
  background-size: cover;
  background-position: center center;
`;

const ThumbnailShadow = styled.span`
  position: absolute;
  content: '';
  width: 80px;
  height: 80px;
  left: 0;
  top: 0;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 80px;
  display: block;
`;

export const Meta = styled.div`
  @media (max-width: 600px) {
    margin-top: 10px;
  }
`;

const MetaTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.55em;
  letter-spacing: -0.5px;
  color: ${Colors.gray_100};
  margin: 0;
  padding: 0;
`;

const MetaDesc = styled.p`
  margin: 0;
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${Colors.slategray_90};
  line-height: 1.5em;
  white-space: pre-line;
`;

const MetaSerial = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${Colors.slategray_50};
`;

const MetaFollowing = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${Colors.dodgerblue_50};
`;

const MetaFollowingCount = styled.strong`
  font-family: Roboto, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: ${Colors.dodgerblue_50};
`;

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannelMetaProps> = props => {
  const {
    id,
    name,
    displayName,
    thumbnailUrl,
    description,
    subDescription,
    followersCount = 0,
  } = props;

  return (
    <section>
      <MetaWrapper>
        <Thumbnail>
          {objectfit ? (
            <ThumbnailImage src={thumbnailUrl} />
          ) : (
            <ThumbnailPolyFill thumbnailUrl={thumbnailUrl} />
          )}
          <ThumbnailShadow />
        </Thumbnail>
        <Meta>
          <MetaTitle>{displayName}</MetaTitle>
          <MetaDesc>{description}</MetaDesc>
          <MetaSerial>{subDescription}</MetaSerial>
          <MetaFollowing>
            팔로잉 <MetaFollowingCount>{thousandsSeperator(followersCount)}</MetaFollowingCount>
          </MetaFollowing>
          <ArticleChannelFollowButton channelId={id} channelName={name} />
        </Meta>
      </MetaWrapper>
    </section>
  );
};
