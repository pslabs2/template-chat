import { useState, type FormEvent, type KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  onStop: () => void
  isStreaming: boolean
}

export function Composer({ onSend, onStop, isStreaming }: Props) {
  const [value, setValue] = useState('')

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!value.trim() || isStreaming) return
    onSend(value)
    setValue('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Message the assistant…"
        rows={1}
        aria-label="Message"
        autoFocus
      />
      {isStreaming ? (
        <button type="button" onClick={onStop} aria-label="Stop generating">
          ■
        </button>
      ) : (
        <button type="submit" disabled={!value.trim()} aria-label="Send">
          ↑
        </button>
      )}
    </form>
  )
}
