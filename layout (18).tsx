'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Bike, Mail, Chrome, Apple, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [mode, setMode] = useState<'options' | 'email'>('options')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function signInGoogle() {
    setLoading('google')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
    setLoading(null)
  }

  async function signInApple() {
    setLoading('apple')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
    setLoading(null)
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading('email')
    const fn = isSignUp
      ? supabase.auth.signUp({ email, password, options: { data: { full_name: '' } } })
      : supabase.auth.signInWithPassword({ email, password })
    const { error } = await fn
    if (error) toast.error(error.message)
    else if (isSignUp) toast.success('Check your email to confirm your account!')
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 60%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 mb-4">
            <Bike className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">CycleSync</h1>
          <p className="text-slate-400 text-sm mt-1">Plan. Ride. Connect. Repeat.</p>
        </div>

        <div className="bg-surface-800 border border-slate-700/60 rounded-3xl p-8 shadow-card-dark">
          {mode === 'options' ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-center mb-6">Get started</h2>
              <button
                onClick={signInGoogle}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {loading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <button
                onClick={signInApple}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium border border-slate-600 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {loading === 'apple' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Apple className="w-5 h-5" />}
                Continue with Apple
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div>
                <div className="relative flex justify-center text-xs text-slate-500 bg-surface-800 px-3">or</div>
              </div>

              <button
                onClick={() => setMode('email')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-surface-900 text-slate-300 font-medium border border-slate-700 hover:border-brand-500/50 transition-colors"
              >
                <Mail className="w-4 h-4" /> Continue with Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmail} className="space-y-4">
              <button type="button" onClick={() => setMode('options')} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-2">
                ← Back
              </button>
              <h2 className="text-lg font-semibold">{isSignUp ? 'Create account' : 'Sign in'}</h2>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-surface-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={!!loading}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-sm text-slate-400 hover:text-white text-center transition-colors">
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          By continuing you agree to our Terms of Service & Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
