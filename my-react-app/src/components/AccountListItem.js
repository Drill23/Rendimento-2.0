import React from 'react';
import styles from './AccountListItem.module.css'; // Importar o CSS Module

const AccountListItem = ({ name, totalAmount, responsible, splitDetails }) => {
  const accountName = name || "Nome não disponível";
  const displayAmount = totalAmount !== undefined ? totalAmount.toFixed(2) : "0.00";
  const responsiblePerson = responsible || "Não informado";
  const isSplit = Array.isArray(splitDetails) && splitDetails.length > 0;

  const cardClasses = `${isSplit ? styles.cardIsSplit : styles.card} ${styles.animateIn}`;

  return (
    <div className={cardClasses}>
      <div className={styles.header}>
        <span className={styles.accountName}>{accountName}</span>
        {isSplit && <span className={styles.splitIndicator}> (Dividida)</span>}
      </div>
      
      <p className={styles.detailText}>
        Total: <strong>R$ {displayAmount}</strong>
      </p>
      <p className={styles.detailText}>
        Responsável: <strong className={styles.responsibleName}>{responsiblePerson}</strong>
      </p>
      
      {isSplit && (
        <div className={styles.splitDetailsSection}>
          <h5 className={styles.splitDetailsTitle}>Detalhes da Divisão:</h5>
          <ul> {/* A estilização de 'ul' pode vir do pai ou ser global, ou adicionar classe aqui */}
            {splitDetails.map(person => (
              <li key={person.id || person.name} className={styles.splitDetailItem}> 
                {person.name || 'Pessoa não informada'}: <strong>R$ {person.amount !== undefined ? parseFloat(person.amount).toFixed(2) : '0.00'}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.actionsContainer}>
        <button className={`${styles.actionButton} ${styles.editButton}`}>Editar</button>
        <button className={`${styles.actionButton} ${styles.deleteButton}`}>Excluir</button>
      </div>
    </div>
  );
};

export default AccountListItem;
