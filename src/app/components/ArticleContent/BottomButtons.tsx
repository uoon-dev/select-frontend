import React from 'react';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

  if (!articleState || !articleState.article) {
    return null;
  }

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
    <ul css={styles.ArticleContent_ButtonsWrapper}>
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
  );
};
