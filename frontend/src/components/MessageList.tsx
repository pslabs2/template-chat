import { useEffect, useRef } from 'react'
import type { Message } from '../lib/api'

interface Props {
  messages: Message[]
  isStreaming: boolean
}

export function MessageList({ messages, isStreaming }: Props) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="empty">
        <h1>How can I help you today?</h1>
        <p>Ask anything to get started.</p>
      </div>
    )
  }

  return (
    <div className="messages">
      {messages.map((m, i) => (
        <div key={m.id} className={`message ${m.role}`}>
          <div className="bubble">
            {m.content}
            {isStreaming && i === messages.length - 1 && m.role === 'assistant' && (
              <span className="cursor" aria-hidden />
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
