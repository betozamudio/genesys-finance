import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, PiggyBank, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function Reserva() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ concepto: '', monto: '', tipo: 'deposito', fecha: format(new Date(), 'yyyy-MM-dd') });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('reserva_historial').select('*').order('fecha', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('reserva_historial').insert([{ concepto: form.concepto, monto: parseFloat(form.monto), tipo: form.tipo, fecha: form.fecha }]);
    setForm({ concepto: '', monto: '', tipo: 'deposito', fecha: format(new Date(), 'yyyy-MM-dd') });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('reserva_historial').delete().eq('id', id);
    fetchData();
  };

  const totalReserva = items.reduce((a, i) => {
    const m = Number(i.monto || 0);
    return i.tipo === 'retiro' ? a - m : a + m;
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white">Reserva</h1><p className="text-slate-400 mt-1">Fondo de emergencia y ahorro</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
          <PlusCircle size={20} /> Nuevo Movimiento
        </motion.button>
      </div>
      <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-8 border border-emerald-700/50">
        <div className="flex items-center gap-3 mb-2"><PiggyBank className="text-emerald-400" size={28} /><span className="text-emerald-200 text-lg">Fondo de Reserva</span></div>
        <p className="text-5xl font-bold text-emerald-400">${totalReserva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
      </div>
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input required placeholder="Concepto" value={form.concepto} onChange={e => setForm({ ...form, concepto: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
            <input required type="number" step="0.01" placeholder="Monto" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
              <option value="deposito">Deposito</option>
              <option value="retiro">Retiro</option>
            </select>
            <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
            <button type="submit" className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-colors">Guardar</button>
          </form>
        </motion.div>
      )}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><TrendingUp className="text-emerald-400" size={18} />Historial de movimientos</h3>
        {loading ? <p className="text-slate-400">Cargando...</p> : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between bg-slate-700 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{item.concepto}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.fecha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={item.tipo === 'retiro' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {item.tipo === 'retiro' ? '-' : '+'}${Number(item.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
