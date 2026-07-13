// Fotos ilustrativas: salve em src/assets/informacoes/ com o nome do bloco
// (missa.jpg, traje.jpg, comunhao.jpg, alimentacao.jpg, pontualidade.jpg).
const photos = import.meta.glob('../assets/informacoes/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function photoFor(slug) {
  const entry = Object.entries(photos).find(([path]) =>
    path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '') === slug,
  )
  return entry ? entry[1] : null
}

const INFOS = [
  {
    slug: 'missa',
    icon: '✝️',
    eyebrow: 'A celebração',
    title: 'Será uma missa de casamento',
    photoAlt: 'Interior de uma igreja católica durante a celebração',
    text: (
      <>
        <p>
          Mais do que uma cerimônia, será uma <strong>celebração com missa completa</strong>,
          dentro de uma igreja católica, com duração esperada de <strong>1h a 1h30</strong>.
        </p>
        <p>
          Contamos com a presença de todos do início ao fim desse momento tão especial
          para nós.
        </p>
      </>
    ),
  },
  {
    slug: 'traje',
    icon: '⛪',
    eyebrow: 'Traje',
    title: 'Vista-se para a casa de Deus',
    photoAlt: 'Convidados vestidos elegantemente para um casamento',
    text: (
      <>
        <p>
          A cerimônia será uma <strong>missa de casamento em uma igreja católica</strong>.
          Pedimos carinhosamente que todos se vistam de forma adequada ao ambiente
          sagrado — em especial às convidadas: prefira vestidos e trajes mais discretos,
          evitando decotes acentuados, comprimentos muito curtos e ombros totalmente
          descobertos.
        </p>
        <p>Um xale ou blazer resolve com elegância.</p>
      </>
    ),
  },
  {
    slug: 'comunhao',
    icon: '🕊️',
    eyebrow: 'Comunhão',
    title: 'Sobre a Sagrada Eucaristia',
    photoAlt: 'Hóstias e cálice preparados para a comunhão',
    text: (
      <>
        <p>
          Haverá comunhão durante a missa. Lembramos, com carinho, que a Eucaristia é
          reservada aos <strong>católicos que estejam em estado de graça</strong> — isto
          é, sem consciência de pecado grave, tendo recorrido à confissão quando
          necessário.
        </p>
        <p>
          Quem não for católico, ou preferir não comungar, pode permanecer
          tranquilamente no banco ou aproximar-se de braços cruzados sobre o peito para
          receber uma bênção.
        </p>
      </>
    ),
  },
  {
    slug: 'alimentacao',
    icon: '🍽️',
    eyebrow: 'Alimentação',
    title: 'Tome um bom café da manhã',
    photoAlt: 'Mesa de café da manhã',
    text: (
      <>
        <p>
          A missa será às <strong>10h da manhã</strong> e o almoço será servido apenas
          na recepção, no Espaço Naya, após a celebração.
        </p>
        <p>
          O acesso à recepção será liberado <strong>apenas após o fim da missa</strong>.
        </p>
        <p>
          Recomendamos que todos se alimentem antes de sair de casa — assim ninguém
          passa aperto e todos aproveitam a celebração inteira.
        </p>
      </>
    ),
  },
  {
    slug: 'pontualidade',
    icon: '🕰️',
    eyebrow: 'Pontualidade',
    title: 'Chegue com antecedência',
    photoAlt: 'Relógio clássico marcando as horas',
    text: (
      <>
        <p>
          As portas da capela abrem cedo: planeje chegar com cerca de{' '}
          <strong>15 minutos de antecedência</strong>. A missa começará pontualmente às
          10h, e a entrada dos noivos não espera trânsito.
        </p>
      </>
    ),
  },
]

export default function Informacoes() {
  return (
    <section className="section">
      <div className="section-eyebrow">Leia antes do grande dia</div>
      <h2 className="section-title script">Informações Importantes</h2>
      <div className="section-intro">
        <p className="section-sub">
          Alguns avisos com carinho, para que todos vivam esse dia conosco com conforto
          e reverência.
        </p>
      </div>

      <div className="infos">
        {INFOS.map((info, index) => {
          const photo = photoFor(info.slug)
          return (
            <article className="info-block" key={info.slug}>
              <div className="info-marker">
                <span className="info-icon" aria-hidden="true">{info.icon}</span>
              </div>
              <div className="info-content">
                <div className="info-eyebrow">{info.eyebrow}</div>
                <h3 className="info-title">{info.title}</h3>
                <div className="info-text">{info.text}</div>
                {photo && (
                  <img className="info-photo" src={photo} alt={info.photoAlt} loading="lazy" />
                )}
              </div>
              {index < INFOS.length - 1 && (
                <div className="info-divider" aria-hidden="true">❦</div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
