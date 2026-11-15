import { useEffect, useState } from 'react'

// Per-concept media for the lesson player: an animated teaching diagram, a
// case photo, or both. Keyed `${module name}::${concept title}`. A concept
// with no entry simply shows its text; nothing decorative is added.
//
// A diagram is a component taking { step }. `steps` maps each beat (screen)
// of the concept to the diagram step it should show.

function useNarrow() {
  const q = '(max-width: 640px)'
  const [n, setN] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q), fn = e => setN(e.matches)
    m.addEventListener('change', fn); return () => m.removeEventListener('change', fn)
  }, [])
  return n
}

// Two timelines and the gap. Steps: 0 axis, 1 BICS, 2 CALP, 3 the gap at year 3.
// Green = social language, gold = academic language, red = the gap.
function BicsCalpTimeline({ step = 0 }) {
  const narrow = useNarrow()
  // Phones get a smaller, taller drawing so the labels stay readable.
  const g = narrow ? { W: 392, x0: 66, dx: 45, H: 300 } : { W: 720, x0: 96, dx: 82, H: 280 }
  const x = y => g.x0 + y * g.dx
  const on = n => 'fade' + (step >= n ? ' on' : '')
  const w = (n, a, b) => (step >= n ? x(b) - x(a) : 0)
  return (
    <svg className="lp-dia" viewBox={`0 0 ${g.W} ${g.H}`} role="img"
      aria-label="Timeline: social language (BICS) develops in 1 to 3 years; academic language (CALP) takes 5 to 7 years. At year 3 a student can sound fluent while academic language is still 2 to 4 years away.">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(y => (
        <g key={y}><line className="axis" x1={x(y)} y1="52" x2={x(y)} y2="236" /><text x={x(y)} y="256" textAnchor="middle">{y}</text></g>
      ))}
      <text x={x(7)} y="276" textAnchor="end">years learning English</text>
      <text className="lab" x="0" y="100">BICS</text><text className="sub" x="0" y="117">social</text>
      <rect className="bar" x={x(0)} y="84" height="28" width={w(1, 0, 1)} fill="var(--green)" />
      <rect className="bar" x={x(1)} y="84" height="28" width={w(1, 1, 3)} fill="var(--green)" opacity=".32" />
      <text className={on(1)} x={x(3) + 8} y="103">1 to 3 years</text>
      <text className="lab" x="0" y="180">CALP</text><text className="sub" x="0" y="197">academic</text>
      <rect className="bar" x={x(0)} y="164" height="28" width={w(2, 0, 5)} fill="var(--gold)" />
      <rect className="bar" x={x(5)} y="164" height="28" width={w(2, 5, 7)} fill="var(--gold)" opacity=".32" />
      <text className={on(2)} x={x(5) + 6} y="156">5 to 7 years</text>
      <g className={on(3)}>
        <line className="now" x1={x(3)} y1="40" x2={x(3)} y2="236" />
        <text className="lab" x={x(3)} y="30" textAnchor="middle" style={{ fontSize: 13 }}>Year 3: sounds fluent</text>
        <rect className="gapbox" x={x(3)} y="160" width={x(7) - x(3)} height="36" rx="3" />
        <text className="gaptext" x={narrow ? x(7) : x(5)} y="222" textAnchor={narrow ? 'end' : 'middle'}>
          {narrow ? '2 to 4 more years of CALP' : '2 to 4 more years of academic language'}
        </text>
      </g>
    </svg>
  )
}

const base = import.meta.env.BASE_URL

export const LESSON_MEDIA = {
  'Language Acquisition Foundations::BICS vs. CALP': {
    Diagram: BicsCalpTimeline,
    steps: [1, 2, 3, 3],
    finalStep: 3,
    caption: 'How long each kind of language takes to develop (Cummins).',
    photo: { src: `${base}media/bics-calp.jpg`, alt: 'Children talking on a school playground at recess' },
  },
}

export const mediaFor = (domain, title) => LESSON_MEDIA[`${domain}::${title}`] || null
