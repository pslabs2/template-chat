import { useCallback, useRef, useState } from 'react'
import { streamChat, type Message } from './api'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (content: string) => {
      const text = content.trim()
      if (!text || isStreaming) return

      const user: Message = { id: crypto.randomUUID(), role: 'user', content: text }
      const assistant: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' }
      const history = [...messages, user]
      setMessages([...history, assistant])
      setError(null)
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller
      try {
        await streamChat(
          history.map(({ role, content }) => ({ role, content })),
          {
            signal: controller.signal,
            onToken: (token) =>
              setMessages((prev) =>
                prev.map((m) => (m.id === assistant.id ? { ...m, content: m.content + token } : m)),
              ),
          },
        )
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setError((err as Error).message)
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [messages, isStreaming],
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])
  const reset = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
  }, [])

  return { messages, isStreaming, error, send, stop, reset }
}
