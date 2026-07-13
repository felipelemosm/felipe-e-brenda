export default function VenueCard({ kind, name, detail, time, photo, photoAlt, mapQuery, wazeQuery, mapTitle }) {
  const encodedMap = encodeURIComponent(mapQuery)
  const encodedWaze = encodeURIComponent(wazeQuery)
  return (
    <div className="venue-card">
      <div className="venue-kind">{kind}</div>
      <div className="venue-name">{name}</div>
      <div className="venue-detail">{detail}</div>
      <div className="venue-time">{time}</div>
      {photo ? (
        <img className="venue-photo" src={photo} alt={photoAlt} loading="lazy" />
      ) : (
        <div className="venue-photo placeholder" aria-hidden="true">
          📷 Foto da fachada — salve em <code>src/assets/locais/</code>
        </div>
      )}
      <iframe
        className="venue-map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={mapTitle}
        src={`https://www.google.com/maps?q=${encodedMap}&output=embed`}
      />
      <div className="venue-links">
        <a className="btn" target="_blank" rel="noopener noreferrer"
          href={`https://www.google.com/maps/search/?api=1&query=${encodedMap}`}>
          Abrir no Google Maps
        </a>
        <a className="btn ghost" target="_blank" rel="noopener noreferrer"
          href={`https://waze.com/ul?q=${encodedWaze}&navigate=yes`}>
          Ir com Waze
        </a>
      </div>
    </div>
  )
}
