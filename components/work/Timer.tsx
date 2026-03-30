'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/lib/store/timerStore'

interface TimerProps {
  onComplete: (segundos: number) => void
  modo: 'pomodoro' | 'flowtime'
  breakRatio?: number
  pomodoroDuration?: number
  onBreakComplete?: () => void
}

type TimerMode = 'idle' | 'study' | 'break'

export function Timer({ onComplete, modo: modoProp, breakRatio: breakRatioProp = 0, pomodoroDuration: pomodoroDurationProp = 0, onBreakComplete }: TimerProps) {
  const { 
    segundos: storeSegundos,
    activo: storeActivo,
    pausado: storePausado,
    startTime: storeStartTime,
    pauseStartTime: storePauseStartTime,
    setSegundos,
    setActivo,
    setPausado,
    setStartTime,
    setPauseStartTime,
    reset: storeReset
  } = useTimerStore()
  
  const modoRef = useRef(modoProp)
  const breakRatioRef = useRef(breakRatioProp)
  const pomodoroDurationRef = useRef(pomodoroDurationProp)

  useEffect(() => {
    modoRef.current = modoProp
    breakRatioRef.current = breakRatioProp
    pomodoroDurationRef.current = pomodoroDurationProp
  }, [modoProp, breakRatioProp, pomodoroDurationProp])
  
  const [timerMode, setTimerMode] = useState<TimerMode>('idle')
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(0)
  const [localSegundos, setLocalSegundos] = useState(0)
  const [localActivo, setLocalActivo] = useState(false)
  const [localPausado, setLocalPausado] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pauseStartTimeRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setTimerMode('idle')
    setBreakSecondsLeft(0)
    setLocalSegundos(0)
    setLocalActivo(false)
    setLocalPausado(false)
    startTimeRef.current = null
    pauseStartTimeRef.current = null
    storeReset()
    localStorage.removeItem('deepworkos-timer-local')
  }, [clearTimer, storeReset])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const hasCompletedBreak = useRef(false)

  useEffect(() => {
    const saved = localStorage.getItem('deepworkos-timer-local')
    console.log('Loading from localStorage:', saved)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        console.log('Parsed data:', data)
        
        // Only restore if there's active timer data
        if (data.localActivo === true || data.timerMode === 'study' || data.timerMode === 'break') {
          console.log('Restoring timer state...')
          if (data.timerMode) setTimerMode(data.timerMode)
          if (data.breakSecondsLeft !== undefined) setBreakSecondsLeft(data.breakSecondsLeft)
          if (data.localSegundos !== undefined) setLocalSegundos(data.localSegundos)
          if (data.localActivo !== undefined) setLocalActivo(data.localActivo)
          if (data.localPausado !== undefined) setLocalPausado(data.localPausado)
          if (data.startTimeRef) startTimeRef.current = data.startTimeRef
          if (data.pauseStartTimeRef) pauseStartTimeRef.current = data.pauseStartTimeRef
          if (data.modo) modoRef.current = data.modo
          if (data.pomodoroDuration) pomodoroDurationRef.current = data.pomodoroDuration
          if (data.breakRatio) breakRatioRef.current = data.breakRatio
          
          if (data.localActivo && data.startTimeRef && !data.localPausado) {
            let adjustedStartTime = data.startTimeRef
            if (data.pauseStartTimeRef) {
              const pausedDuration = Date.now() - data.pauseStartTimeRef
              adjustedStartTime = data.startTimeRef + pausedDuration
            }
            startTimeRef.current = adjustedStartTime
            pauseStartTimeRef.current = null
            const elapsed = Math.floor((Date.now() - adjustedStartTime) / 1000)
            console.log('Elapsed seconds:', elapsed)
            if (data.timerMode === 'break' && data.breakSecondsLeft > 0) {
              const targetBreak = data.breakSecondsLeft - elapsed
              setBreakSecondsLeft(Math.max(0, targetBreak))
            } else {
              setLocalSegundos(elapsed)
            }
          }
        }
      } catch (e) {
        console.error('Error loading timer state:', e)
      }
    }
  }, [])

  useEffect(() => {
    const dataToSave = {
      timerMode,
      breakSecondsLeft,
      localSegundos,
      localActivo,
      localPausado,
      startTimeRef: startTimeRef.current,
      pauseStartTimeRef: pauseStartTimeRef.current,
      modo: modoRef.current,
      pomodoroDuration: pomodoroDurationRef.current,
      breakRatio: breakRatioRef.current
    }
    localStorage.setItem('deepworkos-timer-local', JSON.stringify(dataToSave))
  }, [timerMode, breakSecondsLeft, localSegundos, localActivo, localPausado])



  useEffect(() => {
    if (!localActivo || localPausado) {
      clearTimer()
      return
    }

    if (timerMode === 'break' && breakSecondsLeft <= 0 && !hasCompletedBreak.current) {
      return
    }

    const tick = () => {
      if (timerMode === 'break' && breakSecondsLeft > 0) {
        setBreakSecondsLeft(prev => {
          if (prev <= 1) {
            hasCompletedBreak.current = true
            clearTimer()
            setLocalActivo(false)
            setLocalPausado(false)
            setTimerMode('idle')
            setBreakSecondsLeft(0)
            if (onBreakComplete) {
              onBreakComplete()
            }
            return 0
          }
          return prev - 1
        })
      } else if (modoRef.current === 'pomodoro' && pomodoroDurationRef.current > 0 && timerMode === 'study') {
        const targetSeconds = pomodoroDurationRef.current * 60
        const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)
        const remaining = targetSeconds - elapsed
        
        if (remaining <= 0) {
          clearTimer()
          const studySeconds = targetSeconds
          setLocalActivo(false)
          setLocalPausado(false)
          
          if (breakRatioRef.current > 0 && studySeconds >= 60) {
            const breakSeconds = breakRatioRef.current * 60
            setBreakSecondsLeft(breakSeconds)
            setTimerMode('break')
            setLocalActivo(true)
            startTimeRef.current = Date.now()
            pauseStartTimeRef.current = null
            onComplete(studySeconds)
          } else {
            onComplete(studySeconds)
            reset()
          }
        } else {
          setLocalSegundos(remaining)
        }
      } else if (modoRef.current === 'flowtime' && timerMode === 'study') {
        if (startTimeRef.current) {
          let adjustedStartTime = startTimeRef.current
          if (pauseStartTimeRef.current) {
            const pausedDuration = Date.now() - pauseStartTimeRef.current
            adjustedStartTime = startTimeRef.current + pausedDuration
          }
          const elapsed = Math.floor((Date.now() - adjustedStartTime) / 1000)
          setLocalSegundos(elapsed)
        }
      }
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)

    return clearTimer
  }, [localActivo, localPausado, timerMode, breakSecondsLeft, onComplete, onBreakComplete, reset, clearTimer])

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
    hasCompletedBreak.current = false
    setTimerMode('study')
    setBreakSecondsLeft(0)
    
    setLocalActivo(true)
    setLocalPausado(false)
    startTimeRef.current = Date.now()
    pauseStartTimeRef.current = null
    
    if (modoRef.current === 'pomodoro') {
      setLocalSegundos(pomodoroDurationRef.current * 60)
    } else {
      setLocalSegundos(0)
    }
  }

  const handlePause = () => {
    if (!localPausado) {
      pauseStartTimeRef.current = Date.now()
      clearTimer()
    } else {
      if (pauseStartTimeRef.current) {
        const pausedDuration = Date.now() - pauseStartTimeRef.current
        startTimeRef.current = startTimeRef.current ? startTimeRef.current + pausedDuration : Date.now()
      }
      pauseStartTimeRef.current = null
    }
    setLocalPausado(!localPausado)
  }

  const handleStop = () => {
    clearTimer()

    let finalSeconds = 0
    
    if (timerMode === 'break') {
      setLocalActivo(false)
      setLocalPausado(false)
      setTimerMode('idle')
      setBreakSecondsLeft(0)
      reset()
      if (onBreakComplete) {
        onBreakComplete()
      }
      return
    }
    
    if (modoRef.current === 'pomodoro' && pomodoroDurationRef.current > 0) {
      finalSeconds = pomodoroDurationRef.current * 60 - localSegundos
      if (finalSeconds < 0) finalSeconds = 0
    } else if (startTimeRef.current) {
      let adjustedStartTime = startTimeRef.current
      if (pauseStartTimeRef.current) {
        const pausedDuration = Date.now() - pauseStartTimeRef.current
        adjustedStartTime = startTimeRef.current + pausedDuration
      }
      finalSeconds = Math.floor((Date.now() - adjustedStartTime) / 1000)
    }
    
    if (finalSeconds <= 0) {
      reset()
      return
    }
    
    setLocalActivo(false)
    setLocalPausado(false)
    
    if (modoRef.current === 'flowtime' && breakRatioRef.current > 0 && finalSeconds >= 60) {
      const breakSeconds = Math.max(60, Math.floor(finalSeconds / breakRatioRef.current))
      hasCompletedBreak.current = false
      setBreakSecondsLeft(breakSeconds)
      setTimerMode('break')
      setLocalActivo(true)
      startTimeRef.current = Date.now()
      pauseStartTimeRef.current = null
      setLocalSegundos(0)
      onComplete(finalSeconds)
    } else {
      onComplete(finalSeconds)
      reset()
    }
  }

  const handleReset = () => {
    reset()
  }

  const isPomodoro = modoRef.current === 'pomodoro' && pomodoroDurationRef.current > 0
  const isBreak = timerMode === 'break'
  const displaySeconds = isBreak ? breakSecondsLeft : localSegundos

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      <div className={`text-9xl font-bold tabular-nums tracking-tight ${
        isBreak ? 'text-deepworkos-turquoise' : 'text-white'
      }`} style={isBreak ? { textShadow: '0 0 20px rgba(0,212,255,0.5)' } : undefined}>
        {formatearTiempo(displaySeconds || 0)}
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full transition-all ${
          isBreak 
            ? (localActivo && !localPausado ? 'bg-deepworkos-turquoise animate-pulse' : 
               localActivo && localPausado ? 'bg-deepworkos-orange' : 'bg-deepworkos-turquoise')
            : (localActivo && !localPausado ? 'bg-deepworkos-success animate-pulse' : 
               localActivo && localPausado ? 'bg-deepworkos-orange' : 'bg-deepworkos-gray')
        }`} style={{
          boxShadow: isBreak
            ? (localActivo && !localPausado ? '0 0 10px #00d4ff' : localActivo && localPausado ? '0 0 10px #ff9f43' : '0 0 5px #00d4ff')
            : (localActivo && !localPausado ? '0 0 10px #00ff88' : localActivo && localPausado ? '0 0 10px #ff9f43' : 'none')
        }} />
        <span className="text-sm text-deepworkos-text-muted">
          {isBreak 
            ? (localActivo && !localPausado ? 'Descanso en progreso' : 
               localActivo && localPausado ? 'Descanso pausado' : 
               'Descanso terminado')
            : (localActivo && !localPausado ? 'En progreso' : 
               localActivo && localPausado ? 'Pausado' : 
               'Detenido')
          }
        </span>
      </div>

      <div className="flex gap-4">
        {!localActivo ? (
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
              className={`${localPausado ? 'bg-deepworkos-success hover:bg-deepworkos-success/80 shadow-neon-success' : 'bg-deepworkos-orange hover:bg-deepworkos-orange/80'} text-white text-lg px-10 py-6`}
            >
              {localPausado ? '▶ Reanudar' : '⏸ Pausar'}
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
        
        {(localActivo || displaySeconds > 0) && (
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
        <p>Modo: <span className={`font-medium ${
          isBreak ? 'text-deepworkos-turquoise' : 'text-white'
        }`}>
          {isBreak ? 'Descanso' : (modoRef.current === 'pomodoro' ? 'Pomodoro' : 'Flowtime')}
        </span></p>
      </div>
    </div>
  )
}
