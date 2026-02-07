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


// List of questions Gemini is allowed to answer (exact match or close match)
const GEMINI_ALLOWED_QUESTIONS = [
  "What is the current temperature in the Hochvolthaus Nova main lab? I have heat-sensitive equipment.",
  "I need to reserve a workstation for Thursday, Nov 12th from 14:00 to 18:00. Is anything free?",
  "My TUMcard isn't opening the door to the Nova building. Do I need to re-validate it at the main campus first?",
  "Is the air conditioning running in Room 2.05 right now? It feels really humid.",
  "Does TUM offer psychological counseling services? I’m feeling really stressed about exams.",
  "Can I cancel my booking for tomorrow morning? I won't make it in time.",
  "How do I setup Eduroam wifi on my new laptop?",
  "What’s the CO2 level in the seminar room currently? I want to know if the ventilation is working.",
  "I lost my student ID on the U-Bahn. How much does a replacement card cost?",
  "Can I book the meeting room in Hochvolthaus Nova for a group project on Saturday, or is it closed on weekends?",
  "Where can I find the Career Service office to get my CV checked?",
  "Is there a printer in the building I can use with my card balance?",
  "The app says the temperature in the lab is 26°C. Can you lower it remotely or do I call the Hausmeister?",
  "I tried to book a slot for 9 AM but the system says 'User Blocked'. Is this because I missed my last booking?",
  "Do we get free access to MATLAB through the university license?"
];

const SUGGESTED_QUESTIONS = [
  "What's the temperature in the main lab?",
  "How do I book a workstation?",
  "How do I setup Eduroam wifi?",
  "Is there a printer in the building?"
];

