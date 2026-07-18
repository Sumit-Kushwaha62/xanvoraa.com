import { useEffect, useRef, useState } from 'react'
import { API_ENDPOINTS } from '../config/api'

const INITIAL_MESSAGE = {
  role: 'model',
  text: "Hi! I'm Xanvoraa AI — I can help you learn about our services, pricing, and how Xanvoraa Technologies can help your business. What would you like to know?",
}

const styles = `
  .pai__root {
    position: fixed;
    right: clamp(12px, 2vw, 20px);
    bottom: calc(96px + env(safe-area-inset-bottom, 0px));
    z-index: 10000;
    font-family: Inter, "Segoe UI", system-ui, sans-serif;
  }

  .pai__toggle {
    position: relative;
    display: grid;
    width: 60px;
    height: 60px;
    margin-left: auto;
    place-items: center;
    color: #fff;
    background: linear-gradient(145deg, #8b85ff, #6c63ff 55%, #4b44cc);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    box-shadow:
      0 0 0 7px rgba(108, 99, 255, 0.12),
      0 0 30px rgba(108, 99, 255, 0.65),
      0 12px 30px rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .pai__toggle::before {
    position: absolute;
    inset: -7px;
    content: "";
    border: 1px solid rgba(139, 133, 255, 0.35);
    border-radius: inherit;
    animation: pai__pulse 2.2s ease-out infinite;
  }

  .pai__toggle:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow:
      0 0 0 8px rgba(108, 99, 255, 0.15),
      0 0 38px rgba(108, 99, 255, 0.82),
      0 15px 34px rgba(0, 0, 0, 0.48);
  }

  .pai__tooltip {
    position: absolute;
    right: 72px;
    bottom: 8px;
    width: max-content;
    max-width: 220px;
    padding: 9px 13px;
    color: #f7f7ff;
    background: #181829;
    border: 1px solid rgba(139, 133, 255, 0.28);
    border-radius: 10px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.38);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.35;
    opacity: 0;
    pointer-events: none;
    transform: translateX(8px);
    transition: opacity 180ms ease, transform 180ms ease;
    white-space: nowrap;
  }

  .pai__tooltip::after {
    position: absolute;
    right: -5px;
    top: 50%;
    width: 9px;
    height: 9px;
    content: "";
    background: #181829;
    border-top: 1px solid rgba(139, 133, 255, 0.28);
    border-right: 1px solid rgba(139, 133, 255, 0.28);
    transform: translateY(-50%) rotate(45deg);
  }

  .pai__root:hover .pai__tooltip,
  .pai__toggle:focus-visible + .pai__tooltip {
    opacity: 1;
    transform: translateX(0);
  }

  .pai__toggle:focus-visible,
  .pai__close:focus-visible,
  .pai__input:focus-visible,
  .pai__send:focus-visible {
    outline: 2px solid #a9a4ff;
    outline-offset: 3px;
  }

  .pai__robot {
    width: 31px;
    height: 31px;
    filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.38));
  }

  .pai__window {
    position: fixed;
    right: clamp(12px, 2vw, 20px);
    bottom: calc(96px + env(safe-area-inset-bottom, 0px));
    display: flex;
    width: min(350px, calc(100vw - 24px));
    height: min(480px, calc(100dvh - 116px));
    max-height: calc(100dvh - 116px);
    overflow: hidden;
    color: #f7f7ff;
    background:
      radial-gradient(circle at 100% 0%, rgba(108, 99, 255, 0.17), transparent 38%),
      #0d0d1a;
    border: 1px solid rgba(139, 133, 255, 0.24);
    border-radius: 18px;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6), 0 0 35px rgba(108, 99, 255, 0.12);
    opacity: 0;
    pointer-events: none;
    transform: translateY(26px) scale(0.96);
    transform-origin: bottom right;
    transition: opacity 220ms ease, transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
    flex-direction: column;
  }

  .pai__window--open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  .pai__header {
    display: flex;
    min-height: 76px;
    padding: 16px 16px 15px;
    align-items: center;
    gap: 11px;
    background: rgba(18, 18, 34, 0.86);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
  }

  .pai__avatar {
    display: grid;
    width: 41px;
    height: 41px;
    flex: 0 0 auto;
    color: #fff;
    background: linear-gradient(145deg, #847dff, #5149d8);
    border-radius: 13px;
    box-shadow: 0 0 18px rgba(108, 99, 255, 0.38);
    place-items: center;
  }

  .pai__avatar .pai__robot {
    width: 23px;
    height: 23px;
  }

  .pai__heading {
    min-width: 0;
    flex: 1;
  }

  .pai__title {
    margin: 0;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
  }

  .pai__subtitle {
    display: flex;
    margin-top: 3px;
    color: #9999b3;
    font-size: 11px;
    line-height: 1.2;
    align-items: center;
    gap: 5px;
  }

  .pai__status {
    width: 6px;
    height: 6px;
    background: #52dda2;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(82, 221, 162, 0.8);
  }

  .pai__status--offline {
    background: #ff6b6b;
    box-shadow: 0 0 8px rgba(255, 107, 107, 0.75);
  }

  .pai__close {
    display: grid;
    width: 34px;
    height: 34px;
    padding: 0;
    color: #aaaac1;
    background: transparent;
    border: 0;
    border-radius: 9px;
    cursor: pointer;
    place-items: center;
    transition: color 160ms ease, background 160ms ease;
  }

  .pai__close:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  .pai__messages {
    display: flex;
    min-height: 0;
    padding: 18px 14px;
    overflow-y: auto;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
  }

  .pai__messages::-webkit-scrollbar {
    width: 5px;
  }

  .pai__messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .pai__messages::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.48);
    border-radius: 10px;
  }

  .pai__message {
    max-width: 84%;
    padding: 10px 12px;
    border-radius: 14px;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    animation: pai__message-in 190ms ease-out;
  }

  .pai__message--model {
    align-self: flex-start;
    color: #dddded;
    background: #181829;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-bottom-left-radius: 4px;
  }

  .pai__message--user {
    align-self: flex-end;
    color: #fff;
    background: linear-gradient(135deg, #766eff, #5a52df);
    border-bottom-right-radius: 4px;
    box-shadow: 0 6px 18px rgba(108, 99, 255, 0.2);
  }

  .pai__typing {
    display: flex;
    width: fit-content;
    padding: 13px 15px;
    background: #181829;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px 14px 14px 4px;
    align-items: center;
    gap: 5px;
  }

  .pai__typing-dot {
    width: 6px;
    height: 6px;
    background: #8f89ff;
    border-radius: 50%;
    animation: pai__typing 1.2s ease-in-out infinite;
  }

  .pai__typing-dot:nth-child(2) {
    animation-delay: 160ms;
  }

  .pai__typing-dot:nth-child(3) {
    animation-delay: 320ms;
  }

  .pai__form {
    display: flex;
    padding: 12px;
    background: rgba(18, 18, 32, 0.92);
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    gap: 8px;
    align-items: center;
  }

  .pai__input {
    width: 100%;
    min-width: 0;
    height: 42px;
    padding: 0 13px;
    color: #f7f7ff;
    background: #191929;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    font: inherit;
    font-size: 13px;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  .pai__input::placeholder {
    color: #74748e;
  }

  .pai__input:focus {
    border-color: rgba(108, 99, 255, 0.72);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.11);
    outline: none;
  }

  .pai__input:disabled {
    opacity: 0.7;
  }

  .pai__send {
    display: grid;
    width: 42px;
    height: 42px;
    padding: 0;
    flex: 0 0 auto;
    color: #fff;
    background: linear-gradient(135deg, #817aff, #5a52df);
    border: 0;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(108, 99, 255, 0.27);
    cursor: pointer;
    place-items: center;
    transition: transform 160ms ease, opacity 160ms ease;
  }

  .pai__send:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .pai__send:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  @keyframes pai__typing {
    0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-4px); }
  }

  @keyframes pai__pulse {
    0% { opacity: 0.7; transform: scale(0.92); }
    75%, 100% { opacity: 0; transform: scale(1.18); }
  }

  @keyframes pai__message-in {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .pai__root {
      right: 16px;
      bottom: calc(88px + env(safe-area-inset-bottom, 0px));
    }

    .pai__toggle {
      width: 54px;
      height: 54px;
    }

    .pai__robot {
      width: 28px;
      height: 28px;
    }

    .pai__window {
      right: 12px;
      bottom: calc(86px + env(safe-area-inset-bottom, 0px));
      width: calc(100vw - 24px);
      height: min(440px, calc(100dvh - 104px));
      max-height: calc(100dvh - 104px);
      border-radius: 16px;
    }

    .pai__header {
      min-height: 66px;
      padding: 12px;
    }

    .pai__avatar {
      width: 36px;
      height: 36px;
      border-radius: 11px;
    }

    .pai__messages {
      padding: 14px 12px;
      gap: 10px;
    }

    .pai__message {
      font-size: 12px;
      line-height: 1.45;
    }

    .pai__form {
      padding: 10px;
    }

    .pai__input,
    .pai__send {
      height: 40px;
    }

    .pai__tooltip {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pai__window,
    .pai__toggle,
    .pai__send {
      transition: none;
    }

    .pai__toggle::before,
    .pai__typing-dot,
    .pai__message {
      animation: none;
    }
  }
`

