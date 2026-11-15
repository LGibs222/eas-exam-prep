import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MasteryMap } from './Engagement.jsx'
import { playTTSAsync, stopTTS, setTTSRate } from './TTS.jsx'
import { mediaFor, DiagramHost } from './lessonMedia.jsx'
import './lesson.css'

// Lesson player: a concept is taught one idea per screen.
//   intro -> beats (the concept text, cut by scripts/build-lessons.cjs) -> case
//   -> key terms -> sort -> check
// "One page" shows the same content as a single reading column for review.
// Narration reads the current screen block by block through the read-aloud
// backend, highlights the block being read, and carries on through the
// teaching screens until it reaches one that needs a response.

const RATES = [1, 1.25, 1.5, 0.85]
const VIEW_KEY = 'ol-lesson-view'

// "(1) a; (2) b; (3) c. Then more." -> intro, list items, closing text.
function splitEnum(text) {
  const marks = [...text.matchAll(/\((\d)\)\s/g)]
  if (marks.length < 3 || marks[0][1] !== '1') return null
  const seq = []
  for (const m of marks) { if (+m[1] === seq.length + 1) seq.push(m); else break }
  if (seq.length < 3) return null
  const intro = text.slice(0, seq[0].index).trim()
  const items = seq.map((m, i) => text.slice(m.index + m[0].length, i + 1 < seq.length ? seq[i + 1].index : undefined).trim())
  let outro = ''
  const last = items[items.length - 1], cut = last.search(/[.?!]\s+(?=[A-Z])/)
  if (cut > -1) { outro = last.slice(cut + 1).trim(); items[items.length - 1] = last.slice(0, cut + 1) }
  return { intro, items: items.map(s => s.replace(/[;,]?\s*(and)?$/, '').replace(/;$/, '')), outro }
}

function BeatText({ text, solo, speaking }) {
  const e = useMemo(() => splitEnum(text), [text])
  const cls = 'lp-text' + (solo ? ' solo' : '')
  if (!e) return <p className={cls + (speaking ? ' speaking' : '')} data-say>{text}</p>
  return (
    <div data-say className={speaking ? 'speaking' : ''}>
      {e.intro && <p className={cls}>{e.intro}</p>}
      <ol className="lp-list">{e.items.map((it, i) => <li key={i}><span>{it}</span></li>)}</ol>
      {e.outro && <p className="lp-text" style={{ marginTop: 16 }}>{e.outro}</p>}
    </div>
  )
}

// One item at a time, any number of categories.
function Sorter({ categorize, onComplete }) {
  const { categories, items } = categorize
  const [k, setK] = useState(0)
  const [res, setRes] = useState([])
  const [pick, setPick] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const done = k >= items.length
  const choose = id => {
    if (pick) return
    const ok = id === items[k].correct, next = [...res, ok]
    setPick(id); setRes(next)
    timer.current = setTimeout(() => {
      setPick(null); setK(k + 1)
      if (k + 1 >= items.length) onComplete?.({ correct: next.filter(Boolean).length, total: items.length })
    }, ok ? 1400 : 2800)
  }
  const again = () => { setK(0); setRes([]); setPick(null) }
  return (
    <div>
      <div className="lp-count">{done ? 'Done' : `${k + 1} of ${items.length}`}</div>
      <div className="lp-item"><span key={k}>{done ? `${res.filter(Boolean).length} of ${items.length} sorted correctly.` : items[k].text}</span></div>
      {!done && (
        <div className="lp-choices">
          {categories.map(c => {
            const state = !pick ? '' : c.id === items[k].correct ? 'right' : c.id === pick ? 'wrong' : ''
            return <button key={c.id} className={state} disabled={!!pick} onClick={() => choose(c.id)}>{c.label}</button>
          })}
        </div>
      )}
      <p className="lp-why" aria-live="polite">
        {done ? <button className="lp-chip" onClick={again}>Sort again</button> : pick ? items[k].explanation : ''}
      </p>
      <div className="lp-dots" aria-hidden="true">{items.map((_, i) => <i key={i} className={res[i] === undefined ? '' : res[i] ? 'ok' : 'no'} />)}</div>
    </div>
  )
}

const RATINGS = [['got-it', 'Got it', 'g'], ['almost', 'Almost', 'a'], ['review', 'Review again', 'r']]

