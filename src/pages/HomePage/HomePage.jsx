import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.textContainer}>
              <h1 className={styles.title}>Campers of your dreams</h1>
              <p className={styles.subtitle}>
                You can find everything you want in our catalog
              </p>
            </div>
            <Link to="/catalog" className={styles.ctaButton}>
              View Now
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
