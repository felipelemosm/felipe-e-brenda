import { useEffect, useState } from 'react'

const WEDDING_DATE = new Date('2026-10-10T10:30:00-03:00')

function remaining() {
  const diff = WEDDING_DATE - new Date()
  if (diff <= 0) return null
  const s = Math.floor(diff / 1000)
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    seg: s % 60,
  }
}

function Married() {
  const days = Math.floor((new Date() - WEDDING_DATE) / 86400000)
  return (
    <div className="married">
      <div className="married-script script">Casados!</div>
      <p className="married-note">
        Dissemos “sim” em 10 de outubro de 2026
        {days < 1 ? ' — hoje! 🤍' : ` — há ${days} ${days === 1 ? 'dia' : 'dias'} 🤍`}
      </p>
    </div>
  )
}

export default function Countdown() {
  const [time, setTime] = useState(remaining)

  useEffect(() => {
    const id = setInterval(() => setTime(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return <Married />

  return (
    <div className="countdown-wrap">
      <div className="countdown-title">Faltam</div>
      <div className="countdown" role="timer" aria-label="Contagem regressiva para o casamento">
        {Object.entries(time).map(([label, value]) => (
          <div className="count-item" key={label}>
            <div className="count-num">{value}</div>
            <div className="count-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
