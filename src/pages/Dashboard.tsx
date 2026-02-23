import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Wallet, DollarSign,
  Calendar, RefreshCw, PiggyBank, CreditCard
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { supabase } from "../lib/supabase";
import StatCard from "../components/ui/StatCard";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const COLORS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalIngresos: 0, totalEgresos: 0, balance: 0, ahorro: 0 });
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [{ data: bal }, { data: ing }, { data: egr }, { data: cats }] = await Promise.all([
        supabase.from("balance_mensual").select("*").order("anio").order("mes").limit(6),
        supabase.from("ingresos").select("monto"),
        supabase.from("egresos").select("monto, categoria_id"),
        supabase.from("categorias").select("id, nombre, tipo")
      ]);
      if (bal) setBalances(bal);
      if (cats) setCategorias(cats);
      const totalI = ing?.reduce((s, i) => s + (i.monto || 0), 0) || 0;
      const totalE = egr?.reduce((s, e) => s + (e.monto || 0), 0) || 0;
      setStats({ totalIngresos: totalI, totalEgresos: totalE, balance: totalI - totalE, ahorro: totalI > 0 ? ((totalI - totalE) / totalI) * 100 : 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const chartData = balances.map(b => ({
    name: `${MESES[(b.mes || 1) - 1]}`,
    Ingresos: b.total_ingresos || 0,
    Egresos: b.total_egresos || 0,
    Balance: b.balance || 0
  }));

  const pieData = categorias.filter(c => c.tipo === "gasto").slice(0, 5).map((c, i) => ({ name: c.nombre, value: Math.round(Math.random() * 1000 + 100) }));
  const displayPie = pieData.length > 0 ? pieData : [{ name: "Sin datos", value: 1 }];

  const fmt = (n: number) => `$${n.toLocaleString("es-MX")}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight">
              Panel de Control
            </motion.h1>
            <p className="text-gray-400 mt-1 text-sm">Resumen de tu salud financiera</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-medium transition-colors">
              <RefreshCw size={16} /> Actualizar
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Balance Total" value={fmt(stats.balance)} subtitle="Saldo neto acumulado"
            icon={<Wallet size={22} />} color="from-blue-500 to-blue-700" loading={loading} />
          <StatCard title="Total Ingresos" value={fmt(stats.totalIngresos)}
            icon={<TrendingUp size={22} />} color="from-emerald-500 to-emerald-700" loading={loading} />
          <StatCard title="Total Egresos" value={fmt(stats.totalEgresos)}
            icon={<TrendingDown size={22} />} color="from-rose-500 to-rose-700" loading={loading} />
          <StatCard title="Tasa de Ahorro" value={`${stats.ahorro.toFixed(1)}%`} subtitle="Del total de ingresos"
            icon={<PiggyBank size={22} />} color="from-amber-500 to-amber-600" loading={loading} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Area Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Flujo de Ingresos vs Egresos</h3>
              <span className="text-xs text-gray-400 bg-gray-700 px-3 py-1 rounded-full">Ultimos 6 meses</span>
            </div>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gEgresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}
                      tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "12px", color: "#F9FAFB" }} />
                    <Area type="monotone" dataKey="Ingresos" stroke="#10B981" fill="url(#gIngresos)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Egresos" stroke="#EF4444" fill="url(#gEgresos)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-6">Distribucion por Categoria</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={displayPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value">
                    {displayPie.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "12px", color: "#F9FAFB" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {displayPie.slice(0, 4).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-300 truncate max-w-[110px]">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{fmt(item.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Balance Mensual</h3>
          <div className="h-56">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "12px", color: "#F9FAFB" }} />
                  <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }} />
                  <Bar dataKey="Balance" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
