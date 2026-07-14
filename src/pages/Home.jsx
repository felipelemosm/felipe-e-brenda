import Countdown from '../components/Countdown.jsx'
import MessagesSlideshow from '../components/MessagesSlideshow.jsx'
import HeroPhotos from '../components/HeroPhotos.jsx'
import brasaoCompleto from '../assets/brasao-completo.svg'

export default function Home() {
  return (
    <section className="hero">
      <img src={brasaoCompleto} alt="Brasão de Felipe e Brenda" className="hero-crest" />
      <h1 className="hero-names script">
        Felipe <span className="amp">&amp;</span> Brenda
      </h1>
      <div className="hero-date">10 · 10 · 2026 — 10h30</div>
      <div className="hero-place">Capela Nossa Senhora da Conceição - Colégio Arnaldo · Belo Horizonte, MG</div>

      <HeroPhotos />

      <Countdown />

      <p className="hero-invite">
        “Amamos, porque Deus nos amou primeiro”
        <span className="hero-invite-ref">São João 4, 19</span>
      </p>

      <MessagesSlideshow />
    </section>
  )
}
