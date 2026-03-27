'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { EstadisticaPorDia } from '@/lib/types'
import { format } from 'date-fns'

interface Props {
  data: EstadisticaPorDia[]
}

export function HorasPorDiaChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        No hay datos para mostrar
      </div>
    )
  }

  // Formatear fechas para el eje X
  const dataFormateada = data.map(item => ({
    ...item,
    fecha_corta: format(new Date(item.fecha), 'dd/MM')
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dataFormateada} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="fecha_corta" 
          stroke="#fff"
          fontSize={12}
        />
        <YAxis 
          stroke="#fff"
          label={{ value: 'Horas', angle: -90, position: 'insideLeft', fill: '#fff' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#2C2C2C', 
            border: 'none', 
            borderRadius: '8px',
            color: '#fff' 
          }}
          formatter={(value: any, name: any) => {
            if (name === 'total_horas') return [`${Number(value).toFixed(2)} horas`, 'Tiempo']
            return [value, name]
          }}
          labelFormatter={(label: any) => `Fecha: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="total_horas" 
          stroke="#40A5A4" 
          strokeWidth={3}
          dot={{ fill: '#40A5A4', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
