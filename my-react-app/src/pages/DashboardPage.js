import React, { useState, useEffect } from 'react';
import AccountListItem from '../components/AccountListItem';
import styles from './DashboardPage.module.css'; // Importar o CSS Module

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('contasApp_accounts');
    if (storedAccounts) {
      try {
        const parsedAccounts = JSON.parse(storedAccounts);
        setAccounts(parsedAccounts);
      } catch (error) {
        console.error("Failed to parse accounts from LocalStorage:", error);
        setAccounts([]);
      }
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Dashboard de Contas</h1>
      {accounts.length === 0 ? (
        <p className={styles.noAccountsMessage}>Nenhuma conta adicionada ainda.</p>
      ) : (
        <div className={styles.listContainer}>
          {accounts.map(account => (
            <AccountListItem
              key={account.id}
              name={account.name}
              totalAmount={account.total}
              responsible={account.responsible}
              splitDetails={account.splitDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
