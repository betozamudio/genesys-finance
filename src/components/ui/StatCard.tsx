import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  trend?: number;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'from-blue-500 to-blue-600',
  trend,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-700 rounded w-1/3" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
              </span>
              <span className="text-gray-500 text-xs ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
          >
            <div className="text-white text-xl">{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}