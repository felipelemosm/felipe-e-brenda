import monograma from '../assets/brasao-monograma.png'

export default function Footer() {
  return (
    <footer className="footer">
      <img src={monograma} alt="" className="footer-crest" aria-hidden="true" />
      <div className="footer-names script">
        Felipe <span className="amp">&amp;</span> Brenda
      </div>
      <div className="footer-note">10 · 10 · 2026 — Belo Horizonte · MG</div>
    </footer>
  )
}
