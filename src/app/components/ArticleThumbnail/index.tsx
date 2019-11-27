import * as classNames from 'classnames';
import * as React from 'react';
import Lazyload from 'react-lazyload';
import { Link } from 'react-router-dom';

import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';

interface ArticleThumbnailProps {
  thumbnailShape?: ThumbnailShape;
  thumbnailClassName?: string;
  imageClassName?: string;
  linkUrl: string;
  imageUrl?: string;
  articleTitle: string;
}

export const ArticleThumbnail: React.FunctionComponent<ArticleThumbnailProps> = (props) => {
  const {
    linkUrl,
    imageUrl,
    articleTitle,
    imageClassName,
    thumbnailShape = ThumbnailShape.RECTANGLE,
    thumbnailClassName,
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

  return (
    <div
      className={classNames(
        'ArticleThumbnail_Wrapper',
        `ArticleThumbnail_Wrapper-${thumbnailShape}`,
        thumbnailClassName,
      )}
    >
      <Link
        className="ArticleThumbnail_Link"
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
                'ArticleThumbnail_CoverImage',
                imageClassName,
              )}
              src={imageUrl}
              alt={articleTitle}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsWrongImage(true)}
            />
          ) : (
            <span className="ArticleThumbnail_DefaultCoverImage">
              <img
                className="ArticleThumbnail_DefaultCoverImage_Logo"
                src={require('images/article_default_thumbnail_logo.png')}
                alt="리디셀렉트 아티클 빈 썸네일"
              />
            </span>
          )}
          {!imageUrl || ((isLoaded || isWrongImage) && isEndTransition) ? null : (
            <span
              className={classNames(
                'Skeleton',
                'CoverImage_Placeholder',
                'ArticleCoverImage_Placeholder',
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