function mockReply(message) {
  const lower = message.toLowerCase()
  
  // Temperature & Climate
  if (lower.includes('temperature') || lower.includes('temp')) {
    if (lower.includes('lab') || lower.includes('main')) {
      return 'The current temperature in the Hochvolthaus Nova main lab is 22.4°C. This is within the recommended range for most equipment. If you have heat-sensitive equipment requiring lower temps, consider Room 1.08 (cold storage lab) at 18°C.'
    }
    if (lower.includes('lower') || lower.includes('26') || lower.includes('hausmeister')) {
      return 'For temperature adjustments, you can submit a request through the TUM Facility Management portal or call the Hausmeister directly at +49 89 289-22222. Remote adjustments take 15-30 minutes to take effect.'
    }
    return 'Current building temperature is 22°C. You can check room-specific temperatures in the Model Explorer section under "Environmental Data".'
  }
  
  // Humidity & Air Quality
  if (lower.includes('humid') || lower.includes('air condition') || lower.includes('ac ') || lower.includes('a/c')) {
    return 'The HVAC system in Room 2.05 is currently running. Humidity is at 45% (normal range: 40-60%). If it feels uncomfortable, the system may need 10-15 minutes to stabilize after recent occupancy changes.'
  }
  
  if (lower.includes('co2') || lower.includes('ventilation')) {
    return 'Current CO2 level in the seminar room is 620 ppm (excellent - below 800 ppm is ideal). The ventilation system is operating normally with air exchange rate of 6 ACH.'
  }
  
  // Room Reservations & Bookings
  if (lower.includes('reserve') || lower.includes('book') || lower.includes('workstation')) {
    if (lower.includes('cancel')) {
      return 'To cancel a booking, go to TUMonline → My Bookings → select your reservation → Cancel. Cancellations must be made at least 2 hours before the slot. Need help with a specific booking?'
    }
    if (lower.includes('blocked') || lower.includes('missed')) {
      return 'Your account may be temporarily blocked if you missed 2+ bookings without canceling. Contact the facility manager at nova-support@tum.de to resolve this. Blocks are usually lifted within 24 hours after confirmation.'
    }
    if (lower.includes('weekend') || lower.includes('saturday') || lower.includes('sunday')) {
      return 'Hochvolthaus Nova is open on weekends from 8:00-20:00. Meeting rooms can be booked through TUMonline. Note: Some specialized labs require supervisor approval for weekend access.'
    }
    if (lower.includes('thursday') || lower.includes('14:00') || lower.includes('18:00')) {
      return 'Checking availability for Thursday 14:00-18:00... Workstations 3, 5, and 7 are available in the main lab. You can book directly through TUMonline → Room Reservations → Hochvolthaus Nova.'
    }
    return 'To reserve a workstation: Go to TUMonline → Room Reservations → Select "Hochvolthaus Nova" → Choose your date and time. Bookings can be made up to 2 weeks in advance.'
  }
  
  // TUMcard & Access
  if (lower.includes('tumcard') || lower.includes('card') || lower.includes('door') || lower.includes('access')) {
    if (lower.includes('lost') || lower.includes('replacement')) {
      return 'Lost TUMcard replacement costs €20 and takes 3-5 business days. Report it immediately at studentenkanzlei@tum.de to block the old card. You can get a temporary access card from the InfoPoint.'
    }
    if (lower.includes('validate') || lower.includes('open') || lower.includes('isn\'t')) {
      return 'If your TUMcard isn\'t working, first try re-validating at any validation terminal on campus. If still not working, visit the Student Service Desk at the main campus. New semester validation is required every 6 months.'
    }
    return 'TUMcard issues? Try re-validating at a terminal first. For persistent problems, contact the IT Service Desk or visit the Student Service Center.'
  }
  
  // University Services
  if (lower.includes('psychological') || lower.includes('counseling') || lower.includes('stress') || lower.includes('mental')) {
    return 'Yes! TUM offers free psychological counseling through the Studierendenwerk. Book appointments at www.studierendenwerk-muenchen-oberbayern.de/beratung or call 089-38196-1000. Emergency support is also available 24/7.'
  }
  
  if (lower.includes('career') || lower.includes('cv') || lower.includes('resume')) {
    return 'The TUM Career Service is located at Arcisstraße 21 (main campus). They offer free CV reviews - book online at www.tum.de/career. Drop-in hours are Tue & Thu 10:00-12:00.'
  }
  
  // Technical & IT
  if (lower.includes('eduroam') || lower.includes('wifi') || lower.includes('wi-fi')) {
    return 'To setup Eduroam: 1) Go to cat.eduroam.org 2) Download the TUM installer 3) Run it and enter your TUM credentials (username@tum.de). For manual setup, use PEAP/MSCHAPv2 with your LRZ credentials.'
  }
  
  if (lower.includes('printer') || lower.includes('print')) {
    return 'Yes! There are 2 printers on the ground floor near the entrance. Use your TUMcard to authenticate. Printing costs: €0.04/page B&W, €0.15/page color. Add credit via TUMonline → Print Account.'
  }
  
  if (lower.includes('matlab') || lower.includes('software') || lower.includes('license')) {
    return 'Yes, TUM provides free MATLAB access through the campus license. Download from www.matlab.mathworks.com using your TUM email. Also available: Microsoft Office, Adobe CC, and many more at software.tum.de.'
  }
  
  // IFC & 3D Models
  if (lower.includes('ifc')) {
    return 'IFC (Industry Foundation Classes) is the BIM schema we use for the Hochvolthaus models. Explore the building data in the Model Explorer section to see structural elements, MEP systems, and spatial data.'
  }
  
  if (lower.includes('point cloud')) {
    return 'Point Cloud data from LiDAR scanning is available in the Model Explorer. This captures the as-built condition of the Hochvolthaus with millimeter accuracy.'
  }
  
  // Navigation
  if (lower.includes('navigate') || lower.includes('section') || lower.includes('where')) {
    return 'Use the top navigation bar to explore: Overview (project intro), Concept (design vision), The Hub (facilities), Model Explorer (3D/BIM), and The Minds (team). Click any section or scroll to navigate.'
  }
  
  // Default response
  return 'I can help with questions about Hochvolthaus Nova including: room bookings, building conditions (temperature, CO2), TUM services, technical setup (Eduroam, printers), and the 3D building model. What would you like to know?'
}

function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help with questions about Hochvolthaus Nova - room bookings, building conditions, TUM services, and navigating the 3D model. What would you like to know?'
    }
  ])

  const keys = useMemo(() => {
    const openai = import.meta.env.VITE_OPENAI_API_KEY?.trim()
    const gemini = import.meta.env.VITE_GEMINI_API_KEY?.trim()
    if (openai) return { provider: 'openai', key: openai }
    if (gemini) return { provider: 'gemini', key: gemini }
    return { provider: 'mock', key: null }
  }, [])

  const sendMessage = async (messageText = null) => {
    const text = messageText || input.trim();
    if (!text || loading) return;
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setLoading(true);

    try {
      let reply = '';
      // Only allow Gemini to answer if the question is in the allowed list (exact match or close match)
      if (keys.provider === 'gemini' && keys.key) {
        // Use a simple case-insensitive match or allow for minor variations
        const allowed = GEMINI_ALLOWED_QUESTIONS.some(q => q.toLowerCase() === text.toLowerCase());
        if (allowed) {
          reply = await callGemini([...messages, userMessage], keys.key);
        } else {
          reply = "Sorry, I can only answer specific questions. Please ask one of the supported questions.";
        }
      } else if (keys.provider === 'openai' && keys.key) {
        reply = await callOpenAI([...messages, userMessage], keys.key);
      } else {
        reply = mockReply(userMessage.content);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not reach the AI service. Please check your API key or try again.'
        }
      ]);
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

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
            {showSuggestions && messages.length === 1 && (
              <div className="chat-suggestions">
                {SUGGESTED_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    className="chat-suggestion-btn"
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
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
