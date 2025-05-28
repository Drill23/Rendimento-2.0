import React, { useState } from 'react';
import PeopleSplitter from './PeopleSplitter';
import styles from './AccountForm.module.css'; // Importar o CSS Module

const AccountForm = () => {
  const [accountName, setAccountName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [showSplitter, setShowSplitter] = useState(false);
  const [divisionDetails, setDivisionDetails] = useState([]);

  const handleDivisionChange = (updatedDetails) => {
    setDivisionDetails(updatedDetails);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newAccount = {
      id: Date.now(),
      name: accountName,
      total: parseFloat(totalAmount),
      responsible: responsiblePerson,
    };

    if (showSplitter && divisionDetails.length > 0) {
      newAccount.splitDetails = divisionDetails.map(person => ({
        ...person,
        amount: parseFloat(person.amount) || 0 // Garante que o valor seja número
      }));
    } else {
      newAccount.splitDetails = []; // Ou null, dependendo da preferência
    }

    const existingAccounts = JSON.parse(localStorage.getItem('contasApp_accounts')) || [];
    const updatedAccounts = [...existingAccounts, newAccount];
    localStorage.setItem('contasApp_accounts', JSON.stringify(updatedAccounts));

    // Lógica para "Lembrar Pessoas"
    if (newAccount.splitDetails && newAccount.splitDetails.length > 0) {
      const namesFromSplit = Array.from(new Set(newAccount.splitDetails.map(p => p.name.trim()).filter(name => name)));
      if (namesFromSplit.length > 0) {
        let rememberedPeople = JSON.parse(localStorage.getItem('contasApp_rememberedPeople')) || [];
        namesFromSplit.forEach(name => {
          if (!rememberedPeople.includes(name)) {
            rememberedPeople.push(name);
          }
        });
        // Opcional: Ordenar a lista alfabeticamente
        rememberedPeople.sort(); 
        localStorage.setItem('contasApp_rememberedPeople', JSON.stringify(rememberedPeople));
      }
    }

    // Limpar campos do formulário
    setAccountName('');
    setTotalAmount('');
    setResponsiblePerson('');
    setShowSplitter(false);
    setDivisionDetails([]);

    console.log('Conta salva:', newAccount);
    console.log('Todas as contas:', updatedAccounts);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="accountName" className={styles.label}>Nome da Conta:</label>
        <input
          type="text"
          id="accountName"
          name="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="totalAmount" className={styles.label}>Valor Total (R$):</label>
        <input
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
          step="0.01"
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="responsiblePerson" className={styles.label}>Responsável:</label>
        <input
          type="text"
          id="responsiblePerson"
          name="responsiblePerson"
          value={responsiblePerson}
          onChange={(e) => setResponsiblePerson(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="showSplitterCheckbox"
          checked={showSplitter}
          onChange={(e) => setShowSplitter(e.target.checked)}
          className={styles.checkboxInput}
        />
        <label htmlFor="showSplitterCheckbox">
          Dividir esta conta?
        </label>
      </div>

      <div className={`${styles.splitterSection} ${showSplitter ? styles.splitterSectionVisible : ''}`}>
        {/* Este div só será "visível" (ocupará espaço) se showSplitter for true devido às classes CSS */}
        {showSplitter && (
          <PeopleSplitter
            initialPeople={divisionDetails}
            onChange={handleDivisionChange}
            accountTotal={parseFloat(totalAmount) || 0}
          />
        )}
      </div>
      
      <button type="submit" className={styles.submitButton}>Salvar Conta</button>
    </form>
  );
};

export default AccountForm;
