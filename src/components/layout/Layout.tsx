import { ReactNode, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Wallet, TrendingUp, TrendingDown,
  PieChart, Zap, CreditCard, PiggyBank, Gift,
  BarChart3, Menu, X, ChevronRight
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'text-blue-400' },
  { id: 'billetera', label: 'Billetera', icon: Wallet, path: '/billetera', color: 'text-emerald-400' },
  { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, path: '/ingresos', color: 'text-green-400' },
  { id: 'egresos', label: 'Egresos', icon: TrendingDown, path: '/egresos', color: 'text-red-400' },
  { id: 'budget', label: 'Budget', icon: PieChart, path: '/budget', color: 'text-purple-400' },
  { id: 'servicios', label: 'Servicios', icon: Zap, path: '/servicios', color: 'text-yellow-400' },
  { id: 'creditos', label: 'Creditos', icon: CreditCard, path: '/creditos', color: 'text-orange-400' },
  { id: 'reserva', label: 'Reserva', icon: PiggyBank, path: '/reserva', color: 'text-teal-400' },
  { id: 'gift-list', label: 'Gift List', icon: Gift, path: '/gift-list', color: 'text-pink-400' },
  { id: 'balance', label: 'Balance', icon: BarChart3, path: '/balance', color: 'text-indigo-400' },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const currentPage = navItems.find(item => location.pathname === item.path)

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      {/* Sidebar Desktop */}
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-[#1a1f2e] border-r border-[#2d3748] z-20 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[#2d3748]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-white font-bold text-lg tracking-tight"
                >
                  Genesys
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-gray-400 hover:text-white transition-colors p-1"
          >
            <ChevronRight
              size={16}
              className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-blue-600/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={18} className={`flex-shrink-0 relative z-10 ${isActive ? item.color : ''}`} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2d3748]">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500 text-center"
              >
                Genesys v1.0
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-[#1a1f2e] border-r border-[#2d3748] z-40 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-[#2d3748]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <span className="text-white font-bold text-lg">Genesys</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <Icon size={18} className={isActive ? item.color : ''} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  )
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#1a1f2e] border-b border-[#2d3748] flex items-center px-4 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-white font-semibold text-base">
              {currentPage?.label || 'Genesys'}
            </h1>
            <p className="text-gray-500 text-xs">Finanzas Personales</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-sm font-medium">betozamudio</p>
              <p className="text-gray-500 text-xs">San Miguel de Allende</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}