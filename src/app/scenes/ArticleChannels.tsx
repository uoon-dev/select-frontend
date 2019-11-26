import { HelmetWithTitle } from 'app/components';
import { ArticleChannelsMeta } from 'app/components/ArticleChannels/ArticleChannelsMeta';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { Actions } from 'app/services/articleChannel';
import { getChannelList } from 'app/services/articleChannel/selectors';
import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleChannels: React.FunctionComponent = () => {
  const channelList = useSelector(getChannelList);
  const channelListFetchStatus = useSelector((state: RidiSelectState) => state.articleChannels.fetchStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (channelListFetchStatus === FetchStatusFlag.IDLE && channelList.length === 0) {
      dispatch(Actions.loadArticleChannelListRequest());
    }
  }, []);
  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_CHANNEL} />
      <div className="a11y"><h1>리디셀렉트 아티클 전체 채널</h1></div>
      <section>
        <div className="ArticlePageChannelList_Wrap">
          <ul className="ArticlePageChannelList">
            {channelList.map((channelMeta, idx) => {
                return channelMeta ? (
                  <li key={idx} className="ArticlePageChannel">
                    <ArticleChannelsMeta {...channelMeta} />
                  </li>
                ) : null;
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};
