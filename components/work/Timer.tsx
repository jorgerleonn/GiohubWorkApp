'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/lib/store/timerStore'

interface TimerProps {
  onComplete: (segundos: number) => void
  modo: 'pomodoro' | 'flowtime'
}

export function Timer({ onComplete, modo }: TimerProps) {
  const { 
    segundos, activo, pausado, startTime, pauseStartTime,
    setSegundos, setActivo, setPausado, setStartTime, setPauseStartTime, reset 
  } = useTimerStore()
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!activo || pausado) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const updateTimer = () => {
      if (startTime) {
        let adjustedStartTime = startTime
        if (pauseStartTime) {
          const pausedDuration = Date.now() - pauseStartTime
          adjustedStartTime = startTime + pausedDuration
        }
        const elapsed = Math.floor((Date.now() - adjustedStartTime) / 1000)
        setSegundos(elapsed)
      }
    }

    updateTimer()
    intervalRef.current = setInterval(updateTimer, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activo, pausado, startTime, pauseStartTime, setSegundos])

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
    setStartTime(Date.now())
    setPauseStartTime(null)
    setSegundos(0)
  }

  const handlePause = () => {
    if (!pausado) {
      setPauseStartTime(Date.now())
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } else {
      if (pauseStartTime) {
        const pausedDuration = Date.now() - pauseStartTime
        setStartTime(startTime ? startTime + pausedDuration : Date.now())
      }
      setPauseStartTime(null)
    }
    setPausado(!pausado)
  }

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    let finalSeconds = segundos
    if (startTime) {
      let adjustedStartTime = startTime
      if (pauseStartTime) {
        const pausedDuration = Date.now() - pauseStartTime
        adjustedStartTime = startTime + pausedDuration
      }
      finalSeconds = Math.floor((Date.now() - adjustedStartTime) / 1000)
    }
    
    if (finalSeconds === 0) return
    
    setActivo(false)
    setPausado(false)
    
    onComplete(finalSeconds)
    
    reset()
  }

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setActivo(false)
    setPausado(false)
    setSegundos(0)
    setStartTime(null)
    setPauseStartTime(null)
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      <div className="text-9xl font-bold text-white tabular-nums tracking-tight">
        {formatearTiempo(segundos)}
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full transition-all ${
          activo && !pausado ? 'bg-deepworkos-success animate-pulse' : 
          activo && pausado ? 'bg-deepworkos-orange' : 
          'bg-deepworkos-gray'
        }`} style={{
          boxShadow: activo && !pausado ? '0 0 10px #00ff88' : activo && pausado ? '0 0 10px #ff9f43' : 'none'
        }} />
        <span className="text-sm text-deepworkos-text-muted">
          {activo && !pausado ? 'En progreso' : 
           activo && pausado ? 'Pausado' : 
           'Detenido'}
        </span>
      </div>

      <div className="flex gap-4">
        {!activo ? (
          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-deepworkos-success hover:bg-deepworkos-success/80 text-white text-lg px-10 py-6 shadow-neon-success"
          >
            ▶ Iniciar
          </Button>
        ) : (
          <>
            <Button 
              onClick={handlePause}
              size="lg"
              className={`${pausado ? 'bg-deepworkos-success hover:bg-deepworkos-success/80 shadow-neon-success' : 'bg-deepworkos-orange hover:bg-deepworkos-orange/80'} text-white text-lg px-10 py-6`}
            >
              {pausado ? '▶ Reanudar' : '⏸ Pausar'}
            </Button>
            <Button 
              onClick={handleStop}
              size="lg"
              className="bg-deepworkos-primary hover:bg-deepworkos-primary-hover text-white text-lg px-10 py-6 shadow-neon-primary"
            >
              ⏹ Detener
            </Button>
          </>
        )}
        
        {(activo || segundos > 0) && (
          <Button 
            onClick={handleReset}
            size="lg"
            className="bg-deepworkos-card-secondary hover:bg-deepworkos-card-hover text-white text-lg px-8 py-6 border border-deepworkos-border"
          >
            🔄
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-deepworkos-text-muted">
        <p>Modo: <span className="font-medium text-white">{modo === 'pomodoro' ? 'Pomodoro' : 'Flowtime'}</span></p>
      </div>
    </div>
  )
}
