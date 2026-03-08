import type { Weather } from '@/types'

const BASE = 'https://api.openweathermap.org/data/2.5'
const KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY

export async function fetchWeather(lat: number, lon: number): Promise<Weather | null> {
  if (!KEY) return getMockWeather()
  try {
    const [current, forecast] = await Promise.all([
      fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`).then(r => r.json()),
      fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=5&appid=${KEY}`).then(r => r.json()),
    ])
    return {
      temp: Math.round(current.main.temp),
      feels_like: Math.round(current.main.feels_like),
      condition: current.weather[0].description,
      icon: current.weather[0].icon,
      wind_speed: Math.round(current.wind.speed * 3.6),
      wind_deg: current.wind.deg,
      humidity: current.main.humidity,
      uv_index: 0,
      rain_chance: current.rain ? 80 : 10,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      forecast: forecast.list.slice(0, 5).map((d: Record<string, unknown>) => {
        const main = d.main as Record<string, number>
        const weather = (d.weather as Array<Record<string, string>>)[0]
        return {
          date: new Date((d.dt as number) * 1000).toLocaleDateString(),
          min: Math.round(main.temp_min),
          max: Math.round(main.temp_max),
          condition: weather.description,
          icon: weather.icon,
          rain_chance: d.rain ? 70 : 15,
        }
      }),
    }
  } catch { return getMockWeather() }
}

function getMockWeather(): Weather {
  return {
    temp: 9, feels_like: 6, condition: 'Partly Cloudy', icon: '03d',
    wind_speed: 18, wind_deg: 225, humidity: 72, uv_index: 2,
    rain_chance: 15, sunrise: 1709617200, sunset: 1709660400,
    forecast: [
      { date: 'Mon', min: 6, max: 11, condition: 'Sunny', icon: '01d', rain_chance: 5 },
      { date: 'Tue', min: 5, max: 8, condition: 'Cloudy', icon: '04d', rain_chance: 30 },
      { date: 'Wed', min: 4, max: 7, condition: 'Rainy', icon: '10d', rain_chance: 80 },
      { date: 'Thu', min: 6, max: 10, condition: 'Partly Cloudy', icon: '03d', rain_chance: 20 },
      { date: 'Fri', min: 7, max: 13, condition: 'Sunny', icon: '01d', rain_chance: 5 },
    ],
  }
}

export function getCyclingAdvisory(weather: Weather): { text: string; severity: 'good' | 'caution' | 'warning' } {
  if (weather.wind_speed > 40 || weather.rain_chance > 70)
    return { text: 'Poor conditions — consider postponing', severity: 'warning' }
  if (weather.wind_speed > 25 || weather.rain_chance > 40)
    return { text: 'Challenging conditions — take extra care', severity: 'caution' }
  return { text: 'Good riding conditions — enjoy!', severity: 'good' }
}

export function getWindDirection(deg: number): string {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}
