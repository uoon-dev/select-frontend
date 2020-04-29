import * as React from 'react';

import CheckIcon from 'svgs/Check.svg';

import * as styles from './styles';

export interface CheckBoxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  children?: string;
}

export const CheckBox: React.SFC<CheckBoxProps> = props => {
  const { checked, onChange, disabled, children, className } = props;
  return (
    <label css={styles.checkboxWrapper} className={`RSGCheckBox ${className}`}>
      <input
        type="checkbox"
        className="CheckBoxInput a11y"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span css={styles.inputLabel} className="RSGCheckBox_Label">
        <CheckIcon css={styles.checkIcon} />
        {children}
      </span>
    </label>
  );
};
