import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, CheckIcon, CopyIcon, SparkIcon } from './ui/icons'

type TabType = 'ai' | 'code' | 'metrics'

interface ChatMessage {
  sender: 'ai' | 'user'
  text: string
}

const PRESET_QUESTIONS = [
  { label: '🚀 What did you build?', key: 'build' },
  { label: '💼 Open for roles / projects?', key: 'hire' },
  { label: '⚡ How does offline sync work?', key: 'offline' },
]

const AI_RESPONSES: Record<string, string> = {
  build:
    "I founded Zinodesk (24/7 AI Receptionist SaaS) & SmartPilot, architected ATI EMR (offline healthcare system), and shipped 50+ apps with Next.js, Flutter, and MERN.",
  hire:
    "Yes! I'm actively available for high-impact fullstack roles, AI SaaS builds, and mobile projects. You can WhatsApp or call me anytime.",
  offline:
    "In ATI EMR, I engineered a zero-internet multi-device LAN sync engine that guarantees local-first speed with conflict-free multi-client synchronization.",
  default:
    "I'm Shakil's AI assistant powered by Zinodesk! I can answer questions about fullstack architecture, Flutter mobile apps, AI SaaS, or collaboration.",
}

export default function HeroConsole() {
  const [activeTab, setActiveTab] = useState<TabType>('ai')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hi! I'm Shakil's AI assistant built on Zinodesk. Tap a prompt below or ask anything!",
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleAsk = (query: string, key?: string) => {
    if (!query.trim()) return

    setMessages((prev) => [...prev, { sender: 'user', text: query }])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      let reply = AI_RESPONSES.default
      const q = query.toLowerCase()

      if (key && AI_RESPONSES[key]) {
        reply = AI_RESPONSES[key]
      } else if (q.includes('build') || q.includes('project') || q.includes('zinodesk') || q.includes('experience')) {
        reply = AI_RESPONSES.build
      } else if (q.includes('hire') || q.includes('available') || q.includes('contact') || q.includes('role') || q.includes('work')) {
        reply = AI_RESPONSES.hire
      } else if (q.includes('offline') || q.includes('sync') || q.includes('emr') || q.includes('ati')) {
        reply = AI_RESPONSES.offline
      } else {
        reply = `Thanks for asking! I build end-to-end AI SaaS, offline-first systems, and cross-platform apps. Let's connect on WhatsApp to discuss further!`
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }])
      setIsTyping(false)
    }, 550)
  }

  const copyCode = () => {
    const snippet = `// Shakil — Fullstack & AI SaaS Founder
export const engineer = {
  name: 'Shakil',
  role: 'Fullstack Developer & AI Builder',
  skills: ['Next.js', 'Flutter', 'TypeScript', 'Node.js', 'LLMs'],
  products: {
    zinodesk: 'Live AI Receptionist SaaS',
    ati_emr: 'Zero-Internet Offline Healthcare System',
    livora: 'Cross-platform Flutter Mobile SaaS',
  },
  status: 'Open for high-impact opportunities'
};`
    navigator.clipboard.writeText(snippet)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl">
      {/* Glow aura behind console */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 blur-xl" />

      {/* Main Console Box */}
      <div className="glass-card relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl">
        {/* Console Header / Titlebar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3.5 py-2.5 sm:px-4 sm:py-3">
          {/* macOS window dots */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]/90 shadow-[0_0_8px_rgba(255,95,86,0.6)]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 shadow-[0_0_8px_rgba(255,189,46,0.6)]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]/90 shadow-[0_0_8px_rgba(39,201,63,0.6)]" />
          </div>

          {/* Interactive File Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 shadow-sm'
                  : 'text-[color:var(--color-muted)] hover:bg-white/5 hover:text-[color:var(--color-ink)]'
              }`}
            >
              <SparkIcon width={13} height={13} className="text-cyan-400" />
              <span>Zinodesk.ai</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/40 shadow-sm'
                  : 'text-[color:var(--color-muted)] hover:bg-white/5 hover:text-[color:var(--color-ink)]'
              }`}
            >
              <span className="font-mono text-[11px] text-violet-400">TS</span>
              <span>architecture.ts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeTab === 'metrics'
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm'
                  : 'text-[color:var(--color-muted)] hover:bg-white/5 hover:text-[color:var(--color-ink)]'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>telemetry</span>
            </button>
          </div>

          {/* Live Status indicator */}
          <span className="hidden items-center gap-1 text-[11px] font-mono text-emerald-400 md:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            live
          </span>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {/* TAB 1: Zinodesk AI Live Sandbox */}
            {activeTab === 'ai' && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {/* Chat Stream Box */}
                <div className="h-56 overflow-y-auto space-y-3 pr-1 text-xs sm:text-sm">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-violet-600 font-medium text-white shadow-md'
                            : 'glass-card border border-white/10 text-[color:var(--color-ink)]'
                        }`}
                      >
                        {m.sender === 'ai' && (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-cyan-400">
                            <SparkIcon width={11} height={11} />
                            <span>Zinodesk AI Engine</span>
                          </div>
                        )}
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="glass-card flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2 text-xs text-cyan-300">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Interactive Prompt Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
                  {PRESET_QUESTIONS.map((pq) => (
                    <button
                      key={pq.key}
                      type="button"
                      onClick={() => handleAsk(pq.label, pq.key)}
                      className="glass-chip rounded-lg px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-muted)] transition-all hover:scale-105 hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      {pq.label}
                    </button>
                  ))}
                </div>

                {/* Interactive Input Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAsk(inputValue)
                  }}
                  className="mt-3 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about AI, Flutter, experience..."
                    className="glass-card w-full rounded-xl border border-white/10 px-3.5 py-2 text-xs text-[color:var(--color-ink)] placeholder-[#6b7488] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-2 text-xs font-bold text-[#05060c] transition-all hover:scale-105 active:scale-95"
                  >
                    Send
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 2: TypeScript Architecture Code */}
            {activeTab === 'code' && (
              <motion.div
                key="tab-code"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col font-mono text-xs"
              >
                <div className="flex items-center justify-between pb-2 text-[11px] text-[color:var(--color-faint)]">
                  <span>// TypeScript Fullstack Blueprint</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="glass-chip flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-cyan-300 transition-colors hover:text-cyan-200"
                  >
                    {copiedCode ? (
                      <>
                        <CheckIcon width={12} height={12} className="text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon width={12} height={12} />
                        <span>Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="h-64 overflow-y-auto rounded-xl bg-black/60 p-3.5 leading-relaxed text-[#c3cad9] border border-white/5 selection:bg-cyan-500/30">
                  <p><span className="text-violet-400">export const</span> <span className="text-cyan-300">engineer</span>: <span className="text-amber-300">FullstackFounder</span> = &#123;</p>
                  <p className="pl-4"><span className="text-sky-300">name</span>: <span className="text-emerald-300">&apos;Shakil&apos;</span>,</p>
                  <p className="pl-4"><span className="text-sky-300">role</span>: <span className="text-emerald-300">&apos;Fullstack &amp; AI Architect&apos;</span>,</p>
                  <p className="pl-4"><span className="text-sky-300">coreStack</span>: [<span className="text-emerald-300">&apos;Next.js&apos;</span>, <span className="text-emerald-300">&apos;Flutter&apos;</span>, <span className="text-emerald-300">&apos;TypeScript&apos;</span>, <span className="text-emerald-300">&apos;Node.js&apos;</span>, <span className="text-emerald-300">&apos;LLMs&apos;</span>],</p>
                  <p className="pl-4"><span className="text-sky-300">featuredProducts</span>: &#123;</p>
                  <p className="pl-8"><span className="text-sky-300">aiSaas</span>: <span className="text-emerald-300">&apos;Zinodesk (24/7 Receptionist)&apos;</span>,</p>
                  <p className="pl-8"><span className="text-sky-300">healthcare</span>: <span className="text-emerald-300">&apos;ATI EMR (Zero-Internet Sync)&apos;</span>,</p>
                  <p className="pl-8"><span className="text-sky-300">mobile</span>: <span className="text-emerald-300">&apos;Livora &amp; Ushuttle (Flutter)&apos;</span></p>
                  <p className="pl-4">&#125;,</p>
                  <p className="pl-4"><span className="text-sky-300">status</span>: <span className="text-emerald-300">&apos;Available for high-impact projects&apos;</span></p>
                  <p>&#125;;</p>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Realtime Telemetry / Stats */}
            {activeTab === 'metrics' && (
              <motion.div
                key="tab-metrics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="glass-card rounded-xl p-3 border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Applications Shipped</div>
                    <div className="mt-1 text-xl font-bold text-[color:var(--color-ink)] font-[var(--font-display)]">50+</div>
                    <div className="text-[11px] text-[color:var(--color-faint)]">Web, Mobile &amp; AI SaaS</div>
                  </div>

                  <div className="glass-card rounded-xl p-3 border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Offline Sync Speed</div>
                    <div className="mt-1 text-xl font-bold text-emerald-300 font-[var(--font-display)]">&lt; 12ms</div>
                    <div className="text-[11px] text-[color:var(--color-faint)]">LAN multi-device sync</div>
                  </div>

                  <div className="glass-card rounded-xl p-3 border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-violet-400">Coding Experience</div>
                    <div className="mt-1 text-xl font-bold text-violet-300 font-[var(--font-display)]">7+ Years</div>
                    <div className="text-[11px] text-[color:var(--color-faint)]">Since 2017 to Present</div>
                  </div>

                  <div className="glass-card rounded-xl p-3 border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-400">Production Uptime</div>
                    <div className="mt-1 text-xl font-bold text-fuchsia-300 font-[var(--font-display)]">99.98%</div>
                    <div className="text-[11px] text-[color:var(--color-faint)]">High-availability infra</div>
                  </div>
                </div>

                <div className="glass-chip flex items-center justify-between rounded-xl px-3.5 py-2 text-xs text-[color:var(--color-muted)]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Zinodesk AI Cloud &amp; Offline Engines Operational</span>
                  </span>
                  <ArrowUpRight width={13} height={13} className="text-cyan-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
