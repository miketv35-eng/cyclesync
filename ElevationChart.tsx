'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ElevationChart } from '@/components/shared/ElevationChart'
import { RecentRides } from '@/components/shared/RecentRides'
import { formatDistance, formatDuration } from '@/lib/utils'
import { BarChart2, TrendingUp, Timer, Trophy, Flame, Calendar, MapPin, Users, Bike } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const WEEKLY = [
  { day: 'M', km: 45 }, { day: 'T', km: 0 }, { day: 'W', km: 87 },
  { day: 'T', km: 24 }, { day: 'F', km: 41 }, { day: 'S', km: 112 }, { day: 'S', km: 0 },
]

const PRS = [
  { label: 'Longest Ride',     value: '112.4 km', date: '28 Feb', icon: '🏅' },
  { label: 'Max Elevation',    value: '1,876 m',  date: '28 Feb', icon: '⛰️' },
  { label: 'Fastest Avg Speed',value: '24.1 km/h',date: '6 Mar',  icon: '⚡' },
  { label: 'Longest Streak',   value: '8 days',   date: 'Jan 26', icon: '🔥' },
]

type Period = 'week' | 'month' | 'year'

export default function ProfilePage() {
  const [period, setPeriod] = useState<Period>('month')

  const STATS: Record<Period, { distance: string; rides: string; elevation: string; time: string }> = {
    week:  { distance: '309 km',  rides: '7',  elevation: '3,240 m', time: '14h 22m' },
    month: { distance: '1,047 km', rides: '24', elevation: '12,480 m', time: '47h 15m' },
    year:  { distance: '8,420 km', rides: '187', elevation: '98,400 m', time: '374h 02m' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-800 border border-slate-700/60 rounded-2xl p-6"
      >
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">MC</div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Mike Clarke</h1>
                <div className="text-sm text-slate-400 mt-0.5">@mikec_rides</div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Consett, County Durham</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 2 clubs</span>
                  <span className="flex items-center gap-1"><Bike className="w-3 h-3" /> 2 bikes</span>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 text-white transition-colors font-medium">Edit Profile</button>
            </div>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">A Shift Supervisor. Weekend warrior cyclist. Morning Hammers CC. Chasing PRs on the Consett climbs.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-700/60">
          {[['47', 'Total Rides'], ['187', 'Following'], ['93', 'Followers']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-xl font-bold font-stat text-white">{v}</div>
              <div className="text-xs text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Period stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Performance</h2>
          <div className="flex gap-1 bg-surface-800 border border-slate-700/60 rounded-xl p-1">
            {(['week', 'month', 'year'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >{p}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Distance',  value: STATS[period].distance, icon: BarChart2, color: 'text-brand-400'   },
            { label: 'Rides',     value: STATS[period].rides,    icon: Bike,      color: 'text-emerald-400' },
            { label: 'Elevation', value: STATS[period].elevation,icon: TrendingUp,color: 'text-amber-400'   },
            { label: 'Time',      value: STATS[period].time,     icon: Timer,     color: 'text-violet-400'  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
              <Icon className={`w-4 h-4 ${color} mb-2`} />
              <div className={`text-xl font-bold font-stat ${color}`}>{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-surface-800 border border-slate-700/60 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4">Distance per Day</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={WEEKLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}km`} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="km" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PRs */}
        <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700/60">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">Personal Bests</h3>
          </div>
          <div className="divide-y divide-slate-700/40">
            {PRS.map(pr => (
              <div key={pr.label} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xl flex-shrink-0">{pr.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400">{pr.label}</div>
                  <div className="text-sm font-bold font-stat text-amber-400">{pr.value}</div>
                </div>
                <div className="text-xs text-slate-500 flex-shrink-0">{pr.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent rides */}
      <RecentRides limit={5} />
    </div>
  )
}
