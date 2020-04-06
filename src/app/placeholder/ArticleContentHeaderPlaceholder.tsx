import React from 'react';

import { ArticleChannelInfoHeaderPlaceholder } from 'app/placeholder/ArticleChannelInfoHeaderPlaceholder';

export const ArticleContentHeaderPlaceholder: React.FunctionComponent = () => (
  <>
    <div className="ArticleContent_Title_Skeleton Skeleton" />
    <ArticleChannelInfoHeaderPlaceholder />
  </>
);
