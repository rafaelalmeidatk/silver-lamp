import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import styles from './styles.module.css';

export type InputProps = NumberFormatProps & {
  maskType?: 'currency' | 'percentage';
};

const Input = ({
  suffix = 'R$ ',
  placeholder,
  onChange,
  maskType,
  ...props
}: InputProps) => {
  const formatedPlaceholder = placeholder || `${suffix}0,00`;

  if (maskType === 'currency') {
    return (
      <NumberFormat
        prefix="R$ "
        thousandSeparator="."
        decimalSeparator=","
        placeholder={formatedPlaceholder}
        className={styles.input}
        {...props}
      />
    );
  }

  if (maskType === 'percentage') {
    return <NumberFormat suffix="%" className={styles.input} {...props} />;
  }

  return <input className={styles.input} {...props} />;
};

export default Input;
