import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SerializedStyles } from '@emotion/core';

import { Icon } from '@ridi/rsg';

import { getIsMobile } from 'app/services/commonUI/selectors';
import * as styles from 'app/components/HomeSectionHeader/styles';

export const SectionHeader: React.SFC<{ title: string; link?: string }> = props => {
  const isMobile = useSelector(getIsMobile);
  const { title, link } = props;

  const Arrow: React.SFC = () => <Icon name="arrow_5_right" css={styles.sectionTitleArrowIcon} />;
  const HeaderLink: React.SFC<{ style?: SerializedStyles }> = ({ children, style }) =>
    link ? (
      <Link to={link} css={style}>
        {children}
      </Link>
    ) : (
      <>{children}</>
    );

  return (
    <div className="HomeSection_Header">
      {isMobile ? (
        <HeaderLink>
          <h2 css={styles.sectionTitle}>
            {title}
            {link && <Arrow />}
          </h2>
        </HeaderLink>
      ) : (
        <div css={styles.sectionTitle}>
          <h2 className="reset-heading">{title}</h2>
          <HeaderLink style={styles.sectionTitleLink}>
            {link && (
              <>
                전체 보기
                <Arrow />
              </>
            )}
          </HeaderLink>
        </div>
      )}
    </div>
  );
};
