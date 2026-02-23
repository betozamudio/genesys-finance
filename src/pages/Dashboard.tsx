import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { supabase } from '../lib/supabase';
import StatCard from '../components/ui/StatCard';
import { BalanceMensual, Ingreso, Egreso } from '../types';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<BalanceMensual[]>([]);
  const [stats, setStats] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    balanceActual: 0,
    efectividadPresupuesto: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch balances mensuales for the chart
      const { data: balanceData } = await supabase
        .from('balance_mensual')
        .select('*')
        .order('anio', { ascending: true })
        .order('mes', { ascending: true })
        .limit(6);
      
      if (balanceData) setBalances(balanceData);

      // Fetch summary stats
      const { data: ingresos } = await supabase.from('ingresos').select('monto');
      const { data: egresos } = await supabase.from('egresos').select('monto');

      const totalI = ingresos?.reduce((sum, i) => sum + (i.monto || 0), 0) || 0;
      const totalE = egresos?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0;

      setStats({
        totalIngresos: totalI,
        totalEgresos: totalE,
        balanceActual: totalI - totalE,
        efectividadPresupuesto: totalI > 0 ? (1 - totalE/totalI) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const chartData = balances.map(b => ({
    name: `${b.mes}/${b.anio}`,
    ingresos: b.total_ingresos,
    egresos: b.total_egresos,
    balance: b.balance
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            Panel de Control
          </motion.h1>
          <p className="text-gray-400 mt-1">Bienvenido a Genesys Finance. Aquí está el resumen de tu salud financiera.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
          >
            <Calendar size={20} />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Descargar Reporte
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Balance Total"
          value={`$${stats.balanceActual.toLocaleString()}`}
          subtitle="Saldo disponible en cuentas"
          icon={<Wallet />}
          color="from-blue-500 to-blue-600"
          loading={loading}
        />
        <StatCard 
          title="Ingresos del Mes"
          value={`$${stats.totalIngresos.toLocaleString()}`}
          trend={12.5}
          icon={<TrendingUp />}
          color="from-emerald-500 to-emerald-600"
          loading={loading}
        />
        <StatCard 
          title="Gastos del Mes"
          value={`$${stats.totalEgresos.toLocaleString()}`}
          trend={-5.2}
          icon={<TrendingDown />}
          color="from-rose-500 to-rose-600"
          loading={loading}
        />
        <StatCard 
          title="Ahorro"
          value={`${stats.efectividadPresupuesto.toFixed(1)}%`}
          subtitle="Eficiencia del presupuesto"
          icon={<DollarSign />}
          color="from-amber-500 to-amber-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-white">Flujo de Caja</h3>
            <select className="bg-gray-700 text-white border-none rounded-lg text-sm px-3 py-1 outline-none">
              <Last 6 months</option>
              <Last year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#10B981" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={3} />
                <Area type="monotone" dataKey="egresos" stroke="#EF4444" fillOpacity={1} fill="url(#colorEgresos)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Categories Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Distribución de Gastos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Vivienda', value: 400 },
                    { name: 'Comida', value: 300 },
                    { name: 'Transporte', value: 300 },
                    { name: 'Ocio', value: 200 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {['Vivienda', 'Comida', 'Transporte', 'Ocio'].map((cat, i) => (
              <div key={cat} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-300 text-sm">{cat}</span>
                </div>
                <span className="text-white text-sm font-medium">25%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}