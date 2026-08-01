import { useEffect, useMemo, useState } from 'react'
import { GIFT_ENDPOINT, PIX_KEY, CARD_PAYMENT_LINK } from '../config.js'

const GROOM_PHONE_DISPLAY = '(31) 98323-3101'
const GROOM_PHONE_WA = '5531983233101'

// QR Code do PIX: salve a imagem como src/assets/pix-qr.png (ou .jpg).
const qrImages = import.meta.glob('../assets/pix-qr.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})
const PIX_QR = Object.values(qrImages)[0] ?? null

// Foto de cada presente (fundo branco): src/assets/presentes/<slug>.jpg
const giftPhotos = import.meta.glob('../assets/presentes/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
function photoFor(slug) {
  const entry = Object.entries(giftPhotos).find(([path]) =>
    path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '') === slug,
  )
  return entry ? entry[1] : null
}

// Preços são médias de referência (R$), concentrados na faixa de 80 a 250.
const CATEGORIES = [
  {
    title: 'Cozinha',
    gifts: [
      { slug: 'panelas-tramontina', name: 'Jogo de panelas inox Tramontina', price: 600 },
      { slug: 'jogo-facas', name: 'Jogo de facas', price: 200 },
      { slug: 'faqueiro', name: 'Faqueiro', price: 250 },
      { slug: 'talheres-tramontina', name: 'Jogo de talheres inox Tramontina', price: 140 },
      { slug: 'jogo-pratos', name: 'Jogo de pratos', price: 250 },
      { slug: 'tacas', name: 'Jogo de taças', price: 140 },
      { slug: 'jogo-copos', name: 'Jogo de copos', price: 100 },
      { slug: 'xicaras-cafe', name: 'Jogo de xícaras de café', price: 120 },
      { slug: 'jogo-cha', name: 'Jogo de chá', price: 220 },
      { slug: 'airfryer', name: 'Airfryer', price: 450 },
      { slug: 'liquidificador', name: 'Liquidificador', price: 200 },
      { slug: 'batedeira', name: 'Batedeira', price: 300 },
      { slug: 'sanduicheira', name: 'Sanduicheira / grill', price: 160 },
      { slug: 'chaleira', name: 'Chaleira elétrica', price: 160 },
      { slug: 'moedor-cafe', name: 'Moedor de café', price: 120 },
      { slug: 'espremedor', name: 'Espremedor de frutas', price: 120 },
      { slug: 'panela-pressao', name: 'Panela de pressão', price: 250 },
      { slug: 'fondue', name: 'Panela de fondue', price: 180 },
      { slug: 'filtro-agua', name: 'Filtro de água', price: 200 },
      { slug: 'potes-mantimentos', name: 'Kit de potes de mantimentos', price: 160 },
      { slug: 'assadeiras', name: 'Kit de assadeiras', price: 140 },
      { slug: 'boleira', name: 'Boleira', price: 120 },
      { slug: 'tabua-frios', name: 'Tábua de frios', price: 100 },
      { slug: 'porta-temperos', name: 'Porta-temperos', price: 100 },
      { slug: 'escorredor-louca', name: 'Escorredor de louça', price: 120 },
      { slug: 'jarra-vidro', name: 'Jarra de vidro', price: 80 },
      { slug: 'fruteira', name: 'Fruteira', price: 100 },
      { slug: 'canecas', name: 'Jogo de canecas', price: 80 },
      { slug: 'utensilios-cozinha', name: 'Kit de utensílios de cozinha', price: 90 },
      { slug: 'toalha-mesa', name: 'Toalha de mesa', price: 90 },
      { slug: 'cesto-paes', name: 'Cesto de pães', price: 75 },
      { slug: 'jogo-americano', name: 'Jogo americano', price: 65 },
      { slug: 'formas-silicone', name: 'Kit de formas de silicone', price: 65 },
      { slug: 'panos-prato', name: 'Kit de panos de prato', price: 55 },
      { slug: 'saleiro-pimenteiro', name: 'Saleiro e pimenteiro', price: 55 },
      { slug: 'descanso-panela', name: 'Descanso de panela', price: 55 },
    ],
  },
  {
    title: 'Sala',
    gifts: [
      { slug: 'sofa', name: 'Sofá', price: 2800 },
      { slug: 'televisao', name: 'Televisão', price: 2000 },
      { slug: 'rack-tv', name: 'Rack para TV', price: 600 },
      { slug: 'aspirador-robo', name: 'Aspirador robô', price: 1000 },
      { slug: 'tapete-sala', name: 'Tapete de sala', price: 300 },
      { slug: 'cortina', name: 'Cortina', price: 250 },
      { slug: 'luminaria-piso', name: 'Luminária de piso', price: 250 },
      { slug: 'ventilador', name: 'Ventilador', price: 200 },
      { slug: 'quadro-decorativo', name: 'Quadro decorativo', price: 160 },
      { slug: 'almofadas', name: 'Kit de almofadas', price: 180 },
      { slug: 'mantas', name: 'Mantas para sofá', price: 140 },
      { slug: 'vaso-decorativo', name: 'Vaso decorativo', price: 120 },
      { slug: 'porta-retratos', name: 'Porta-retratos', price: 100 },
      { slug: 'difusor-aromas', name: 'Difusor de aromas', price: 90 },
      { slug: 'porta-copos', name: 'Kit de porta-copos', price: 55 },
    ],
  },
  {
    title: 'Quarto',
    gifts: [
      { slug: 'jogo-cama', name: 'Jogo de cama', price: 250 },
      { slug: 'edredom', name: 'Edredom', price: 250 },
      { slug: 'criado-mudo', name: 'Criado-mudo', price: 250 },
      { slug: 'espelho', name: 'Espelho', price: 220 },
      { slug: 'cortina-quarto', name: 'Cortina blackout', price: 200 },
      { slug: 'cabideiro', name: 'Cabideiro / arara', price: 180 },
      { slug: 'abajur', name: 'Abajur', price: 160 },
      { slug: 'protetor-colchao', name: 'Protetor de colchão', price: 140 },
      { slug: 'travesseiros', name: 'Travesseiros', price: 140 },
      { slug: 'lencois-avulsos', name: 'Lençol avulso', price: 120 },
      { slug: 'organizador-sapatos', name: 'Organizador de sapatos', price: 90 },
      { slug: 'cabides', name: 'Kit de cabides', price: 65 },
    ],
  },
  {
    title: 'Banheiro',
    gifts: [
      { slug: 'roupao-casal', name: 'Roupão de banho para casal', price: 220 },
      { slug: 'toalhas', name: 'Kit de toalhas', price: 180 },
      { slug: 'cesto-roupa', name: 'Cesto de roupa suja', price: 140 },
      { slug: 'kit-banheiro-acessorios', name: 'Kit de acessórios para banheiro', price: 120 },
      { slug: 'tapetes', name: 'Kit de tapetes', price: 100 },
      { slug: 'organizadores-gaveta', name: 'Organizadores de gaveta', price: 80 },
      { slug: 'lixeira-banheiro', name: 'Lixeira para banheiro', price: 80 },
      { slug: 'tapete-antiderrapante', name: 'Tapete antiderrapante para box', price: 80 },
      { slug: 'saboneteira', name: 'Kit saboneteira e dispenser', price: 65 },
      { slug: 'porta-escovas', name: 'Porta-escovas de dente', price: 55 },
    ],
  },
  {
    title: 'Lavanderia',
    gifts: [
      { slug: 'aspirador-po', name: 'Aspirador de pó', price: 350 },
      { slug: 'ferro-passar', name: 'Ferro de passar', price: 160 },
      { slug: 'balde-esfregao', name: 'Balde com esfregão (mop)', price: 160 },
      { slug: 'tabua-passar', name: 'Tábua de passar', price: 140 },
      { slug: 'varal', name: 'Varal', price: 120 },
      { slug: 'cesto-organizador', name: 'Cesto organizador', price: 100 },
      { slug: 'rodo-vassoura', name: 'Kit rodo e vassoura', price: 100 },
      { slug: 'pregadores', name: 'Kit de prendedores', price: 80 },
      { slug: 'panos-limpeza', name: 'Kit de panos de limpeza', price: 55 },
    ],
  },
]

let indexCounter = 0
const ALL_GIFTS = CATEGORIES.flatMap((category) =>
  category.gifts.map((gift) => ({ ...gift, category: category.title, order: indexCounter++ })),
)
const GIFT_BY_SLUG = Object.fromEntries(ALL_GIFTS.map((g) => [g.slug, g]))

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function GiftPhoto({ slug, name }) {
  const photo = photoFor(slug)
  if (photo) {
    return (
      <div className="gift-photo">
        <img src={photo} alt={name} loading="lazy" />
      </div>
    )
  }
  return (
    <div className="gift-photo placeholder" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
        <rect x="9" y="20" width="30" height="19" rx="1.5" />
        <rect x="7" y="14" width="34" height="6" rx="1.5" />
        <path d="M24 14 V39" />
        <path d="M24 14 c-3-6 -11-5 -8 0 M24 14 c3-6 11-5 8 0" />
      </svg>
    </div>
  )
}

function GiftCard({ gift, bought, showCategory, onPix }) {
  return (
    <article className={`gift-card${bought ? ' bought' : ''}`}>
      {bought && <div className="gift-badge">Já comprado</div>}
      <GiftPhoto slug={gift.slug} name={gift.name} />
      {showCategory && <div className="gift-cat-tag">{gift.category}</div>}
      <div className="gift-name">{gift.name}</div>
      <div className="gift-price">{formatPrice(gift.price)}</div>
      <div className="gift-actions">
        {bought ? (
          <span className="gift-bought-label">Já comprado 🤍</span>
        ) : (
          <>
            <button className="btn gift-btn" onClick={() => onPix(gift)}>
              Presentear
            </button>
            {CARD_PAYMENT_LINK && (
              <a className="btn ghost gift-btn" target="_blank" rel="noopener noreferrer"
                href={CARD_PAYMENT_LINK}>
                Cartão
              </a>
            )}
          </>
        )}
      </div>
    </article>
  )
}

function PixModal({ gift, onClose, onRegistered }) {
  const [copied, setCopied] = useState(false)
  const [registro, setRegistro] = useState('idle') // idle | form | sending | sent
  const [form, setForm] = useState({ nome: '', dedicatoria: '' })

  async function registrar(event) {
    event.preventDefault()
    setRegistro('sending')
    try {
      await fetch(GIFT_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          tipo: 'presente',
          slug: gift.slug,
          presente: gift.name,
          valor: String(gift.price),
          nome: form.nome,
          dedicatoria: form.dedicatoria,
        }),
      })
      setRegistro('sent')
      onRegistered(gift.slug)
    } catch {
      setRegistro('form')
    }
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // seleção manual continua possível
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true"
      aria-label={`Presentear ${gift.name} via PIX`}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <h3 className="modal-title">{gift.name}</h3>
        <div className="modal-price">{formatPrice(gift.price)}</div>

        {PIX_QR ? (
          <img className="modal-qr" src={PIX_QR} alt="QR Code do PIX dos noivos" />
        ) : (
          <div className="modal-qr placeholder">QR Code em breve</div>
        )}

        <div className="modal-pix-key">
          <span>Chave PIX (e-mail)</span>
          <code>{PIX_KEY}</code>
        </div>
        <button className="btn" onClick={copyKey}>
          {copied ? 'Chave copiada! ✓' : 'Copiar chave PIX'}
        </button>
        <p className="modal-note">
          O valor é uma referência carinhosa — qualquer quantia nos ajuda a montar o
          nosso lar. Obrigado! 🤍
        </p>

        {GIFT_ENDPOINT && (
          <div className="gift-confirm">
            {registro === 'idle' && (
              <button className="btn ghost" onClick={() => setRegistro('form')}>
                Já paguei — registrar meu presente
              </button>
            )}
            {(registro === 'form' || registro === 'sending') && (
              <form className="gift-confirm-form" onSubmit={registrar}>
                <input type="text" placeholder="Seu nome (opcional)" value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                <textarea rows="2" placeholder="Dedicatória aos noivos (opcional)"
                  value={form.dedicatoria} maxLength={300}
                  onChange={(e) => setForm({ ...form, dedicatoria: e.target.value })} />
                <button className="btn" type="submit" disabled={registro === 'sending'}>
                  {registro === 'sending' ? 'Registrando…' : 'Registrar presente'}
                </button>
                <p className="gift-confirm-hint">
                  Ao registrar, o item passa a aparecer como “já comprado” para os demais
                  convidados, nos dois sites.
                </p>
              </form>
            )}
            {registro === 'sent' && (
              <p className="gift-confirm-thanks">
                Presente registrado — muito obrigado! 🤍
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Presentes() {
  const [selected, setSelected] = useState(null)
  const [sort, setSort] = useState('sugerido') // sugerido | preco-asc | preco-desc
  const [filter, setFilter] = useState('todos') // todos | disponiveis | comprados
  const [purchased, setPurchased] = useState(() => new Set())

  useEffect(() => {
    if (!GIFT_ENDPOINT) return
    let cancelled = false
    fetch(`${GIFT_ENDPOINT}?action=comprados`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.comprados)) {
          setPurchased(new Set(data.comprados))
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  function markBought(slug) {
    setPurchased((prev) => {
      const next = new Set(prev)
      next.add(slug)
      return next
    })
  }

  const isBought = (slug) => purchased.has(slug)

  function passesFilter(slug) {
    if (filter === 'disponiveis') return !isBought(slug)
    if (filter === 'comprados') return isBought(slug)
    return true
  }

  // ordena: disponíveis primeiro, depois já comprados; dentro disso, pela chave escolhida
  function ordenar(list) {
    return [...list].sort((a, b) => {
      const ba = isBought(a.slug) ? 1 : 0
      const bb = isBought(b.slug) ? 1 : 0
      if (ba !== bb) return ba - bb
      if (sort === 'preco-asc') return a.price - b.price
      if (sort === 'preco-desc') return b.price - a.price
      return a.order - b.order
    })
  }

  const flat = useMemo(() => ordenar(ALL_GIFTS.filter((g) => passesFilter(g.slug))),
    [sort, filter, purchased])

  const totalDisponiveis = ALL_GIFTS.filter((g) => !isBought(g.slug)).length

  return (
    <section className="section">
      <div className="section-eyebrow">Com carinho</div>
      <h2 className="section-title script">Lista de Presentes</h2>
      <div className="section-intro">
        <p className="section-sub">
          Sua presença é o nosso maior presente. Mas, se quiser nos ajudar a montar o
          nosso primeiro lar, reunimos aqui algumas lembranças, dos itens do dia a dia
          aos que vão deixar a casa com a nossa cara.
        </p>
        <p className="section-sub">
          A lista é a mesma nos dois sites: quando alguém escolhe um presente, ele aparece
          como “já comprado” para todos. Cada item pode ser presenteado por PIX, e o valor
          é só uma referência — qualquer quantia é bem-vinda.
        </p>
      </div>

      <div className="gift-controls">
        <div className="gift-sort">
          <span className="gift-sort-label">Mostrar</span>
          <button className={filter === 'todos' ? 'active' : undefined}
            onClick={() => setFilter('todos')}>Todos</button>
          <button className={filter === 'disponiveis' ? 'active' : undefined}
            onClick={() => setFilter('disponiveis')}>Ainda disponíveis</button>
          <button className={filter === 'comprados' ? 'active' : undefined}
            onClick={() => setFilter('comprados')}>Já comprados</button>
        </div>
        <div className="gift-sort">
          <span className="gift-sort-label">Ordenar por</span>
          <button className={sort === 'sugerido' ? 'active' : undefined}
            onClick={() => setSort('sugerido')}>Sugerido</button>
          <button className={sort === 'preco-asc' ? 'active' : undefined}
            onClick={() => setSort('preco-asc')}>Menor preço</button>
          <button className={sort === 'preco-desc' ? 'active' : undefined}
            onClick={() => setSort('preco-desc')}>Maior preço</button>
        </div>
      </div>

      {sort === 'sugerido' ? (
        CATEGORIES.map((category) => {
          const items = ordenar(
            category.gifts.map((g) => GIFT_BY_SLUG[g.slug]).filter((g) => passesFilter(g.slug)),
          )
          if (items.length === 0) return null
          return (
            <div className="gift-category" key={category.title}>
              <h3 className="gift-category-title">{category.title}</h3>
              <div className="gift-grid">
                {items.map((gift) => (
                  <GiftCard key={gift.slug} gift={gift} bought={isBought(gift.slug)}
                    onPix={setSelected} />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <div className="gift-grid">
          {flat.map((gift) => (
            <GiftCard key={gift.slug} gift={gift} bought={isBought(gift.slug)}
              showCategory onPix={setSelected} />
          ))}
        </div>
      )}

      {flat.length === 0 && (
        <p className="section-sub" style={{ marginTop: '2rem' }}>
          {filter === 'comprados'
            ? 'Nenhum presente foi escolhido ainda — seja o primeiro! 🤍'
            : 'Todos os presentes já foram escolhidos. Obrigado de coração! 🤍'}
        </p>
      )}

      <div className="gift-help">
        <div className="gift-help-icon" aria-hidden="true">💬</div>
        <div>
          <h3 className="gift-help-title">Dúvidas sobre os presentes?</h3>
          <p className="gift-help-text">
            Quer confirmar um item, combinar outro valor ou tem qualquer dúvida? Fale
            direto com o Felipe.
          </p>
          <div className="gift-help-actions">
            <a className="btn" target="_blank" rel="noopener noreferrer"
              href={`https://wa.me/${GROOM_PHONE_WA}`}>
              WhatsApp {GROOM_PHONE_DISPLAY}
            </a>
            <a className="btn ghost" href={`tel:+${GROOM_PHONE_WA}`}>Ligar</a>
          </div>
        </div>
      </div>

      {selected && (
        <PixModal gift={selected} onClose={() => setSelected(null)} onRegistered={markBought} />
      )}
    </section>
  )
}
