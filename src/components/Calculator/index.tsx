import CalculatorForm from '../CalculatorForm';
import Result from '../Result';
import styles from './styles.module.css';

const Calculator = () => {
  return (
    <div className={styles.calculator}>
      <CalculatorForm />
      <Result />
    </div>
  );
};

export default Calculator;
