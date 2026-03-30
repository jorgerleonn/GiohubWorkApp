'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Trash2, Plus } from 'lucide-react'
import { Asignatura } from '@/lib/types'

interface Todo {
  id: string
  text: string
  completed: boolean
  asignaturaId: string | null
}

interface TodoListProps {
  asignaturas: Asignatura[]
  currentAsignaturaId?: string
}

export function TodoList({ asignaturas, currentAsignaturaId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('deepworkos-todos')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error loading todos:', e)
      }
    }
    return []
  })
  const [newTodo, setNewTodo] = useState('')
  const [filterAsignatura, setFilterAsignatura] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('deepworkos-todos', JSON.stringify(todos))
  }, [todos])

  if (asignaturas.length === 0) {
    return (
      <div className="mt-6 pt-6 border-t border-deepworkos-border/50">
        <h3 className="text-lg font-medium text-white mb-4">Tareas de la sesión</h3>
        <p className="text-sm text-deepworkos-text-muted text-center py-4">
          Configura tus asignaturas en la página de Configuración para usar las tareas.
        </p>
      </div>
    )
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        asignaturaId: filterAsignatura || currentAsignaturaId || null
      }
      setTodos([...todos, todo])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const getAsignaturaNombre = (id: string | null) => {
    if (!id) return 'Sin asignar'
    const asig = asignaturas.find(a => a.id === id)
    return asig?.nombre || 'Sin asignar'
  }

  const getAsignaturaColor = (id: string | null) => {
    if (!id) return 'bg-deepworkos-border'
    const asig = asignaturas.find(a => a.id === id)
    return asig?.color || 'bg-deepworkos-border'
  }

  const filteredTodos = filterAsignatura 
    ? todos.filter(t => t.asignaturaId === filterAsignatura)
    : todos

  const pendingTodos = filteredTodos.filter(t => !t.completed)
  const completedTodos = filteredTodos.filter(t => t.completed)

  return (
    <div className="mt-6 pt-6 border-t border-deepworkos-border/50">
      <h3 className="text-lg font-medium text-white mb-4">Tareas de la sesión</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Añadir una tarea..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-deepworkos-bg-dark border-deepworkos-border text-white placeholder:text-deepworkos-text-muted"
        />
        <Button
          onClick={addTodo}
          className="bg-deepworkos-turquoise hover:bg-deepworkos-turquoise/80 text-deepworkos-bg-dark"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {asignaturas.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterAsignatura(null)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filterAsignatura === null 
                ? 'bg-deepworkos-turquoise text-deepworkos-bg-dark' 
                : 'bg-deepworkos-card border border-deepworkos-border text-white hover:border-deepworkos-turquoise'
            }`}
          >
            Todas
          </button>
          {asignaturas.map(asig => (
            <button
              key={asig.id}
              onClick={() => setFilterAsignatura(filterAsignatura === asig.id ? null : asig.id)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filterAsignatura === asig.id 
                  ? 'text-deepworkos-bg-dark' 
                  : 'bg-deepworkos-card border border-deepworkos-border text-white hover:border-deepworkos-turquoise'
              }`}
              style={filterAsignatura === asig.id ? { backgroundColor: asig.color || '#00d4ff' } : undefined}
            >
              {asig.nombre}
            </button>
          ))}
        </div>
      )}

      {pendingTodos.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs text-deepworkos-text-muted uppercase tracking-wide">Pendientes</p>
          {pendingTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-deepworkos-card/30 rounded-lg border border-deepworkos-border/30 group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded-full border-2 border-deepworkos-border hover:border-deepworkos-turquoise flex items-center justify-center transition-colors flex-shrink-0"
              >
              </button>
              <span className="text-white flex-1">{todo.text}</span>
              <span 
                className="text-xs px-2 py-1 rounded-full text-white/80 flex-shrink-0"
                style={{ backgroundColor: todo.asignaturaId ? getAsignaturaColor(todo.asignaturaId) + '40' : undefined }}
              >
                {getAsignaturaNombre(todo.asignaturaId)}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-deepworkos-primary/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-deepworkos-primary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {completedTodos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-deepworkos-text-muted uppercase tracking-wide">Completadas</p>
          {completedTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-deepworkos-card/20 rounded-lg border border-deepworkos-border/20 opacity-60 group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded-full bg-deepworkos-success border-2 border-deepworkos-success flex items-center justify-center flex-shrink-0"
              >
                <Check className="w-3 h-3 text-deepworkos-bg-dark" />
              </button>
              <span className="text-deepworkos-text-muted line-through flex-1">{todo.text}</span>
              <span 
                className="text-xs px-2 py-1 rounded-full text-white/60 flex-shrink-0"
                style={{ backgroundColor: todo.asignaturaId ? getAsignaturaColor(todo.asignaturaId) + '20' : undefined }}
              >
                {getAsignaturaNombre(todo.asignaturaId)}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-deepworkos-primary/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-deepworkos-primary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {todos.length === 0 && (
        <p className="text-sm text-deepworkos-text-muted text-center py-4">
          No hay tareas. Añade algunas para organizar tu sesión.
        </p>
      )}
    </div>
  )
}
