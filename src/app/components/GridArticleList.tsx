import { Method } from 'axios';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';

import { ArticleChannelThumbnail } from 'app/components/ArticleChannels/ArticleChannelThumbnail';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Actions } from 'app/services/article';
import { ArticleResponse } from 'app/services/article/requests';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { buildDateDistanceFormat } from 'app/utils/formatDate';
import { articleChannelToPath } from 'app/utils/toPath';
import { getArticleKeyFromData } from 'app/utils/utils';

interface Props {
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  filterForTracking?: string;
  articles: ArticleResponse[];
  renderAuthor?: boolean;
  renderChannelThumbnail?: boolean;
  renderChannelMeta?: boolean;
  renderPublishDate?: boolean;
  renderFavoriteButton?: boolean;
  isFullWidthAvailable?: boolean;
  gridListSizeClassNames?: string;
}
export const GridArticleList: React.FunctionComponent<Props> = (props) => {
  const dispatch = useDispatch();
  const {
    pageTitleForTracking,
    uiPartTitleForTracking,
    filterForTracking,
    articles,
    renderAuthor = true,
    renderChannelThumbnail = false,
    renderChannelMeta = false,
    renderPublishDate = false,
    renderFavoriteButton = false,
    isFullWidthAvailable = false,
    gridListSizeClassNames,
  } = props;

  const section = !!pageTitleForTracking
    ? getSectionStringForTracking(pageTitleForTracking, uiPartTitleForTracking, filterForTracking)
    : undefined;
  const { articleChannelById } = useSelector((state: RidiSelectState) => ({ articleChannelById: state.articleChannelById }));

  const favoriteArticleAction = (articleId: number, isFavorite: boolean | undefined) => {
    let method: Method = 'POST';
    if (isFavorite) {
      method = 'DELETE';
    }
    dispatch(Actions.favoriteArticleActionRequest({ articleId, method }));
  };
  return (
    <ul
      className={classNames(
        'GridArticleList',
        isFullWidthAvailable && 'GridArticleList-fullWidthAvailable',
        gridListSizeClassNames,
      )}
    >
      {articles.map((article, idx) => {
        const articleUrl = `/article/${getArticleKeyFromData(article)}`;
        const channelMeta = articleChannelById &&
          articleChannelById[article.channelName] &&
          articleChannelById[article.channelName].channelMeta;
        return (
          <li className="GridArticleItem" key={idx}>
            <ConnectedTrackImpression
              section={section}
              index={idx}
              id={article.id}
            >
              <ArticleThumbnail
                linkUrl={articleUrl}
                imageUrl={article.thumbnailUrl}
                articleTitle={article.title}
                isEnabled={article.isEnabled}
              />
              <div className="GridArticleItem_Meta">
                {renderChannelThumbnail && channelMeta ? (
                  <ArticleChannelThumbnail
                    imageUrl={channelMeta.thumbnailUrl}
                    linkUrl={articleChannelToPath({channelName: channelMeta.name})}
                    channelName={channelMeta.displayName}
                    isEnabled={channelMeta.isEnabled}
                  />
                ) : null}
                <div className="GridArticleItem_Meta_InnerWrapper">
                  {article.isEnabled ? (
                    <>
                      <Link
                        to={articleUrl}
                        className="GridArticleItem_Link"
                      >
                        <p className="GridArticleItem_Title">
                          {article.title}
                        </p>
                      </Link>
                      {renderChannelMeta && channelMeta ? (
                        <Link to={articleChannelToPath({channelName: channelMeta.name})}>
                          <p className="GridArticleItem_ChannelName">
                            {channelMeta.displayName}
                          </p>
                        </Link>
                      ) : null}
                      <Link
                        to={articleUrl}
                        className="GridArticleItem_Link"
                      >
                      {renderAuthor && article.author ? (
                        <span className="GridArticleItem_Author">
                          {article.author.name}
                        </span>
                      ) : null}
                      {renderPublishDate && article.publishDate ? (
                        <span className="GridArticleItem_RegDate"> · {buildDateDistanceFormat(article.publishDate)} 전</span>
                      ) : null}
                      </Link>
                    </>
                  ) : (
                   <>
                    <p className="GridArticleItem_Title">
                      {article.title}
                    </p>
                    {renderChannelMeta && channelMeta ? (
                      <p className="GridArticleItem_ChannelName">
                        {channelMeta.displayName}
                      </p>
                    ) : null}
                    {renderAuthor && article.author ? (
                      <span className="GridArticleItem_Author">
                        {article.author.name}
                      </span>
                    ) : null}
                    {renderPublishDate && article.publishDate ? (
                      <span className="GridArticleItem_RegDate"> · {buildDateDistanceFormat(article.publishDate)} 전</span>
                    ) : null}
                   </>
                  )}
                </div>
                {renderFavoriteButton ? (
                  <div className="GridArticleItem_ButtonWrapper">
                    <button
                      className="GridArticleItem_FavoriteButton"
                      onClick={() => favoriteArticleAction(article.id, article.isFavorite)}
                    >
                      <Icon
                        name="heart_1"
                        className={classNames(
                          'GridArticleItem_FavoriteButtonIcon',
                          article.isFavorite && 'GridArticleItem_FavoriteButton-active',
                        )}
                      />
                    </button>
                  </div>
                ) : null}
              </div>
            </ConnectedTrackImpression>
          </li>
        );
      })}
    </ul>
  );
};