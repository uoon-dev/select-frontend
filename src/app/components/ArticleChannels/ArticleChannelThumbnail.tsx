import { BlockIconComponent } from 'app/components/ArticleThumbnail/index';
import * as classNames from 'classnames';
import * as React from 'react';
import Lazyload from 'react-lazyload';
import { Link } from 'react-router-dom';

interface ArticleChannelThumbnailProps {
  thumbnailClassName?: string;
  imageClassName?: string;
  linkUrl: string;
  imageUrl?: string;
  channelName: string;
  isEnabled?: boolean;
}

export const ArticleChannelThumbnail: React.FunctionComponent<ArticleChannelThumbnailProps> = (props) => {
  const {
    thumbnailClassName,
    imageClassName,
    linkUrl,
    imageUrl,
    channelName,
    isEnabled = true,
  } = props;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isEndTransition, setIsEndTransition] = React.useState(false);
  const [isWrongImage, setIsWrongImage] = React.useState(false);
  const coverPlaceholder = React.useRef<HTMLSpanElement>(null);

  if (coverPlaceholder && coverPlaceholder.current) {
    coverPlaceholder.current.addEventListener(
      'transitionend',
      () => setIsEndTransition(true),
    );
  }

  React.useEffect(() => {
    if (!imageUrl) {
      setIsWrongImage(true);
    }
  }, []);

  if (!isEnabled) {
    return (
      <div
        className={classNames(
          'ArticleChannelThumbnail_Wrapper',
          thumbnailClassName,
        )}
      >
        <div className="ArticleChannelThumbnail_Block">
          <BlockIconComponent width={24} height={24} className="ArticleChannelThumbnail_BlockImage" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'ArticleChannelThumbnail_Wrapper',
        thumbnailClassName,
      )}
    >
      <Link
        className="ArticleChannelThumbnail_Link"
        to={linkUrl}
      >
        <Lazyload
          offset={100}
          once={true}
          throttle={true}
          resize={true}
          overflow={false}
          placeholder={<div className="Skeleton" />}
        >
          {!isWrongImage ? (
            <img
              className={classNames(
                'ArticleChannelThumbnail_CoverImage',
                imageClassName,
              )}
              src={imageUrl}
              alt={channelName}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsWrongImage(true)}
            />
          ) : (
            <span className="ArticleChannelThumbnail_DefaultCoverImage">
              <img
                className="ArticleChannelThumbnail_DefaultCoverImage_Logo"
                src={require('images/article_default_thumbnail_logo.png')}
                alt="리디셀렉트 채널 빈 썸네일"
              />
            </span>
          )}
          {!imageUrl || ((isLoaded || isWrongImage) && isEndTransition) ? null : (
            <span
              className={classNames(
                'Skeleton',
                'CoverImage_Placeholder',
                'ArticleChannelCoverImage_Placeholder',
                isLoaded || isWrongImage ? 'CoverImage_Placeholder-fadeout' : null,
              )}
              onTransitionEnd={() => setIsEndTransition(true)}
              ref={coverPlaceholder}
            />
          )}
        </Lazyload>
      </Link>
    </div>
  );
};
