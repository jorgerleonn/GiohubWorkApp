'use client'

import { useMemo, useState, useEffect } from 'react'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
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

interface Props {
  data: EstadisticaPorAsignatura[]
}

export function BarStackNeon({ data }: Props) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<{ asignaturas: string; horas: number; color: string }>()

  const { TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const [containerWidth, setContainerWidth] = useState(600)
  const [animated, setAnimated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateWidth = () => {
      const container = document.getElementById('bar-chart-container')
      if (container) {
        setContainerWidth(container.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    if (mounted && data.length > 0) {
      setAnimated(true)
    }
  }, [mounted, data])

  const height = 300
  const margin = { top: 20, right: 20, bottom: 60, left: 50 }
  const innerWidth = containerWidth - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const colors = useMemo(() => {
    return data.map((d, i) => d.color || defaultColors[i % defaultColors.length])
  }, [data])

  const xScale = useMemo(() => {
    return scaleBand<string>({
      domain: data.map(d => d.asignatura),
      range: [0, innerWidth],
      padding: 0.3,
    })
  }, [data, innerWidth])

  const yScale = useMemo(() => {
    const maxValue = Math.max(...data.map(d => d.total_horas), 1)
    return scaleLinear<number>({
      domain: [0, maxValue * 1.1],
      range: [innerHeight, 0],
    })
  }, [data, innerHeight])

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-deepworkos-text-muted">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <div id="bar-chart-container" className="relative w-full">
      <svg width="100%" height={height}>
        <Group left={margin.left} top={margin.top}>
          {yScale.ticks(5).map((tick, i) => {
            const y = yScale(tick)
            return (
              <g key={i}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={y}
                  y2={y}
                  stroke="#2a2a3a"
                  strokeDasharray="4,4"
                />
                <text
                  x={-10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#aaaabc"
                  fontSize={10}
                >
                  {tick.toFixed(1)}h
                </text>
              </g>
            )
          })}

          {data.map((d, i) => {
            const barWidth = xScale.bandwidth()
            const x = xScale(d.asignatura) || 0
            const finalBarHeight = innerHeight - yScale(d.total_horas)
            const currentBarHeight = animated ? finalBarHeight : 0
            const color = colors[i]
            const isLight = parseInt(color.replace('#', '').substring(0, 2), 16) * 0.299 +
                           parseInt(color.replace('#', '').substring(2, 4), 16) * 0.587 +
                           parseInt(color.replace('#', '').substring(4, 6), 16) * 0.114 > 150

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={animated ? yScale(d.total_horas) : innerHeight}
                  width={barWidth}
                  height={currentBarHeight}
                  fill={color}
                  rx={6}
                  style={{
                    filter: animated ? `drop-shadow(0 0 8px ${color}60)` : 'none',
                    cursor: 'pointer',
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    transitionDelay: `${i * 0.15}s`,
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    showTooltip({
                      tooltipData: { asignaturas: d.asignatura, horas: d.total_horas, color },
                      tooltipLeft: rect.left + rect.width / 2,
                      tooltipTop: rect.top,
                    })
                  }}
                  onMouseLeave={hideTooltip}
                />
                <text
                  x={x + barWidth / 2}
                  y={innerHeight + 20}
                  textAnchor="middle"
                  fill="#aaaabc"
                  fontSize={10}
                  transform={`rotate(-35, ${x + barWidth / 2}, ${innerHeight + 20})`}
                  style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.3s', transitionDelay: `${i * 0.15 + 0.3}s` }}
                >
                  {d.asignatura.length > 10 ? d.asignatura.substring(0, 10) + '...' : d.asignatura}
                </text>
                {animated && finalBarHeight > 25 && (
                  <text
                    x={x + barWidth / 2}
                    y={yScale(d.total_horas) + 20}
                    textAnchor="middle"
                    fill={isLight ? '#000000' : '#ffffff'}
                    fontSize={11}
                    fontWeight="bold"
                    style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.3s', transitionDelay: `${i * 0.15 + 0.4}s` }}
                  >
                    {d.total_horas.toFixed(1)}h
                  </text>
                )}
              </g>
            )
          })}
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: 'rgba(22, 22, 31, 0.95)',
            border: `1px solid ${tooltipData.color}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: `0 0 20px ${tooltipData.color}40`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-white font-semibold">{tooltipData.asignaturas}</div>
          <div className="text-deepworkos-text-muted text-sm">
            {tooltipData.horas.toFixed(2)} horas
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
