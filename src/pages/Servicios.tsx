import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Zap, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Servicios() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', monto: '', periodicidad: 'mensual', fecha_cobro: '', activo: true });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('servicios').select('*').order('nombre');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('servicios').insert([{ nombre: form.nombre, monto: parseFloat(form.monto), periodicidad: form.periodicidad, fecha_cobro: form.fecha_cobro || null, activo: true }]);
    setForm({ nombre: '', monto: '', periodicidad: 'mensual', fecha_cobro: '', activo: true });
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('servicios').delete().eq('id', id);
    fetchData();
  };

  const totalMensual = items.filter(i => i.activo).reduce((a, i) => {
    const m = Number(i.monto || 0);
    if (i.periodicidad === 'anual') return a + m / 12;
    if (i.periodicidad === 'semanal') return a + m * 4;
    return a + m;
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white">Servicios</h1><p className="text-slate-400 mt-1">Suscripciones y servicios recurrentes</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
          <PlusCircle size={20} /> Nuevo Servicio
        </motion.button>
      </div>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-1"><Zap className="text-cyan-400" size={20} /><span className="text-slate-400">Gasto mensual estimado</span></div>
        <p className="text-3xl font-bold text-cyan-400">${totalMensual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
      </div>
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input required placeholder="Nombre del servicio" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500" />
            <input required type="number" step="0.01" placeholder="Monto" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500" />
            <select value={form.periodicidad} onChange={e => setForm({ ...form, periodicidad: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500">
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
              <option value="semanal">Semanal</option>
            </select>
            <input type="date" value={form.fecha_cobro} onChange={e => setForm({ ...form, fecha_cobro: e.target.value })} className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
            <button type="submit" className="col-span-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-3 font-semibold transition-colors">Guardar</button>
          </form>
        </motion.div>
      )}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        {loading ? <p className="text-slate-400">Cargando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl p-4 border ${item.activo ? 'bg-slate-700 border-slate-600' : 'bg-slate-700/50 border-slate-700 opacity-60'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg"><Zap className="text-cyan-400" size={16} /></div>
                    <div>
                      <p className="text-white font-medium">{item.nombre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full">{item.periodicidad}</span>
                        {item.fecha_cobro && <span className="text-xs text-slate-400">{format(new Date(item.fecha_cobro + 'T00:00:00'), 'dd MMM', { locale: es })}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">${Number(item.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
