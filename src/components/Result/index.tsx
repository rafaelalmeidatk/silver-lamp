import cx from 'classnames';
import styles from './styles.module.css';

type ResultProps = {
  isLoading: boolean;
  dayValueMap: Record<string, number>;
};

const Result = ({ isLoading, dayValueMap }: ResultProps) => {
  console.log(dayValueMap);
  return (
    <div className={cx(styles.calcResult, { [styles.loading]: isLoading })}>
      <h2 className={styles.subtitle}>Você receberá:</h2>

      <div className={styles.results}>
        {Object.keys(dayValueMap).map((day) => {
          const value = dayValueMap[day];
          const label = day === '1' ? 'Amanhã' : `Em ${day} dias`;

          return (
            <p key={day}>
              {label}:{' '}
              <span data-testid={`day-${day}`} className={styles.value}>
                R$ {value ?? 0}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Result;
