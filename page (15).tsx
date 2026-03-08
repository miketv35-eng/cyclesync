'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { User, Link2, Bell, Lock, Key, ChevronRight, ExternalLink, Check } from 'lucide-react'

type Tab = 'profile' | 'integrations' | 'notifications' | 'privacy'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',       label: 'Profile',        icon: User   },
  { id: 'integrations',  label: 'Integrations',   icon: Link2  },
  { id: 'notifications', label: 'Notifications',  icon: Bell   },
  { id: 'privacy',       label: 'Privacy',        icon: Lock   },
]

function FieldInput({ label, defaultValue, type = 'text', placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
      />
    </div>
  )
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button onClick={() => setOn(!on)}
      className={cn('w-11 h-6 rounded-full flex items-center transition-all flex-shrink-0', on ? 'bg-brand-500' : 'bg-slate-700')}
    >
      <div className={cn('w-4 h-4 rounded-full bg-white shadow transition-all mx-1', on ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  )
}

function NotifRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-slate-700/40 last:border-0">
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
      </div>
      <Toggle defaultOn={defaultOn} />
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-display font-bold text-white mb-6">Settings</h1>

      {/* Tab nav */}
      <div className="flex gap-1 bg-surface-800 border border-slate-700/60 rounded-2xl p-1.5 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              tab === t.id ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
            )}
          >
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-800 border border-slate-700/60 rounded-2xl p-6"
      >
        {tab === 'profile' && (
          <div className="space-y-5">
            <h2 className="font-semibold text-white">Profile Information</h2>
            <div className="flex items-center gap-4 pb-4 border-b border-slate-700/60">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-2xl font-bold text-white">MC</div>
              <div>
                <button className="text-sm px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors font-medium">Change Photo</button>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF · Max 5MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Full Name" defaultValue="Mike Clarke" />
              <FieldInput label="Username" defaultValue="mikec_rides" />
              <FieldInput label="Email" defaultValue="mike@cyclesync.app" type="email" />
              <FieldInput label="Location" defaultValue="Consett, County Durham" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Bio</label>
              <textarea defaultValue="A Shift Supervisor. Weekend warrior cyclist. Morning Hammers CC."
                className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 resize-none transition-colors"
                rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Units</label>
                <select className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors">
                  <option>Metric (km, m)</option><option>Imperial (mi, ft)</option>
                </select>
              </div>
              <FieldInput label="FTP (watts)" defaultValue="248" type="number" />
              <FieldInput label="Weight (kg)" defaultValue="78" type="number" />
              <FieldInput label="Max Heart Rate" defaultValue="185" type="number" />
            </div>
          </div>
        )}

        {tab === 'integrations' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-white mb-2">API Integrations</h2>
            <p className="text-sm text-slate-400">Add your API keys to enable maps, weather, and device sync.</p>
            {[
              { label: 'Mapbox Token',       key: 'NEXT_PUBLIC_MAPBOX_TOKEN',       desc: 'Required for route planning and live ride maps', link: 'https://account.mapbox.com' },
              { label: 'OpenWeatherMap Key', key: 'NEXT_PUBLIC_OPENWEATHER_KEY',    desc: 'Live weather data and ride condition forecasts',  link: 'https://openweathermap.org/api' },
              { label: 'Garmin Client ID',   key: 'GARMIN_CLIENT_ID',               desc: 'Garmin Connect integration for device sync',      link: 'https://developer.garmin.com' },
            ].map(({ label, key, desc, link }) => (
              <div key={key} className="bg-surface-900 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{label}</span>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                    Get key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-2">{desc}</p>
                <div className="flex gap-2">
                  <input type="password" placeholder={`Enter ${label}`} className="flex-1 bg-surface-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors" />
                  <button className="px-3 py-2 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 text-sm hover:bg-brand-500/30 transition-colors font-medium">Save</button>
                </div>
              </div>
            ))}

            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-start gap-2">
                <Key className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-400">Environment Variables</div>
                  <p className="text-xs text-amber-400/70 mt-1">For production, add these keys as environment variables in your Vercel project settings — not here.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div>
            <h2 className="font-semibold text-white mb-4">Notification Preferences</h2>
            <NotifRow label="Group Ride Reminders"   desc="Alerts for upcoming club rides you've RSVP'd to"    defaultOn={true}  />
            <NotifRow label="Club Post Notifications" desc="When someone posts in your clubs"                   defaultOn={false} />
            <NotifRow label="Segment Personal Bests"  desc="When you set a new segment PR on a ride"           defaultOn={true}  />
            <NotifRow label="Ride Weather Alerts"     desc="Poor conditions forecast for your planned routes"   defaultOn={true}  />
            <NotifRow label="Component Service Due"   desc="When a bike component needs servicing"              defaultOn={true}  />
            <NotifRow label="New Followers"           desc="When someone starts following you"                  defaultOn={false} />
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-5">
            <h2 className="font-semibold text-white">Privacy Controls</h2>
            <div className="bg-surface-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700 text-xs text-slate-400 font-semibold uppercase tracking-wider">Ride Visibility</div>
              {['Public — Everyone can see my rides', 'Followers — Only my followers', 'Private — Only me'].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-800 transition-colors border-b border-slate-700 last:border-b-0">
                  <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0', i === 1 ? 'border-brand-500 bg-brand-500' : 'border-slate-600')}>
                    {i === 1 && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-slate-300">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-700/60">
              <div>
                <div className="text-sm font-medium text-white">Show on Discover</div>
                <div className="text-xs text-slate-400">Allow others to find your profile in search</div>
              </div>
              <Toggle defaultOn={true} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-white">Data Export</div>
                <div className="text-xs text-slate-400">Download all your rides and data as JSON</div>
              </div>
              <button className="text-sm px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors font-medium">Export</button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={handleSave}
            className={cn('flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all',
              saved ? 'bg-emerald-500 text-white' : 'bg-brand-500 hover:bg-brand-400 text-white'
            )}
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
