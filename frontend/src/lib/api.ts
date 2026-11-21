export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
}

interface StreamHandlers {
  onToken: (token: string) => void
  signal?: AbortSignal
}

/** POSTs the conversation and consumes the server-sent event stream. */
export async function streamChat(
  messages: Pick<Message, 'role' | 'content'>[],
  { onToken, signal }: StreamHandlers,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  if (!res.ok || !res.body) throw new Error(`Request failed: ${res.status}`)

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += value
    const frames = buffer.split('\n\n')
    buffer = frames.pop() ?? ''
    for (const frame of frames) {
      const event = /^event: (.*)$/m.exec(frame)?.[1]
      const data = JSON.parse(/^data: (.*)$/m.exec(frame)?.[1] ?? '{}')
      if (event === 'token') onToken(data.content)
      else if (event === 'error') throw new Error(data.message)
      else if (event === 'done') return
    }
  }
}
