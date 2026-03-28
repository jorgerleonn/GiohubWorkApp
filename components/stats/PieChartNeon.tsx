'use client'

import { useMemo, useState, useEffect } from 'react'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip'
import { EstadisticaPorAsignatura } from '@/lib/types'

const defaultColors = [
  '#00ff88',
  '#00d4ff',
  '#bf5af2',
  '#ff6b9d',
  '#ffd93d',
  '#ff9f43',
  '#ff4c4c',
  '#00ffff',
]

function getTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000000' : '#ffffff'
}

interface Props {
  data: EstadisticaPorAsignatura[]
}

export function PieChartNeon({ data }: Props) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<EstadisticaPorAsignatura>()

  const { TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const [containerWidth, setContainerWidth] = useState(400)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateWidth = () => {
      const container = document.getElementById('pie-chart-container')
      if (container) {
        setContainerWidth(container.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const colors = useMemo(() => {
    return data.map((d, i) => d.color || defaultColors[i % defaultColors.length])
  }, [data])

  const totalHoras = useMemo(() => {
    return data.reduce((sum, d) => sum + d.total_horas, 0)
  }, [data])

  const radius = Math.min(containerWidth, 300) / 2 - 20
  const centerX = containerWidth / 2

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-deepworkos-text-muted">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <div id="pie-chart-container" className="relative w-full">
      <svg width="100%" height={300}>
        <Group top={150} left={centerX}>
          <Pie<EstadisticaPorAsignatura>
            data={data}
            pieValue={(d) => d.total_horas}
            outerRadius={mounted ? radius : 0}
            innerRadius={mounted ? radius * 0.55 : 0}
            padAngle={0.02}
          >
            {(pie) => {
              return pie.arcs.map((arc: any, index: number) => {
                const arcData = arc.data as EstadisticaPorAsignatura
                const centroid = pie.path.centroid(arc) as [number, number]
                const percent = ((arcData.total_horas / totalHoras) * 100).toFixed(1)
                const color = colors[index % colors.length]
                const textColor = getTextColor(color)
                const showText = arc.endAngle - arc.startAngle > 0.3

                return (
                  <g key={`arc-${index}`}>
                    <path
                      d={pie.path(arc) || ''}
                      fill={color}
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth={1}
                      style={{
                        filter: mounted ? `drop-shadow(0 0 6px ${color}60)` : 'none',
                        cursor: 'pointer',
                        transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                        transitionDelay: `${index * 0.1}s`,
                      }}
                      onMouseEnter={(e) => {
                        showTooltip({
                          tooltipData: arcData,
                          tooltipLeft: e.clientX,
                          tooltipTop: e.clientY,
                        })
                      }}
                      onMouseLeave={hideTooltip}
                    />
                    {mounted && showText && (
                      <text
                        x={centroid[0]}
                        y={centroid[1]}
                        fill={textColor}
                        fontSize={11}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ 
                          pointerEvents: 'none',
                          opacity: mounted ? 1 : 0,
                          transition: 'opacity 0.3s',
                          transitionDelay: `${index * 0.1 + 0.3}s`
                        }}
                      >
                        {percent}%
                      </text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
          {mounted && (
            <>
              <text
                textAnchor="middle"
                dy="-0.3em"
                fill="#aaaabc"
                fontSize={12}
              >
                Total
              </text>
              <text
                textAnchor="middle"
                dy="1em"
                fill="#ffffff"
                fontSize={20}
                fontWeight="bold"
                style={{
                  textShadow: '0 0 8px rgba(0,255,136,0.4)',
                }}
              >
                {totalHoras.toFixed(1)}h
              </text>
            </>
          )}
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: 'rgba(22, 22, 31, 0.95)',
            border: `1px solid ${tooltipData.color || '#00d4ff'}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: `0 0 20px ${tooltipData.color || '#00d4ff'}40`,
          }}
        >
          <div className="text-white font-semibold">{tooltipData.asignatura}</div>
          <div className="text-deepworkos-text-muted text-sm">
            {tooltipData.total_horas.toFixed(2)} horas
          </div>
          <div className="text-deepworkos-text-muted text-xs">
            {tooltipData.sesiones_count} sesiones
          </div>
        </TooltipInPortal>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {data.map((item, index) => (
          <div 
            key={item.asignatura_id} 
            className="flex items-center gap-2"
            style={{ 
              opacity: mounted ? 1 : 0, 
              transition: 'opacity 0.3s', 
              transitionDelay: `${index * 0.1 + 0.4}s` 
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: item.color || defaultColors[index % defaultColors.length],
                boxShadow: `0 0 6px ${item.color || defaultColors[index % defaultColors.length]}`,
              }}
            />
            <span className="text-sm text-deepworkos-text-muted">{item.asignatura}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
