import InputField from '../InputField';
import Alert from '../Alert';
import styles from './styles.module.css';

export type FieldNames = 'amount' | 'installments' | 'mdr';

type CalculatorFormProps = {
  onInputChange: (name: FieldNames, value: string) => void;
};

const CalculatorForm = ({ onInputChange }: CalculatorFormProps) => {
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
        />

        <InputField
          label="Informe o percentual de MDR"
          name="mdr"
          maskType="percentage"
          onChange={handleInputChange}
        />
      </div>

      <Alert />
    </div>
  );
};

export default CalculatorForm;
