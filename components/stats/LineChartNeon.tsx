'use client'

import { useMemo, useState, useEffect } from 'react'
import { Group } from '@visx/group'
import { LinePath } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip'
import { EstadisticaPorDia } from '@/lib/types'
import { format } from 'date-fns'

interface Props {
  data: EstadisticaPorDia[]
}

interface DataPoint {
  date: Date
  total_horas: number
  fecha: string
  sesiones_count: number
}

export function LineChartNeon({ data }: Props) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<DataPoint>()

  const { TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const [containerWidth, setContainerWidth] = useState(600)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateWidth = () => {
      const container = document.getElementById('line-chart-container')
      if (container) {
        setContainerWidth(container.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const height = 300
  const margin = { top: 20, right: 20, bottom: 50, left: 50 }
  const innerWidth = containerWidth - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const dataWithDates = useMemo((): DataPoint[] => {
    return data.map(d => ({
      ...d,
      date: new Date(d.fecha)
    }))
  }, [data])

  const xScale = useMemo(() => {
    if (dataWithDates.length === 0) {
      return scaleTime({
        domain: [new Date(), new Date()],
        range: [0, innerWidth]
      })
    }
    
    let minDate = Math.min(...dataWithDates.map(d => d.date.getTime()))
    let maxDate = Math.max(...dataWithDates.map(d => d.date.getTime()))
    
    if (dataWithDates.length === 1) {
      const dayMs = 24 * 60 * 60 * 1000
      minDate = minDate - dayMs
      maxDate = maxDate + dayMs
    } else if (maxDate - minDate < 2 * 24 * 60 * 60 * 1000) {
      const dayMs = 24 * 60 * 60 * 1000
      minDate = minDate - dayMs
      maxDate = maxDate + dayMs
    }
    
    return scaleTime({
      domain: [minDate, maxDate],
      range: [0, innerWidth]
    })
  }, [dataWithDates, innerWidth])

  const yScale = useMemo(() => {
    const maxValue = Math.max(...dataWithDates.map(d => d.total_horas), 1)
    return scaleLinear({
      domain: [0, maxValue * 1.2],
      range: [innerHeight, 0]
    })
  }, [dataWithDates, innerHeight])

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-deepworkos-text-muted">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <div id="line-chart-container" className="relative w-full">
      <svg width="100%" height={height}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" stopOpacity={mounted ? 0.4 : 0} />
            <stop offset="100%" stopColor="#00ff88" stopOpacity={mounted ? 0.02 : 0} />
          </linearGradient>
          <filter id="glowGreen">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Group left={margin.left} top={margin.top}>
          {mounted && dataWithDates.length > 0 && (
            <>
              <path
                d={`
                  M ${xScale(dataWithDates[0].date)},${innerHeight}
                  L ${dataWithDates.map(d => `${xScale(d.date)},${yScale(d.total_horas)}`).join(' L ')}
                  L ${xScale(dataWithDates[dataWithDates.length - 1].date)},${innerHeight}
                  Z
                `}
                fill="url(#areaGradient)"
                stroke="transparent"
                style={{ transition: 'opacity 0.8s ease-out' }}
              />

              <LinePath<DataPoint>
                data={dataWithDates}
                x={d => xScale(d.date)}
                y={d => yScale(d.total_horas)}
                stroke="#00ff88"
                strokeWidth={3}
                filter="url(#glowGreen)"
                style={{ 
                  strokeDasharray: mounted ? 'none' : '2000',
                  strokeDashoffset: mounted ? 0 : 2000,
                  transition: 'stroke-dashoffset 1s ease-out'
                }}
              />

              {dataWithDates.map((d, i) => {
                const x = xScale(d.date)
                const y = yScale(d.total_horas)
                
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={mounted ? 5 : 0}
                    fill="#00ff88"
                    stroke="#0a0a0f"
                    strokeWidth={2}
                    style={{
                      filter: mounted ? 'drop-shadow(0 0 8px #00ff88)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.4s ease-out',
                      transitionDelay: `${i * 0.1}s`,
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      showTooltip({
                        tooltipData: d,
                        tooltipLeft: rect.left + rect.width / 2,
                        tooltipTop: rect.top,
                      })
                    }}
                    onMouseLeave={hideTooltip}
                  />
                )
              })}
            </>
          )}

          {xScale.ticks(Math.min(7, dataWithDates.length + 1)).map((tick, i) => {
            const x = xScale(tick)
            return (
              <g key={i} transform={`translate(${x}, ${innerHeight})`} style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s', transitionDelay: '0.5s' }}>
                <line y2={6} stroke="#2a2a3a" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="#aaaabc"
                  fontSize={11}
                >
                  {format(tick, 'dd/MM')}
                </text>
              </g>
            )
          })}

          {yScale.ticks(5).map((tick, i) => {
            const y = yScale(tick)
            return (
              <g key={i}>
                <line
                  x1={-8}
                  x2={0}
                  y1={y}
                  y2={y}
                  stroke="#2a2a3a"
                />
                <text
                  x={-12}
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
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: 'rgba(22, 22, 31, 0.95)',
            border: '1px solid #00ff88',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-white font-semibold">
            {format(new Date(tooltipData.fecha), 'dd/MM/yyyy')}
          </div>
          <div className="text-deepworkos-text-muted text-sm">
            {tooltipData.total_horas.toFixed(2)} horas
          </div>
          <div className="text-deepworkos-text-muted text-xs">
            {tooltipData.sesiones_count} sesiones
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
