// Types for Genesys Finance App

export interface Ingreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria_id?: number;
  cuenta_id?: number;
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Egreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria_id?: number;
  cuenta_id?: number;
  tipo: string;
  estado: string;
  notas?: string;
  recurrente?: boolean;
  frecuencia?: string;
  dia_pago?: number;
  monto_pagado?: number;
  fecha_proximo_pago?: string;
  es_imprevisto?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  color?: string;
  icono?: string;
  descripcion?: string;
  created_at?: string;
}

export interface Cuenta {
  id: number;
  nombre: string;
  tipo: string;
  saldo: number;
  saldo_inicial?: number;
  moneda?: string;
  color?: string;
  icono?: string;
  descripcion?: string;
  created_at?: string;
}

export interface Credito {
  id: number;
  nombre: string;
  tipo: string;
  monto_total: number;
  monto_pagado: number;
  monto_pendiente: number;
  tasa_interes: number;
  fecha_inicio: string;
  fecha_fin?: string;
  dia_corte?: number;
  dia_pago?: number;
  estado: string;
  banco?: string;
  numero_cuenta?: string;
  notas?: string;
  meses_plazo?: number;
  mensualidad?: number;
  saldo_actual?: number;
  limite_credito?: number;
  fecha_vencimiento?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreditoPago {
  id: number;
  credito_id: number;
  monto: number;
  fecha: string;
  tipo?: string;
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: number;
  categoria_id?: number;
  nombre: string;
  monto_presupuestado: number;
  monto_gastado?: number;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  color?: string;
  alerta_porcentaje?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GiftItem {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_estimado?: number;
  precio_real?: number;
  url?: string;
  imagen_url?: string;
  tienda?: string;
  prioridad?: number;
  estado: string;
  fecha_deseada?: string;
  para_persona?: string;
  ocasion?: string;
  notas?: string;
  monto_pagado?: number;
  comprado?: boolean;
  fecha_compra?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Reserva {
  id: number;
  nombre: string;
  monto_meta: number;
  monto_actual: number;
  fecha_meta?: string;
  color?: string;
  icono?: string;
  descripcion?: string;
  created_at?: string;
}

export interface ReservaHistorial {
  id: number;
  reserva_id: number;
  tipo: string;
  monto: number;
  fecha: string;
  notas?: string;
  saldo_anterior?: number;
  saldo_nuevo?: number;
  created_at?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  costo: number;
  frecuencia: string;
  dia_cobro?: number;
  fecha_proximo_cobro?: string;
  estado: string;
  categoria?: string;
  url?: string;
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BalanceMensual {
  id: number;
  mes: number;
  anio: number;
  total_ingresos: number;
  total_egresos: number;
  balance: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transferencia {
  id: number;
  cuenta_origen_id: number;
  cuenta_destino_id: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  comision?: number;
  notas?: string;
  created_at?: string;
}
