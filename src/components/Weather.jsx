import { useEffect, useState } from 'react'

// Belo Horizonte, MG
const LAT = -19.9167
const LON = -43.9345
const TIMEZONE = 'America/Sao_Paulo'

// Semana da festa: 3 dias antes e 3 depois, com o casamento no centro
const WEDDING_DAY = '2026-10-10'
const WEEK_START = '2026-10-07'
const WEEK_END = '2026-10-13'
const HISTORY_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
const RAIN_THRESHOLD = 45 // %

function iconFor(rainProb) {
  if (rainProb > 60) return { icon: '🌧️', text: 'Chuva provável' }
  if (rainProb > RAIN_THRESHOLD) return { icon: '🌦️', text: 'Possibilidade de chuva' }
  if (rainProb > 25) return { icon: '🌤️', text: 'Parcialmente nublado' }
  return { icon: '☀️', text: 'Tempo firme' }
}

function labelFor(iso) {
  const date = new Date(`${iso}T12:00:00-03:00`)
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  return { weekday, day }
}

// Previsão oficial (disponível ~2 semanas antes do evento)
async function fetchForecast() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&start_date=${WEEK_START}&end_date=${WEEK_END}&timezone=${encodeURIComponent(TIMEZONE)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`forecast HTTP ${res.status}`)
  const { daily } = await res.json()
  if (!daily?.time?.length || daily.temperature_2m_max.every((t) => t === null)) {
    throw new Error('forecast fora do horizonte')
  }
  return daily.time.map((date, i) => ({
    date,
    max: Math.round(daily.temperature_2m_max[i]),
    min: Math.round(daily.temperature_2m_min[i]),
    rain: daily.precipitation_probability_max[i] ?? 0,
  }))
}

// Média histórica: mesmos 7 dias nos últimos 10 anos
async function fetchHistoricalAverage() {
  const perYear = await Promise.all(
    HISTORY_YEARS.map(async (year) => {
      const start = WEEK_START.replace('2026', String(year))
      const end = WEEK_END.replace('2026', String(year))
      const url =
        `https://archive-api.open-meteo.com/v1/archive?latitude=${LAT}&longitude=${LON}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
        `&start_date=${start}&end_date=${end}&timezone=${encodeURIComponent(TIMEZONE)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`archive HTTP ${res.status}`)
      const { daily } = await res.json()
      return daily
    }),
  )

  return Array.from({ length: 7 }, (_, i) => {
    const valid = perYear.filter((d) => d?.temperature_2m_max?.[i] !== null)
    const avg = (values) => values.reduce((a, b) => a + b, 0) / values.length
    const rainyYears = valid.filter((d) => (d.precipitation_sum[i] ?? 0) >= 1).length
    const date = new Date(`${WEEK_START}T12:00:00-03:00`)
    date.setDate(date.getDate() + i)
    return {
      date: date.toISOString().slice(0, 10),
      max: Math.round(avg(valid.map((d) => d.temperature_2m_max[i]))),
      min: Math.round(avg(valid.map((d) => d.temperature_2m_min[i]))),
      rain: Math.round((rainyYears / valid.length) * 100),
    }
  })
}

export default function Weather() {
  const [days, setDays] = useState(null)
  const [mode, setMode] = useState(null) // 'forecast' | 'history'
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchForecast()
      .then((data) => {
        if (!cancelled) {
          setDays(data)
          setMode('forecast')
        }
      })
      .catch(() =>
        fetchHistoricalAverage()
          .then((data) => {
            if (!cancelled) {
              setDays(data)
              setMode('history')
            }
          })
          .catch(() => !cancelled && setError(true)),
      )
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return null

  const weddingDay = days?.find((d) => d.date === WEDDING_DAY)
  const willRain = weddingDay ? weddingDay.rain > RAIN_THRESHOLD : null

  return (
    <div className="weather">
      <div className="weather-title">O tempo na semana da festa — Belo Horizonte</div>

      {!days ? (
        <p className="weather-loading">Consultando o céu de outubro…</p>
      ) : (
        <>
          {willRain !== null && (
            <div className={`rain-verdict ${willRain ? 'yes' : 'no'}`}>
              CHUVA: <strong>{willRain ? 'SIM' : 'NÃO'}</strong>
              <span className="rain-prob">({weddingDay.rain}% no dia 10/10)</span>
            </div>
          )}

          <div className="weather-days">
            {days.map((day) => {
              const { icon, text } = iconFor(day.rain)
              const { weekday, day: dayLabel } = labelFor(day.date)
              const isWedding = day.date === WEDDING_DAY
              return (
                <div className={`weather-day${isWedding ? ' wedding' : ''}`} key={day.date} title={text}>
                  {isWedding && <div className="weather-badge">O grande dia</div>}
                  <div className="weather-weekday">{weekday}</div>
                  <div className="weather-date">{dayLabel}</div>
                  <div className="weather-icon" role="img" aria-label={text}>{icon}</div>
                  <div className="weather-temp">
                    <strong>{day.max}°</strong> / {day.min}°
                  </div>
                  <div className="weather-rain">💧 {day.rain}%</div>
                </div>
              )
            })}
          </div>

          <p className="weather-note">
            {mode === 'history'
              ? 'Estimativa pela média histórica dos últimos 10 anos nesta semana. A previsão oficial substitui estes números automaticamente quando o grande dia se aproximar.'
              : 'Previsão oficial, atualizada a cada visita.'}
          </p>
        </>
      )}
    </div>
  )
}
