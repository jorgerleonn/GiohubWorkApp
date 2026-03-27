'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { EstadisticaPorAsignatura } from '@/lib/types'

interface Props {
  data: EstadisticaPorAsignatura[]
}

export function HorasPorAsignaturaChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="asignatura" 
          stroke="#fff"
          angle={-45}
          textAnchor="end"
          height={80}
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
          formatter={(value: any) => [`${Number(value).toFixed(2)} horas`, 'Tiempo']}
        />
        <Bar dataKey="total_horas" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#FF4C4C'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
