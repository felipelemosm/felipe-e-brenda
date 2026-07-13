// Fotos: salve em src/assets/indicacoes/ com o nome do slug do item
// (ex.: hotel-lagoon-prime.jpg). Os passeios já vêm com foto; cartões sem
// foto são renderizados sem imagem, sem quebrar o layout.
const photos = import.meta.glob('../assets/indicacoes/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function photoFor(slug) {
  const entry = Object.entries(photos).find(([path]) =>
    path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '') === slug,
  )
  return entry ? entry[1] : null
}

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const HOTEIS_LAGOA_SANTA = [
  {
    slug: 'hotel-lagoon-prime',
    name: 'Lagoon Prime Hotel',
    text: 'Na beira da Lagoa Central, com piscina no rooftop e vista privilegiada. A escolha mais charmosa da cidade.',
    map: 'Lagoon Prime Hotel, Lagoa Santa MG',
  },
  {
    slug: 'hotel-esuites-spa',
    name: 'eSuites Spa Lagoa Santa',
    text: 'Estilo resort urbano, com spa e piscina — ideal para quem quer descansar antes e depois da festa.',
    map: 'eSuites Spa Lagoa Santa, Lagoa Santa MG',
  },
  {
    slug: 'hotel-ramada',
    name: 'Ramada by Wyndham Lagoa Santa',
    text: 'Rede internacional, confortável e prático — a poucos minutos do aeroporto de Confins.',
    map: 'Ramada Hotel Suites Lagoa Santa, Lagoa Santa MG',
  },
]

const HOTEIS_BH = [
  {
    slug: 'hotel-novotel-savassi',
    name: 'Novotel BH Savassi',
    text: 'Moderno e bem avaliado, no coração da Savassi — cercado de restaurantes e cafés, a minutos da capela.',
    map: 'Novotel Belo Horizonte Savassi',
  },
  {
    slug: 'hotel-promenade-pancetti',
    name: 'Promenade BH Pancetti',
    text: 'Apart-hotel tranquilo no bairro Funcionários, a cerca de 1 km da Praça João Pessoa — dá para ir a pé.',
    map: 'Promenade BH Pancetti, Belo Horizonte',
  },
  {
    slug: 'hotel-savassi',
    name: 'Savassi Hotel',
    text: 'Ótimo custo-benefício, pertinho do Pátio Savassi, com piscina e terraço.',
    map: 'Savassi Hotel, Belo Horizonte',
  },
]

const PASSEIOS = [
  {
    slug: 'passeio-pampulha',
    name: 'Conjunto Moderno da Pampulha',
    text: 'Patrimônio Mundial da UNESCO: a Igrejinha de São Francisco de Assis (Niemeyer e Portinari), a orla da lagoa e o Museu de Arte — tudo pertinho do local da recepção.',
    map: 'Igreja São Francisco de Assis, Pampulha, Belo Horizonte',
  },
  {
    slug: 'passeio-liberdade',
    name: 'Praça da Liberdade & Circuito Cultural',
    text: 'O cartão-postal de BH: palmeiras imperiais, fontes e museus gratuitos ao redor (CCBB, Memorial Vale, Espaço do Conhecimento).',
    map: 'Praça da Liberdade, Belo Horizonte',
  },
  {
    slug: 'passeio-mercado',
    name: 'Mercado Central',
    text: 'A alma mineira em um só lugar: queijos, doce de leite, cachaças e o famoso fígado com jiló acompanhado de uma cerveja gelada.',
    map: 'Mercado Central de Belo Horizonte',
  },
  {
    slug: 'passeio-papa',
    name: 'Praça do Papa & Mirante das Mangabeiras',
    text: 'A vista mais bonita da cidade, aos pés da Serra do Curral — imperdível no fim de tarde.',
    map: 'Praça do Papa, Belo Horizonte',
  },
  {
    slug: 'passeio-inhotim',
    name: 'Inhotim (bate-volta)',
    text: 'O maior museu a céu aberto do mundo, entre jardins botânicos e galerias de arte contemporânea. Fica em Brumadinho, a ~1h30 de carro — reserve um dia inteiro.',
    map: 'Instituto Inhotim, Brumadinho MG',
  },
]

function RecCard({ item }) {
  const photo = photoFor(item.slug)
  return (
    <article className="rec-card">
      {photo && <img className="rec-photo" src={photo} alt={item.name} loading="lazy" />}
      <div className="rec-body">
        <h4 className="rec-name">{item.name}</h4>
        <p className="rec-text">{item.text}</p>
        <a className="btn ghost rec-link" target="_blank" rel="noopener noreferrer"
          href={mapsUrl(item.map)}>
          Ver no mapa
        </a>
      </div>
    </article>
  )
}

function RecGroup({ eyebrow, title, sub, items }) {
  return (
    <div className="rec-group">
      <div className="rec-group-eyebrow">{eyebrow}</div>
      <h3 className="rec-group-title">{title}</h3>
      {sub && <p className="rec-group-sub">{sub}</p>}
      <div className="rec-grid">
        {items.map((item) => <RecCard key={item.slug} item={item} />)}
      </div>
    </div>
  )
}

export default function Indicacoes() {
  return (
    <section className="section">
      <div className="section-eyebrow">Para quem vem de fora</div>
      <h2 className="section-title script">Indicações</h2>
      <div className="section-intro">
        <p className="section-sub">
          Reunimos aqui sugestões de onde ficar, onde se arrumar e o que conhecer na
          cidade. São indicações com carinho, para que o fim de semana do casamento
          seja também um passeio.
        </p>
      </div>

      <RecGroup
        eyebrow="Onde ficar"
        title="Hotéis em Lagoa Santa"
        sub="Para a família e os amigos da noiva, que partem de lá no dia da cerimônia."
        items={HOTEIS_LAGOA_SANTA}
      />

      <RecGroup
        eyebrow="Onde ficar"
        title="Hotéis perto da capela"
        sub="Na região da Savassi e do bairro Funcionários, a poucos minutos da Praça João Pessoa."
        items={HOTEIS_BH}
      />

      <div className="rec-group">
        <div className="rec-group-eyebrow">Para se arrumar</div>
        <h3 className="rec-group-title">Beleza no grande dia</h3>
        <div className="beauty-card">
          <div className="beauty-icon" aria-hidden="true">💄</div>
          <div>
            <h4 className="rec-name">Maquiadora indicada pelos noivos</h4>
            <p className="rec-text">
              Em breve divulgaremos aqui o contato da maquiadora que acompanhará a
              noiva — ela também atende convidadas, mediante agendamento antecipado.
            </p>
            <p className="rec-text">
              Enquanto isso, uma dica: tanto a Savassi quanto o centro de Lagoa Santa
              têm bons salões; agende com antecedência para a manhã do dia 10, pois a
              missa começa às 10h.
            </p>
          </div>
        </div>
      </div>

      <RecGroup
        eyebrow="Para conhecer BH"
        title="Passeios para quem vem de longe"
        sub="Um roteiro afetivo pela cidade que escolhemos para começar essa história."
        items={PASSEIOS}
      />
    </section>
  )
}
