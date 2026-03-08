'use client'
import { useState, useEffect } from 'react'

interface GeoState {
  lat: number | null
  lng: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation(watch = false) {
  const [state, setState] = useState<GeoState>({ lat: null, lng: null, accuracy: null, error: null, loading: true })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported', loading: false }))
      return
    }
    const onSuccess = (pos: GeolocationPosition) => {
      setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, error: null, loading: false })
    }
    const onError = (err: GeolocationPositionError) => {
      setState(s => ({ ...s, error: err.message, loading: false }))
    }
    const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, opts)
      return () => navigator.geolocation.clearWatch(id)
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, opts)
    }
  }, [watch])

  return state
}
