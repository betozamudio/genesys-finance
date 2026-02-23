import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, Search, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Ingresos() {
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchIngresos(); }, []);

  async function fetchIngresos() {
    setLoading(true);
    try {
      const { data } = await supabase.from('ingresos').select('*').order('fecha', { ascending: false });
      if (data) setIngresos(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function addIngreso(e: React.FormEvent) {
    e.preventDefault();
    if (!form.descripcion || !form.monto) return;
    try {
      await supabase.from('ingresos').insert([{ ...form, monto: parseFloat(form.monto) }]);
      setForm({ descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchIngresos();
    } catch (e) { console.error(e); }
  }

  async function deleteIngreso(id: number) {
    await supabase.from('ingresos').delete().eq('id', id);
    fetchIngresos();
  }

  const filtered = ingresos.filter(i => i.descripcion?.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.reduce((sum, i) => sum + (i.monto || 0), 0);

  // Group by month for chart
  const byMonth: Record<string, number> = {};
  ingresos.forEach(i => {
    const m = i.fecha?.slice(0, 7) || 'N/A';
    byMonth[m] = (byMonth[m] || 0) + (i.monto || 0);
  });
  const chartData = Object.entries(byMonth).slice(-6).map(([name, value]) => ({ name: name.slice(5), value }));

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white tracking-tight">Ingresos</motion.h1>
          <p className="text-gray-400 mt-1">Registra y monitorea tus fuentes de ingresos.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">
          <Plus size={18} /> Nuevo Ingreso
        </button>
      </header>

      {/* KPI + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Ingresos</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2">${total.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-1">{filtered.length} registros</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Ingresos por Mes</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '10px', color: '#F9FAFB' }} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={addIngreso}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-2xl p-6 border border-emerald-500/30 space-y-4">
            <h3 className="text-white font-semibold text-lg">Nuevo Ingreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Descripcion" value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none" required />
              <input type="number" placeholder="Monto" value={form.monto}
                onChange={e => setForm({ ...form, monto: e.target.value })}
                className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none" required />
              <input type="date" value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })}
                className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">Guardar</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">Cancelar</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-gray-700 text-white rounded-xl pl-9 pr-4 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none w-full text-sm" />
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse flex gap-4">
                <div className="h-10 w-10 bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-2"><div className="h-4 bg-gray-700 rounded w-1/3" /><div className="h-3 bg-gray-700 rounded w-1/4" /></div>
                <div className="h-6 bg-gray-700 rounded w-20" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No hay ingresos. ¡Agrega tu primer ingreso!</p>
            </div>
          ) : (
            filtered.map((ingreso, i) => (
              <motion.div key={ingreso.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center p-4 hover:bg-gray-750 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <TrendingUp className="text-emerald-400" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{ingreso.descripcion}</p>
                  <p className="text-gray-500 text-sm">{ingreso.fecha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">+${(ingreso.monto || 0).toLocaleString()}</span>
                  <button onClick={() => deleteIngreso(ingreso.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-rose-400 transition-all">
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