import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Creditos() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', saldo_total: '', saldo_pagado: '', tasa_interes: '', fecha_vencimiento: '' });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('creditos').select('*').order('nombre');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('creditos').insert([{
      nombre: form.nombre,
      saldo_total: parseFloat(form.saldo_total),
      saldo_pagado: parseFloat(form.saldo_pagado || '0'),
      tasa_interes: parseFloat(form.tasa_interes || '0'),
      fecha_vencimiento: form.fecha_vencimiento || null
    }]);
    setForm({ nombre: '', saldo_total: '', saldo_pagado: '', tasa_interes: '', fecha_vencimiento: '' });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('creditos').delete().eq('id', id);
    fetchData();
  };

  const totalDeuda = items.reduce((a, i) => a + Math.max(0, Number(i.saldo_total || 0) - Number(i.saldo_pagado || 0)), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white">Creditos</h1><p className="text-slate-400 mt-1">Gestion de creditos y deudas</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
          <PlusCircle size={20} /> Nuevo Credito
        </motion.button>
      </div>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-1"><AlertCircle className="text-purple-400" size={20} /><span className="text-slate-400">Deuda total pendiente</span></div>
        <p className="text-3xl font-bold text-purple-400">${totalDeuda.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
      </div>
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input required placeholder="Nombre del credito" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="col-span-2 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" />
            <input required type="number" step="0.01" placeholder="Saldo total" value={form.saldo_total} onChange={e => setForm({ ...form, saldo_total: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" />
            <input type="number" step="0.01" placeholder="Saldo pagado" value={form.saldo_pagado} onChange={e => setForm({ ...form, saldo_pagado: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" />
            <input type="number" step="0.01" placeholder="Tasa de interes %" value={form.tasa_interes} onChange={e => setForm({ ...form, tasa_interes: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500" />
            <input type="date" value={form.fecha_vencimiento} onChange={e => setForm({ ...form, fecha_vencimiento: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
            <button type="submit" className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-semibold transition-colors">Guardar</button>
          </form>
        </motion.div>
      )}
      <div className="space-y-4">
        {loading ? <p className="text-slate-400">Cargando...</p> : items.map(item => {
          const pendiente = Math.max(0, Number(item.saldo_total || 0) - Number(item.saldo_pagado || 0));
          const pct = Number(item.saldo_total) > 0 ? (Number(item.saldo_pagado || 0) / Number(item.saldo_total)) * 100 : 0;
          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 p-3 rounded-xl"><CreditCard className="text-purple-400" size={20} /></div>
                  <div>
                    <p className="text-white font-semibold text-lg">{item.nombre}</p>
                    {item.tasa_interes > 0 && <p className="text-slate-400 text-sm">{item.tasa_interes}% interes anual</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div><p className="text-slate-400 text-xs mb-1">Saldo Total</p><p className="text-white font-bold">${Number(item.saldo_total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p></div>
                <div><p className="text-slate-400 text-xs mb-1">Pagado</p><p className="text-green-400 font-bold">${Number(item.saldo_pagado || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p></div>
                <div><p className="text-slate-400 text-xs mb-1">Pendiente</p><p className="text-purple-400 font-bold">${pendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p></div>
              </div>
              <div className="bg-slate-700 rounded-full h-3">
                <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1">{pct.toFixed(0)}% pagado</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
