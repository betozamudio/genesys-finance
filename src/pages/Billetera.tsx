import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Billetera() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCuentas(); }, []);

  async function fetchCuentas() {
    setLoading(true);
    try {
      const { data } = await supabase.from('cuentas').select('*').order('nombre');
      if (data) setCuentas(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const totalSaldo = cuentas.reduce((sum, c) => sum + (c.saldo || 0), 0);

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white tracking-tight">
            Billetera
          </motion.h1>
          <p className="text-gray-400 mt-1">Gestiona tus cuentas y saldos.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
          <Plus size={18} /> Nueva Cuenta
        </button>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8">
        <p className="text-blue-100 font-medium">Saldo Total</p>
        <p className="text-5xl font-bold text-white mt-2">${totalSaldo.toLocaleString()}</p>
        <p className="text-blue-200 text-sm mt-2">Combinado de todas tus cuentas</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse h-32" />
          ))
        ) : cuentas.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <Wallet size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No hay cuentas registradas.</p>
          </div>
        ) : (
          cuentas.map((cuenta, i) => (
            <motion.div key={cuenta.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.02 }} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{cuenta.tipo || 'Cuenta'}</p>
                  <p className="text-white font-bold text-lg mt-1">{cuenta.nombre}</p>
                  <p className="text-2xl font-bold text-white mt-3">${(cuenta.saldo || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Wallet className="text-blue-400" size={22} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}