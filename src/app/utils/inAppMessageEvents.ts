import PostRobot from 'post-robot';

export const setSendPostRobotEvent = () => {
  window.addEventListener('message', (e) => {
    const { name, args } = e.data;
    if (name && name === 'init') {
      window.postMessage({
        name: 'sendPostRobot',
        args: [{
          'post-robot': PostRobot,
        }],
      }, '*');
    }
  });
};
