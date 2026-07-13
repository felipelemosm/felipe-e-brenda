import Weather from '../components/Weather.jsx'
import VenueCard from '../components/VenueCard.jsx'

const photos = import.meta.glob('../assets/locais/espaco-naya*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const NAYA_PHOTO = Object.values(photos)[0] ?? null

export default function Recepcao() {
  return (
    <section className="section">
      <div className="section-eyebrow">Para celebrar</div>
      <h2 className="section-title script">A Recepção</h2>
      <div className="section-intro">
        <p className="section-sub">
          Após a missa, receberemos nossos convidados para um almoço de celebração no
          Espaço Naya, na região da Pampulha.
        </p>
        <p className="section-sub">
          <strong>O acesso à recepção será liberado apenas após o fim da missa.</strong>{' '}
          Aproveite a celebração inteira na capela — a festa espera por todos.
        </p>
      </div>

      <VenueCard
        kind="Recepção & Festa"
        name="Espaço Naya"
        detail="Av. Portugal, 3430 — Santa Amélia (região da Pampulha), Belo Horizonte · MG"
        time="Acesso somente após o fim da missa"
        photo={NAYA_PHOTO}
        photoAlt="Espaço Naya, na Pampulha, em Belo Horizonte"
        mapQuery="Espaço Naya, Av. Portugal 3430, Belo Horizonte MG"
        wazeQuery="Espaço Naya Pampulha Belo Horizonte"
        mapTitle="Mapa do Espaço Naya"
      />

      <Weather />
    </section>
  )
}
