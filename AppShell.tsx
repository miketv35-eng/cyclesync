'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, getRelativeTime } from '@/lib/utils'
import { Plus, Users, Trophy, MapPin, Calendar, Heart, MessageCircle, Share2, ChevronRight, X, Lock, Globe, ArrowLeft } from 'lucide-react'

const MOCK_CLUBS = [
  { id: '1', name: 'Morning Hammers CC', description: 'Early risers, no excuses. Fast group rides every Tuesday & Saturday.', members: 14, total_rides: 47, total_km: 8420, next_ride: '2026-03-10T07:00', level: 'Advanced', is_private: false, avatar_letters: 'MH' },
  { id: '2', name: 'Brewery Cyclists',   description: 'A Shift colleagues who ride. Casual pace, great craic.', members: 6, total_rides: 12, total_km: 1840, next_ride: '2026-03-12T18:00', level: 'Mixed', is_private: true, avatar_letters: 'BC' },
]

const MOCK_POSTS = [
  { id: '1', club_id: '1', user: 'Sarah K.', initials: 'SK', time: '2026-03-08T06:30', text: 'Great spin this morning lads 🔥 Strava segment PR on the Consett climb!', likes: 8 },
  { id: '2', club_id: '1', user: 'James R.', initials: 'JR', time: '2026-03-07T20:00', text: 'Route for Saturday uploaded. 90km, 1200m elevation. Check the planner 👆', likes: 5 },
  { id: '3', club_id: '2', user: 'Dave T.',  initials: 'DT', time: '2026-03-06T15:00', text: 'Anyone up for Wednesday evening? Leaving from the brewery at 6pm sharp.', likes: 4 },
  { id: '4', club_id: '1', user: 'Pete M.',  initials: 'PM', time: '2026-03-05T18:00', text: "Just ordered new tyres. Finally replacing the worn Vittoria's!", likes: 3 },
]

const MOCK_RIDES = [
  { id: '1', club_id: '1', title: 'Saturday Hammer Session', date: '2026-03-10T07:00', distance: '90 km', difficulty: 'Hard', rsvps: 9, max: 12 },
  { id: '2', club_id: '2', title: 'Wednesday Evening Spin',  date: '2026-03-12T18:00', distance: '35 km', difficulty: 'Easy', rsvps: 4, max: 8 },
]

