import React from 'react';
import { useDispatch } from 'react-redux';
import throttle from 'lodash-es/throttle';

import Share from 'svgs/Share.svg';
import Heart from 'svgs/Heart.svg';
import toast from 'app/utils/toast';
import { Actions, ArticleItemState } from 'app/services/article';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { Actions as TrackingActions } from 'app/services/tracking';
import * as styles from 'app/scenes/ArticleContent/styles';

export const ArticleContentBottomButtons: React.FunctionComponent<{
  articleState: ArticleItemState;
}> = props => {
  const { articleState } = props;

  if (!articleState || !articleState.article) {
    return null;
  }

  const contentButtonsContainer = React.useRef<HTMLDivElement>(null);

  const [windowInnerHeight, setWindowInnerHeight] = React.useState(window.innerHeight);
  const [isSticky, setIsSticky] = React.useState(false);

  let targetPosY = 0;
  let prevScrollTop = 0;

  const scrollFunction = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isTargetOutOfScreen = currentScrollTop + windowInnerHeight < targetPosY;

    const isScrollUp = prevScrollTop >= currentScrollTop;
    setIsSticky(isScrollUp && isTargetOutOfScreen);

    prevScrollTop = currentScrollTop;
  };
  const resizeFunction = () => setWindowInnerHeight(window.innerHeight);

  const throttledScrollFunction = throttle(scrollFunction, 100);
  const throttledResizeFunction = throttle(resizeFunction, 100);

  React.useEffect(() => {
    window.addEventListener('resize', throttledResizeFunction);

    return () => {
      window.removeEventListener('resize', throttledResizeFunction);
    };
  }, []);

  React.useEffect(() => {
    window.removeEventListener('scroll', throttledScrollFunction);

    if (!articleState?.content || !contentButtonsContainer?.current?.parentElement) {
      return;
    }

    targetPosY =
      contentButtonsContainer.current.offsetTop +
      contentButtonsContainer.current.offsetHeight +
      contentButtonsContainer.current.parentElement.offsetTop;

    if (windowInnerHeight < targetPosY) {
      window.addEventListener('scroll', throttledScrollFunction);
      scrollFunction();
    }

    return () => {
      window.removeEventListener('scroll', throttledScrollFunction);
    };
  }, [articleState, windowInnerHeight]);

  const dispatch = useDispatch();
  const copyUrl = () => {
    const domForCopyUrl = document.createElement('textarea');
    const locationUrl = new URL(location.href);
    locationUrl.search = '';
    locationUrl.hash = '';
    domForCopyUrl.value = locationUrl.toString();
    domForCopyUrl.className = 'a11y';
    document.body.appendChild(domForCopyUrl);
    domForCopyUrl.select();
    document.execCommand('copy');
    document.body.removeChild(domForCopyUrl);
    toast.success('아티클 링크가 복사되었습니다.');

    const trackingParams = {
      eventName: 'Share Article',
      id: articleState.article!.id,
      misc: JSON.stringify({ share_type: 'copy' }),
    };
    dispatch(TrackingActions.trackingArticleActions({ trackingParams }));
  };

  const favoriteArticleActionClick = () =>
    dispatch(
      Actions.favoriteArticleActionRequest({
        articleId: articleState.article!.id,
        method: articleState.article!.isFavorite ? 'DELETE' : 'POST',
      }),
    );

  return (
    <div
      className={isSticky ? 'sticky' : ''}
      css={styles.ArticleContent_ButtonsContainer}
      ref={contentButtonsContainer}
    >
      <ul className={isSticky ? 'sticky' : ''} css={styles.ArticleContent_ButtonsWrapper}>
        <li css={styles.ArticleContent_ButtonElement}>
          <button
            type="button"
            css={styles.ArticleContent_Button}
            onClick={favoriteArticleActionClick}
          >
            <Heart
              css={styles.ArticleContent_LikeButton_Icon}
              className={articleState.article.isFavorite ? 'active' : ''}
            />
            <span className="a11y">좋아요</span>
            {typeof articleState.article.favoritesCount === 'number'
              ? thousandsSeperator(articleState.article.favoritesCount)
              : ''}
          </button>
        </li>
        <li css={styles.ArticleContent_ButtonElement}>
          <button type="button" css={styles.ArticleContent_Button} onClick={copyUrl}>
            <Share css={styles.ArticleContent_ShareButton_Icon} />
            링크 복사하기
          </button>
        </li>
      </ul>
    </div>
  );
};
