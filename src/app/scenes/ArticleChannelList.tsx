import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannels/ArticleChannelMeta';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { ArticleChannelListPlaceholder } from 'app/placeholder/ArticleChannelListPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { getChannelList } from 'app/services/articleChannel/selectors';
import { Actions as ArticleFollowingActions } from 'app/services/articleFollowing';
import { RidiSelectState } from 'app/store';

export const ArticleChannelList: React.FunctionComponent = () => {
  const { channelList, hasAvailableTicket, unseenFeedsFetchStatus } = useSelector((state: RidiSelectState) => ({
    channelList: getChannelList(state),
    hasAvailableTicket: state.user.hasAvailableTicket,
    unseenFeedsFetchStatus: state.articleFollowing.unseenFeedsFetchStatus,
  }));
  const channelListFetchStatus = useSelector((state: RidiSelectState) => state.articleChannels.fetchStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (channelListFetchStatus === FetchStatusFlag.IDLE && channelList.length === 0) {
      dispatch(Actions.loadArticleChannelListRequest());
    }
  }, []);

  React.useEffect(() => {
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
        'PageArticleChannels',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_CHANNEL} />
      <div className="a11y"><h1>리디셀렉트 아티클 전체 채널</h1></div>
      <section>
        { channelListFetchStatus === FetchStatusFlag.FETCHING ?
          <ArticleChannelListPlaceholder /> : (
            <div className="ArticleChannelList_Wrapper">
              <ul className="ArticleChannelList">
                {channelList.map((channelMeta, idx) => {
                    return channelMeta ? (
                      <li key={idx} className="ArticleChannelList_Item">
                        <ArticleChannelMeta {...channelMeta} />
                      </li>
                    ) : null;
                })}
              </ul>
            </div>
        )}
      </section>
    </main>
  );
};
