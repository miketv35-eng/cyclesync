'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export type RideStatus = 'idle' | 'active' | 'paused' | 'ended'

export interface LiveRideData {
  status: RideStatus
  elapsed: number        // seconds
  distance: number       // metres
  speed: number          // km/h current
  avgSpeed: number       // km/h
  maxSpeed: number       // km/h
  elevation: number      // metres gained
  calories: number
  heartRate: number
  cadence: number
  coordinates: [number, number][]
}

const INITIAL: LiveRideData = {
  status: 'idle', elapsed: 0, distance: 0, speed: 0,
  avgSpeed: 0, maxSpeed: 0, elevation: 0, calories: 0,
  heartRate: 0, cadence: 0, coordinates: [],
}

export function useRide() {
  const [data, setData] = useState<LiveRideData>(INITIAL)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const speedHistory = useRef<number[]>([])

  const tick = useCallback(() => {
    setData(prev => {
      const speed = Math.max(0, 24 + (Math.random() - 0.5) * 10)
      speedHistory.current.push(speed)
      const avgSpeed = speedHistory.current.reduce((a, b) => a + b, 0) / speedHistory.current.length
      const distanceDelta = (speed / 3600) * 1000  // metres per second
      return {
        ...prev,
        elapsed: prev.elapsed + 1,
        distance: prev.distance + distanceDelta,
        speed: parseFloat(speed.toFixed(1)),
        avgSpeed: parseFloat(avgSpeed.toFixed(1)),
        maxSpeed: Math.max(prev.maxSpeed, speed),
        elevation: prev.elevation + (Math.random() > 0.6 ? Math.random() * 2 : 0),
        calories: prev.calories + 0.28,
        heartRate: Math.round(148 + (Math.random() - 0.5) * 20),
        cadence: Math.round(88 + (Math.random() - 0.5) * 16),
      }
    })
  }, [])

  useEffect(() => {
    if (data.status === 'active') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [data.status, tick])

  const start  = () => { speedHistory.current = []; setData({ ...INITIAL, status: 'active' }) }
  const pause  = () => setData(d => ({ ...d, status: 'paused' }))
  const resume = () => setData(d => ({ ...d, status: 'active' }))
  const stop   = () => setData(d => ({ ...d, status: 'ended' }))
  const reset  = () => setData(INITIAL)

  return { data, start, pause, resume, stop, reset }
}
