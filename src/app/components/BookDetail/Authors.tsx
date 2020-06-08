import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { authorKeys, authorKoreanNames, BookAuthors, BookAuthor } from 'app/services/book';
import { RoutePaths } from 'app/constants';
import hoverStyles from 'app/styles/hover';
import { resetButton, resetLayout } from 'app/styles/customProperties';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';

interface AuthorsWithRole {
  authors: BookAuthor[];
  role: string;
  overCount: number;
}

const AuthorLimitCount = 2;

const getAuthors = (authors: BookAuthors) =>
  authorKeys
    .filter(key => authors[key])
    .map(key => ({
      authors: authors[key],
      role: authorKoreanNames[key],
      overCount: authors[key].length - AuthorLimitCount,
    }));

const buttonStyles = css`
  font-size: inherit;
  color: inherit;
  text-decoration: none;
  font-weight: 700;
  line-height: inherit;

  ${hoverStyles(css`
    text-decoration: underline;
  `)}
`;

const AuthorLink = styled(Link)`
  ${buttonStyles}
`;

const ExpendedButton = styled.button`
  ${resetLayout}
  ${resetButton}
  ${buttonStyles}
  display: inline;
`;

const AuthorsWithRole: React.FunctionComponent<{ authorsWithRole: AuthorsWithRole }> = props => {
  const { authors, role, overCount } = props.authorsWithRole;
  const [isFolded, setIsFolded] = useState(overCount > 0);

  const dispatch = useDispatch();
  const dispatchTrackClick = (authorId?: number) => {
    if (authorId) {
      const trackingParams: DefaultTrackingParams = {
        section: 'select-book.detail.authors',
        index: 0,
        id: authorId,
      };
      dispatch(TrackingActions.trackClick({ trackingParams }));
    }
  };

  return (
    <>
      {(!isFolded ? authors : authors.slice(0, AuthorLimitCount)).map((author, nameIdx) => (
        <span key={`author_link-${author.id}`}>
          {nameIdx > 0 && ', '}
          <AuthorLink
            to={`${RoutePaths.SEARCH_RESULT}?q=${author.name}&type=Books`}
            onClick={() => {
              dispatchTrackClick(author.id);
            }}
          >
            {author.name}
          </AuthorLink>
        </span>
      ))}
      {isFolded && (
        <>
          {' 외 '}
          <ExpendedButton
            type="button"
            onClick={() => {
              setIsFolded(false);
            }}
          >
            {overCount}명
          </ExpendedButton>
        </>
      )}
      {` ${role}`}
    </>
  );
};

const Authors: React.FunctionComponent<{ authors?: BookAuthors }> = props => {
  const { authors } = props;
  if (!authors) {
    return null;
  }
  return (
    <>
      {getAuthors(authors).map((authorsWithRole, index) => (
        <span key={`authorsWithRole-${index}`}>
          {index > 0 && ', '}
          <AuthorsWithRole authorsWithRole={authorsWithRole} />
        </span>
      ))}
    </>
  );
};

export default Authors;