function Check({ quickCheck, rating, onRate, speaking }) {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)
  return (
    <div>
      <p className={'lp-q' + (speaking ? ' speaking' : '')} data-say>{quickCheck.prompt}</p>
      {!open && (
        <div className="lp-row">
          <button className="lp-solid" onClick={() => setOpen(true)}>Show the model answer</button>
          {quickCheck.hint && <button className="lp-chip" aria-pressed={hint} onClick={() => setHint(h => !h)}>Hint</button>}
        </div>
      )}
      {hint && !open && <p className="lp-hint">{quickCheck.hint}</p>}
      <div className={'lp-answer' + (open ? ' open' : '')}><div>
        <p>{quickCheck.answer}</p>
        <div className="lp-rate">
          <span className="lp-eyebrow">How did you do?</span>
          <div className="lp-row">
            {RATINGS.map(([id, label, c]) => (
              <button key={id} className={c} aria-pressed={rating === id} onClick={() => onRate?.(id)}>{label}</button>
            ))}
          </div>
        </div>
      </div></div>
    </div>
  )
}

function buildSteps(concept, lesson) {
  const s = [{ k: 'intro' }]
  lesson.beats.forEach((_, i) => s.push({ k: 'beat', i }))
  if (concept.example) s.push({ k: 'case' })
  if (concept.keyTerms?.length) s.push({ k: 'terms' })
  if (concept.categorize) s.push({ k: 'sort' })
  if (concept.quickCheck) s.push({ k: 'check' })
  return s
}

// The strings narration reads on a screen. Every one is a literal from the
// content data, which is what the backend checks before voicing it.
function blocksFor(step, concept, lesson) {
  if (step.k === 'intro') return [concept.title, lesson.lead].filter(Boolean)
  if (step.k === 'beat') { const b = lesson.beats[step.i]; return [b.head, b.text].filter(Boolean) }
  if (step.k === 'case') return [concept.example]
  if (step.k === 'check') return [concept.quickCheck.prompt]
  return []
}

