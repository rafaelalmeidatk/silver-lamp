import { useState, useRef } from 'react';
import { calculate, getAbortController } from '../../api/client';
import { config } from '../../config';
import CalculatorForm, { FieldNames } from '../CalculatorForm';
import Result from '../Result';
import styles from './styles.module.css';

type InputsValuesRef = {
  [key in FieldNames]: number | null;
};

const buildResultObject = () => {
  return config.days.reduce<{ [key: string]: number }>((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {});
};

const Calculator = () => {
  // We are using refs here to avoid rerenders without changing the UI, the refs will
  // keep a stable reference (this doesn't really matter here) and stable values
  // across rerenders (what we want)
  const inputsValuesRef = useRef<InputsValuesRef>({
    amount: null,
    installments: null,
    mdr: null,
  });
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const delayWarningTimeoutRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [result, setResult] = useState(() => buildResultObject());

  const handleInputChange = (name: FieldNames, value: string) => {
    const numericValue = value
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    inputsValuesRef.current[name] = parseFloat(numericValue);
    calculateResult();
  };

  const calculateResult = async () => {
    const { amount, installments, mdr } = inputsValuesRef.current;

    if (amount === null || installments === null || mdr === null) {
      return;
    }

    // Cancel the last request if it exists, this way we don't show stale
    // responses in case of inconsistent response times
    if (fetchAbortControllerRef.current !== null) {
      fetchAbortControllerRef.current?.abort();
    }

    // Clear the timeout to avoid showing it when starting a new request
    clearTimeout(delayWarningTimeoutRef.current);

    setIsLoading(true);

    try {
      fetchAbortControllerRef.current = getAbortController();

      // Before doing the request, we will create a timeout that is going to fire
      // after 1.5 seconds, in case the request is taking too long
      delayWarningTimeoutRef.current = window.setTimeout(() => {
        setAlertMessage(config.errorMessages.delay.message);
      }, 1500);

      const res = await calculate(
        { amount, installments, mdr, days: config.days },
        { signal: fetchAbortControllerRef.current.signal }
      );

      // Clear the timeout to avoid showing the warning after success
      clearTimeout(delayWarningTimeoutRef.current);

      setAlertMessage('');

      config.days.forEach((day) =>
        setResult((prev) => ({ ...prev, [day]: res[day] }))
      );
    } catch (err) {
      // Clear the timeout to avoid showing it after the response
      clearTimeout(delayWarningTimeoutRef.current);

      if (err.name === 'AbortError') {
        // The `abort` method above will throw a `DOMException` named `AbortError`,
        // it is expected so we will ignore it
        return;
      }

      let messageType: 'unknown' | 'timeout' | 'network' = 'unknown';

      if (err.response?.status === 408) {
        messageType = 'timeout';
      }

      // fetch will throw a TypeError for network errors
      if (err.name === 'TypeError') {
        messageType = 'network';
      }

      setAlertMessage(config.errorMessages[messageType].message);
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.calculator}>
      <CalculatorForm onInputChange={handleInputChange} />
      <Result isLoading={isLoading} dayValueMap={result} />
    </div>
  );
};

export default Calculator;
