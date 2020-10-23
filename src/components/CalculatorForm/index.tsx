import InputField from '../InputField';
import Alert from '../Alert';
import styles from './styles.module.css';

const CalculatorForm = () => {
  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Simule sua Antecipação</h1>

      <InputField
        label="Informe o valor da venda"
        name="amount"
        maskType="currency"
      />

      <InputField
        label="Em quantas parcelas"
        name="installments"
        helperText="Máximo de 12 parcelas"
      />

      <InputField
        label="Informe o percentual de MDR"
        name="mdr"
        maskType="percentage"
      />

      <Alert />
    </div>
  );
};

export default CalculatorForm;
