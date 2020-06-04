import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { authorKeys, authorKoreanNames, BookAuthors } from 'app/services/book';
import { RoutePaths } from 'app/constants';
import hoverStyles from 'app/styles/hover';
import { resetButton, resetLayout } from 'app/styles/customProperties';

interface AuthorsWithRole {
  names: string[];
  role: string;
  overCount: number;
}

const AuthorLimitCount = 2;

const getAuthors = (authors: BookAuthors) =>
  authorKeys
    .filter(key => authors[key])
    .map(key => ({
      names: authors[key].map(author => author.name),
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
  const { names, role, overCount } = props.authorsWithRole;
  const [isFolded, setIsFolded] = useState(overCount > 0);
  return (
    <>
      {names.slice(0, isFolded ? AuthorLimitCount : names.length).map((authorName, nameIdx) => (
        <>
          {nameIdx > 0 && ', '}
          <AuthorLink to={`${RoutePaths.SEARCH_RESULT}?q=${authorName}&type=Books`}>
            {authorName}
          </AuthorLink>
        </>
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
        <>
          {index > 0 && ', '}
          <AuthorsWithRole authorsWithRole={authorsWithRole} />
        </>
      ))}
    </>
  );
};

export default Authors;
