// Vídeos e links de formação católica por seção. Para trocar um vídeo, basta
// substituir o ID do YouTube abaixo.
const VIDEO_MISSA = 'ELgn6jdGA_I' // Casamento católico: tudo sobre a cerimônia
const VIDEO_EUCARISTIA = 'YzuEyaMH3vQ' // Sacramento da Eucaristia

const LINK_MISSA_PASSO = 'https://formacao.cancaonova.com/igreja/catequese/voce-sabe-quais-sao-as-partes-da-missa-e-seus-elementos/'
const LINK_PDF = './celebracao-do-matrimonio-na-missa.pdf'
const LINK_EUCARISTIA = 'https://formacao.cancaonova.com/igreja/doutrina/o-sacramento-da-eucaristia/'
const LINK_CATOLICO = 'https://www.a12.com/redacaoa12/espiritualidade/como-me-tornar-catolico'

const INFOS = [
  {
    slug: 'missa',
    icon: '✝️',
    eyebrow: 'A celebração',
    title: 'Será uma missa de casamento',
    text: (
      <>
        <p>
          Mais do que uma cerimônia, será uma <strong>celebração com missa completa</strong>,
          dentro de uma igreja católica, com duração esperada de <strong>1h a 1h30</strong>.
        </p>
        <p>
          Se você não é católico ou não conhece o rito, não se preocupe: deixamos aqui um
          vídeo mostrando como a missa de casamento acontece, um guia das partes da missa
          e o roteiro da nossa celebração.
        </p>
      </>
    ),
    video: { id: VIDEO_MISSA, title: 'Como funciona a missa de casamento católico' },
    links: [
      { label: 'A missa católica, passo a passo', href: LINK_MISSA_PASSO },
      { label: 'Roteiro: a Celebração do Matrimônio na Missa (PDF)', href: LINK_PDF, pdf: true },
    ],
  },
  {
    slug: 'traje',
    icon: '⛪',
    eyebrow: 'Traje',
    title: 'Vista-se para a casa de Deus',
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
        <p>
          Para nós, católicos, a Eucaristia é o próprio Cristo — Corpo e Sangue,
          realmente presente. Se tiver curiosidade sobre o que a Igreja crê, deixamos um
          vídeo e alguns links abaixo, com todo o carinho.
        </p>
      </>
    ),
    video: { id: VIDEO_EUCARISTIA, title: 'O que é a Sagrada Eucaristia' },
    links: [
      { label: 'O que a Igreja crê sobre a Eucaristia', href: LINK_EUCARISTIA },
      { label: 'Como se tornar católico', href: LINK_CATOLICO },
    ],
  },
  {
    slug: 'alimentacao',
    icon: '🍽️',
    eyebrow: 'Alimentação',
    title: 'Tome um bom café da manhã',
    text: (
      <>
        <p>
          A missa será às <strong>10h30 da manhã</strong> e o almoço será servido apenas
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
    text: (
      <>
        <p>
          As portas da capela abrem cedo: planeje chegar com cerca de{' '}
          <strong>15 minutos de antecedência</strong>. A missa começará por volta das
          10h30, e a entrada dos noivos acontece logo em seguida.
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
        {INFOS.map((info, index) => (
          <article className="info-block" key={info.slug}>
            <div className="info-marker">
              <span className="info-icon" aria-hidden="true">{info.icon}</span>
            </div>
            <div className="info-content">
              <div className="info-eyebrow">{info.eyebrow}</div>
              <h3 className="info-title">{info.title}</h3>
              <div className="info-text">{info.text}</div>
              {info.video && (
                <div className="info-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${info.video.id}`}
                    title={info.video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {info.links && (
                <div className="info-links">
                  {info.links.map((link) => (
                    <a key={link.href} className={`info-link${link.pdf ? ' pdf' : ''}`}
                      href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {index < INFOS.length - 1 && (
              <div className="info-divider" aria-hidden="true">❦</div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
