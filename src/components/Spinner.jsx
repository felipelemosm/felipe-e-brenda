// Indicador de carregamento reutilizável (círculo dourado girando).
export default function Spinner({ label }) {
  return (
    <div className="loading-box" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      {label && <span className="loading-label">{label}</span>}
    </div>
  )
}
