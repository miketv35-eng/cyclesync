import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(meters: number, units: 'metric' | 'imperial' = 'metric'): string {
  if (units === 'imperial') {
    const miles = meters / 1609.344
    return miles >= 1 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.28084)} ft`
  }
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatSpeed(kmh: number, units: 'metric' | 'imperial' = 'metric'): string {
  if (units === 'imperial') return `${(kmh * 0.621371).toFixed(1)} mph`
  return `${kmh.toFixed(1)} km/h`
}

export function formatElevation(meters: number, units: 'metric' | 'imperial' = 'metric'): string {
  if (units === 'imperial') return `${Math.round(meters * 3.28084)} ft`
  return `${Math.round(meters)} m`
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    easy: 'text-emerald-400',
    moderate: 'text-amber-400',
    hard: 'text-orange-400',
    extreme: 'text-red-400',
  }
  return map[difficulty] ?? 'text-slate-400'
}

export function getRelativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
