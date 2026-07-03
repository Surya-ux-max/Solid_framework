import { createSignal, createMemo, For, Show, onCleanup, onMount } from 'solid-js'
import gsap from 'gsap'

// ─── 1. GSAP Timeline ────────────────────────────────────────────────────────
function GsapDemo() {
  let box
  const run = () => {
    gsap.timeline()
      .to(box, { x: 150, duration: 0.4, ease: 'power2.out' })
      .to(box, { rotation: 360, duration: 0.4 })
      .to(box, { scale: 1.5, backgroundColor: '#6366f1', duration: 0.3 })
      .to(box, { x: 0, rotation: 0, scale: 1, backgroundColor: '#a5b4fc', duration: 0.5, ease: 'elastic.out(1,0.5)' })
  }
  return (
    <div class="flex flex-col items-center gap-6 py-4">
      <div ref={box} style={{ width: '64px', height: '64px', 'border-radius': '12px', 'background-color': '#a5b4fc' }} />
      <button onClick={run} class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        Run Timeline
      </button>
    </div>
  )
}

// ─── 2. GSAP Stagger ─────────────────────────────────────────────────────────
function StaggerDemo() {
  let container
  const items = ['⚡ Fast', '🎯 Precise', '🔥 Reactive', '💎 Minimal', '🚀 Solid']
  const replay = () => {
    gsap.fromTo(
      container.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
    )
  }
  onMount(() => replay())
  return (
    <div class="flex flex-col items-center gap-4 py-4">
      <button onClick={replay} class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        Replay Stagger
      </button>
      <div ref={container} class="flex flex-wrap gap-3 justify-center">
        <For each={items}>
          {item => (
            <div class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow">
              {item}
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// ─── 3. Fine-Grained Reactivity — 1000 nodes ─────────────────────────────────
function ReactivityDemo() {
  const [running, setRunning] = createSignal(false)
  const [tick, setTick] = createSignal(0)
  const items = Array.from({ length: 1000 }, (_, i) => i)
  let interval

  const toggle = () => {
    if (running()) {
      clearInterval(interval)
      setRunning(false)
    } else {
      setRunning(true)
      interval = setInterval(() => setTick(t => t + 1), 16)
    }
  }
  onCleanup(() => clearInterval(interval))

  const hue = createMemo(() => (tick() * 3) % 360)

  return (
    <div class="flex flex-col items-center gap-4 py-4">
      <button onClick={toggle} class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        {running() ? '⏹ Stop' : '▶ Start'} — 1000 reactive nodes
      </button>
      <p class="text-sm text-gray-400">Tick: {tick()}</p>
      <div class="flex flex-wrap gap-1 justify-center" style={{ 'max-width': '480px' }}>
        <For each={items}>
          {i => (
            <div
              style={{
                width: '16px',
                height: '16px',
                'border-radius': '3px',
                background: `hsl(${hue()}, 70%, 60%)`,
                opacity: String(0.3 + ((i + tick()) % 10) / 10),
              }}
            />
          )}
        </For>
      </div>
    </div>
  )
}

// ─── 4. Signal Counter ───────────────────────────────────────────────────────
function CounterDemo() {
  const [count, setCount] = createSignal(0)
  const doubled = createMemo(() => count() * 2)
  const color = createMemo(() => count() > 0 ? 'text-green-600' : count() < 0 ? 'text-red-500' : 'text-gray-700')
  return (
    <div class="flex flex-col items-center gap-6 py-4">
      <p class={`text-6xl font-bold tabular-nums ${color()}`}>{count()}</p>
      <p class="text-sm text-gray-400">Doubled: {doubled()}</p>
      <div class="flex gap-3">
        <button onClick={() => setCount(c => c - 1)} class="w-12 h-12 rounded-full bg-red-100 text-red-600 text-xl font-bold hover:bg-red-200 transition-colors">−</button>
        <button onClick={() => setCount(0)} class="px-4 h-12 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors">Reset</button>
        <button onClick={() => setCount(c => c + 1)} class="w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-bold hover:bg-green-200 transition-colors">+</button>
      </div>
    </div>
  )
}

// ─── 5. Virtual Scroll (manual) ──────────────────────────────────────────────
function VirtualList() {
  const ROW_H = 40
  const VISIBLE = 10
  const allItems = Array.from({ length: 10000 }, (_, i) => `Row #${i + 1}`)
  const [scrollTop, setScrollTop] = createSignal(0)

  const startIdx = createMemo(() => Math.floor(scrollTop() / ROW_H))
  const visibleItems = createMemo(() => allItems.slice(startIdx(), startIdx() + VISIBLE + 2))

  return (
    <div
      style={{ height: `${ROW_H * VISIBLE}px`, 'overflow-y': 'auto', position: 'relative', border: '1px solid #e5e7eb', 'border-radius': '12px' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: `${allItems.length * ROW_H}px`, position: 'relative' }}>
        <For each={visibleItems()}>
          {(item, i) => (
            <div
              style={{
                position: 'absolute',
                top: `${(startIdx() + i()) * ROW_H}px`,
                left: 0, right: 0,
                height: `${ROW_H}px`,
                display: 'flex',
                'align-items': 'center',
                padding: '0 16px',
                'border-bottom': '1px solid #f3f4f6',
                'font-size': '14px',
                color: '#374151',
              }}
            >
              {item}
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// ─── 6. Show / Conditional ───────────────────────────────────────────────────
function ToggleDemo() {
  const [show, setShow] = createSignal(true)
  const [theme, setTheme] = createSignal('indigo')
  const themes = { indigo: 'bg-indigo-100 text-indigo-800', green: 'bg-green-100 text-green-800', rose: 'bg-rose-100 text-rose-800' }
  return (
    <div class="flex flex-col items-center gap-4 py-4">
      <div class="flex gap-3">
        <button onClick={() => setShow(v => !v)} class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          {show() ? 'Hide' : 'Show'}
        </button>
        <For each={Object.keys(themes)}>
          {t => (
            <button
              onClick={() => setTheme(t)}
              class={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${theme() === t ? 'border-indigo-600 text-indigo-600' : 'border-gray-200 text-gray-500'}`}
            >
              {t}
            </button>
          )}
        </For>
      </div>
      <Show when={show()}>
        <div class={`px-8 py-5 rounded-xl font-medium shadow text-lg ${themes[theme()]}`}>
          SolidJS renders this without a Virtual DOM ✨
        </div>
      </Show>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const sections = [
  { id: 'gsap',      label: '🎯 GSAP Timeline',     component: GsapDemo },
  { id: 'stagger',   label: '🚀 GSAP Stagger',       component: StaggerDemo },
  { id: 'reactive',  label: '⚡ 1K Reactive Nodes',  component: ReactivityDemo },
  { id: 'counter',   label: '🔢 Signal Counter',     component: CounterDemo },
  { id: 'virtual',   label: '📋 10K Virtual List',   component: VirtualList },
  { id: 'toggle',    label: '👁 Show / Conditional', component: ToggleDemo },
]

export default function App() {
  const [active, setActive] = createSignal('gsap')
  const current = createMemo(() => sections.find(s => s.id === active()))

  return (
    <div style={{ 'min-height': '100vh', display: 'flex', 'flex-direction': 'column', background: '#f9fafb' }}>

      {/* Header */}
      <header style={{ background: '#fff', 'border-bottom': '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', 'align-items': 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: '#4f46e5', 'border-radius': '8px' }} />
        <h1 style={{ margin: 0, 'font-size': '18px', 'font-weight': '700', color: '#111827' }}>SolidJS Performance Lab</h1>
        <span style={{ 'margin-left': 'auto', 'font-size': '12px', color: '#9ca3af' }}>No Virtual DOM · Fine-grained Reactivity</span>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <nav style={{ width: '200px', background: '#fff', 'border-right': '1px solid #e5e7eb', padding: '16px', display: 'flex', 'flex-direction': 'column', gap: '4px' }}>
          <For each={sections}>
            {s => (
              <button
                onClick={() => setActive(s.id)}
                style={{
                  'text-align': 'left',
                  padding: '8px 12px',
                  'border-radius': '8px',
                  'font-size': '13px',
                  'font-weight': '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  background: active() === s.id ? '#4f46e5' : 'transparent',
                  color: active() === s.id ? '#fff' : '#4b5563',
                }}
              >
                {s.label}
              </button>
            )}
          </For>
        </nav>

        {/* Main */}
        <main style={{ flex: 1, padding: '40px', display: 'flex', 'align-items': 'center', 'justify-content': 'center' }}>
          <div style={{ width: '100%', 'max-width': '640px', background: '#fff', 'border-radius': '16px', 'box-shadow': '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', padding: '32px' }}>
            <h2 style={{ margin: '0 0 20px', 'padding-bottom': '16px', 'border-bottom': '1px solid #e5e7eb', 'font-size': '16px', 'font-weight': '600', color: '#1f2937' }}>
              {current()?.label}
            </h2>
            <Show when={current()}>
              {() => { const C = current().component; return <C /> }}
            </Show>
          </div>
        </main>

      </div>
    </div>
  )
}
