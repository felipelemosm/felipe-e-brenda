import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const LightboxContext = createContext(() => {})

// Hook para abrir uma foto inteira em tela cheia: openLightbox(src, alt)
export function useLightbox() {
  return useContext(LightboxContext)
}

export function LightboxProvider({ children }) {
  const [photo, setPhoto] = useState(null) // { src, alt }
  const open = useCallback((src, alt) => setPhoto({ src, alt }), [])
  const close = useCallback(() => setPhoto(null), [])

  useEffect(() => {
    if (!photo) return
    function onKey(event) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [photo, close])

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {photo && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true"
          aria-label="Foto ampliada">
          <button className="lightbox-close" onClick={close} aria-label="Fechar">×</button>
          <img src={photo.src} alt={photo.alt || 'Foto de Felipe e Brenda'}
            onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </LightboxContext.Provider>
  )
}