export default function ClubsPage() {
  const [activeClub, setActiveClub] = useState<typeof MOCK_CLUBS[0] | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const clubPosts = activeClub ? MOCK_POSTS.filter(p => p.club_id === activeClub.id) : []
  const clubRides = activeClub ? MOCK_RIDES.filter(r => r.club_id === activeClub.id) : []

  function toggleLike(postId: string) {
    setLikedPosts(prev => {
      const n = new Set(prev)
      n.has(postId) ? n.delete(postId) : n.add(postId)
      return n
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <AnimatePresence mode="wait">
        {!activeClub ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Cycle Clubs</h1>
                <p className="text-slate-400 text-sm mt-1">Ride together, go further</p>
              </div>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm transition-colors"
              ><Plus className="w-4 h-4" /> Create Club</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {MOCK_CLUBS.map((club, i) => (
                <motion.div key={club.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500/30 transition-all group"
                  onClick={() => setActiveClub(club)}
                >
                  <div className="h-20 bg-gradient-to-br from-brand-500/20 to-brand-600/10 relative px-5 pb-3 flex items-end gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white text-sm border-2 border-surface-800 relative z-10">{club.avatar_letters}</div>
                    <div>
                      <div className="font-bold text-white">{club.name}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {club.is_private ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        <span>{club.level}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 ml-auto group-hover:text-brand-400 transition-colors" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{club.description}</p>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold font-stat text-white">{club.members}</div>
                        <div className="text-xs text-slate-500">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold font-stat text-white">{club.total_rides}</div>
                        <div className="text-xs text-slate-500">Rides</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold font-stat text-white">{club.total_km.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">km</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* All posts feed */}
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/60">
                <h2 className="font-semibold text-white">Club Feed</h2>
              </div>
              <div className="divide-y divide-slate-700/40">
                {MOCK_POSTS.map(post => (
                  <div key={post.id} className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{post.initials}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{post.user}</div>
                        <div className="text-xs text-slate-500">{getRelativeTime(post.time)} · {MOCK_CLUBS.find(c => c.id === post.club_id)?.name}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">{post.text}</p>
                    <button onClick={() => toggleLike(post.id)} className={cn('flex items-center gap-1.5 text-xs transition-colors', likedPosts.has(post.id) ? 'text-red-400' : 'text-slate-500 hover:text-red-400')}>
                      <Heart className={cn('w-3.5 h-3.5', likedPosts.has(post.id) && 'fill-current')} />
                      <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setActiveClub(null)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Clubs
            </button>

            {/* Club header */}
            <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden mb-5">
              <div className="h-28 bg-gradient-to-br from-brand-500/25 to-brand-600/10 px-6 pb-4 flex items-end gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white text-lg border-3 border-surface-800">{activeClub.avatar_letters}</div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-white">{activeClub.name}</h1>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{activeClub.members} members</span>
                    <span>{activeClub.level}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs bg-surface-900/60 border border-slate-700 text-slate-300 hover:border-brand-500/40 transition-colors flex items-center gap-1.5">
                    <Share2 className="w-3 h-3" /> Invite
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors flex items-center gap-1.5">
                    <Plus className="w-3 h-3" /> Schedule Ride
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-slate-400">{activeClub.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Posts */}
              <div className="lg:col-span-2 space-y-4">
                {/* Post composer */}
                <div className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
                  <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Post an update..."
                    className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none transition-colors"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button disabled={!newPost.trim()} className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white text-sm font-medium transition-colors">Post</button>
                  </div>
                </div>

                {/* Posts */}
                {clubPosts.map(post => (
                  <div key={post.id} className="bg-surface-800 border border-slate-700/60 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{post.initials}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{post.user}</div>
                        <div className="text-xs text-slate-500">{getRelativeTime(post.time)}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">{post.text}</p>
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleLike(post.id)} className={cn('flex items-center gap-1.5 text-xs transition-colors', likedPosts.has(post.id) ? 'text-red-400' : 'text-slate-500 hover:text-red-400')}>
                        <Heart className={cn('w-3.5 h-3.5', likedPosts.has(post.id) && 'fill-current')} />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-400 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming rides + leaderboard */}
              <div className="space-y-4">
                <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700/60">
                    <h3 className="font-semibold text-sm text-white">Upcoming Rides</h3>
                  </div>
                  {clubRides.length > 0 ? clubRides.map(ride => (
                    <div key={ride.id} className="px-4 py-3 border-b border-slate-700/40 last:border-b-0">
                      <div className="font-medium text-sm text-white mb-1">{ride.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar className="w-3 h-3" /> {new Date(ride.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{ride.distance} · {ride.difficulty}</span>
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-16 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(ride.rsvps/ride.max)*100}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{ride.rsvps}/{ride.max}</span>
                        </div>
                      </div>
                      <button className="w-full mt-2 py-1.5 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium">RSVP</button>
                    </div>
                  )) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">No upcoming rides</div>
                  )}
                </div>

                <div className="bg-surface-800 border border-slate-700/60 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700/60 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="font-semibold text-sm text-white">Leaderboard</h3>
                  </div>
                  {[
                    { rank: 1, name: 'Sarah K.', km: 420, initials: 'SK' },
                    { rank: 2, name: 'James R.', km: 385, initials: 'JR' },
                    { rank: 3, name: 'Mike C.',  km: 310, initials: 'MC' },
                    { rank: 4, name: 'Pete M.',  km: 284, initials: 'PM' },
                  ].map(rider => (
                    <div key={rider.rank} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-700/40 last:border-b-0">
                      <span className={cn('text-sm font-bold w-5 text-center', rider.rank === 1 ? 'text-amber-400' : rider.rank === 2 ? 'text-slate-300' : rider.rank === 3 ? 'text-orange-400' : 'text-slate-500')}>{rider.rank}</span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{rider.initials}</div>
                      <span className="flex-1 text-sm text-slate-200">{rider.name}</span>
                      <span className="text-sm font-stat font-bold text-brand-400">{rider.km} km</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Club Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
          >
            <motion.div className="bg-surface-800 border border-slate-700/60 rounded-3xl p-6 w-full max-w-md"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Create a Club</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {[{ label: 'Club Name', ph: 'e.g. Derwent Valley Riders', type: 'text' }, { label: 'Location', ph: 'e.g. County Durham', type: 'text' }].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.ph} className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea rows={3} placeholder="What's your club about?" className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Level</label>
                  <select className="w-full bg-surface-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors">
                    {['Mixed','Beginner','Intermediate','Advanced'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-300">Private club (invite only)</span>
                  <div className="w-10 h-5 rounded-full bg-brand-500 relative cursor-pointer flex items-center">
                    <div className="absolute right-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors">Create Club</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
