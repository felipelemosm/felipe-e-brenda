import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MESSAGES_ENDPOINT } from '../config.js'
import Spinner from './Spinner.jsx'

const SLIDE_INTERVAL_MS = 12000

export default function MessagesSlideshow() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(Boolean(MESSAGES_ENDPOINT))
  const [index, setIndex] = useState(0)

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
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  // avança sozinho; reinicia a contagem sempre que o índice muda (inclusive na
  // navegação manual), para a mensagem escolhida ter o tempo cheio de leitura.
  useEffect(() => {
    if (messages.length < 2) return
    const id = setTimeout(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearTimeout(id)
  }, [messages, index])

  function go(delta) {
    setIndex((current) => (current + delta + messages.length) % messages.length)
  }

  return (
    <div className="messages-slideshow">
      <div className="messages-title">Mensagens aos noivos</div>
      {loading ? (
        <Spinner label="Carregando mensagens…" />
      ) : messages.length === 0 ? (
        <p className="messages-empty">
          Seja a primeira pessoa a deixar um carinho para nós!{' '}
          <Link to="/mensagens">Escrever mensagem 💌</Link>
        </p>
      ) : (
        <>
          <div className="messages-viewer">
            {messages.length > 1 && (
              <button className="messages-nav prev" onClick={() => go(-1)}
                aria-label="Mensagem anterior">‹</button>
            )}
            <figure className="message-slide" key={index}>
              <blockquote>“{messages[index].mensagem}”</blockquote>
              <figcaption>— {messages[index].nome}</figcaption>
            </figure>
            {messages.length > 1 && (
              <button className="messages-nav next" onClick={() => go(1)}
                aria-label="Próxima mensagem">›</button>
            )}
          </div>
          <div className="message-dots" role="presentation">
            {messages.slice(0, 12).map((_, i) => (
              <span key={i} className={i === index % 12 ? 'dot active' : 'dot'} />
            ))}
          </div>
          <Link className="messages-link" to="/mensagens">Deixe a sua também 💌</Link>
        </>
      )}
    </div>
  )
}
