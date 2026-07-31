import { useMemo, useState } from 'react'
import { BACKEND_ENDPOINT, PIX_KEY, CARD_PAYMENT_LINK } from '../config.js'

// QR Code do PIX: salve a imagem como src/assets/pix-qr.png (ou .jpg)
// e ela aparece automaticamente na janela de presente.
const qrImages = import.meta.glob('../assets/pix-qr.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})
const PIX_QR = Object.values(qrImages)[0] ?? null

// Foto de cada presente (fundo branco): salve em src/assets/presentes/<slug>.jpg
// (ou .png/.webp). Sem foto, o card mostra um selo dourado discreto.
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

// Preços são médias de referência (R$); qualquer quantia é bem-vinda.
const CATEGORIES = [
  {
    title: 'Cozinha',
    gifts: [
      { slug: 'panelas-tramontina', name: 'Jogo de panelas inox Tramontina', price: 700 },
      { slug: 'airfryer', name: 'Airfryer', price: 500 },
      { slug: 'talheres-tramontina', name: 'Jogo de talheres inox Tramontina', price: 120 },
      { slug: 'faqueiro', name: 'Faqueiro', price: 300 },
      { slug: 'tacas', name: 'Jogo de taças', price: 150 },
      { slug: 'jogo-pratos', name: 'Jogo de pratos', price: 250 },
      { slug: 'liquidificador', name: 'Liquidificador', price: 250 },
      { slug: 'batedeira', name: 'Batedeira', price: 300 },
      { slug: 'filtro-agua', name: 'Filtro de água', price: 200 },
      { slug: 'chaleira', name: 'Chaleira elétrica', price: 160 },
      { slug: 'moedor-cafe', name: 'Moedor de café', price: 130 },
      { slug: 'jogo-cha', name: 'Jogo de chá', price: 220 },
      { slug: 'boleira', name: 'Boleira', price: 120 },
      { slug: 'tabua-frios', name: 'Tábua de frios', price: 90 },
      { slug: 'fondue', name: 'Panela de fondue', price: 180 },
      { slug: 'porta-temperos', name: 'Porta-temperos', price: 110 },
      { slug: 'fruteira', name: 'Fruteira', price: 90 },
    ],
  },
  {
    title: 'Sala',
    gifts: [
      { slug: 'sofa', name: 'Sofá', price: 2500 },
      { slug: 'televisao', name: 'Televisão', price: 2800 },
      { slug: 'aspirador-robo', name: 'Aspirador robô', price: 1200 },
      { slug: 'cortina', name: 'Cortina', price: 250 },
      { slug: 'ventilador', name: 'Ventilador', price: 200 },
      { slug: 'almofadas', name: 'Kit de almofadas', price: 200 },
      { slug: 'mantas', name: 'Mantas para sofá', price: 150 },
      { slug: 'porta-retratos', name: 'Porta-retratos', price: 80 },
    ],
  },
  {
    title: 'Quarto',
    gifts: [
      { slug: 'jogo-cama', name: 'Jogo de cama', price: 300 },
      { slug: 'edredom', name: 'Edredom', price: 300 },
      { slug: 'espelho', name: 'Espelho', price: 250 },
      { slug: 'travesseiros', name: 'Travesseiros', price: 150 },
      { slug: 'abajur', name: 'Abajur', price: 150 },
    ],
  },
  {
    title: 'Banheiro',
    gifts: [
      { slug: 'roupao-casal', name: 'Roupão de banho para casal', price: 250 },
      { slug: 'toalhas', name: 'Kit de toalhas', price: 180 },
      { slug: 'tapetes', name: 'Kit de tapetes', price: 90 },
      { slug: 'organizadores-gaveta', name: 'Organizadores de gaveta', price: 70 },
    ],
  },
  {
    title: 'Lavanderia',
    gifts: [
      { slug: 'aspirador-po', name: 'Aspirador de pó', price: 400 },
      { slug: 'robo-aspirador', name: 'Robô aspirador', price: 1200 },
      { slug: 'ferro-passar', name: 'Ferro de passar', price: 150 },
      { slug: 'tabua-passar', name: 'Tábua de passar', price: 120 },
      { slug: 'varal', name: 'Varal', price: 120 },
    ],
  },
]

const ALL_GIFTS = CATEGORIES.flatMap((category) =>
  category.gifts.map((gift) => ({ ...gift, category: category.title })),
)

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

function GiftCard({ gift, showCategory, onPix }) {
  return (
    <article className="gift-card">
      <GiftPhoto slug={gift.slug} name={gift.name} />
      {showCategory && <div className="gift-cat-tag">{gift.category}</div>}
      <div className="gift-name">{gift.name}</div>
      <div className="gift-price">{formatPrice(gift.price)}</div>
      <div className="gift-actions">
        <button className="btn gift-btn" onClick={() => onPix(gift)}>
          Presentear
        </button>
        {CARD_PAYMENT_LINK && (
          <a className="btn ghost gift-btn" target="_blank" rel="noopener noreferrer"
            href={CARD_PAYMENT_LINK}>
            Cartão
          </a>
        )}
      </div>
    </article>
  )
}

function PixModal({ gift, onClose }) {
  const [copied, setCopied] = useState(false)
  const [registro, setRegistro] = useState('idle') // idle | form | sending | sent
  const [form, setForm] = useState({ nome: '', dedicatoria: '' })

  async function registrar(event) {
    event.preventDefault()
    setRegistro('sending')
    try {
      await fetch(BACKEND_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          tipo: 'presente',
          presente: gift.name,
          valor: String(gift.price),
          nome: form.nome,
          dedicatoria: form.dedicatoria,
        }),
      })
      setRegistro('sent')
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

        {BACKEND_ENDPOINT && (
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

  const sortedFlat = useMemo(() => {
    const list = [...ALL_GIFTS]
    if (sort === 'preco-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'preco-desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [sort])

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
          Cada item pode ser presenteado por PIX. O valor é só uma referência — qualquer
          quantia é bem-vinda.
        </p>
      </div>

      <div className="gift-sort" role="group" aria-label="Ordenar presentes">
        <span className="gift-sort-label">Ordenar por</span>
        <button className={sort === 'sugerido' ? 'active' : undefined}
          onClick={() => setSort('sugerido')}>Sugerido</button>
        <button className={sort === 'preco-asc' ? 'active' : undefined}
          onClick={() => setSort('preco-asc')}>Menor preço</button>
        <button className={sort === 'preco-desc' ? 'active' : undefined}
          onClick={() => setSort('preco-desc')}>Maior preço</button>
      </div>

      {sort === 'sugerido' ? (
        CATEGORIES.map((category) => (
          <div className="gift-category" key={category.title}>
            <h3 className="gift-category-title">{category.title}</h3>
            <div className="gift-grid">
              {category.gifts.map((gift) => (
                <GiftCard key={gift.slug} gift={gift} onPix={setSelected} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="gift-grid">
          {sortedFlat.map((gift) => (
            <GiftCard key={gift.slug} gift={gift} showCategory onPix={setSelected} />
          ))}
        </div>
      )}

      {selected && <PixModal gift={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
