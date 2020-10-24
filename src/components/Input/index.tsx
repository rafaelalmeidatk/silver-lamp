import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import styles from './styles.module.css';

export type InputProps = NumberFormatProps & {
  maskType?: 'currency' | 'percentage';
};

const Input = ({ suffix = 'R$ ', maskType, ...props }: InputProps) => {
  if (maskType === 'currency') {
    return (
      <NumberFormat
        prefix="R$ "
        thousandSeparator="."
        decimalSeparator=","
        placeholder="R$ 0,00"
        className={styles.input}
        {...props}
      />
    );
  }

  if (maskType === 'percentage') {
    return (
      <NumberFormat
        suffix="%"
        placeholder="0%"
        className={styles.input}
        {...props}
      />
    );
  }

  return <input className={styles.input} {...props} />;
};

export default Input;
