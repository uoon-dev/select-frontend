import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { SearchResultArticle } from 'app/services/searchResult';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { getArticleKeyFromData } from 'app/utils/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThumbnailShape } from '../ArticleThumbnail/types';

interface Props {
  keyword: string;
  articles: SearchResultArticle[];
}

export const SearchResultArticleList: React.FunctionComponent<Props> = (props) => {
  const { keyword, articles } = props;
  const channelState = useSelector((state: RidiSelectState) => state.articleChannelById);
  const section = getSectionStringForTracking('select-article', 'search-result', 'article-list');
  return (
    <ul className="SearchResultArticleList">
      {articles.map((article, idx) => (
        <li className="SearchResultArticleList_Item" key={article.id}>
          <ConnectedTrackImpression
            section={section}
            index={idx}
            id={article.id}
          >
            <div className="SearchResultArticleList_Link">
              <ArticleThumbnail
                linkUrl={`/article/${getArticleKeyFromData(article)}`}
                imageUrl={article.thumbnailUrl}
                thumbnailShape={ThumbnailShape.SQUARE}
                thumbnailClassName={'SearchResultArticleList_Thumbnail'}
                articleTitle={article.title}
              />
              <Link to={`/article/${getArticleKeyFromData(article)}?q=${keyword}&s=search`} className="SearchResultArticleList_Meta">
                <h3
                  className="SearchResultArticleList_Title"
                  dangerouslySetInnerHTML={{ __html: article.highlight.title || article.title }}
                />
                { article.highlight.authorNames ? (
                  <span
                    className="SearchResultArticleList_Author"
                    dangerouslySetInnerHTML={{ __html: article.highlight.authorNames }}
                  />) : (
                    article.authors && <span className="SearchResultArticleList_Author">{article.authors.map((author) => author.name).join(',')}</span>
                  )
                }                
                <span
                  className="SearchResultArticleList_Channel"
                  dangerouslySetInnerHTML={{ __html: article.highlight.channelDisplayName || channelState[article.channelName].channelMeta!.displayName }}
                />
              </Link>
            </div>
          </ConnectedTrackImpression>
        </li>
      ))}
    </ul>
  );
};
