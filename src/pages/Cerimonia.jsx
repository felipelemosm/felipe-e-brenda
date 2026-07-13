import Weather from '../components/Weather.jsx'
import VenueCard from '../components/VenueCard.jsx'

const ORIGIN = 'Colégio Arnaldo, Praça João Pessoa, Funcionários, Belo Horizonte MG'
const DESTINATION = 'Espaço Naya, Pampulha, Belo Horizonte MG'

const photos = import.meta.glob('../assets/locais/capela*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const CAPELA_PHOTO = Object.values(photos)[0] ?? null

export default function Cerimonia() {
  const origin = encodeURIComponent(ORIGIN)
  const destination = encodeURIComponent(DESTINATION)

  return (
    <section className="section">
      <div className="section-eyebrow">O grande dia</div>
      <h2 className="section-title script">A Cerimônia</h2>
      <div className="section-intro">
        <p className="section-sub">
          A celebração acontecerá na Capela Nossa Senhora da Conceição, no Colégio
          Arnaldo, coração de Belo Horizonte. Será uma <strong>missa completa de
          casamento</strong>, com duração esperada de <strong>1h a 1h30</strong>.
        </p>
        <p className="section-sub">
          Pedimos aos convidados que cheguem com cerca de 15 minutos de antecedência.
        </p>
      </div>

      <VenueCard
        kind="Cerimônia Religiosa"
        name="Capela Nossa Senhora da Conceição - Colégio Arnaldo"
        detail="Praça João Pessoa — Bairro Funcionários, Belo Horizonte · MG"
        time="Sábado, 10 · 10 · 2026 — 10h · Missa (1h a 1h30)"
        photo={CAPELA_PHOTO}
        photoAlt="Fachada do Colégio Arnaldo, em Belo Horizonte"
        mapQuery="Capela do Colégio Arnaldo, Belo Horizonte MG"
        wazeQuery="Colégio Arnaldo Belo Horizonte"
        mapTitle="Mapa da Capela Nossa Senhora da Conceição - Colégio Arnaldo"
      />

      <div className="venue-card route-card">
        <div className="venue-kind">Depois da missa</div>
        <div className="venue-name">Trajeto até a recepção</div>
        <div className="venue-detail">
          Da Capela Nossa Senhora da Conceição - Colégio Arnaldo até o Espaço Naya,
          na Pampulha. O acesso à recepção será liberado apenas após o fim da missa.
        </div>
        <iframe
          className="venue-map route-map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Trajeto da capela até o Espaço Naya"
          src={`https://www.google.com/maps?saddr=${origin}&daddr=${destination}&output=embed`}
        />
        <p className="route-note">
          O tempo de percurso exibido no mapa considera o trânsito em tempo real — no
          dia 10/10, ao fim da manhã de sábado, ele refletirá as condições daquele
          momento.
        </p>
        <div className="venue-links">
          <a className="btn" target="_blank" rel="noopener noreferrer"
            href={`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`}>
            Abrir trajeto no Google Maps
          </a>
          <a className="btn ghost" target="_blank" rel="noopener noreferrer"
            href={`https://waze.com/ul?q=${encodeURIComponent('Espaço Naya Pampulha Belo Horizonte')}&navigate=yes`}>
            Ir com Waze
          </a>
        </div>
      </div>

      <Weather />
    </section>
  )
}
