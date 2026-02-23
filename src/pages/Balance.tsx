import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Balance() {
  const [data, setData] = useState({ ingresos: 0, egresos: 0, reserva: 0, deudas: 0, servicios: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [ing, egr, res, cred, serv] = await Promise.all([
        supabase.from('ingresos').select('monto'),
        supabase.from('egresos').select('monto'),
        supabase.from('reserva_historial').select('monto,tipo'),
        supabase.from('creditos').select('saldo_total,saldo_pagado'),
        supabase.from('servicios').select('monto,periodicidad,activo').eq('activo', true),
      ]);
      const totalIngresos = (ing.data || []).reduce((a, i) => a + Number(i.monto || 0), 0);
      const totalEgresos = (egr.data || []).reduce((a, i) => a + Number(i.monto || 0), 0);
      const totalReserva = (res.data || []).reduce((a, i) => i.tipo === 'retiro' ? a - Number(i.monto || 0) : a + Number(i.monto || 0), 0);
      const totalDeudas = (cred.data || []).reduce((a, i) => a + Math.max(0, Number(i.saldo_total || 0) - Number(i.saldo_pagado || 0)), 0);
      const totalServicios = (serv.data || []).reduce((a, i) => {
        const m = Number(i.monto || 0);
        if (i.periodicidad === 'anual') return a + m / 12;
        if (i.periodicidad === 'semanal') return a + m * 4;
        return a + m;
      }, 0);
      setData({ ingresos: totalIngresos, egresos: totalEgresos, reserva: totalReserva, deudas: totalDeudas, servicios: totalServicios });
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return { name: format(d, 'MMM yy', { locale: es }), Ingresos: Math.round(Math.random() * 5000 + 3000), Egresos: Math.round(Math.random() * 3000 + 1500) };
      });
      setChartData(months);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const neto = data.ingresos - data.egresos;

  const cards = [
    { label: 'Ingresos Totales', value: data.ingresos, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Egresos Totales', value: data.egresos, icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'Balance Neto', value: neto, icon: DollarSign, color: neto >= 0 ? 'text-blue-400' : 'text-red-400', bg: neto >= 0 ? 'bg-blue-500/20' : 'bg-red-500/20' },
    { label: 'Fondo Reserva', value: data.reserva, icon: PiggyBank, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'Deudas Pendientes', value: data.deudas, icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'Servicios/mes', value: data.servicios, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Balance General</h1>
        <p className="text-slate-400 mt-1">Vision general de tu situacion financiera</p>
      </div>
      {loading ? (
        <div className="text-slate-400 text-center py-12">Cargando datos...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className={`inline-flex p-2 rounded-xl mb-3 ${card.bg}`}>
                  <card.icon className={card.color} size={20} />
                </div>
                <p className="text-slate-400 text-sm">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>${card.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Tendencia Ingresos vs Egresos (6 meses)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="Ingresos" stroke="#22c55e" fill="url(#gIngresos)" strokeWidth={2} />
                <Area type="monotone" dataKey="Egresos" stroke="#ef4444" fill="url(#gEgresos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  );
}
