import { useEffect, useState } from 'react'
import { useLightbox } from '../components/Lightbox.jsx'

// Mural de fotos do pré-wedding. As imagens ficam em src/assets/mural/ (versão
// cheia, usada no destaque e ao ampliar) e src/assets/mural-thumb/ (miniatura
// da grade), com o MESMO nome de arquivo nas duas pastas. Para adicionar mais
// fotos, salve o arquivo nas duas pastas — a ordem segue o nome do arquivo.
const fullFiles = import.meta.glob('../assets/mural/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const thumbFiles = import.meta.glob('../assets/mural-thumb/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const basename = (path) => path.split('/').pop()
const orderedKeys = Object.keys(fullFiles).sort()
const FULL = orderedKeys.map((key) => fullFiles[key])
// casa cada miniatura com a foto cheia pelo nome; se faltar, usa a própria cheia
const thumbByName = Object.fromEntries(
  Object.entries(thumbFiles).map(([key, value]) => [basename(key), value]),
)
const THUMBS = orderedKeys.map((key) => thumbByName[basename(key)] ?? fullFiles[key])

const FEATURED_INTERVAL_MS = 6000

export default function Mural() {
  const [featured, setFeatured] = useState(0)
  // `beat` muda só para reiniciar o contador sem trocar a foto (ao clicar/ampliar)
  const [beat, setBeat] = useState(0)
  const openLightbox = useLightbox()

  // troca a foto destaque a cada 6s; o contador reinicia sempre que `featured`
  // muda (avanço automático ou navegação) e a cada `beat` (clique para ampliar),
  // para não pular enquanto a pessoa está vendo a foto.
  useEffect(() => {
    if (FULL.length < 2) return
    const id = setTimeout(() => {
      setFeatured((current) => (current + 1) % FULL.length)
    }, FEATURED_INTERVAL_MS)
    return () => clearTimeout(id)
  }, [featured, beat])

  // pré-carrega a próxima foto cheia para a troca do destaque não piscar
  useEffect(() => {
    if (FULL.length < 2) return
    const next = new Image()
    next.src = FULL[(featured + 1) % FULL.length]
  }, [featured])

  if (FULL.length === 0) return null

  function goFeatured(delta) {
    setFeatured((current) => (current + delta + FULL.length) % FULL.length)
  }

  function expandFeatured() {
    setBeat((value) => value + 1) // reinicia a contagem ao ampliar
    openLightbox(FULL, featured, 'Felipe e Brenda')
  }

  return (
    <section className="section">
      <div className="section-eyebrow">Pré-wedding</div>
      <h2 className="section-title script">Mural de Fotos</h2>
      <div className="section-intro">
        <p className="section-sub">
          Um cantinho com as fotos do nosso ensaio. Clique em qualquer imagem para
          ampliá-la e use as setas para navegar por todas.
        </p>
      </div>

      <div className="mural-featured zoomable" onClick={expandFeatured}
        role="button" tabIndex={0} aria-label="Ampliar foto em destaque"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); expandFeatured() }
        }}>
        <img key={featured} src={FULL[featured]} alt="Felipe e Brenda"
          className="mural-featured-img" loading={featured === 0 ? 'eager' : 'lazy'} />
        {FULL.length > 1 && (
          <>
            <button className="mural-featured-nav prev"
              onClick={(event) => { event.stopPropagation(); goFeatured(-1) }}
              aria-label="Foto anterior">‹</button>
            <button className="mural-featured-nav next"
              onClick={(event) => { event.stopPropagation(); goFeatured(1) }}
              aria-label="Próxima foto">›</button>
          </>
        )}
      </div>

      <div className="mural-grid">
        {THUMBS.map((src, index) => (
          <button key={index} type="button" className="mural-cell"
            onClick={() => openLightbox(FULL, index, 'Felipe e Brenda')}
            aria-label={`Ampliar foto ${index + 1}`}>
            <img src={src} alt="Felipe e Brenda" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  )
}
