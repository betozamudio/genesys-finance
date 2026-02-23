import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Billetera from './pages/Billetera';
import Ingresos from './pages/Ingresos';
import Egresos from './pages/Egresos';
import Budget from './pages/Budget';
import Servicios from './pages/Servicios';
import Creditos from './pages/Creditos';
import Reserva from './pages/Reserva';
import GiftList from './pages/GiftList';
import Balance from './pages/Balance';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billetera" element={<Billetera />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/egresos" element={<Egresos />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/creditos" element={<Creditos />} />
          <Route path="/reserva" element={<Reserva />} />
          <Route path="/gift-list" element={<GiftList />} />
          <Route path="/balance" element={<Balance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
