// Para ilustrar um momento, salve a foto em src/assets/historia/
// com o nome do slug do capítulo (ex.: 2016-amizade.jpg).
// Formatos aceitos: jpg, jpeg, png e webp.
// Campos opcionais por capítulo: photoPosition ('top' etc., para ajustar o
// enquadramento) e noPhoto (capítulo só com texto, sem espaço de foto).
import HistoriaGaleria from '../components/HistoriaGaleria.jsx'
import { useLightbox } from '../components/Lightbox.jsx'

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
    title: 'O primeiro encontro',
    text: 'Foi no Colégio Militar de Belo Horizonte que nossos caminhos se cruzaram pela primeira vez. Brenda havia acabado de se mudar de Curitiba para Belo Horizonte, enquanto Felipe já estudava no colégio havia alguns anos. Ainda éramos apenas colegas de sala, mas Deus já começava a escrever, silenciosamente, a nossa história.',
  },
  {
    slug: '2016-amizade',
    date: '2016',
    title: 'Uma amizade que crescia',
    text: 'Continuamos convivendo no dia a dia do colégio, participando das mesmas aulas e atividades. Embora ainda não existisse um relacionamento entre nós, o carinho e a admiração começaram a surgir naturalmente. Sem percebermos, Deus preparava nossos corações para um encontro que aconteceria no tempo certo.',
  },
  {
    slug: '2017-primeiro-beijo',
    date: '2017',
    title: 'O início do amor',
    text: 'Foi o ano em que tudo mudou. Felipe percebeu que Brenda possuía valores que admirava e decidiu conquistá-la, aproximando-se de suas amigas e criando oportunidades para conhecê-la melhor. Em setembro, veio o primeiro encontro no cinema, o primeiro beijo e, no fim do ano, uma conversa sincera que confirmou que ambos desejavam construir uma história juntos.',
  },
  {
    slug: '2018-pedido-namoro',
    date: '2018',
    title: 'O começo da nossa história',
    text: 'Em fevereiro, Felipe pediu Brenda em namoro e ela respondeu o primeiro “sim” da nossa caminhada. Desde o início do relacionamento, a fé passou a ocupar um lugar especial em nossa rotina. Aos poucos, Deus começou a conduzir também a caminhada espiritual da Brenda, por meio do testemunho e do incentivo constante do Felipe.',
  },
  {
    slug: '2019-espanha-orlando',
    date: '2019',
    title: 'A primeira grande distância',
    text: 'O amor foi colocado à prova. Brenda realizou um intercâmbio de três meses na Espanha e, no fim do ano, Felipe passou outros três meses em Orlando, nos Estados Unidos. Entre fusos horários, chamadas de vídeo e muita saudade, aprendemos que a distância nunca seria maior do que o amor que nos unia.',
  },
  {
    slug: '2020-volta-brasil',
    date: '2020',
    title: 'Esperança em meio à pandemia',
    text: 'O ano começou ainda marcado pela distância, mas logo o mundo inteiro precisou parar por causa da pandemia. Mesmo em meio às incertezas, nosso relacionamento permaneceu firme. Foi também quando Brenda decidiu buscar os sacramentos da Iniciação Cristã, um sonho que precisou ser adiado por causa da pandemia.',
  },
  {
    slug: '2021-ufmg',
    date: '2021',
    title: 'Um ano de muitas graças',
    text: 'Brenda ingressou na Faculdade de Odontologia da UFMG e viveu uma profunda transformação espiritual. Recebeu sua primeira confissão, a Primeira Eucaristia, a Crisma e fez sua consagração a Nossa Senhora, sempre incentivada pelo Felipe, que acabou se tornando seu primeiro catequista. Deus confirmava, pouco a pouco, nossa vocação.',
  },
  {
    slug: '2022-alemanha',
    date: '2022',
    title: 'Mais uma prova de amor',
    text: 'Felipe mudou-se para a Alemanha para um intercâmbio que acabou se transformando em um ano inteiro fora do Brasil. Foi um período desafiador, de muitas despedidas e expectativas, mas também de amadurecimento. Permanecemos firmes na fé, confiando que Deus sustentaria nosso relacionamento até o reencontro.',
    photoPosition: 'top',
  },
  {
    slug: '2023-reencontro',
    date: '2023',
    title: 'O ano das grandes graças',
    text: 'Com o retorno de Felipe ao Brasil, finalmente pudemos viver novamente o namoro de perto. Começamos a servir juntos na Obra Jovem da Divina Providência, participamos da Jornada Mundial da Juventude em Lisboa, onde experimentamos de forma intensa a beleza da Igreja, e Felipe teve a alegria de cumprimentar o Papa Francisco. Ainda naquele ano, Brenda foi chamada para o ministério de Ministra Extraordinária da Sagrada Comunhão e conheceu, pela primeira vez, o Santuário Nacional de Nossa Senhora Aparecida. Foi um ano que fortaleceu profundamente nossa fé e confirmou a missão que Deus preparava para nós.',
    photoPosition: 'center 72%',
  },
  {
    slug: '2024-formatura-ojdp',
    date: '2024',
    title: 'Tempo de amadurecimento',
    text: 'Continuamos servindo juntos na Obra Jovem da Divina Providência, aprofundando nossa vida de oração e nossa missão na Igreja. Enquanto Felipe se aproximava da conclusão da graduação em Engenharia da Computação, nós dois amadurecíamos profissionalmente, espiritualmente e como casal. O desejo pelo sacramento do Matrimônio tornava-se cada vez mais claro.',
  },
  {
    slug: '2025-vocacao',
    date: '2025',
    title: 'A certeza da vocação',
    text: 'Foi um ano de preparação e de espera. Felipe concluiu sua graduação e iniciou uma nova etapa profissional, enquanto continuávamos construindo nossos sonhos e servindo juntos na Igreja. Aos poucos, entendemos que o casamento já não era apenas um projeto futuro, mas uma certeza colocada por Deus em nossos corações.',
  },
  {
    slug: '2026-pedido',
    date: '2026',
    title: 'O nosso “sim” definitivo',
    text: 'Após uma nova oportunidade profissional para Felipe e a reta final da graduação da Brenda, entendemos que havia chegado o momento de dar o próximo passo. Veio o pedido de casamento, o noivado, mais um breve período de distância entre São Paulo e Guaranésia e, finalmente, a realização do grande sonho. Primeiro, o casamento civil em Pitangui; depois, diante de Deus e da família, na Capela Nossa Senhora da Conceição, em Belo Horizonte, onde diremos o nosso eterno “sim”, iniciando juntos a missão de ajudar um ao outro a chegar ao Céu.',
  },
]

export default function Historia() {
  const openLightbox = useLightbox()
  return (
    <section className="section">
      <div className="section-eyebrow">Do colégio ao altar</div>
      <h2 className="section-title script">Nossa História</h2>
      <p className="section-sub">
        Onze anos, três continentes e um amor que Deus conduziu do primeiro encontro
        até o altar. Esta é a nossa história — de 2015 até o grande dia.{' '}
        <span className="photo-hint">🔍 Toque nas fotos para vê-las ampliadas.</span>
      </p>
      <div className="timeline">
        {CHAPTERS.map((chapter) => {
          const photo = photoFor(chapter.slug)
          return (
            <div className="t-item" key={chapter.slug}>
              {chapter.noPhoto ? null : photo ? (
                <figure className="t-photo zoomable"
                  onClick={() => openLightbox(photo, 0, `${chapter.title} — ${chapter.date}`)}>
                  <img src={photo} alt={`${chapter.title} — ${chapter.date}`} loading="lazy"
                    style={chapter.photoPosition ? { objectPosition: chapter.photoPosition } : undefined} />
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

      <HistoriaGaleria />
    </section>
  )
}
