import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import * as classNames from 'classnames';
import * as Modernizr from 'modernizr';
import * as React from 'react';
import Lazyload from 'react-lazyload';
import { Link } from 'react-router-dom';

interface ArticleThumbnailProps {
  thumbnailShape?: ThumbnailShape;
  thumbnailClassName?: string;
  imageClassName?: string;
  linkUrl: string;
  imageUrl?: string;
  articleTitle: string;
  isEnabled?: boolean;
  onLinkClick?: (event: React.SyntheticEvent<any>) => void;
}

export const BlockIconComponent = (props: any) => (
  <svg width={40} height={40} viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12zm16.3 4.9L7.1 5.7C8.4 4.6 10.1 4 12 4c4.4 0 8 3.6 8 8 0 1.9-.6 3.6-1.7 4.9zM4 12c0-1.9.6-3.6 1.7-4.9l11.2 11.2c-1.3 1.1-3 1.7-4.9 1.7-4.4 0-8-3.6-8-8z" />
  </svg>
);

export const ArticleThumbnail: React.FunctionComponent<ArticleThumbnailProps> = (props) => {
  const {
    linkUrl,
    imageUrl,
    articleTitle,
    imageClassName,
    onLinkClick = () => {},
    thumbnailShape = ThumbnailShape.RECTANGLE,
    thumbnailClassName,
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

  const renderThumbnailImage = () => {
    if (!Modernizr.objectfit) {
      return (
        <>
          <div
            className={classNames(
              'ArticleThumbnail_BackgroundImage',
              imageClassName,
            )}
            style={{ backgroundImage: `url(${imageUrl})`}}
          />
          <span className="ArticleThumbnail_CoverShadow" />
        </>
      );
    }

    return (
      <>
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
        <span className="ArticleThumbnail_CoverShadow" />
      </>
    );
  };

  if (!isEnabled) {
    return (
      <div
        className={classNames(
          'ArticleThumbnail_Wrapper',
          `ArticleThumbnail_Wrapper-${thumbnailShape}`,
          thumbnailClassName,
        )}
      >
        <div className="ArticleThumbnail_Block">
          <BlockIconComponent className="ArticleThumbnail_BlockImage" />
          <p className="ArticleThumbnail_BlockText">이용할 수 없는 아티클입니다.</p>
        </div>
      </div>
    );
  }
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
        onClick={onLinkClick}
      >
        <Lazyload
          offset={100}
          once={true}
          throttle={true}
          resize={true}
          overflow={false}
          placeholder={<div className="Skeleton CoverImage_Placeholder ArticleCoverImage_Placeholder" />}
        >
          {!isWrongImage ? (
            renderThumbnailImage()
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
