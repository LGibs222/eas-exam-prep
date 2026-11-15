import { useEffect, useState } from 'react'

// Per-concept media for the lesson player: a teaching diagram, a case photo,
// or both. Keyed `${module name}::${concept title}`. A concept with no entry
// shows its text only; nothing decorative is added.
//
// Each entry:
//   Diagram   component taking { step, focus }
//   steps     one value per beat (screen) of the concept: how far the diagram
//             is built on that screen, or null to hide it there
//   focus     optional, per beat: indexes to emphasize (the rest dim)
//   finalStep the fully built state, used by the one-page view
//   caption   optional line under the diagram
// Every label is taken from the concept's own verified text. Bars are used
// only where the text gives real quantities.

function useNarrow() {
  const q = '(max-width: 640px)'
  const [n, setN] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q), fn = e => setN(e.matches)
    m.addEventListener('change', fn); return () => m.removeEventListener('change', fn)
  }, [])
  return n
}

// Mounts at step 0 and moves to the requested step on the next frame, so a
// diagram animates in the first time it appears as well as between screens.
export function DiagramHost({ media, step, focus }) {
  const [s, setS] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setS(step)); return () => cancelAnimationFrame(id) }, [step])
  const D = media.Diagram
  return (
    <div className="lp-diawrap">
      <D step={s} focus={focus} />
      {media.caption && <p className="lp-diacap">{media.caption}</p>}
    </div>
  )
}

// ── generic diagrams ────────────────────────────────────────────────────────
// Ordered sequence: numbered items revealed left to right.
const seq = (items, axis) => function Sequence({ step, focus }) {
  return (
    <div className="lp-seq" style={{ '--n': items.length }} role="img" aria-label={items.map((it, i) => `${i + 1}. ${it[0]}`).join('. ')}>
      {items.map(([t, s], i) => (
        <div key={i} className={'lp-seq-i' + (i < step ? ' on' : '') + (focus && !focus.includes(i) ? ' dim' : '')} style={{ transitionDelay: `${i * 90}ms` }}>
          <b>{String(i + 1).padStart(2, '0')}</b><span className="t">{t}</span>{s && <span className="s">{s}</span>}
        </div>
      ))}
      {axis && <div className={'lp-axis' + (step >= items.length ? ' on' : '')}><span>{axis[0]}</span><i /><span>{axis[1]}</span></div>}
    </div>
  )
}

// Side-by-side comparison: step n shows n columns, one more shows the rule.
const cmp = (cols, rule) => function Compare({ step }) {
  return (
    <div className="lp-cmp" style={{ '--n': cols.length }} role="img" aria-label={cols.map(c => `${c[0]}: ${c[1].join('; ')}`).join('. ')}>
      {cols.map(([title, points, tag], i) => (
        <div key={i} className={'lp-cmp-c' + (i < step ? ' on' : '')} style={{ transitionDelay: `${i * 120}ms` }}>
          {tag && <span className="tag">{tag}</span>}
          <h4>{title}</h4>
          <ul>{points.map((p, k) => <li key={k}>{p}</li>)}</ul>
        </div>
      ))}
      {rule && <p className={'lp-rule' + (step > cols.length ? ' on' : '')}>{rule}</p>}
    </div>
  )
}

// Proportional bars, for quantities the text states.
const bars = (rows, rule) => function Bars({ step, focus }) {
  const max = Math.max(...rows.map(r => r[2]))
  return (
    <div className="lp-bars" role="img" aria-label={rows.map(r => `${r[0]}: ${r[3]}`).join('. ')}>
      {rows.map(([t, s, v, label], i) => (
        <div key={i} className={'lp-bar' + (i < step ? ' on' : '') + (focus && !focus.includes(i) ? ' dim' : '')} style={{ transitionDelay: `${i * 110}ms` }}>
          <div className="lab"><b>{t}</b>{s && <span>{s}</span>}</div>
          <div className="trk"><i style={{ width: i < step ? `${(v / max) * 100}%` : 0, transitionDelay: `${i * 110}ms` }} /><em>{label}</em></div>
        </div>
      ))}
      {rule && <p className={'lp-rule' + (step > rows.length ? ' on' : '')}>{rule}</p>}
    </div>
  )
}

// ── bespoke: BICS vs. CALP ──────────────────────────────────────────────────
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
const LAF = 'Language Acquisition Foundations'
const ELLA = 'ELL Assessment, Program Models & Collaboration'
const UDL = 'Inclusive, Evidence-Based Instruction & UDL'
const DIV = 'Diversity as an Asset & School-Community Collaboration'
const DIS = 'Disability Characteristics & Individualized Instruction'
const LAW = 'Disability Law, RtI/PBIS & the CSE Process'
const KNOW = 'Knowing Learners & Building Classroom Community'
const RESP = 'Teacher Responsibilities: Legal & Ethical Judgment'
const COLLAB = 'Collaboration, Assistive Technology & Service Delivery'

