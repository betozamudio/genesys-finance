import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Gift, CheckCircle, Circle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function GiftList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio_estimado: '', para_quien: '' });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('gift_list').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('gift_list').insert([{
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio_estimado: form.precio_estimado ? parseFloat(form.precio_estimado) : null,
      para_quien: form.para_quien,
      comprado: false
    }]);
    setForm({ nombre: '', descripcion: '', precio_estimado: '', para_quien: '' });
    setShowForm(false);
    fetchData();
  };

  const toggleComprado = async (item: any) => {
    await supabase.from('gift_list').update({ comprado: !item.comprado }).eq('id', item.id);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('gift_list').delete().eq('id', id);
    fetchData();
  };

  const totalEstimado = items.filter(i => !i.comprado).reduce((a, i) => a + Number(i.precio_estimado || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white">Gift List</h1><p className="text-slate-400 mt-1">Lista de regalos y deseos</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
          <PlusCircle size={20} /> Nuevo Regalo
        </motion.button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Total items</p>
          <p className="text-2xl font-bold text-white">{items.length}</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Comprados</p>
          <p className="text-2xl font-bold text-green-400">{items.filter(i => i.comprado).length}</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">Pendiente</p>
          <p className="text-2xl font-bold text-pink-400">${totalEstimado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input required placeholder="Nombre del regalo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500" />
            <input placeholder="Para quien" value={form.para_quien} onChange={e => setForm({ ...form, para_quien: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500" />
            <input placeholder="Descripcion" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500" />
            <input type="number" step="0.01" placeholder="Precio estimado" value={form.precio_estimado} onChange={e => setForm({ ...form, precio_estimado: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500" />
            <button type="submit" className="col-span-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 font-semibold transition-colors">Guardar</button>
          </form>
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-slate-400">Cargando...</p> : items.map(item => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-5 border ${item.comprado ? 'bg-slate-800/50 border-slate-700 opacity-70' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <button onClick={() => toggleComprado(item)} className="mt-1">
                  {item.comprado ? <CheckCircle className="text-green-400" size={20} /> : <Circle className="text-slate-500" size={20} />}
                </button>
                <div>
                  <p className={`font-semibold ${item.comprado ? 'text-slate-400 line-through' : 'text-white'}`}>{item.nombre}</p>
                  {item.para_quien && <p className="text-pink-400 text-sm">Para: {item.para_quien}</p>}
                  {item.descripcion && <p className="text-slate-400 text-sm mt-1">{item.descripcion}</p>}
                  {item.precio_estimado && <p className="text-white font-bold mt-2">${Number(item.precio_estimado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400 ml-2"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
