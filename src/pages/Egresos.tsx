import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingDown, Search, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Egresos() {
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0], tipo: 'variable', estado: 'pendiente' });

  useEffect(() => { fetchEgresos(); }, []);

  async function fetchEgresos() {
    setLoading(true);
    try {
      const { data } = await supabase.from('egresos').select('*').order('fecha', { ascending: false });
      if (data) setEgresos(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function addEgreso(e) {
    e.preventDefault();
    if (!form.descripcion || !form.monto) return;
    try {
      await supabase.from('egresos').insert([{ ...form, monto: parseFloat(form.monto) }]);
      setForm({ descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0], tipo: 'variable', estado: 'pendiente' });
      setShowForm(false);
      fetchEgresos();
    } catch (e) { console.error(e); }
  }

  async function deleteEgreso(id) {
    await supabase.from('egresos').delete().eq('id', id);
    fetchEgresos();
  }

  const filtered = egresos.filter(e => e.descripcion?.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.reduce((sum, e) => sum + (e.monto || 0), 0);

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white tracking-tight">
            Egresos
          </motion.h1>
          <p className="text-gray-400 mt-1">Controla tus gastos y pagos.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors">
          <Plus size={18} /> Nuevo Egreso
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Egresos</p>
          <p className="text-3xl font-bold text-rose-400 mt-2">${total.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-1">{filtered.length} registros</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={addEgreso} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
            <h3 className="text-white font-semibold text-lg">Nuevo Egreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-rose-500 focus:outline-none w-full" required />
              <input type="number" placeholder="Monto" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-rose-500 focus:outline-none w-full" required />
              <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-rose-500 focus:outline-none w-full" />
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-rose-500 focus:outline-none w-full">
                <option value="variable">Variable</option>
                <option value="fijo">Fijo</option>
                <option value="extra">Extra</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors">Guardar</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">Cancelar</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar egresos..." value={search} onChange={e => setSearch(e.target.value)} className="bg-gray-700 text-white rounded-xl pl-10 pr-4 py-2 border border-gray-600 focus:border-rose-500 focus:outline-none w-full md:w-64" />
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse flex gap-4">
                <div className="h-10 w-10 bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-700 rounded w-1/4" />
                </div>
                <div className="h-6 bg-gray-700 rounded w-20" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <TrendingDown size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No hay egresos registrados.</p>
            </div>
          ) : (
            filtered.map((egreso, i) => (
              <motion.div key={egreso.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="flex items-center p-4 hover:bg-gray-750 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <TrendingDown className="text-rose-400" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{egreso.descripcion}</p>
                  <p className="text-gray-500 text-sm">{egreso.fecha} &bull; {egreso.tipo}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-rose-400 font-bold">-${(egreso.monto || 0).toLocaleString()}</span>
                  <button onClick={() => deleteEgreso(egreso.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-rose-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}