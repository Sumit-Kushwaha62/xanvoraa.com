import { useEffect, useState } from 'react'
import { API_ENDPOINTS, getAdminHeaders } from '../config/api'

export default function ConversationPanel({ sessionId, onClose }) {
  const [conversation, setConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(API_ENDPOINTS.admin.conversation(sessionId), {
          credentials: 'include',
          headers: { ...getAdminHeaders() }
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.message || 'Unable to load conversation')
        if (!cancelled) setConversation(data.data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [sessionId])

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>Conversation</h3>
          <button className="admin-btn admin-btn--ghost" onClick={onClose}>Close</button>
        </div>

        <div className="admin-modal__body">
          {loading && <div className="admin-state">Loading conversation...</div>}
          {!loading && error && <div className="admin-state admin-state--error">{error}</div>}

          {!loading && !error && conversation && (
            <div className="admin-thread">
              {(conversation.messages || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`admin-msg ${msg.role === 'user' ? 'admin-msg--user' : 'admin-msg--model'}`}
                >
                  <span className="admin-msg__role">
                    {msg.role === 'user' ? 'User' : 'Assistant'}
                  </span>
                  <p className="admin-msg__content">{msg.content}</p>
                  {msg.timestamp && (
                    <span className="admin-msg__time">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
              {(!conversation.messages || conversation.messages.length === 0) && (
                <div className="admin-state">No messages in this conversation.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
