import * as React from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';
import * as classNames from 'classnames';
import { throttle } from 'lodash-es';

export const ArticleContentGetTicketToRead: React.FunctionComponent<{ contentKey: string }> = (props) => {
  const BASE_URL_STORE = useSelector((state: RidiSelectState) => state.environment.STORE_URL);
  const articleState = useSelector((state: RidiSelectState) => state.articlesById[props.contentKey]);
  const isLoggedIn = useSelector((state: RidiSelectState) => state.user.isLoggedIn);

  const [isSticky, setIsSticky] = React.useState(false);
  const getTicketToReadButtonWrapper = React.useRef<HTMLDivElement>(null);

  const throttledScrollFunction = throttle(() => {
    if (
      !getTicketToReadButtonWrapper ||
      !getTicketToReadButtonWrapper.current ||
      !getTicketToReadButtonWrapper.current.parentElement
    ) {
      return;
    }
    const parentElement = getTicketToReadButtonWrapper.current.parentElement as HTMLElement;
    const currentScrollTop = window.pageYOffset || document.documentElement!.scrollTop;
    if (
      (currentScrollTop + window.innerHeight) >=
      (parentElement.offsetTop + parentElement.offsetHeight)
    ) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, 100);

  React.useEffect(() => {
    window.addEventListener('scroll', throttledScrollFunction);
    return () => {
      window.removeEventListener('scroll', throttledScrollFunction);
    };
  }, []);

  if (!articleState || !articleState.article) {
    return null;
  }

  const paymentUrl = `${BASE_URL_STORE}/select/payments?return_url=${encodeURIComponent(location.origin + location.pathname)}`;

  return (
    <div
      className={classNames(
        'ArticleContent_GetTicketToReadButtonWrapper',
        articleState.article.isPublic && 'ArticleContent_GetTicketToReadButtonWrapper-publicContent',
        isSticky && 'ArticleContent_GetTicketToReadButtonWrapper-sticky',
      )}
      ref={getTicketToReadButtonWrapper}
    >
      <Button
        size="large"
        color="blue"
        className="ArticleContent_GetTicketToReadButton"
        onClick={() => {
          if (isLoggedIn) {
            window.location.replace(paymentUrl);
            return;
          }
          moveToLogin(paymentUrl);
        }}
      >
        리디셀렉트 구독하고 무료로 보기
      </Button>
    </div>
  );
};
