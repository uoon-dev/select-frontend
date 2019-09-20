import * as PostRobot from 'post-robot';

import { Actions as EnvironmentActions } from 'app/services/environment';
import { store } from 'app/store';
import toast from 'app/utils/toast';

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

export function sendPostRobotInappLogin() {
  if (!window.postRobot) {
    window.postRobot = PostRobot;
  }
  window.postRobot
    .send(window, 'inApp', { name: 'onLoginRequired' })
    .catch((err) => {
      toast.failureMessage('앱에서 로그인 후 이용해주세요.');
    });
}
