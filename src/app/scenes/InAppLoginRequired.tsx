import * as React from 'react';

export const InAppLoginRequired: React.FunctionComponent = () => {
  React.useEffect(() => {
    window.history.back();
    setTimeout(() => { window.location.reload(); }, 500);
  }, []);

  return (
    <main className="SceneWrapper" />
  );
};
