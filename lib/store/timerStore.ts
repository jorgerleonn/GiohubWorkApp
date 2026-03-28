import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  segundos: number
  activo: boolean
  pausado: boolean
  startTime: number | null
  pauseStartTime: number | null
  asignaturaId: string
  tipoTarea: string
  setSegundos: (segundos: number) => void
  setActivo: (activo: boolean) => void
  setPausado: (pausado: boolean) => void
  setStartTime: (time: number | null) => void
  setPauseStartTime: (time: number | null) => void
  setAsignaturaId: (id: string) => void
  setTipoTarea: (tarea: string) => void
  reset: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      segundos: 0,
      activo: false,
      pausado: false,
      startTime: null,
      pauseStartTime: null,
      asignaturaId: '',
      tipoTarea: '',
      setSegundos: (segundos) => set({ segundos }),
      setActivo: (activo) => set({ activo }),
      setPausado: (pausado) => set({ pausado }),
      setStartTime: (time) => set({ startTime: time }),
      setPauseStartTime: (time) => set({ pauseStartTime: time }),
      setAsignaturaId: (id) => set({ asignaturaId: id }),
      setTipoTarea: (tarea) => set({ tipoTarea: tarea }),
      reset: () => set({ segundos: 0, activo: false, pausado: false, startTime: null, pauseStartTime: null }),
    }),
    {
      name: 'deepworkos-timer',
    }
  )
)
