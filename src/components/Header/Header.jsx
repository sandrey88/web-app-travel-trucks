import { NavLink, useLocation } from 'react-router-dom';
import logoSvg from '../../images/logo.svg';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <img src={logoSvg} alt="TravelTrucks Logo" />
        </NavLink>
        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/catalog" 
            className={({ isActive }) => {
              if (isActive && location.pathname === '/catalog') {
                return `${styles.link} ${styles.active}`;
              }
              return styles.link;
            }}
          >
            Catalog
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
