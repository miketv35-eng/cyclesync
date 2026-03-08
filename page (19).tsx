'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapView } from '@/components/map/MapView'
import { ElevationChart } from '@/components/shared/ElevationChart'
import { WeatherWidget } from '@/components/shared/WeatherWidget'
import { cn, formatDistance, formatDuration, getDifficultyColor } from '@/lib/utils'
import { Plus, Navigation, Clock, TrendingUp, Share2, Download, ChevronRight, ToggleLeft, ToggleRight, MapPin } from 'lucide-react'

const MOCK_ROUTES = [
  { id: '1', title: 'Reservoir Loop',       distance_m: 34200, elevation_gain_m: 480,  estimated_duration_s: 5280, difficulty: 'moderate', surface: 'road'  },
  { id: '2', title: 'Coast Road Sprint',    distance_m: 52800, elevation_gain_m: 210,  estimated_duration_s: 7500, difficulty: 'easy',     surface: 'road'  },
  { id: '3', title: 'Highland Challenge',   distance_m: 89400, elevation_gain_m: 2100, estimated_duration_s: 15300,difficulty: 'hard',     surface: 'gravel'},
  { id: '4', title: 'Forest Track Explore', distance_m: 28600, elevation_gain_m: 760,  estimated_duration_s: 6600, difficulty: 'moderate', surface: 'mtb'   },
  { id: '5', title: 'Town Centre Tour',     distance_m: 15200, elevation_gain_m: 120,  estimated_duration_s: 2700, difficulty: 'easy',     surface: 'road'  },
]

type Tab = 'saved' | 'planner'

export default function RoutesPage() {
  const [tab, setTab] = useState<Tab>('saved')
  const [selectedRoute, setSelectedRoute] = useState<typeof MOCK_ROUTES[0] | null>(null)
  const [snapToRoads, setSnapToRoads] = useState(true)
  const [waypoints, setWaypoints] = useState(3)
  const [showTraffic, setShowTraffic] = useState(true)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Routes</h1>
          <p className="text-slate-400 text-sm mt-1">Plan, save and explore cycling routes</p>
        </div>
        <button
          onClick={() => setTab('planner')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Plan Route
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-800 border border-slate-700/60 rounded-xl p-1 w-fit mb-6">
        {(['saved', 'planner'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all',
              tab === t ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
            )}
          >{t === 'planner' ? 'Route Planner' : 'Saved Routes'}</button>
        ))}
      </div>

      {tab === 'saved' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Route list */}
          <div className="space-y-3">
            {MOCK_ROUTES.map((route, i) => (
              <motion.div key={route.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedRoute(route)}
                className={cn(
                  'bg-surface-800 border rounded-2xl p-4 cursor-pointer transition-all hover:border-brand-500/40',
                  selectedRoute?.id === route.id ? 'border-brand-500/60 bg-brand-500/5' : 'border-slate-700/60'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{route.title}</h3>
                      <span className={cn('text-xs font-medium capitalize', getDifficultyColor(route.difficulty))}>{route.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Navigation className="w-3 h-3" />{formatDistance(route.distance_m)}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{route.elevation_gain_m}m</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(route.estimated_duration_s)}</span>
                    </div>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 transition-colors flex-shrink-0 mt-0.5', selectedRoute?.id === route.id ? 'text-brand-400' : 'text-slate-600')} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Route detail */}
          <div className="lg:col-span-2 space-y-4">
            {selectedRoute ? (
              <>
                <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden">
                  <MapView className="h-64 w-full" style="outdoors" />
                </div>
                <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedRoute.title}</h2>
                      <span className={cn('text-sm font-medium capitalize', getDifficultyColor(selectedRoute.difficulty))}>{selectedRoute.difficulty} · {selectedRoute.surface}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"><Share2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"><Download className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Distance',  value: formatDistance(selectedRoute.distance_m)           },
                      { label: 'Elevation', value: `+${selectedRoute.elevation_gain_m}m`              },
                      { label: 'Est. Time', value: formatDuration(selectedRoute.estimated_duration_s) },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-surface-900 rounded-xl p-3 text-center">
                        <div className="text-xs text-slate-400 mb-1">{label}</div>
                        <div className="text-sm font-bold font-stat text-white">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 mb-2">Elevation Profile</div>
                    <ElevationChart height={100} />
                  </div>
                  <button className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                    <Navigation className="w-4 h-4" /> Start This Route
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Navigation className="w-12 h-12 opacity-30 mb-3" />
                <p className="text-sm">Select a route to preview it</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Route Planner */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-white text-sm">Map Options</h3>
              {[
                { label: 'Snap to Roads', val: snapToRoads, set: setSnapToRoads },
                { label: 'Live Traffic',  val: showTraffic, set: setShowTraffic  },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{label}</span>
                  <button onClick={() => set(!val)} className="text-slate-400 hover:text-white transition-colors">
                    {val ? <ToggleRight className="w-5 h-5 text-brand-400" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Waypoints */}
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Waypoints</h3>
                <button onClick={() => setWaypoints(w => Math.min(w+1, 6))} className="text-brand-400 hover:text-brand-300 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {['Brewery, Consett','Waskerley Reservoir','Langdon Beck','Return Home'].slice(0, waypoints).map((wp, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs">
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      i === 0 ? 'bg-emerald-500 text-white' : i === waypoints-1 ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                    )}>{i+1}</div>
                    <span className="text-slate-300 truncate">{wp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4 space-y-2">
              <h3 className="font-semibold text-white text-sm mb-3">Route Stats</h3>
              {[['Distance','34.2 km'],['Elevation','+480 m'],['Est. Time','1h 28m'],['Difficulty','Moderate']].map(([k,v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-medium text-slate-200">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors">Save Route</button>
              <button className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"><Download className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden">
              <MapView className="h-96 w-full" style="outdoors" showControls />
            </div>
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
              <div className="text-xs text-slate-400 mb-2">Elevation Profile</div>
              <ElevationChart height={90} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
