import React, { useState, useEffect } from 'react';
import styles from './PeopleSplitter.module.css'; // Importar o CSS Module

const PeopleSplitter = ({ onChange, initialPeople = [], accountTotal = 0 }) => {
  const [people, setPeople] = useState(initialPeople);
  const [rememberedPeopleList, setRememberedPeopleList] = useState([]);
  const [splitEqually, setSplitEqually] = useState(false);

  // Efeito para inicializar o estado 'people' se initialPeople mudar
  useEffect(() => {
    setPeople(initialPeople);
    // Se initialPeople for limpo (ex: após salvar formulário), resetar splitEqually
    if (initialPeople.length === 0) {
      setSplitEqually(false);
    }
  }, [initialPeople]);

  // Efeito para carregar pessoas lembradas do LocalStorage na montagem
  useEffect(() => {
    const storedRememberedPeople = localStorage.getItem('contasApp_rememberedPeople');
    if (storedRememberedPeople) {
      try {
        const parsedList = JSON.parse(storedRememberedPeople);
        setRememberedPeopleList(parsedList);
      } catch (error) {
        console.error("Failed to parse remembered people from LocalStorage:", error);
      }
    }
  }, []);

  // Efeito para dividir igualmente quando 'splitEqually', 'people.length' ou 'accountTotal' muda
  useEffect(() => {
    if (splitEqually && people.length > 0 && accountTotal > 0) {
      const amountPerPerson = (accountTotal / people.length).toFixed(2);
      const updatedPeople = people.map(person => ({
        ...person,
        amount: amountPerPerson,
      }));
      setPeople(updatedPeople);
      if (onChange) { // Notificar pai apenas se houver uma função onChange
        notifyParent(updatedPeople);
      }
    }
    // Não é necessário um 'else' aqui, pois a edição manual já desativa 'splitEqually'
  }, [splitEqually, people.length, accountTotal]); // Adicionado onChange à lista de dependências para garantir que notifyParent use a versão mais recente


  // Notifica o componente pai sobre as mudanças
  const notifyParent = (updatedPeople) => {
    if (onChange) {
      onChange(updatedPeople);
    }
  };
  
  const handleSplitEquallyChange = (e) => {
    setSplitEqually(e.target.checked);
    // Se estiver desmarcando, não faz nada com os valores, eles permanecem manuais.
    // Se estiver marcando, o useEffect acima cuidará da redistribuição.
  };

  const handleAddPerson = () => {
    const newPerson = {
      id: Date.now(),
      name: '',
      amount: '', // Mantém vazio, useEffect cuidará se splitEqually for true
    };
    const updatedPeopleList = [...people, newPerson];
    setPeople(updatedPeopleList);
    // Se splitEqually for true, o useEffect já vai recalcular.
    // Se for false, apenas adiciona a pessoa e notifica.
    if (!splitEqually) {
      notifyParent(updatedPeopleList);
    }
    // Se splitEqually for true, o useEffect disparará notifyParent.
  };

  const handleRemovePerson = (id) => {
    const updatedPeopleList = people.filter(person => person.id !== id);
    setPeople(updatedPeopleList);
    // Se splitEqually for true, o useEffect já vai recalcular.
    // Se for false, apenas remove a pessoa e notifica.
    if (!splitEqually) {
      notifyParent(updatedPeopleList);
    }
    // Se splitEqually for true, o useEffect disparará notifyParent.
  };

  const handlePersonChange = (id, field, value) => {
    let newSplitEquallyState = splitEqually;
    if (field === 'amount') {
      newSplitEquallyState = false; // Desativa splitEqually se o valor for editado manualmente
      if (splitEqually) setSplitEqually(false); // Atualiza o estado do checkbox
    }

    const updatedPeople = people.map(person =>
      person.id === id ? { ...person, [field]: value } : person
    );
    setPeople(updatedPeople);
    notifyParent(updatedPeople); // Notifica sempre
  };

  return (
    <div className={styles.splitterContainer}>
      <h5 className={styles.title}>Dividir conta com:</h5>
      
      <div className={styles.equalSplitCheckboxContainer}>
        <input
          type="checkbox"
          id="equalSplitCheckbox" // Adicionar um ID para o label htmlFor
          checked={splitEqually}
          onChange={handleSplitEquallyChange}
          disabled={people.length === 0 || accountTotal <= 0}
          className={styles.checkboxInput}
        />
        <label htmlFor="equalSplitCheckbox">
          Dividir valor igualmente ({people.length > 0 && accountTotal > 0 ? `R$ ${(accountTotal / people.length).toFixed(2)} cada` : 'R$ 0.00 cada'})
        </label>
      </div>

      {people.map((person, index) => (
        <div key={person.id} className={styles.personRow}>
          <input
            type="text"
            placeholder={`Pessoa ${index + 1}`}
            value={person.name}
            onChange={(e) => handlePersonChange(person.id, 'name', e.target.value)}
            className={styles.inputName}
            list="remembered-people-options"
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            value={person.amount}
            onChange={(e) => handlePersonChange(person.id, 'amount', e.target.value)}
            className={styles.inputAmount}
            step="0.01"
            readOnly={splitEqually}
          />
          <button
            type="button"
            onClick={() => handleRemovePerson(person.id)}
            className={styles.removeButton}
          >
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddPerson}
        className={styles.addButton}
      >
        Adicionar Pessoa
      </button>

      {/* Datalist para sugestões de nomes - O datalist em si não precisa de estilo de módulo direto */}
      <datalist id="remembered-people-options">
        {rememberedPeopleList.map(name => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </div>
  );
};

export default PeopleSplitter;
