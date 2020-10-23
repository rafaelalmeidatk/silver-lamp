import styles from './styles.module.css';

type InputFieldProps = React.HTMLProps<HTMLInputElement> & {
  helperText?: string;
  maskType?: string;
};

const InputField = ({
  name,
  label,
  placeholder,
  helperText,
}: InputFieldProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label} *
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className={styles.input}
      />

      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </div>
  );
};

export default InputField;
