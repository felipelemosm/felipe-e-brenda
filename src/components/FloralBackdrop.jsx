import lirio from '../assets/florais/lirio-1.png'
import cravos from '../assets/florais/cravos.png'
import calendula from '../assets/florais/calendula.png'
import floresCampo from '../assets/florais/flores-campo.png'
import ramoFolhas from '../assets/florais/ramo-folhas.png'
import rosaPessego from '../assets/florais/rosa-pessego.png'

// Composição em moldura: um arranjo por canto e um ramo discreto no meio de
// cada lateral, em alturas alternadas — sem sobreposição entre elementos.
const FLORALS = [
  { src: lirio, className: 'floral-tl' },
  { src: floresCampo, className: 'floral-tr' },
  { src: cravos, className: 'floral-bl' },
  { src: calendula, className: 'floral-br' },
  { src: ramoFolhas, className: 'floral-ml' },
  { src: rosaPessego, className: 'floral-mr' },
]

export default function FloralBackdrop() {
  return (
    <div className="floral-backdrop" aria-hidden="true">
      {FLORALS.map(({ src, className }) => (
        <img key={className} src={src} alt="" className={`floral ${className}`} />
      ))}
    </div>
  )
}