function RobotIcon() {
  return (
    <svg
      className="pai__robot"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 7V4m-2 0h4M8.5 11.5h15a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 17h.01M21.5 17h.01M11.5 21c2.7 1.7 6.3 1.7 9 0M5.5 17H3m23.5 0H29"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function PixelAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatStatus, setChatStatus] = useState('ready')
  const [sessionId] = useState(
    () => sessionStorage.getItem('xanvoraa_chat_session_id') || crypto.randomUUID(),
  )
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    sessionStorage.setItem('xanvoraa_chat_session_id', sessionId)
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 260)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  async function handleSubmit(event) {
    event.preventDefault()

    const userText = input.trim()
    if (!userText || isTyping) return

    const userMessage = { role: 'user', text: userText }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch(API_ENDPOINTS.chat, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, message: userText }) })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to reach Xanvoraa AI.')
      }

      const reply = data?.reply

      if (!reply) {
        throw new Error('Gemini returned an empty response.')
      }

      setChatStatus('ready')
      setMessages((current) => [...current, { role: 'model', text: reply }])
    } catch (error) {
      console.error('Xanvoraa AI request failed:', error)
      setChatStatus('offline')
      setMessages((current) => [
        ...current,
        {
          role: 'model',
          text: 'The AI service is temporarily unavailable. Please try again shortly, or contact us on WhatsApp at +91 7067694391 or info@xanvoraa.com.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="pai__root">
      <style>{styles}</style>

      <section
        className={`pai__window ${isOpen ? 'pai__window--open' : ''}`}
        aria-label="Xanvoraa AI chat"
        aria-hidden={!isOpen}
      >
        <header className="pai__header">
          <div className="pai__avatar">
            <RobotIcon />
          </div>
          <div className="pai__heading">
            <h2 className="pai__title">Xanvoraa AI</h2>
            <div className="pai__subtitle">
              <span className={'pai__status ' + (chatStatus === 'offline' ? 'pai__status--offline' : '')} />
              {chatStatus === 'offline' ? 'Temporarily unavailable' : 'Powered by Gemini'}
            </div>
          </div>
          <button
            className="pai__close"
            type="button"
            aria-label="Close Xanvoraa AI chat"
            onClick={() => setIsOpen(false)}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="pai__messages" aria-live="polite">
          {messages.map((message, index) => (
            <div
              className={`pai__message pai__message--${message.role}`}
              key={`${message.role}-${index}`}
            >
              {message.text}
            </div>
          ))}

          {isTyping && (
            <div className="pai__typing" aria-label="Xanvoraa AI is typing">
              <span className="pai__typing-dot" />
              <span className="pai__typing-dot" />
              <span className="pai__typing-dot" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="pai__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="pai__input"
            type="text"
            value={input}
            placeholder="Ask Xanvoraa AI..."
            aria-label="Message Xanvoraa AI"
            autoComplete="off"
            disabled={isTyping}
            onChange={(event) => setInput(event.target.value)}
          />
          <button
            className="pai__send"
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isTyping}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m21 3-7.2 18-4.1-7.1L3 10.2 21 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="m9.7 13.9 4.1-3.7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      </section>

      <button
        className="pai__toggle"
        type="button"
        aria-label={isOpen ? 'Close Xanvoraa AI chat' : 'Open Xanvoraa AI chat'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <RobotIcon />
      </button>
      {!isOpen && (
        <div className="pai__tooltip" role="tooltip">
          Ask Xanvoraa AI about our services
        </div>
      )}
    </div>
  )
}
