'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface TimerProps {
  onComplete: (segundos: number) => void
  modo: 'pomodoro' | 'flowtime'
}

export function Timer({ onComplete, modo }: TimerProps) {
  const [segundos, setSegundos] = useState(0)
  const [activo, setActivo] = useState(false)
  const [pausado, setPausado] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activo && !pausado) {
      intervalRef.current = setInterval(() => {
        setSegundos((s) => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activo, pausado])

  // Formato MM:SS o HH:MM:SS
  const formatearTiempo = (segs: number): string => {
    const horas = Math.floor(segs / 3600)
    const minutos = Math.floor((segs % 3600) / 60)
    const segundosRestantes = segs % 60

    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`
    }
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setActivo(true)
    setPausado(false)
  }

  const handlePause = () => {
    setPausado(!pausado)
  }

  const handleStop = () => {
    if (segundos === 0) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActivo(false)
    setPausado(false)
    
    // Llamar callback con los segundos trabajados
    onComplete(segundos)
    
    // Resetear
    setSegundos(0)
  }

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActivo(false)
    setPausado(false)
    setSegundos(0)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Display del tiempo */}
      <div className="bg-giohub-bg-dark rounded-2xl p-8 shadow-2xl">
        <div className="text-8xl font-bold text-white tabular-nums">
          {formatearTiempo(segundos)}
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          activo && !pausado ? 'bg-giohub-success animate-pulse' : 
          activo && pausado ? 'bg-giohub-orange' : 
          'bg-giohub-gray'
        }`} />
        <span className="text-sm text-gray-400">
          {activo && !pausado ? 'En progreso' : 
           activo && pausado ? 'Pausado' : 
           'Detenido'}
        </span>
      </div>

      {/* Botones de control */}
      <div className="flex gap-4">
        {!activo ? (
          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-giohub-success hover:bg-giohub-success/80 text-white text-lg px-8"
          >
            ▶ Iniciar
          </Button>
        ) : (
          <>
            <Button 
              onClick={handlePause}
              size="lg"
              className="bg-giohub-orange hover:bg-giohub-red text-white text-lg px-8"
            >
              {pausado ? '▶ Reanudar' : '⏸ Pausar'}
            </Button>
            <Button 
              onClick={handleStop}
              size="lg"
              className="bg-giohub-primary hover:bg-giohub-primary-hover text-white text-lg px-8"
            >
              ⏹ Detener
            </Button>
          </>
        )}
        
        {(activo || segundos > 0) && (
          <Button 
            onClick={handleReset}
            size="lg"
            variant="secondary"
            className="bg-giohub-card-secondary hover:bg-giohub-gray text-white text-lg px-8"
          >
            🔄 Reiniciar
          </Button>
        )}
      </div>

      {/* Info del modo */}
      <div className="text-center text-sm text-gray-400">
        <p>Modo: <span className="font-medium text-white">{modo === 'pomodoro' ? 'Pomodoro' : 'Flowtime'}</span></p>
        {modo === 'flowtime' && (
          <p className="text-xs mt-1">Descanso recomendado: {Math.floor(segundos / 5)} segundos</p>
        )}
      </div>
    </div>
  )
}
