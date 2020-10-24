import Input, { InputProps } from '../Input';
import styles from './styles.module.css';

type InputFieldProps = InputProps & {
  helperText?: string;
};

const InputField = ({ name, label, helperText, ...props }: InputFieldProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label} *
      </label>

      <Input name={name} {...props} />

      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </div>
  );
};

export default InputField;
