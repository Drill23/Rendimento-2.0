import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Importar o CSS Module

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Contas Divididas</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Dashboard</Link>
        <Link to="/add" className={styles.navLink}>Adicionar Nova Conta</Link>
      </nav>
    </header>
  );
};

export default Header;
