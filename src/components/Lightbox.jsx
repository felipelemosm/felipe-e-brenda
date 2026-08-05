import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const LightboxContext = createContext(() => {})

// Hook para abrir foto(s) em tela cheia:
//   openLightbox(src, 0, alt)            → uma foto (sem navegação)
//   openLightbox([a, b, c], index, alt)  → galeria navegável (setas + teclado)
export function useLightbox() {
  return useContext(LightboxContext)
}

export function LightboxProvider({ children }) {
  const [state, setState] = useState(null) // { photos: [], index, alt }

  const open = useCallback((photos, index = 0, alt) => {
    const list = Array.isArray(photos) ? photos : [photos]
    setState({ photos: list, index, alt })
  }, [])
  const close = useCallback(() => setState(null), [])
  const go = useCallback((delta) => {
    setState((s) => (s ? { ...s, index: (s.index + delta + s.photos.length) % s.photos.length } : s))
  }, [])

  useEffect(() => {
    if (!state) return
    function onKey(event) {
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowLeft') go(-1)
      else if (event.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [state, close, go])

  const multiple = state && state.photos.length > 1

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {state && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true"
          aria-label="Foto ampliada">
          <button className="lightbox-close" onClick={close} aria-label="Fechar">×</button>
          {multiple && (
            <button className="lightbox-nav prev"
              onClick={(event) => { event.stopPropagation(); go(-1) }}
              aria-label="Foto anterior">‹</button>
          )}
          <img src={state.photos[state.index]} alt={state.alt || 'Foto de Felipe e Brenda'}
            onClick={(event) => event.stopPropagation()} />
          {multiple && (
            <button className="lightbox-nav next"
              onClick={(event) => { event.stopPropagation(); go(1) }}
              aria-label="Próxima foto">›</button>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  )
}
