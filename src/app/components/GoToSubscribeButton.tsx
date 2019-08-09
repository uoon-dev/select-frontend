import { Button } from '@ridi/rsg';
import * as classNames from 'classnames';
import * as React from 'react';

interface GoToSubscribeButtonProps {
  className?: string;
  onClick: () => void;
}

export const GoToSubscribeButton: React.FunctionComponent<GoToSubscribeButtonProps> = ({ className, onClick }) => (
  <Button
    className={classNames(
      'GoToSubscribeButton',
      className,
    )}
    color="blue"
    size="large"
    onClick={onClick}
  >
    리디셀렉트 구독하러 가기
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="GoToSubscribeButton_Icon">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
    </svg>
  </Button>
);
