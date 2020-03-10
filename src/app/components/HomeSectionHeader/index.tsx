import React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';
import { useMediaQuery } from 'react-responsive';
import { MAX_WIDTH } from 'app/constants';

import * as styles from 'app/components/HomeSectionHeader/styles';

export const SectionHeader: React.SFC<{ title: string; link?: string }> = props => {
  const isMobile = useMediaQuery({ query: `(max-width: ${MAX_WIDTH}px)` });
  if (!props.link) {
    return (
      <div className="HomeSection_Header">
        {isMobile ? (
          <h2 css={styles.sectionTitle} className="reset-heading">
            {props.title}
          </h2>
        ) : (
          <div css={styles.sectionTitle}>
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
          <h2 css={styles.sectionTitle} className="reset-heading">
            {props.title}
            <Icon name="arrow_5_right" css={styles.sectionTitleArrowIcon} />
          </h2>
        </Link>
      ) : (
        <div css={styles.sectionTitle}>
          <h2 className="reset-heading">{props.title}</h2>
          <Link to={props.link} css={styles.sectionTitleLink}>
            전체 보기
            <Icon name="arrow_5_right" css={styles.sectionTitleArrowIcon} />
          </Link>
        </div>
      )}
    </div>
  );
};
