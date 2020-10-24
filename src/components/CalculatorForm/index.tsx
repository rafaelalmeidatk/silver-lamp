import InputField from '../InputField';
import Alert from '../Alert';
import styles from './styles.module.css';

export type FieldNames = 'amount' | 'installments' | 'mdr';

type CalculatorFormProps = {
  onInputChange: (name: FieldNames, value: string) => void;
  alert: { type: 'error' | 'warning'; message: string };
};

const CalculatorForm = ({ onInputChange, alert }: CalculatorFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    onInputChange(target.name as FieldNames, target.value);
  };

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Simule sua Antecipação</h1>

      <div className={styles.inputList}>
        <InputField
          label="Informe o valor da venda"
          name="amount"
          maskType="currency"
          onChange={handleInputChange}
        />

        <InputField
          label="Em quantas parcelas"
          name="installments"
          helperText="Máximo de 12 parcelas"
          onChange={handleInputChange}
          placeholder="0"
        />

        <InputField
          label="Informe o percentual de MDR"
          name="mdr"
          maskType="percentage"
          onChange={handleInputChange}
        />
      </div>

      {alert.message && <Alert type={alert.type} message={alert.message} />}
    </div>
  );
};

export default CalculatorForm;
