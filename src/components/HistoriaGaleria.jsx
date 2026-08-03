import { useEffect, useState } from 'react'

// Slideshow de fotos do casal ao fim da timeline. As imagens ficam em
// src/assets/historia-galeria/ (jpg, jpeg, png ou webp) e entram em ordem
// alfabética. Para adicionar mais, basta salvar o arquivo lá.
const files = import.meta.glob('../assets/historia-galeria/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const PHOTOS = Object.keys(files).sort().map((key) => files[key])

const INTERVAL_MS = 4500

export default function HistoriaGaleria() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || PHOTOS.length < 2) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % PHOTOS.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [paused])

  if (PHOTOS.length === 0) return null

  function go(delta) {
    setIndex((current) => (current + delta + PHOTOS.length) % PHOTOS.length)
  }

  return (
    <div className="galeria">
      <h3 className="galeria-title script">Nossos momentos</h3>
      <p className="galeria-sub">Um retrato de tantos capítulos que vivemos juntos.</p>

      <div className="galeria-stage"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {PHOTOS.map((src, i) => (
          <img key={i} src={src} alt="Felipe e Brenda"
            className={i === index ? 'visible' : undefined}
            loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
        <button className="galeria-nav prev" onClick={() => go(-1)} aria-label="Foto anterior">‹</button>
        <button className="galeria-nav next" onClick={() => go(1)} aria-label="Próxima foto">›</button>
      </div>

      <div className="galeria-dots" role="presentation">
        {PHOTOS.map((_, i) => (
          <button key={i} className={i === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(i)} aria-label={`Foto ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
