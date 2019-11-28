import * as React from 'react';

export const ArticleContentPlaceholder: React.FunctionComponent = () => (
  <main className="SceneWrapper PageArticleContent">
    <div className="ArticleContent_Title_Skeleton Skeleton" />
    <div className="ArticleContent_ContentWrapper">
      <div className="ChannelInfoHeader_Wrapper">
        <div className="ChannelInfoHeader_Thumbnail_Skeleton Skeleton" />
        <div className="ChannelInfoHeader_Meta">
          <div className="ChannelInfoHeader_Title_Skeleton Skeleton" />
          <div className="ChannelInfoHeader_Desc_Skeleton Skeleton" />
        </div>
        <div className="ChannelInfoHeader_Button_Skeleton Skeleton" />
      </div>
      <div className="ArticleContent_Text_Skeleton Skeleton" />
      <div className="ArticleContent_Text_Skeleton Skeleton" />
      <div className="ArticleContent_Text_Skeleton Skeleton" />
      <div className="ArticleContent_LastText_Skeleton Skeleton" />
    </div>
  </main>
);
