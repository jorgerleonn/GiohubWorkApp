'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { 
  Home, 
  Timer, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/work', label: 'Work', icon: Timer },
  { href: '/stats', label: 'Estadísticas', icon: BarChart3 },
  { href: '/config', label: 'Configuración', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-deepworkos-card border-r border-deepworkos-border flex flex-col z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-deepworkos-turquoise to-deepworkos-purple flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            DeepWorkOS
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-deepworkos-card-hover text-deepworkos-turquoise'
                      : 'text-deepworkos-text-muted hover:bg-deepworkos-card-hover hover:text-white'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-all ${
                      isActive ? 'text-deepworkos-turquoise' : 'group-hover:text-deepworkos-turquoise'
                    }`}
                    style={isActive ? { filter: 'drop-shadow(0 0 6px #00d4ff)' } : {}}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-deepworkos-turquoise" 
                      style={{ boxShadow: '0 0 8px #00d4ff' }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-deepworkos-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deepworkos-purple to-deepworkos-turquoise flex items-center justify-center text-white text-sm font-medium">
            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName || 'Usuario'}
            </p>
            <p className="text-xs text-deepworkos-text-muted truncate">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        
        <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-deepworkos-text-muted hover:bg-deepworkos-card-hover hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
