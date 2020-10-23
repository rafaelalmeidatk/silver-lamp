import Head from 'next/head';
import styles from '../styles/Home.module.css';

import CalculatorForm from '../components/CalculatorForm';
import Result from '../components/Result';

export default function Home() {
  return (
    <div className={styles.container}>
      <CalculatorForm />
      <Result />
    </div>
  );
}
