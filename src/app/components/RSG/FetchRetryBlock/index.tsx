import * as React from 'react';

import { Button, RSGButtonSize } from 'app/components/RSG';
import RetryIcon from 'svgs/Retry.svg';

import {
  RSGFetchRetry,
  RSGFetchRetryTitle,
  RSGFetchRetryDescription,
  buttonStyle,
  retryIconStyle,
} from './components';

export interface FetchRetryBlockProps {
  title?: string;
  description?: string;
  buttonClassName?: string;
  onRetry: () => void;
}

export const FetchRetryBlock: React.FunctionComponent<FetchRetryBlockProps> = ({
  title,
  description = '다시 시도해주세요.',
  buttonClassName,
  onRetry,
}) => (
  <RSGFetchRetry>
    {title && <RSGFetchRetryTitle>{title}</RSGFetchRetryTitle>}
    <RSGFetchRetryDescription>{description}</RSGFetchRetryDescription>
    <Button
      css={buttonStyle}
      className={buttonClassName}
      size={RSGButtonSize.LARGE}
      onClick={onRetry}
      outline
    >
      <RetryIcon css={retryIconStyle} />
      다시 시도
    </Button>
  </RSGFetchRetry>
);
