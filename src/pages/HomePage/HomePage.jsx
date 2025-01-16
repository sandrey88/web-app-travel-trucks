import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to TravelTrucks</h1>
        <p className={styles.subtitle}>Your adventure begins with the perfect camper</p>
        <Link to="/catalog" className={styles.ctaButton}>
          View Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
