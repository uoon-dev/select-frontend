import * as React from 'react';

export const InAppLoginRequired: React.FunctionComponent = () => {
  React.useEffect(() => {
    setTimeout(() => history.back(), 1000);
  });

  return (
    <main className="SceneWrapper" />
  );
};
