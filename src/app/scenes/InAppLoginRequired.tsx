import * as React from 'react';

export const InAppLoginRequired: React.FunctionComponent = () => {
  React.useEffect(() => {
    setTimeout(() => history.back(), 1000);
  });
  // 인앱에서 isLoginRequired 호출시에 해당 url 컴포넌트
  return (
    <main className="SceneWrapper" />
  );
};
