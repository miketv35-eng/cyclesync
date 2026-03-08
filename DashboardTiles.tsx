'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Cpu, Wifi, WifiOff, RefreshCw, Plus, Battery, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'

const MOCK_DEVICES = [
  { id: '1', name: 'Garmin Edge 1040', type: 'gps_computer', brand: 'garmin', model: 'Edge 1040', is_connected: true,  last_sync: '2026-03-08T08:32', battery_level: 87, firmware_version: '8.20' },
  { id: '2', name: 'Garmin Fēnix 7X',  type: 'smartwatch',   brand: 'garmin', model: 'Fēnix 7X Solar', is_connected: true, last_sync: '2026-03-08T07:15', battery_level: 64, firmware_version: '14.20' },
  { id: '3', name: 'Apple Watch Ultra 2', type: 'smartwatch', brand: 'apple', model: 'Ultra 2', is_connected: false, last_sync: null, battery_level: null, firmware_version: null },
  { id: '4', name: 'Wahoo KICKR V6',   type: 'trainer',      brand: 'wahoo', model: 'KICKR V6', is_connected: false, last_sync: '2026-03-05T20:00', battery_level: null, firmware_version: '5.2.3' },
  { id: '5', name: 'Favero Assioma Duo', type: 'power_meter', brand: 'other', model: 'Assioma Duo', is_connected: true, last_sync: '2026-03-08T08:30', battery_level: 92, firmware_version: '3.0.11' },
]

const PLATFORMS = [
  { name: 'Garmin Connect',  desc: 'Sync rides, heart rate, power & device data', ready: true,  logo: '🔵' },
  { name: 'Apple Health',    desc: 'HealthKit integration for Apple Watch workouts', ready: true,  logo: '🍎' },
  { name: 'Wahoo',           desc: 'KICKR trainers & ELEMNT bike computers',        ready: false, logo: '🔶' },
  { name: 'Polar Flow',      desc: 'Polar heart rate monitors & sports watches',    ready: false, logo: '🔴' },
  { name: 'Strava Import',   desc: 'Import existing activities from Strava',        ready: true,  logo: '🟠' },
  { name: 'Suunto App',      desc: 'Suunto sports watches & multisport tracking',   ready: false, logo: '⚫' },
]

const TYPE_LABELS: Record<string, string> = {
  gps_computer: 'GPS Computer', smartwatch: 'Smartwatch',
  heart_rate: 'Heart Rate Monitor', power_meter: 'Power Meter',
  cadence: 'Cadence Sensor', trainer: 'Smart Trainer',
}

export default function DevicesPage() {
  const [devices, setDevices] = useState(MOCK_DEVICES)

  function toggleConnection(id: string) {
    setDevices(d => d.map(dev => dev.id === id ? { ...dev, is_connected: !dev.is_connected } : dev))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Devices</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your connected hardware</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Device
        </button>
      </div>

      {/* Connected devices */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">My Devices</h2>
        <div className="space-y-3">
          {devices.map((device, i) => (
            <motion.div key={device.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-600 transition-all"
            >
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
                device.is_connected ? 'bg-brand-500/10' : 'bg-slate-800'
              )}>
                {device.brand === 'garmin' ? '🔵' : device.brand === 'apple' ? '🍎' : device.brand === 'wahoo' ? '🔶' : '📡'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">{device.name}</span>
                  {device.is_connected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{TYPE_LABELS[device.type]} · {device.model}</div>
                <div className="flex items-center gap-3 mt-1">
                  {device.last_sync && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(device.last_sync).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {device.battery_level != null && (
                    <span className={cn('text-xs flex items-center gap-1', device.battery_level < 20 ? 'text-red-400' : device.battery_level < 40 ? 'text-amber-400' : 'text-emerald-400')}>
                      <Battery className="w-3 h-3" /> {device.battery_level}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {device.is_connected && (
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Sync now">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => toggleConnection(device.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                    device.is_connected
                      ? 'bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400'
                      : 'bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 border border-brand-500/30'
                  )}
                >
                  {device.is_connected ? <><WifiOff className="w-3 h-3" /> Disconnect</> : <><Wifi className="w-3 h-3" /> Connect</>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Supported Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PLATFORMS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              className={cn('bg-surface-800 border rounded-2xl p-4 transition-all', p.ready ? 'border-slate-700/60 hover:border-slate-600' : 'border-slate-800 opacity-60')}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{p.logo}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                    {!p.ready && <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">Coming soon</span>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">{p.desc}</p>
              {p.ready && (
                <button className="mt-3 w-full py-2 rounded-xl text-xs font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 transition-colors">
                  Connect {p.name}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
