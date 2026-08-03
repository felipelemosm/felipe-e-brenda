import { useEffect, useState } from 'react'
import { MESSAGES_ENDPOINT } from '../config.js'

function MessagesWall({ messages }) {
  if (messages.length === 0) return null
  return (
    <div className="messages-wall">
      <h3 className="messages-wall-title script">Mural de mensagens</h3>
      <div className="messages-wall-grid">
        {messages.map((m, i) => (
          <figure className="wall-card" key={i}>
            <blockquote>“{m.mensagem}”</blockquote>
            <figcaption>— {m.nome}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export default function Mensagens() {
  const [form, setForm] = useState({ nome: '', mensagem: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!MESSAGES_ENDPOINT) return
    let cancelled = false
    fetch(`${MESSAGES_ENDPOINT}?action=mensagens`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.mensagens)) {
          setMessages(data.mensagens.filter((m) => m.mensagem))
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!MESSAGES_ENDPOINT) return
    setStatus('sending')
    try {
      await fetch(MESSAGES_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ tipo: 'mensagem', ...form }),
      })
      // adiciona ao mural na hora (o back-end é no-cors e não devolve a lista)
      setMessages((prev) => [{ nome: form.nome, mensagem: form.mensagem }, ...prev])
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section className="section">
        <div className="section-eyebrow">Mensagem recebida</div>
        <h2 className="section-title script">Obrigado!</h2>
        <p className="section-sub">
          Seu carinho foi guardado com a gente e já entrou no mural abaixo — também
          aparece na página inicial do site. 🤍
        </p>
        <button className="btn" onClick={() => { setForm({ nome: '', mensagem: '' }); setStatus('idle') }}>
          Escrever outra mensagem
        </button>
        <MessagesWall messages={messages} />
      </section>
    )
  }

  return (
    <section className="section">
      <div className="section-eyebrow">Um carinho por escrito</div>
      <h2 className="section-title script">Mensagens aos Noivos</h2>
      <p className="section-sub">
        Deixe aqui seu recado, conselho, oração ou memória com a gente. As mensagens são
        guardadas e exibidas no mural abaixo e na página inicial do site — e vamos reler
        todas, muitas vezes, ao longo da vida.
      </p>

      {!MESSAGES_ENDPOINT && (
        <p className="rsvp-soon">
          O mural de mensagens abrirá em breve por aqui. Enquanto isso, fale diretamente
          com os noivos. 💌
        </p>
      )}

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Seu nome</span>
          <input type="text" required value={form.nome} autoComplete="name"
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Quem está mandando esse carinho?" />
        </label>

        <label className="field">
          <span>Sua mensagem</span>
          <textarea rows="5" required value={form.mensagem} maxLength={600}
            onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
            placeholder="Escreva do coração — até 600 caracteres" />
        </label>

        {status === 'error' && (
          <p className="rsvp-error">
            Não conseguimos enviar sua mensagem. Verifique sua internet e tente de novo.
          </p>
        )}

        <button className="btn rsvp-submit" type="submit"
          disabled={!MESSAGES_ENDPOINT || status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
        </button>
      </form>

      <MessagesWall messages={messages} />
    </section>
  )
}
