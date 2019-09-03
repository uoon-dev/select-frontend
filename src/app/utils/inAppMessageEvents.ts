import postRobot from 'post-robot';

export const setSendPostRobotEvent = () => {
  const inAppInitEventListener = (e: MessageEvent) => {
    const { platform, version } = e.data;
    if (platform && version) {
      window.postMessage({ postRobot }, '*');
    }
    window.removeEventListener('message', inAppInitEventListener);
  };

  window.addEventListener('message', inAppInitEventListener);
};
