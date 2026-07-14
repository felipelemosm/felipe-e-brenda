// Para ilustrar um momento, salve a foto em src/assets/historia/
// com o nome do slug do capítulo (ex.: 2015-colegio-militar.jpg).
// Formatos aceitos: jpg, jpeg, png e webp.
const photos = import.meta.glob('../assets/historia/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function photoFor(slug) {
  const entry = Object.entries(photos).find(([path]) =>
    path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '') === slug,
  )
  return entry ? entry[1] : null
}

const CHAPTERS = [
  {
    slug: '2015-colegio-militar',
    date: '2015',
    title: 'Onde tudo começou',
    text: 'Nos conhecemos nos corredores do Colégio Militar, ainda sem imaginar o que o destino guardava.',
  },
  {
    slug: '2017-primeiro-beijo',
    date: '2017',
    title: 'O primeiro beijo',
    text: 'A amizade foi virando outra coisa: veio a aproximação — e o primeiro beijo.',
  },
  {
    slug: '2018-pedido-namoro',
    date: 'Fevereiro · 2018',
    title: 'O pedido de namoro',
    text: 'Felipe pediu Brenda em namoro, e começou oficialmente a nossa história a dois.',
  },
  {
    slug: '2019-espanha-orlando',
    date: '2019',
    title: 'Um oceano entre nós',
    text: 'Felipe começou a faculdade e Brenda foi morar na Espanha. No fim do ano, foi a vez dele partir: Orlando, nos Estados Unidos. Começava a jornada do amor à distância.',
  },
  {
    slug: '2020-volta-brasil',
    date: '2020',
    title: 'De volta ao Brasil',
    text: 'Felipe regressou ao Brasil — e o mundo parou com a pandemia. O nosso amor, não.',
  },
  {
    slug: '2021-ufmg',
    date: '2021',
    title: 'Brenda na UFMG',
    text: 'Brenda começou a faculdade de Odontologia na UFMG, realizando um grande sonho.',
  },
  {
    slug: '2022-alemanha',
    date: '2022',
    title: 'Um capítulo na Alemanha',
    text: 'Mais uma vez o mundo nos separou no mapa: Felipe se mudou para a Alemanha. E, mais uma vez, a distância não venceu.',
  },
  {
    slug: '2023-reencontro',
    date: '2023',
    title: 'O reencontro',
    text: 'Felipe voltou de vez para o Brasil, e pudemos viver o nosso amor de perto de novo.',
  },
  {
    slug: '2026-sp-guaranesia',
    date: '2026',
    title: 'São Paulo & Guaranésia',
    text: 'Felipe se mudou para São Paulo e Brenda passou vários meses em Guaranésia-MG. Já éramos especialistas em saudade — e em superá-la.',
  },
  {
    slug: '2026-pedido',
    date: 'Março · 2026',
    title: 'O pedido',
    text: 'Veio o “sim” mais esperado: ficamos noivos e começamos a sonhar, juntos, com o grande dia.',
  },
  {
    slug: '2026-casamento',
    date: '10 · Outubro · 2026',
    title: 'O grande dia',
    text: 'Às 10h30 da manhã, na Capela Nossa Senhora da Conceição - Colégio Arnaldo, diante de Deus, da família e dos amigos, diremos “sim” para a vida inteira.',
  },
]

export default function Historia() {
  return (
    <section className="section">
      <div className="section-eyebrow">Do colégio ao altar</div>
      <h2 className="section-title script">Nossa História</h2>
      <p className="section-sub">
        Onze anos, três continentes e um amor que nunca saiu do lugar. Esta é a nossa
        história — de 2015 até o grande dia.
      </p>
      <div className="timeline">
        {CHAPTERS.map((chapter) => {
          const photo = photoFor(chapter.slug)
          return (
            <div className="t-item" key={chapter.slug}>
              {photo ? (
                <figure className="t-photo">
                  <img src={photo} alt={`${chapter.title} — ${chapter.date}`} loading="lazy" />
                </figure>
              ) : (
                <div className="t-photo placeholder" aria-hidden="true">
                  <span className="t-photo-icon">📷</span>
                  <span className="t-photo-hint">
                    Foto deste momento
                    <br />
                    <code>historia/{chapter.slug}.jpg</code>
                  </span>
                </div>
              )}
              <div className="t-date">{chapter.date}</div>
              <div className="t-title">{chapter.title}</div>
              <div className="t-text">{chapter.text}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
