import { useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { calculate, getAbortController } from '../../api/client';
import { config } from '../../config';
import CalculatorForm, { FieldNames } from '../CalculatorForm';
import Result from '../Result';
import styles from './styles.module.css';

type InputsValuesRef = {
  [key in FieldNames]: number | null;
};

type AlertState = {
  type: 'error' | 'warning';
  message: string;
};

const buildResultObject = () => {
  return config.days.reduce<Record<string, number>>((acc, curr) => {
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
  const [alert, setAlert] = useState<AlertState>({
    message: '',
    type: 'error',
  });
  // Using the function argument of useState to run the build function only once
  const [result, setResult] = useState(() => buildResultObject());

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
        setAlert(config.errorMessages.delay);
      }, 1500);

      // In a bigger project, instead of calling the request directly we could use some
      // library like react-query or swr to take advantage of requests dedupes, cache, etc.
      // It is not necessary here since we only do one request
      const res = await calculate(
        { amount, installments, mdr, days: config.days },
        { signal: fetchAbortControllerRef.current.signal }
      );

      // Clear the timeout to avoid showing the warning after success
      clearTimeout(delayWarningTimeoutRef.current);

      setAlert((prev) => ({ ...prev, message: '' }));

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

      setAlert(config.errorMessages[messageType]);
    }

    setIsLoading(false);
  };

  const debouncedCalculateResult = useCallback(
    debounce(calculateResult, 250),
    []
  );

  const handleInputChange = (name: FieldNames, value: string) => {
    const numericValue = value
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    inputsValuesRef.current[name] = parseFloat(numericValue);
    debouncedCalculateResult();
  };

  return (
    <div className={styles.calculator}>
      <CalculatorForm onInputChange={handleInputChange} alert={alert} />

      <Result isLoading={isLoading} dayValueMap={result} />
    </div>
  );
};

export default Calculator;