export const LESSON_MEDIA = {
  [`${LAF}::BICS vs. CALP`]: {
    Diagram: BicsCalpTimeline, steps: [1, 2, 3, 3], finalStep: 3,
    caption: 'How long each kind of language takes to develop (Cummins).',
    photo: { src: `${base}media/bics-calp.jpg`, alt: 'Children talking on a school playground at recess' },
  },
  [`${LAF}::Stages of Second-Language Acquisition`]: {
    Diagram: seq([
      ['Pre-production', 'Silent period, nonverbal responses'],
      ['Early Production', 'One- to two-word responses'],
      ['Speech Emergence', 'Simple sentences, errors still prominent'],
      ['Intermediate Fluency', 'Complex sentences, content gaps remain'],
      ['Advanced Fluency', 'Near-native command'],
    ]),
    steps: [null, 5, 5, 5], focus: [null, [0, 3], null, null], finalStep: 5,
    caption: 'Five stages of the Natural Approach (Krashen and Terrell).',
  },
  [`${LAF}::Types and Benefits of Bilingualism`]: {
    Diagram: cmp([
      ['Additive', ['A second language is acquired without displacing the first', 'Associated with metalinguistic awareness and strong academic outcomes']],
      ['Subtractive', ['English acquisition erodes the home language', 'Associated with loss of family communication and weaker long-term outcomes']],
    ]),
    steps: [2, null, null, null, 2], finalStep: 2,
  },
  [`${ELLA}::NYS Proficiency Levels and the WIDA Assessment Transition`]: {
    Diagram: seq([
      ['Entering'], ['Emerging'], ['Transitioning'],
      ['Expanding', 'Exit with a proficient 3-8 ELA score or 65+ on the ELA Regents'],
      ['Commanding', 'Exit on the annual assessment'],
    ]),
    steps: [5, null, null, 5, 5], focus: [null, null, null, null, [3, 4]], finalStep: 5,
    caption: "New York's five Part 154 proficiency levels.",
  },
  [`${ELLA}::ENL Program Models: Integrated and Stand-Alone`]: {
    Diagram: bars([
      ['Entering', 'Integrated plus Stand-Alone', 360, '360'],
      ['Emerging', 'Integrated plus Stand-Alone', 360, '360'],
      ['Transitioning', 'Integrated, Stand-Alone permitted', 180, '180'],
      ['Expanding', 'Integrated', 180, '180'],
      ['Commanding / Former ELL', 'Integrated', 90, '90'],
    ]),
    steps: [null, null, 5, 5, null], finalStep: 5,
    caption: 'Required ENL minutes per week, grades K-8 (Part 154 Units of Study).',
  },
  [`${ELLA}::Bilingual Program Models: Transitional and Dual Language`]: {
    Diagram: cmp([
      ['Transitional Bilingual Education', ['Home language is a temporary bridge to English', 'Home-language support is phased out as English develops']],
      ['Dual Language', ['Develops bilingualism, biliteracy, and cross-cultural competence', 'Two languages on a sustained ratio across subjects and grades']],
    ], 'Families may decline bilingual instruction and still receive required ENL services.'),
    steps: [1, 1, 2, 2, 3], finalStep: 3,
  },
  [`${ELLA}::The NYS ELL Pathway: Identification, Placement, and Exit`]: {
    Diagram: seq([
      ['Home Language Questionnaire', 'Given to parents'],
      ['Student interview', 'In English and the home language'],
      ['Language Proficiency Team', 'For students with disabilities'],
      ['NYSITELL', 'Given once, in person'],
      ['Placement', 'After a parent orientation'],
      ['Annual proficiency test', 'Every year'],
      ['Exit', 'Two routes only'],
    ]),
    steps: [2, 4, 4, 5, 6, 7], finalStep: 7,
  },
  [`${UDL}::Universal Design for Learning (UDL)`]: {
    Diagram: cmp([
      ['Representation', ['Text, visuals, audio, and manipulatives'], 'The what'],
      ['Action and Expression', ['Writing, speech, drawing, or digital tools'], 'The how'],
      ['Engagement', ['Choice, relevance, and appropriate challenge'], 'The why'],
    ], 'Built into the lesson for all learners. It does not replace IEPs or 504 plans.'),
    steps: [null, 3, 3, 4], finalStep: 4,
  },
  [`${UDL}::Research-Based vs. Evidence-Based Practice`]: {
    Diagram: cmp([
      ['Research-based', ['Systematic observation or experiment', 'Rigorous data analysis and replicated results', 'Published in a peer-reviewed journal']],
      ['Evidence-based', ['Empirically shown to improve learner outcomes', 'Not necessarily systematic experiments or peer-reviewed publication']],
    ]),
    steps: [null, 2, null, null, null], finalStep: 2,
  },
  [`${DIV}::Teaching Appreciation of Diversity: Banks' Approaches and Dignity Act Instruction`]: {
    Diagram: seq([
      ['Contributions', 'Heroes, holidays, isolated elements'],
      ['Additive', 'Content added, structure unchanged'],
      ['Transformation', "Studied from several groups' perspectives"],
      ['Social action', 'Students decide and act on issues'],
    ]),
    steps: [null, 2, 4, 4, null], focus: [null, null, null, [2, 3], null], finalStep: 4,
    caption: "Banks' four approaches to multicultural curriculum reform.",
  },
  [`${DIS}::Curriculum Modifications vs. Accommodations`]: {
    Diagram: cmp([
      ['Accommodation', ['Changes how a student accesses or demonstrates learning', 'Grade-level standard is not altered', 'Extended time, large print, text-to-speech']],
      ['Modification', ['Changes what the student is expected to learn', 'Reduced content, alternate grading scale', 'May have implications for diploma type']],
    ]),
    steps: [1, 2, 2, null, 2], finalStep: 2,
  },
  [`${DIS}::Response to Intervention (RtI) & Multi-Tiered Support Systems`]: {
    Diagram: bars([
      ['Tier 1', 'Core instruction for all students', 100, 'All students'],
      ['Tier 2', 'Targeted small-group intervention', 15, 'Roughly 15%'],
      ['Tier 3', 'Intensive, individualized intervention', 5, 'About 5%'],
    ]),
    steps: [null, 3, null, 3, 3], finalStep: 3,
  },
  [`${DIS}::Least Restrictive Environment (LRE) & Continuum of Services`]: {
    Diagram: seq([
      ['General education', 'With related services and aids'],
      ['Consultant teacher'],
      ['Resource room'],
      ['Integrated co-teaching'],
      ['Special class'],
      ['Separate school'],
      ['Home or hospital'],
    ], ['Least restrictive', 'Most restrictive']),
    steps: [null, 7, 7, null, null], finalStep: 7,
  },
  [`${LAW}::IDEA 2004: Core Protections & Eligibility`]: {
    Diagram: cmp([
      ['One of the 13 classifications', ['For example learning disability, autism, emotional disability'], 'Prong 1'],
      ['Need for special education', ['The disability adversely affects educational performance'], 'Prong 2'],
    ]),
    steps: [null, 2, null, null, null], finalStep: 2,
  },
  [`${LAW}::Section 504 of the Rehabilitation Act`]: {
    Diagram: cmp([
      ['Section 504', ['Civil rights statute', 'Impairment that substantially limits a major life activity', '504 Plan: accommodations and related aids and services', 'No measurable annual goals required']],
      ['IDEA', ['13 disability classifications', 'Specially designed instruction with related services', 'Delivered through an IEP']],
    ]),
    steps: [1, 2, 2, 2, 2], finalStep: 2,
  },
  [`${LAW}::The CSE Process: Referral, Evaluation & IEP Development`]: {
    Diagram: seq([
      ['Written referral'],
      ['Parental consent'],
      ['Evaluation', 'Within 60 calendar days of consent'],
      ['Services arranged', 'Within 60 school days of consent'],
      ['IEP review', 'At least annually'],
      ['Reevaluation', 'At least triennially'],
    ]),
    steps: [null, 1, 4, 4, 6], finalStep: 6,
  },
  [`${LAW}::Discipline Protections, FBA/BIP & NYS Limits on Restraint`]: {
    Diagram: seq([
      ['Up to 10 consecutive school days', 'Removed as any student would be'],
      ['More than 10 school days', 'A disciplinary change in placement'],
      ['Manifestation review', 'Within 10 school days of the decision'],
      ['FBA and BIP', 'If the conduct was a manifestation'],
    ]),
    steps: [1, 3, 4, 4, 4, null, null], finalStep: 4,
  },
  [`${KNOW}::Teacher Self-Reflection to Strengthen Practice`]: {
    Diagram: seq([['Collect evidence'], ['Analyze patterns'], ['Revise practice'], ['Observe the impact'], ['Repeat']]),
    steps: [null, 5, null, null], finalStep: 5,
  },
  [`${RESP}::Mandated Reporting of Suspected Child Abuse and Maltreatment`]: {
    Diagram: seq([
      ['Reasonable cause to suspect', 'Not certainty'],
      ['Call the SCR immediately', '1-800-635-1522'],
      ['Written report', 'Within 48 hours, form LDSS-2221A'],
      ['Notify the person in charge of the school', 'After making the report'],
    ]),
    steps: [3, 3, 4, 4, null, null], focus: [null, [0], [3], null, null, null], finalStep: 4,
  },
  [`${COLLAB}::Service-Delivery Models Under IDEA & NYS Regulations`]: {
    Diagram: seq([
      ['Consultant Teacher', 'At least two hours per week'],
      ['Resource Room', 'No more than five students per teacher'],
      ['Integrated Co-Teaching', 'No more than 12 students with disabilities'],
      ['Special Class', 'Ratios matched to need'],
    ], ['Least restrictive', 'Most restrictive']),
    steps: [null, 1, 2, 3, 4, 4], finalStep: 4,
  },
}

export const mediaFor = (domain, title) => LESSON_MEDIA[`${domain}::${title}`] || null
