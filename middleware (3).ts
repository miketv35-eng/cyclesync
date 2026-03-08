// Mapbox helper utilities

export const MAPBOX_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
} as const

export type MapboxStyle = keyof typeof MAPBOX_STYLES

export function getRouteColor(difficulty: string): string {
  const map: Record<string, string> = {
    easy: '#10b981', moderate: '#f59e0b', hard: '#f97316', extreme: '#ef4444',
  }
  return map[difficulty] ?? '#0ea5e9'
}

export function metersToMapboxZoom(meters: number): number {
  if (meters < 1000) return 15
  if (meters < 5000) return 13
  if (meters < 20000) return 11
  if (meters < 100000) return 9
  return 7
}

// Calculate bounding box for a set of coordinates
export function getBounds(coords: [number, number][]): [[number, number], [number, number]] {
  const lngs = coords.map(c => c[0])
  const lats = coords.map(c => c[1])
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
}

// Generate mock elevation profile
export function generateElevationProfile(points: number): number[] {
  const profile: number[] = []
  let elevation = 100 + Math.random() * 50
  for (let i = 0; i < points; i++) {
    elevation += (Math.random() - 0.48) * 15
    elevation = Math.max(50, Math.min(800, elevation))
    profile.push(Math.round(elevation))
  }
  return profile
}
