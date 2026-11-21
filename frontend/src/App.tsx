import { Composer } from './components/Composer'
import { MessageList } from './components/MessageList'
import { useChat } from './lib/useChat'

export default function App() {
  const { messages, isStreaming, error, send, stop, reset } = useChat()

  return (
    <div className="app">
      <header className="header">
        <span className="brand">Chat</span>
        <button className="ghost" onClick={reset} disabled={messages.length === 0}>
          New chat
        </button>
      </header>
      <main className="main">
        <MessageList messages={messages} isStreaming={isStreaming} />
      </main>
      <footer className="footer">
        {error && <div className="error">{error}</div>}
        <Composer onSend={send} onStop={stop} isStreaming={isStreaming} />
      </footer>
    </div>
  )
}
