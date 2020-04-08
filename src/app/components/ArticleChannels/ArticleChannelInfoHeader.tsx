import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Colors from 'app/styles/colors';
import { ArticleChannelInfoHeaderPlaceholder } from 'app/placeholder/ArticleChannelInfoHeaderPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import { articleChannelToPath } from 'app/utils/toPath';

import { ArticleChannelFollowButton } from './ArticleChannelFollowButton';
import { ArticleChannelThumbnail } from './ArticleChannelThumbnail';

type PublishDateProp = {
  hasAuthorName: boolean;
};

const ChannelInfoHeader = {
  Wrapper: styled.div`
    display: flex;
    padding: 0 18px;
    align-items: center;
  `,
  Meta: styled.div`
    flex: 1;
    min-width: 0;
    padding-right: 10px;
    box-sizing: border-box;
  `,
  Link: styled(Link)`
    text-decoration: none;
  `,
  Title: styled.span`
    display: block;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.3px;
    color: ${Colors.gray_100};
  `,
  Description: styled.p`
    margin: 2px 0 0;
    padding-right: 5px;
    display: block;
    line-height: 18px;
    font-size: 12px;
    letter-spacing: -0.3px;
    color: ${Colors.slategray_60};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  AuthorName: styled.span`
    display: inline;
    word-break: break-all;
    line-height: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    color: inherit;
    padding-right: 5px;
    vertical-align: top;
  `,
  PublishDate: styled.span`
    display: inline;
    position: relative;
    line-height: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    color: inherit;
    vertical-align: top;
    ${(publishDateProp: PublishDateProp) =>
      publishDateProp.hasAuthorName
        ? `
          padding-left: 6px;
          &::before {
            content: '';
            position: absolute;
            width: 1px;
            height: 10px;
            top: 5px;
            left: 0;
            background: ${Colors.slategray_30};
          }
        `
        : ''}
  `,
};

export const ArticleChannelInfoHeader: React.FunctionComponent<{
  channelId?: number;
  channelName?: string;
  contentKey: string;
  isRenderDescription?: boolean;
}> = props => {
  const { channelId, channelName, contentKey, isRenderDescription = false } = props;
  const { channelState, articleState, authorName, isChannelFollowing } = useSelector(
    (state: RidiSelectState) => {
      if (!channelName) {
        return {};
      }
      const articleById = state.articlesById[contentKey];
      const channelById = state.articleChannelById[channelName];
      return {
        articleState: articleById,
        channelState: channelById,
        authorName: articleById.article!.authors
          ? articleById.article!.authors.map(author => author.name).join(', ')
          : undefined,
        isChannelFollowing:
          channelById &&
          channelById.isMetaFetched &&
          typeof channelById.channelMeta!.isFollowing === 'boolean'
            ? channelById.channelMeta!.isFollowing
            : undefined,
      };
    },
  );

  const dispatch = useDispatch();
  const section = getSectionStringForTracking('select-article', 'content', 'channel');

  React.useEffect(() => {
    if (!channelName || typeof isChannelFollowing === 'boolean') {
      return;
    }
    dispatch(Actions.loadArticleChannelDetailRequest({ channelName }));
  }, []);

  const trackingClick = (index: number, id: string) => {
    if (!section) {
      return;
    }

    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  if (
    !channelId ||
    !channelName ||
    !articleState ||
    !articleState.article ||
    !channelState ||
    !channelState.channelMeta
  ) {
    return <ArticleChannelInfoHeaderPlaceholder />;
  }

  const hasAuthorName = authorName ? authorName.length > 0 : false;
  const renderDescription = () => {
    if (!articleState.article || !channelState.channelMeta) {
      return null;
    }

    return isRenderDescription ? (
      <ChannelInfoHeader.Description>{channelState.channelMeta.description}</ChannelInfoHeader.Description>
    ) : (
      <ChannelInfoHeader.Description>
        {hasAuthorName && (
          <ChannelInfoHeader.AuthorName>{authorName}</ChannelInfoHeader.AuthorName>
        )}
        <ChannelInfoHeader.PublishDate hasAuthorName={hasAuthorName}>
          {buildOnlyDateFormat(articleState.article.publishDate)}
        </ChannelInfoHeader.PublishDate>
      </ChannelInfoHeader.Description>
    );
  };

  return (
    <ChannelInfoHeader.Wrapper className="ChannelInfoHeader_Wrapper">
      <ArticleChannelThumbnail
        imageUrl={channelState.channelMeta.thumbnailUrl}
        linkUrl={articleChannelToPath({ channelName: channelState.channelMeta.name })}
        channelName={channelState.channelMeta.name}
        onLinkClick={() => trackingClick(0, `ch:${channelState.channelMeta!.id}`)}
      />
      <ChannelInfoHeader.Meta>
        <ChannelInfoHeader.Link
          to={articleChannelToPath({ channelName: channelState.channelMeta.name })}
          onClick={() => trackingClick(0, `ch:${channelState.channelMeta!.id}`)}
        >
          <ChannelInfoHeader.Title>{channelState.channelMeta.displayName}</ChannelInfoHeader.Title>
        </ChannelInfoHeader.Link>
        {renderDescription()}
      </ChannelInfoHeader.Meta>
      <ArticleChannelFollowButton channelId={channelId} channelName={channelName} />
    </ChannelInfoHeader.Wrapper>
  );
};
