'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRide } from '@/hooks/useRide'
import { MapView } from '@/components/map/MapView'
import { ElevationChart } from '@/components/shared/ElevationChart'
import { formatDistance, formatDuration, formatSpeed } from '@/lib/utils'
import { Play, Pause, Square, Activity, Zap, TrendingUp, Timer, Flame, Heart, RotateCcw, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function RidePage() {
  const { data, start, pause, resume, stop, reset } = useRide()
  const [showSummary, setShowSummary] = useState(false)
  const { status, elapsed, distance, speed, avgSpeed, maxSpeed, elevation, calories, heartRate, cadence } = data

  const isActive = status === 'active'
  const isPaused = status === 'paused'
  const isEnded  = status === 'ended'
  const isIdle   = status === 'idle'

  function handleStop() { stop(); setShowSummary(true) }

  if (isIdle && !showSummary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Ready to Ride?</h1>
          <p className="text-slate-400 mb-8">GPS will track your route, speed, and distance automatically.</p>
          <button onClick={start}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-glow-green"
          >
            <Play className="w-6 h-6 fill-white" /> Start Ride
          </button>
          <div className="mt-4 text-xs text-slate-500">Make sure location is enabled</div>
        </motion.div>
      </div>
    )
  }

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Ride Complete! 🎉</h1>
          <p className="text-slate-400 text-sm">Great work. Here's your summary.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Distance',   value: formatDistance(distance),      color: 'text-brand-400'   },
            { label: 'Duration',   value: formatDuration(elapsed),       color: 'text-emerald-400' },
            { label: 'Avg Speed',  value: formatSpeed(avgSpeed),         color: 'text-amber-400'   },
            { label: 'Max Speed',  value: formatSpeed(maxSpeed),         color: 'text-orange-400'  },
            { label: 'Elevation',  value: `+${Math.round(elevation)}m`,  color: 'text-violet-400'  },
            { label: 'Calories',   value: `${Math.round(calories)} kcal`,color: 'text-red-400'     },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className={cn('text-2xl font-bold font-stat', color)}>{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
          <div className="text-sm font-medium text-slate-300 mb-3">Elevation Profile</div>
          <ElevationChart height={100} />
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors">Save Ride</button>
          <button onClick={() => { reset(); setShowSummary(false) }} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors">Discard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Map */}
      <div className="flex-1 min-h-0 relative">
        <MapView className="w-full h-full" style="outdoors" />

        {/* Live indicator */}
        {isActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-white rounded-full" />
              <div className="absolute inset-0 bg-white rounded-full animate-ping" />
            </div>
            <span className="text-white text-xs font-semibold tracking-wider">RECORDING</span>
          </div>
        )}
        {isPaused && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold">
            PAUSED
          </div>
        )}
      </div>

      {/* Stats panel */}
      <div className="bg-surface-900 border-t border-slate-800 px-4 py-4">
        {/* Big speed */}
        <div className="text-center mb-4">
          <div className="text-6xl font-bold font-stat text-white leading-none">{speed.toFixed(1)}</div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">km/h current speed</div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { icon: Timer,   label: 'Time',      value: formatDuration(elapsed) },
            { icon: Zap,     label: 'Distance',  value: formatDistance(distance) },
            { icon: TrendingUp, label: 'Avg',    value: `${avgSpeed.toFixed(1)}` },
            { icon: TrendingUp, label: 'Elev',   value: `+${Math.round(elevation)}m` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <div className="text-lg font-bold font-stat text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Extra stats */}
        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          {[
            { icon: Heart,  label: 'HR',       value: heartRate ? `${heartRate} bpm` : '—', color: 'text-red-400'    },
            { icon: Activity, label: 'Cadence',value: cadence ? `${cadence} rpm` : '—',     color: 'text-violet-400' },
            { icon: Flame,  label: 'Calories', value: `${Math.round(calories)} kcal`,       color: 'text-orange-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-surface-800 rounded-xl p-2.5">
              <Icon className={cn('w-4 h-4 mx-auto mb-1', color)} />
              <div className={cn('text-sm font-bold font-stat', color)}>{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {isActive && (
            <>
              <button onClick={pause}
                className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 hover:bg-amber-500/30 transition-colors"
              ><Pause className="w-6 h-6 fill-current" /></button>
              <button onClick={handleStop}
                className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
              ><Square className="w-6 h-6 fill-current" /></button>
            </>
          )}
          {isPaused && (
            <>
              <button onClick={resume}
                className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              ><Play className="w-6 h-6 fill-current" /></button>
              <button onClick={handleStop}
                className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
              ><Square className="w-6 h-6 fill-current" /></button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
