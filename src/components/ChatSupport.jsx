import { useMemo, useState } from 'react'
import { MessageSquare, X, Send, Loader2, Bot, ShieldCheck } from 'lucide-react'

const SYSTEM_PROMPT =
  'You are a concise, friendly assistant for the Hochvolthaus website. Offer short, practical answers about the project, 3D models, BIM/IFC, and navigation guidance.'

async function callOpenAI(messages, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ]
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'OpenAI request failed')
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || 'No response received.'
}

async function callGemini(messages, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nConversation:\n${messages
                  .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
                  .join('\n')}`
              }
            ]
          }
        ]
      })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Gemini request failed')
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No response received.'
}

function mockReply(message) {
  const lower = message.toLowerCase()
  if (lower.includes('ifc')) {
    return 'IFC is the Building Information Modeling schema we use for the Hochvolthaus models. The site hosts an IFC tab for BIM insights.'
  }
  if (lower.includes('point cloud')) {
    return 'Point Cloud covers LiDAR/photogrammetry data. Use the Point Cloud tab to explore that dataset when it is available.'
  }
  if (lower.includes('navigate') || lower.includes('section')) {
    return 'Use the top navigation: Overview, Concept, Hub, 3D Models, and Minds. Scroll or click a tab to jump.'
  }
  return 'This is demo mode. Add VITE_OPENAI_API_KEY or VITE_GEMINI_API_KEY to get live answers.'
}

function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can answer questions about Hochvolthaus, the 3D models, and how to navigate the site.'
    }
  ])

  const keys = useMemo(() => {
    const openai = import.meta.env.VITE_OPENAI_API_KEY?.trim()
    const gemini = import.meta.env.VITE_GEMINI_API_KEY?.trim()
    if (openai) return { provider: 'openai', key: openai }
    if (gemini) return { provider: 'gemini', key: gemini }
    return { provider: 'mock', key: null }
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      let reply = ''
      if (keys.provider === 'openai' && keys.key) {
        reply = await callOpenAI([...messages, userMessage], keys.key)
      } else if (keys.provider === 'gemini' && keys.key) {
        reply = await callGemini([...messages, userMessage], keys.key)
      } else {
        reply = mockReply(userMessage.content)
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not reach the AI service. Please check your API key or try again.'
        }
      ])
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-support">
      <button
        className="chat-launcher"
        aria-label="Open chat support"
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <X size={18} /> : <MessageSquare size={18} />}
        <span>{isOpen ? 'Close' : 'Chat'}</span>
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-title">
              <Bot size={16} />
              <span>AI Guide</span>
            </div>
            <div className="chat-provider">
              <ShieldCheck size={14} />
              <span>
                {keys.provider === 'openai'
                  ? 'ChatGPT'
                  : keys.provider === 'gemini'
                  ? 'Gemini'
                  : 'Demo mode'}
              </span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <div className="chat-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Ask about Hochvolthaus or the 3D models..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
            />
            <button className="chat-send" onClick={sendMessage} disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            </button>
          </div>

          {keys.provider === 'mock' && (
            <div className="chat-footer-note">
              Add VITE_OPENAI_API_KEY or VITE_GEMINI_API_KEY in a .env file to enable live answers.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatSupport
