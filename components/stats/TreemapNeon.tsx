'use client'

import { useMemo } from 'react'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip'
import { TreemapData } from '@/lib/actions/estadisticas'

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
  data: TreemapData
}

interface NodeData {
  x0: number
  x1: number
  y0: number
  y1: number
  data: TreemapData
  value?: number
  parent?: NodeData
  children?: NodeData[]
  depth?: number
}

export function TreemapNeon({ data }: Props) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<NodeData>()

  const { TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  const colors = useMemo(() => {
    const colorMap = new Map<string, string>()
    if (data.children) {
      data.children.forEach((child, index) => {
        colorMap.set(child.name, child.color || defaultColors[index % defaultColors.length])
      })
    }
    return colorMap
  }, [data])

  const nodes = useMemo(() => {
    const children = data.children
    if (!children || children.length === 0) return []
    
    const width = 800
    const height = 400
    const totalValue = children.reduce((sum, child) => {
      const childValue = child.children?.reduce((s, c) => s + (c.value || 0), 0) || child.value || 0
      return sum + childValue
    }, 0) || 1

    let currentY = 0
    return children.map((child, index) => {
      const childValue = child.children?.reduce((s, c) => s + (c.value || 0), 0) || child.value || 0
      const ratio = childValue / totalValue
      const nodeHeight = height * ratio
      
      const nodeWidth = width / Math.ceil(Math.sqrt(children.length))
      const nodeX = (index % Math.ceil(Math.sqrt(children.length))) * nodeWidth
      
      const node: NodeData = {
        x0: nodeX,
        x1: nodeX + nodeWidth,
        y0: currentY,
        y1: currentY + nodeHeight,
        data: child,
        value: childValue,
        depth: 1,
      }
      
      if (child.children && child.children.length > 0) {
        const childs = child.children
        const childTotalValue = childs.reduce((s, c) => s + (c.value || 0), 0) || 1
        let childY = currentY
        node.children = childs.map((c, cIndex) => {
          const cValue = c.value || 0
          const cRatio = cValue / childTotalValue
          const cHeight = nodeHeight * cRatio
          const cWidth = nodeWidth / childs.length
          
          const result: NodeData = {
            x0: nodeX + cIndex * cWidth,
            x1: nodeX + (cIndex + 1) * cWidth,
            y0: childY,
            y1: childY + cHeight,
            data: c,
            value: cValue,
            parent: node,
            depth: 2,
          }
          childY += cHeight
          return result
        })
      }
      
      currentY += nodeHeight
      return node
    })
  }, [data])

  if (!data.children || data.children.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-deepworkos-text-muted">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <div className="relative">
      <svg width="100%" height={400}>
        {nodes.map((node, index) => {
          const width = node.x1 - node.x0
          const height = node.y1 - node.y0
          const color = colors.get(node.data.name) || defaultColors[index % defaultColors.length]
          const childNodes = node.children || []

          return (
            <g key={`node-${index}`}>
              {childNodes.length > 0 ? (
                childNodes.map((child: NodeData, childIndex: number) => {
                  const childWidth = child.x1 - child.x0
                  const childHeight = child.y1 - child.y0
                  const childColor = color
                  
                  return (
                    <g key={`child-${index}-${childIndex}`}>
                      <rect
                        x={child.x0}
                        y={child.y0}
                        width={childWidth}
                        height={childHeight}
                        fill={childColor}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={1}
                        rx={4}
                        style={{
                          filter: `drop-shadow(0 0 6px ${childColor}80)`,
                          opacity: 0.85,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          showTooltip({
                            tooltipData: child,
                            tooltipLeft: rect.left + rect.width / 2,
                            tooltipTop: rect.top,
                          })
                        }}
                        onMouseLeave={hideTooltip}
                      />
                      {childWidth > 40 && childHeight > 20 && (
                        <text
                          x={child.x0 + childWidth / 2}
                          y={child.y0 + childHeight / 2}
                          fill="#fff"
                          fontSize={11}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ pointerEvents: 'none' }}
                        >
                          {child.data.name.length > 10 
                            ? child.data.name.substring(0, 10) + '...' 
                            : child.data.name}
                        </text>
                      )}
                      {childWidth > 40 && childHeight > 35 && (
                        <text
                          x={child.x0 + childWidth / 2}
                          y={child.y0 + childHeight / 2 + 14}
                          fill="rgba(255,255,255,0.7)"
                          fontSize={10}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ pointerEvents: 'none' }}
                        >
                          {child.value?.toFixed(1)}h
                        </text>
                      )}
                    </g>
                  )
                })
              ) : (
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={width}
                  height={height}
                  fill={color}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={1}
                  rx={4}
                  style={{
                    filter: `drop-shadow(0 0 6px ${color}80)`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    showTooltip({
                      tooltipData: node,
                      tooltipLeft: rect.left + rect.width / 2,
                      tooltipTop: rect.top,
                    })
                  }}
                  onMouseLeave={hideTooltip}
                />
              )}
              {width > 60 && height > 40 && (
                <>
                  <text
                    x={node.x0 + width / 2}
                    y={node.y0 + 20}
                    fill="#fff"
                    fontSize={14}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {node.data.name}
                  </text>
                  <text
                    x={node.x0 + width / 2}
                    y={node.y0 + height - 15}
                    fill="rgba(255,255,255,0.8)"
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.value?.toFixed(1)}h
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: 'rgba(22, 22, 31, 0.95)',
            border: '1px solid #00d4ff',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-white font-semibold">{tooltipData.data.name}</div>
          <div className="text-deepworkos-text-muted text-sm">
            {tooltipData.value?.toFixed(2)} horas
          </div>
        </TooltipInPortal>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.children?.slice(0, 6).map((child, index) => (
          <div key={child.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: child.color || defaultColors[index % defaultColors.length],
                boxShadow: `0 0 6px ${child.color || defaultColors[index % defaultColors.length]}`,
              }}
            />
            <span className="text-sm text-deepworkos-text-muted">{child.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
