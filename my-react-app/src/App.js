import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import AddEditAccountPage from './pages/AddEditAccountPage';
// Se você tiver um arquivo CSS global que queira manter, pode importá-lo aqui.
// import './App.css'; 

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: '20px' }}> {/* Adiciona um padding ao redor do conteúdo principal */}
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add" element={<AddEditAccountPage />} />
          {/* Outras rotas podem ser adicionadas aqui no futuro */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
