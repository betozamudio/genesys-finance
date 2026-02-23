import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Target, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../lib/supabase';

export default function Budget() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoria: '', presupuesto: '', gastado: '' });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('budget').select('*').order('categoria');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('budget').insert([{ categoria: form.categoria, presupuesto: parseFloat(form.presupuesto), gastado: parseFloat(form.gastado || '0') }]);
    setForm({ categoria: '', presupuesto: '', gastado: '' });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('budget').delete().eq('id', id);
    fetchData();
  };

  const totalPresupuesto = items.reduce((a, i) => a + Number(i.presupuesto || 0), 0);
  const totalGastado = items.reduce((a, i) => a + Number(i.gastado || 0), 0);
  const chartData = items.map(i => ({ name: i.categoria, Presupuesto: Number(i.presupuesto), Gastado: Number(i.gastado || 0) }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white">Budget</h1><p className="text-slate-400 mt-1">Presupuesto mensual por categoria</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
          <PlusCircle size={20} /> Nueva Categoria
        </motion.button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-1"><Target className="text-yellow-400" size={20} /><span className="text-slate-400">Total Presupuesto</span></div>
          <p className="text-3xl font-bold text-yellow-400">${totalPresupuesto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="text-orange-400" size={20} /><span className="text-slate-400">Total Gastado</span></div>
          <p className="text-3xl font-bold text-orange-400">${totalGastado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input required placeholder="Categoria" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500" />
            <input required type="number" step="0.01" placeholder="Presupuesto" value={form.presupuesto} onChange={e => setForm({ ...form, presupuesto: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500" />
            <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl py-3 font-semibold transition-colors">Guardar</button>
          </form>
        </motion.div>
      )}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Presupuesto vs Gasto</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }} />
            <Legend />
            <Bar dataKey="Presupuesto" fill="#eab308" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Gastado" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Categorias</h3>
        {loading ? <p className="text-slate-400">Cargando...</p> : (
          <div className="space-y-3">
            {items.map(item => {
              const pct = item.presupuesto > 0 ? Math.min(100, (item.gastado / item.presupuesto) * 100) : 0;
              return (
                <div key={item.id} className="bg-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{item.categoria}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-sm">${Number(item.gastado || 0).toFixed(2)} / ${Number(item.presupuesto).toFixed(2)}</span>
                      <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="bg-slate-600 rounded-full h-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }}
                      className={'h-2 rounded-full ' + (pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-green-500')} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pct.toFixed(0)}% utilizado</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
