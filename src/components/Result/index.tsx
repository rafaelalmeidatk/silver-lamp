import { config } from '../../config';
import styles from './styles.module.css';

const Result = () => {
  return (
    <div className={styles.calcResult}>
      <h2 className={styles.subtitle}>Você receberá:</h2>

      <div className={styles.results}>
        {config.days.map((day) => {
          const label = day === 1 ? 'Amanhã' : `Em ${day} dias`;

          return (
            <p key={day}>
              {label}:{' '}
              <span id={`day-${day}`} className={styles.value}>
                R$ 0,00
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Result;
