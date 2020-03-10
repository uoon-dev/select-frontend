import React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';
import { useMediaQuery } from 'react-responsive';
import { MAX_WIDTH } from 'app/constants';

export const SectionHeader: React.SFC<{ title: string; link?: string }> = props => {
  const isMobile = useMediaQuery({ query: `(max-width: ${MAX_WIDTH}px)` });
  if (!props.link) {
    return (
      <div className="HomeSection_Header">
        {isMobile ? (
          <h2 className="Section_Title reset-heading">{props.title}</h2>
        ) : (
          <div className="Section_Title">
            <h2 className="reset-heading">{props.title}</h2>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="HomeSection_Header">
      {isMobile ? (
        <Link to={props.link}>
          <h2 className="Section_Title reset-heading">
            {props.title}
            <Icon name="arrow_5_right" className="Section_TitleArrowIcon" />
          </h2>
        </Link>
      ) : (
        <div className="Section_Title">
          <h2 className="reset-heading">{props.title}</h2>
          <Link to={props.link} className="Section_TitleLink">
            전체 보기
            <Icon name="arrow_5_right" className="Section_TitleArrowIcon" />
          </Link>
        </div>
      )}
    </div>
  );
};
