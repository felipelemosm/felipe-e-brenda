import { useEffect, useState } from 'react'
import fotoCapa from '../assets/foto-capa.jpeg'

// Para adicionar mais fotos ao slideshow da capa, salve os arquivos em
// src/assets/capa/ (jpg, jpeg, png ou webp). Elas entram em ordem alfabética,
// depois da foto principal, trocando com fade a cada 6 segundos.
const extras = import.meta.glob('../assets/capa/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const PHOTOS = [fotoCapa, ...Object.keys(extras).sort().map((key) => extras[key])]

const SLIDE_INTERVAL_MS = 6000

export default function HeroPhotos() {
  // começa numa foto aleatória; a cada visita a capa abre diferente
  const [start] = useState(() => Math.floor(Math.random() * PHOTOS.length))
  const [index, setIndex] = useState(start)

  useEffect(() => {
    if (PHOTOS.length < 2) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % PHOTOS.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <figure className="hero-photo">
      {PHOTOS.map((src, i) => {
        // a foto principal (i === 0) mantém o enquadramento original; as demais
        // ficam centralizadas na moldura (classe base), pois têm outros formatos.
        const classes = [i === 0 ? 'cover-main' : null, i === index ? 'visible' : null]
          .filter(Boolean)
          .join(' ')
        return (
          <img key={i} src={src}
            alt={i === 0 ? 'Felipe e Brenda abraçados em um parque' : 'Felipe e Brenda'}
            className={classes || undefined}
            loading={i === start ? 'eager' : 'lazy'} />
        )
      })}
    </figure>
  )
}