export default function LessonPlayer({ domain, concepts, enhancements, lessons, progress, onConceptView, onConceptRate, onBack, onStartPractice }) {
  const [ci, setCi] = useState(0)
  const [si, setSi] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [view, setView] = useState(() => { try { return localStorage.getItem(VIEW_KEY) || 'steps' } catch { return 'steps' } })
  const [listening, setListening] = useState(false)
  const [active, setActive] = useState(-1)
  const [rate, setRate] = useState(0)
  const run = useRef(0)

  const full = i => ({ ...concepts[i], ...(enhancements?.[i] || {}) })
  const lessonOf = i => lessons?.[i] || { lead: null, beats: [{ head: null, text: concepts[i].body }] }
  const concept = full(ci), lesson = lessonOf(ci)
  const media = mediaFor(domain, concept.title)
  const steps = useMemo(() => buildSteps(concept, lesson), [domain, ci])
  const step = steps[Math.min(si, steps.length - 1)]
  const blocks = useMemo(() => blocksFor(step, concept, lesson), [domain, ci, si])
  const lastConcept = ci === concepts.length - 1, lastStep = si >= steps.length - 1
  const rating = progress?.[ci]?.rating

  useEffect(() => { onConceptView?.(ci) }, [ci, domain])
  // A new screen starts at the top (long screens scroll on phones).
  useEffect(() => { try { window.scrollTo({ top: 0 }) } catch {} }, [ci, si, view])
  useEffect(() => { try { localStorage.setItem(VIEW_KEY, view) } catch {} }, [view])

  const halt = useCallback(() => { run.current++; stopTTS(); setActive(-1) }, [])
  useEffect(() => () => { run.current++; stopTTS() }, [])

  const goStep = n => {
    if (n < 0) { if (ci > 0) { const p = ci - 1; setCi(p); setSi(buildSteps(full(p), lessonOf(p)).length - 1) } return }
    if (n >= steps.length) { if (lastConcept) { halt(); onStartPractice?.() } else { setCi(ci + 1); setSi(0) } return }
    setSi(n)
  }
  const goConcept = i => { setCi(Math.max(0, Math.min(concepts.length - 1, i))); setSi(0); setShowMap(false) }

  // Narration follows the screen. While listening, each new screen is read
  // aloud; it moves on by itself through teaching screens and stops at a
  // screen that asks the learner to respond.
  useEffect(() => {
    halt()
    if (!listening || view !== 'steps') return
    if (!blocks.length) { setListening(false); return }
    const id = run.current
    ;(async () => {
      for (let i = 0; i < blocks.length; i++) {
        setActive(i)
        const ok = await playTTSAsync(blocks[i], `lp:${domain}:${ci}:${si}:${i}`)
        if (run.current !== id) return
        if (!ok) { setActive(-1); setListening(false); return }
      }
      setActive(-1)
      const next = steps[si + 1]
      if (step.k !== 'check' && next && (next.k === 'beat' || next.k === 'case')) setSi(si + 1)
      else setListening(false)
    })()
  }, [listening, ci, si, view, domain])

  useEffect(() => {
    if (view !== 'steps') return
    const onKey = e => {
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key === 'ArrowRight') goStep(si + 1)
      if (e.key === 'ArrowLeft') goStep(si - 1)
    }
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey)
  })

  const cycleRate = () => { const r = (rate + 1) % RATES.length; setRate(r); setTTSRate(RATES[r]) }
  const rateConcept = r => onConceptRate?.(ci, r)
  const sortDone = r => { if (r.correct === r.total && !rating) onConceptRate?.(ci, 'got-it') }
  const say = i => (active === i ? ' speaking' : '')
  const hasDiagram = !!media?.Diagram

  const header = (
    <>
      <div className="lp-top">
        <button className="lp-link" onClick={() => { halt(); onBack?.() }}>&larr; Study plan</button>
        <div className="lp-tools">
          <span className="lp-eyebrow" style={{ marginRight: 6 }}>Concept {ci + 1} of {concepts.length}</span>
          <button className="lp-chip" aria-pressed={showMap} onClick={() => setShowMap(s => !s)}>Map</button>
          <button className="lp-chip" aria-pressed={view === 'page'} onClick={() => { setListening(false); setView(v => (v === 'page' ? 'steps' : 'page')) }}>One page</button>
        </div>
      </div>
      {showMap && <MasteryMap domain={domain} concepts={concepts} progress={progress} onJumpTo={goConcept} color="var(--gold)" />}
    </>
  )

  if (view === 'page') {
    return (
      <div className="lp" style={{ minHeight: 0 }}>
        {header}
        <article className="lp-page" key={ci}>
          <span className="lp-eyebrow">{domain}</span>
          <h2 className="lp-title">{concept.title}</h2>
          {lesson.lead && <p className="lp-lead">{lesson.lead}</p>}
          {hasDiagram && <figure><DiagramHost media={media} step={media.finalStep} /></figure>}
          <div className="lp-beats">
            {lesson.beats.map((b, i) => (
              <div className="lp-beat" key={i}><div>{b.head && <p style={{ fontWeight: 800, marginBottom: 6 }}>{b.head}</p>}<BeatText text={b.text} /></div></div>
            ))}
          </div>
          {concept.example && <section><h3>Case</h3>
            {media?.photo && <img className="lp-caseimg" src={media.photo.src} alt={media.photo.alt} />}
            <p className="lp-text">{concept.example}</p></section>}
          {concept.keyTerms?.length > 0 && <section><h3>Terms</h3>
            <dl className="lp-terms">{concept.keyTerms.map((t, i) => <div key={i}><dt>{t.term}</dt><dd>{t.def}</dd></div>)}</dl></section>}
          {concept.categorize && <section><h3>Sort it</h3><Sorter categorize={concept.categorize} onComplete={sortDone} /></section>}
          {concept.quickCheck && <section><h3>Check yourself</h3><Check quickCheck={concept.quickCheck} rating={rating} onRate={rateConcept} /></section>}
          <div className="lp-pagenav">
            <button className="lp-nav" disabled={ci === 0} onClick={() => goConcept(ci - 1)}>Previous concept</button>
            {lastConcept
              ? <button className="lp-nav go" onClick={onStartPractice}>Practice questions</button>
              : <button className="lp-nav go" onClick={() => goConcept(ci + 1)}>Next concept</button>}
          </div>
        </article>
      </div>
    )
  }

  let screen
  if (step.k === 'intro') {
    screen = (
      <div className="lp-screen" key={`${ci}-intro`}>
        <span className="lp-eyebrow lp-kicker">{domain}</span>
        <h2 className={'lp-title' + say(0)} data-say>{concept.title}</h2>
        {lesson.lead && <p className={'lp-lead' + say(1)} data-say>{lesson.lead}</p>}
      </div>
    )
  } else if (step.k === 'beat') {
    const b = lesson.beats[step.i], hasHead = !!b.head
    // A diagram is built up across the screens it belongs to and hidden on
    // screens where steps[i] is null.
    const dStep = hasDiagram ? (media.steps ? media.steps[step.i] : media.finalStep) : null
    const showDia = dStep != null
    screen = (
      <div className="lp-screen lp-teach" key={`${ci}-beats`}>
        {showDia && <DiagramHost media={media} step={dStep} focus={media.focus?.[step.i] || null} />}
        <div className="lp-beatwrap" key={step.i}>
          {!showDia && <span className="lp-eyebrow lp-kicker">{concept.title}</span>}
          {hasHead && <h3 className={'lp-head' + say(0)} data-say>{b.head}</h3>}
          <BeatText text={b.text} solo={!hasHead && !showDia} speaking={active === (hasHead ? 1 : 0)} />
        </div>
      </div>
    )
  } else if (step.k === 'case') {
    screen = media?.photo ? (
      <div className="lp-screen lp-case" key={`${ci}-case`}>
        <img src={media.photo.src} alt={media.photo.alt} />
        <div><span className="lp-eyebrow lp-kicker">In the classroom</span><p className={'lp-text' + say(0)} data-say>{concept.example}</p></div>
      </div>
    ) : (
      <div className="lp-screen" key={`${ci}-case`}>
        <span className="lp-eyebrow lp-kicker">In the classroom</span>
        <p className={'lp-text solo' + say(0)} data-say>{concept.example}</p>
      </div>
    )
  } else if (step.k === 'terms') {
    screen = (
      <div className="lp-screen" key={`${ci}-terms`}>
        <span className="lp-eyebrow lp-kicker">Terms to know</span>
        <dl className="lp-terms">{concept.keyTerms.map((t, i) => <div key={i}><dt>{t.term}</dt><dd>{t.def}</dd></div>)}</dl>
      </div>
    )
  } else if (step.k === 'sort') {
    screen = (
      <div className="lp-screen lp-narrow" key={`${ci}-sort`}>
        <span className="lp-eyebrow lp-kicker">Sort it · {concept.categorize.title}</span>
        <Sorter categorize={concept.categorize} onComplete={sortDone} />
      </div>
    )
  } else {
    screen = (
      <div className="lp-screen lp-narrow" key={`${ci}-check`}>
        <span className="lp-eyebrow lp-kicker">Check yourself</span>
        <Check quickCheck={concept.quickCheck} rating={rating} onRate={rateConcept} speaking={active === 0} />
      </div>
    )
  }

  const nextLabel = !lastStep ? 'Next' : lastConcept ? 'Practice questions' : 'Next concept'
  return (
    <div className="lp">
      {header}
      <div className="lp-prog" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i <= si ? 'done' : ''} />)}</div>
      <div className="lp-stage">{screen}</div>
      <div className="lp-foot">
        <button className="lp-nav" disabled={ci === 0 && si === 0} onClick={() => goStep(si - 1)}>Back</button>
        <div className="lp-player">
          <button className="lp-pp" disabled={!blocks.length} aria-label={listening ? 'Pause narration' : 'Play narration'} onClick={() => setListening(l => !l)}>
            {listening
              ? <svg viewBox="0 0 14 14"><path d="M2 1h4v12H2zM8 1h4v12H8z" /></svg>
              : <svg viewBox="0 0 14 14"><path d="M2 1l11 6-11 6z" /></svg>}
          </button>
          <div className="lp-track"><i style={{ width: `${((si + 1) / steps.length) * 100}%` }} /></div>
          <span className="lp-meta">{listening ? 'Reading' : blocks.length ? 'Listen' : 'Your turn'}</span>
          <button className="lp-speed" aria-label="Narration speed" onClick={cycleRate}>{RATES[rate]}x</button>
        </div>
        <button className="lp-nav go" onClick={() => goStep(si + 1)}>{nextLabel}</button>
      </div>
    </div>
  )
}
