import { useEffect, useState } from 'react'

// O slideshow da capa mostra as fotos de src/assets/capa/ (jpg, jpeg, png ou
// webp), em ordem alfabética, trocando com fade a cada 6 segundos e começando
// numa foto aleatória. Para adicionar mais, salve o arquivo nessa pasta.
//
// Cada foto recebe um data-frame com o nome do arquivo (ex.: capa-03), e o CSS
// ajusta o enquadramento dela individualmente. Isso é necessário porque a
// moldura é 4/5 e cada foto tem uma proporção diferente: o object-fit: cover
// corta no eixo mais longo, então o mesmo "center" que centraliza uma corta o
// casal de outra. Foto nova sem regra própria cai no padrão centralizado —
// olhe o resultado e, se o casal não ficar no meio, acrescente a regra em
// styles.css (bloco "enquadramento por foto da capa").
const extras = import.meta.glob('../assets/capa/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const PHOTOS = Object.keys(extras)
  .sort()
  .map((key) => ({
    src: extras[key],
    frame: key.split('/').pop().replace(/\.[^.]+$/, ''),
    alt: 'Felipe e Brenda',
  }))

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
      {PHOTOS.map(({ src, frame, alt }, i) => (
        <img key={frame} src={src} alt={alt}
          data-frame={frame}
          className={i === index ? 'visible' : undefined}
          loading={i === start ? 'eager' : 'lazy'} />
      ))}
    </figure>
  )
}
