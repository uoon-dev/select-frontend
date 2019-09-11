import * as PostRobot from 'post-robot';

import { Actions as EnvironmentActions } from 'app/services/environment';
import { store } from 'app/store';

export const setSendPostRobotEvent = () => {
  const inAppInitEventListener = (e: MessageEvent) => {
    const { platform, version } = e.data;
    if (platform && version) {
      window.postRobot = PostRobot;
      window.postMessage({ postRobot: true }, '*');
      store.dispatch(EnvironmentActions.setAppEnvironment({ platform, version }));
    }
  };

  window.addEventListener('message', inAppInitEventListener);
};
