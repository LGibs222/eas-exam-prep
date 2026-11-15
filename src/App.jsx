import { useState, useEffect, useMemo } from "react";
import { TTSButton } from "./TTS.jsx";
import { Icon, ModuleIcon } from "./icons.jsx";
import { MODULE_ENHANCEMENTS } from "./data/moduleEnhancements.js";
import { LESSONS } from "./data/lessons.js";
import LessonPlayer from "./LessonPlayer.jsx";
import { track, getUser } from "./tracking.js";

// ─── DESIGN SYSTEM (OneLove "Blue Hour" brand system, ported from BCBA) ──
// Theme-switching tokens resolve to CSS variables (defined in GlobalStyles);
// fixed warm accents stay concrete. Dark mode flips the vars via [data-theme].
const T = {
  paper:'var(--bg)', paper2:'var(--surface-2)', paper3:'var(--surface)',
  ink:'var(--text)', ink2:'var(--muted)',
  orange:'var(--accent)', orange2:'var(--accent-2)',
  rule:'var(--border)', muted:'var(--muted)',
  green:'var(--green)', greenBg:'var(--green-bg)',
  red:'var(--red)', redBg:'var(--red-bg)',
  hairline:'var(--border)',
  glass:'var(--surface)', solid:'var(--surface-solid)', shadow:'var(--shadow)',
  // Blue Hour sets everything in Plus Jakarta Sans; the serif key is kept so
  // existing call sites need no change.
  serif:`'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif`,
  sans:`'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif`,
};

const baseStyles = {
  html: { background: 'var(--bg)', color: 'var(--text)', fontFamily: T.sans, WebkitFontSmoothing: 'antialiased' },
  cap: { fontFamily: T.sans, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700 },
  capSm: { fontFamily: T.sans, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, color: T.muted },
  ital: { fontStyle: 'italic', fontWeight: 400 },
};

// ═══════════════════════════════════════════════════════════════
// EXAM CONTENT · Edit this block to fork a new exam app.
// Everything below the ENGINE divider is generic and can be copied verbatim.
// AUTO-GENERATED for EAS by cst-rebuild/eas-assemble.cjs.

const SUBTESTS = {
  "C1": {
    "label": "Diverse Student Populations",
    "roman": "I"
  },
  "C2": {
    "label": "English Language Learners",
    "roman": "II"
  },
  "C3": {
    "label": "Students with Disabilities & Other Special Learning Needs",
    "roman": "III"
  },
  "C4": {
    "label": "Teacher Responsibilities & School–Home Relationships",
    "roman": "IV & V"
  }
};

const WELCOME = {
  "imprint": "New York State · NYSTCE Educating All Students (EAS · Field 201)",
  "title": {
    "pre": "Educating All",
    "italic": "Students",
    "post": ""
  },
  "subtitle": "A complete preparation course for the NYSTCE Educating All Students (EAS, field 201) test: five competencies, forty selected-response items, and three constructed-response assignments.",
  "alignment": [
    "NYSTCE EAS 201 Framework",
    "Diverse Learners · ELLs · SWD",
    "5 Competencies"
  ],
  "steps": [
    [
      "Take the Pretest",
      "Thirty questions across all five competencies establish your baseline."
    ],
    [
      "Review Your Results",
      "A competency-by-competency analysis shows precisely where to focus."
    ],
    [
      "Study the Modules",
      "Eleven modules with concept summaries and exam-style practice. Flagged areas come first."
    ],
    [
      "Take the Post-Test",
      "Thirty fresh questions measure your growth. Then drill the three written assignments."
    ]
  ],
  "subareasHeading": "The Five Competencies",
  "subareaWord": "Competency",
  "posttestIntro": "fresh questions across the five competencies. Demonstrate the growth of your study.",
  "crSubtitle": "Three scenario-based written assignments · identify, describe, explain",
  "colophon": "Built by OneLove Behavior Analysts, PLLC as an independent study aid for the NYSTCE Educating All Students (EAS) test, aligned to the official EAS (field 201) test framework.",
  "testFacts": {
    "heading": "The EAS 201 at a Glance",
    "tables": [
      {
        "title": "Format",
        "rows": [
          [
            "Selected-response items",
            "40 scored"
          ],
          [
            "Constructed-response",
            "3 written (~150–200 words)"
          ],
          [
            "Testing time",
            "2 hours 15 minutes"
          ],
          [
            "Delivery",
            "Computer-based (CBT)"
          ],
          [
            "Passing score",
            "520 (scale 400–600)"
          ]
        ]
      },
      {
        "title": "Score Weighting",
        "rows": [
          [
            "Selected-response",
            "70% of total"
          ],
          [
            "Constructed-response",
            "30% (10% each)"
          ],
          [
            "Diverse Populations",
            "18% SR + 1 CR"
          ],
          [
            "English Language Learners",
            "18% SR + 1 CR"
          ],
          [
            "Students w/ Disabilities",
            "18% SR + 1 CR"
          ],
          [
            "Teacher Responsibilities",
            "8% SR"
          ],
          [
            "School-Home Relationships",
            "8% SR"
          ]
        ]
      }
    ],
    "note": "Constructed-response assignments come from the first three competencies (one each). Competencies IV and V are selected-response only and are studied together in this course. Figures reflect the official EAS (201) test design."
  }
};

const PRETEST = [
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Ms. Okafor notices that several of her Black and Latino students rarely volunteer answers during whole-class discussion, yet they actively engage and demonstrate mastery in small-group work. Which action best reflects culturally responsive teaching?",
    "a": [
      "Contact families to explain that verbal participation in class is required for success.",
      "Refer students to the school counselor to investigate whether anxiety is limiting participation.",
      "Incorporate varied participation structures, such as partner talk, small groups, and written responses, to honor diverse cultural communication norms.",
      "Continue whole-class discussion as the primary participation structure, since comfort speaking before the full group is what later grades and standardized testing situations will demand of these students."
    ],
    "c": 2,
    "r": "The correct answer is right because culturally responsive pedagogy recognizes that participation norms vary across cultures; students may learn well through collectivist or collaborative structures rather than competitive public recitation. The strongest distractor is wrong: it ignores documented cultural variability in discourse styles and frames one narrow participation mode as the only legitimate one. Another option medicalizes a cultural difference without evidence of a disability or disorder."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "Mr. Rivera assigns a weekend project requiring students to visit a local museum and submit a reflection. Three students inform him they cannot afford admission. What is the most appropriate response?",
    "a": [
      "Excuse those students from the assignment and give them an alternate grade.",
      "Redesign the task so all students can access equivalent learning through free digital resources or virtual museum tours.",
      "Contact the museum to request a school discount or reduced-cost admission, and quietly offer the three students help covering whatever balance remains.",
      "Ask the school social worker to apply for emergency funds to cover admission for those three students."
    ],
    "c": 1,
    "r": "The correct answer is right because equity requires that instructional tasks do not create barriers based on socioeconomic status; redesigning for universal access upholds this principle and maintains the same learning objective for all students. The strongest distractor is wrong: it partially helps yet still may not resolve the barrier and does not address the principle of equitable design from the outset."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "During small-group work, a teacher overhears a Black student fluidly shifting between African American English with peers and more formal academic English when presenting to the class. A colleague later remarks that the student \"needs to be corrected\" whenever the home dialect appears. Which response best reflects an asset-based view of linguistic diversity?",
    "a": [
      "Discourage dialect use in all classroom contexts while acknowledging its value at home and in the community.",
      "Refer the student for a speech-language screening to determine whether the dialect reflects a language delay.",
      "Recognize the student's code-switching as evidence of sophisticated sociolinguistic competence, and teach registers explicitly as choices suited to audience and purpose rather than treating the home dialect as an error.",
      "Agree with the colleague and correct the home dialect consistently whenever it appears, since a single academic standard is what students will ultimately be graded against on state assessments."
    ],
    "c": 2,
    "r": "Shifting deliberately between language varieties by audience is a linguistic strength, not a deficit; culturally responsive practice treats home dialects as rule-governed systems and teaches academic English as an additional register. Constant correction frames the student's identity as an error and is associated with disengagement, a ban in \"all classroom contexts\" contradicts the asset stance, and a dialect difference is not a disorder, so a speech-language referral is unfounded."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "A teacher in a high-poverty urban school notices that few families attend parent-teacher conferences. Which interpretation and action is most aligned with research on family engagement?",
    "a": [
      "Families may face structural barriers such as work schedules, transportation, or distrust of institutions; offer flexible meeting times, home visits, or community-based locations.",
      "Interpret the low attendance as limited parental investment in schooling and send home a strongly worded letter emphasizing how much family involvement matters to student achievement.",
      "Students whose parents do not attend conferences should receive additional homework to compensate for less home support.",
      "Report persistent non-attendance to the principal as a potential neglect concern."
    ],
    "c": 0,
    "r": "The correct answer is right because research consistently shows that non-attendance correlates with structural barriers, not lack of care; offering flexible, community-accessible options removes barriers and builds trust. The strongest distractor is wrong: it misattributes absence to deficit parenting, which is both inaccurate and harmful to the teacher–family relationship."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "Ms. Delgado has a student who finishes every assignment in half the allotted time, asks complex extension questions, and still earns high marks. The student recently expressed that class is \"boring.\" Which response best addresses this student's needs?",
    "a": [
      "Praise the student's achievement and remind them that patience is a virtue.",
      "Recommend the student for the school's gifted and talented program and simultaneously provide curriculum compacting and tiered tasks in the current classroom.",
      "Allow the student to assist other students as a peer tutor during free time.",
      "Assign additional practice problems drawn from the same grade-level material, since consolidating current skills through extended repetition keeps a fast finisher productively occupied."
    ],
    "c": 1,
    "r": "The correct answer is right because gifted learners require curriculum compacting (removing already-mastered content) and tiered or accelerated tasks to maintain engagement and growth, while a gifted program referral addresses long-term placement. The strongest distractor is wrong: using the student as a peer tutor manages classroom logistics without providing intellectual challenge and does not address the identified need."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "During Ramadan, a Muslim student arrives to school visibly fatigued and asks to be excused from a demanding physical education unit. What should the teacher do first?",
    "a": [
      "Consult the student and family to understand their needs, then work with the PE teacher to identify reasonable accommodations that respect the observance.",
      "Excuse the student from PE for the entire month without offering instructional alternatives.",
      "Document the student's request and refer the matter to the principal to decide.",
      "Require full participation in the unit, because New York State physical education requirements apply to every enrolled student and individual exceptions could set an inequitable precedent."
    ],
    "c": 0,
    "r": "The correct answer is right because consulting the student and family and then working with the PE teacher on reasonable adjustments respects the student's religious practice while keeping her in instruction. The First Amendment protects free exercise of religion, and New York's Dignity for All Students Act prohibits discrimination based on religion and religious practice, so a rigid refusal that burdens observance raises a discrimination concern. The strongest distractor, requiring full participation, treats equal treatment as identical treatment and disregards the student's observance. Excusing her for the whole month with no alternative removes her from instruction, and passing the matter to the principal skips the teacher's own first step of gathering information."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Before a standardized math test, a teacher says to the class, \"I know some groups historically score lower on these tests, so I want you to know I believe in all of you.\" Research on stereotype threat suggests this statement will most likely:",
    "a": [
      "Improve scores for students from underrepresented groups, because explicitly naming and rejecting a stereotype has been shown to neutralize its effects on test performance.",
      "Have no effect because students are already aware of achievement gaps.",
      "Activate stereotype threat for students who belong to negatively stereotyped groups, potentially lowering their performance.",
      "Reduce anxiety for all students by communicating high expectations."
    ],
    "c": 2,
    "r": "The correct answer is right because Steele and Aronson's stereotype threat research demonstrates that merely invoking group-based stereotypes, even to refute them, can activate the threat and suppress performance for targeted students. The strongest distractor is wrong: it incorrectly assumes that positive framing neutralizes the effect of raising the stereotype in the first place."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 4th-grade student from the Dominican Republic arrived in the U.S. two years ago and scored at the Transitioning level on her most recent annual English language proficiency assessment. She converses fluently with peers at lunch and on the playground but struggles significantly with written science reports. Her ENL teacher shares this observation at a team meeting. Which explanation BEST accounts for this pattern?",
    "a": [
      "The student has developed Basic Interpersonal Communicative Skills (BICS) but has not yet attained the Cognitive Academic Language Proficiency (CALP) required for academic tasks.",
      "The student likely has an undiagnosed learning disability affecting written expression, and the team should request a comprehensive special education evaluation before the academic gap widens further.",
      "The student's home language is interfering with her writing and is the primary cause of her difficulties.",
      "The student is unmotivated because academic tasks are less interesting to her than social conversation."
    ],
    "c": 0,
    "r": "Conversational fluency (BICS) typically emerges in roughly 1 to 3 years, while the decontextualized academic language proficiency (CALP) needed for science writing takes about 5 to 7 years (Cummins). Fluent peer interaction alongside academic-writing struggles is the textbook BICS/CALP gap, especially for a student who is still only at the Transitioning level. The special education evaluation option is the strongest distractor but is premature: under IDEA's eligibility rules (34 CFR 300.306(b)), limited English proficiency may not be the determinant factor in a disability decision, so the team must first ensure the student has received appropriate language support and gathered language-proficiency data. Home-language interference does not explain robust oral fluency, and attributing the pattern to motivation ignores the predictable second-language-acquisition trajectory."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "A school district in New York is designing services for a growing population of recently arrived ELLs across multiple grade levels. District leadership wants students to maintain and develop proficiency in both their home language and English, and to enroll English-proficient peers alongside them. Which instructional model BEST aligns with this goal?",
    "a": [
      "Transitional Bilingual Education, which uses the home language as an instructional bridge in the early years and then gradually phases it out as students' English proficiency develops.",
      "Pull-out (Stand-Alone) ENL, where students receive English language development from a certified ENL teacher in a separate setting.",
      "Dual Language bilingual education, where instruction is delivered in both English and the partner language with the goal of biliteracy for ELLs and English-proficient peers together.",
      "Structured submersion, which places ELLs in general education classrooms with no additional language services."
    ],
    "c": 2,
    "r": "Dual Language is the only listed model designed to develop and sustain proficiency in two languages (an additive model) and to enroll both ELLs and English-proficient students together, matching the district's biliteracy and home-language-maintenance goal. Transitional Bilingual Education is the strongest distractor, but it uses the home language mainly as a bridge and phases it out (a weaker, potentially subtractive model) rather than maintaining it. Stand-Alone ENL develops English without sustaining the home language. Structured submersion provides no services and is not a legally permissible stand-alone approach, because Commissioner's Regulations Part 154 require documented ENL or bilingual services for every identified ELL."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A newly enrolled kindergartner's Home Language Questionnaire indicates that a language other than English is spoken at home. Which is the teacher's MOST IMMEDIATE required next step under New York State regulations?",
    "a": [
      "Refer the student to the Committee on Special Education (CSE) for a bilingual evaluation.",
      "Begin Stand-Alone ENL pull-out services immediately, before any screening is completed.",
      "Ensure qualified staff interview the child and family in English and the home language and, if indicated, give the NYSITELL within 10 school days.",
      "Notify the student's parents that the child will be placed in a bilingual classroom, since a Home Language Questionnaire indicating another language automatically determines program placement."
    ],
    "c": 2,
    "r": "Under Part 154, the HLQ is Step 1. When it shows a language other than English, qualified personnel conduct an individual interview with the student in English and the home language (Step 2); if the interview indicates the child may be an ELL, the district administers the NYSITELL, completing identification within 10 school days of initial enrollment. A CSE referral is premature: limited English proficiency may not be the determinant factor in a disability decision (34 CFR 300.306(b)), so language identification precedes any disability question. Automatic bilingual placement is the strongest distractor because bilingual education is the default where offered, but placement follows identification, parent orientation, and parent choice, not the HLQ alone. Starting services before identification reverses the required sequence."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 7th-grade science teacher has several ELL students whose home cultures emphasize collaborative, communal learning rather than individual competition. When introducing a new unit on ecosystems, which approach BEST supports these students' cultural and linguistic needs?",
    "a": [
      "Postpone complex ecosystem concepts until the ELL students reach a higher English proficiency level.",
      "Assign individual research papers so students can develop independent academic writing skills before any group work.",
      "Pair each ELL with a high-achieving English-proficient classmate and ask that student to re-explain the content, since peer explanations are often more accessible than teacher talk.",
      "Use structured cooperative learning groups in which students build shared academic vocabulary and concept maps together before completing individual tasks."
    ],
    "c": 3,
    "r": "Structured cooperative learning aligns with collectivist cultural values while building academic language (CALP) through purposeful peer interaction and content scaffolding, a core sheltered-instruction principle. Postponing grade-level content is the strongest distractor but is wrong: research shows that delaying access to grade-level content widens opportunity gaps and undercuts the meaningful-access ELLs are owed under Title VI and the EEOA (Lau v. Nichols; Castaneda v. Pickard). Individual research papers with no language support do not address the students' linguistic needs, and informal peer tutoring places an undue instructional burden on the English-proficient student rather than constituting a structured strategy with shared accountability."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "An ELL student at the Transitioning level is taking the state science assessment. Under NYS policy, which accommodation is MOST appropriate to support her language needs without invalidating the measurement of her science content knowledge?",
    "a": [
      "Have a bilingual teacher explain the meaning of difficult science questions to her in the home language during the test.",
      "Let her use a bilingual dictionary that gives definitions and explanations of the science terms in each question.",
      "Excuse the student from the state assessment until she scores Commanding on the annual proficiency test.",
      "Provide an approved word-to-word bilingual glossary of science terms and extended time."
    ],
    "c": 3,
    "r": "NYSED permits ELLs to use word-to-word bilingual glossaries and extended time on state content tests (along with a separate location, translated editions, and oral translation for lower-incidence languages); these supports reduce the language barrier without changing the science being measured. Having a teacher explain questions is the strongest distractor because oral translation is permitted, but translators must translate directly and may not clarify or explain, which would change the construct. Dictionaries with definitions or explanations are not allowed, and ELLs must take state science assessments rather than be excused."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A 3rd-grade teacher notices that the parents of her ELL students rarely attend family events or respond to school communications. She suspects language barriers may be a contributing factor. Which action is MOST consistent with federal and state requirements and best practice?",
    "a": [
      "Send communications home only in English to encourage parents to develop their own English proficiency.",
      "Temporarily reduce the frequency of home communications until the district can assign an interpreter, so families are not overwhelmed by repeated messages they cannot read.",
      "Ask each student to translate school communications for their parents, since children are usually the family's most proficient English speakers and always available at home.",
      "Partner with the school's parent liaison to provide translated notices and trained interpreter services for school events and conferences."
    ],
    "c": 3,
    "r": "Title VI of the Civil Rights Act requires schools to communicate meaningfully with limited-English-proficient parents in a language they can understand, and Part 154 likewise requires notification of identification, placement, and progress in an accessible language. Providing translated materials and trained, qualified interpreters fulfills this obligation and supports authentic engagement. Using the student as interpreter is a common but inappropriate practice that places developmentally inappropriate responsibility on a child, risks inaccurate communication of sensitive information, and is discouraged by professional and legal guidance. Sending English-only notices actively disadvantages these families and fails the meaningful-communication standard, and reducing communication withholds information families are entitled to receive."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "An ENL teacher is concerned about a newcomer student who arrived 6 months ago and is making slow progress in English despite consistent attendance. A classroom teacher suggests referring the student for a special education evaluation. What should the ENL teacher advise?",
    "a": [
      "Advise that ELL students are exempt from special education eligibility and cannot be referred to the CSE.",
      "Explain that the student may be referred, but under IDEA limited English proficiency may not be the determinant factor in eligibility, so the team should first document appropriate ENL instruction and difficulties across both languages.",
      "Agree with the referral, since six months of consistent attendance with slow progress is generally enough time for a newcomer to show meaningful growth, and early evaluation ensures the student does not miss services she may genuinely need.",
      "Recommend delaying any evaluation for several more years, because academic language acquisition typically takes five to seven years and testing before then rarely yields valid results."
    ],
    "c": 1,
    "r": "Under IDEA, a student may not be identified as having a disability if the determinant factor is limited English proficiency (34 CFR 300.306(b)), and evaluations must be nondiscriminatory (34 CFR 300.304). The team should ensure appropriate, evidence-based ENL instruction has been delivered with progress monitored, and gather data indicating difficulties exist across languages and settings, before concluding a disability is present; this guards against misidentification while still allowing referral. Agreeing immediately is the strongest distractor but ignores that 6 months is far too little time and that LEP cannot drive an eligibility decision. The exemption option is false, since ELLs are fully eligible for special education when a disability is properly identified, and a fixed multi-year wait improperly delays evaluation for a student who may have a genuine disability."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A 9th-grade student with a specific learning disability has an IEP that includes extended time on assessments. The student's general education English teacher tells the special education teacher, 'I give everyone the same time because equal treatment is fair.' Which response BEST reflects the teacher's legal and ethical obligations under IDEA?",
    "a": [
      "Extended time should be provided only when the student requests it, to promote self-advocacy.",
      "The student's IEP accommodations are legally binding and must be implemented in the general education setting.",
      "The accommodation can be waived if the class uses open-note assessments instead.",
      "The general education teacher makes a defensible point: uniform time limits are a consistent classroom policy, and consistency is fair so long as the limit is applied to every student in the class."
    ],
    "c": 1,
    "r": "Under IDEA (20 U.S.C. § 1400 et seq.), IEP accommodations are legally mandated and enforceable in all educational settings, including general education classrooms; a teacher's personal equity philosophy cannot override them, and a material failure to implement a documented accommodation can constitute a denial of FAPE. The 'equal treatment' option is the strongest distractor because it misapplies equality, conflating identical treatment with the equitable, individualized supports the law requires. Conditioning the accommodation on a student request or waiving it for open-note tests both unilaterally narrow what the IEP guarantees, which a teacher may not do."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A 2nd-grade teacher notices that four students are consistently below grade level in reading fluency. The school uses a multi-tiered system of supports. What is the MOST appropriate first step?",
    "a": [
      "Refer the four students to the Committee on Special Education for evaluation, since a documented pattern of below-grade-level reading performance is the standard trigger for a referral.",
      "Move the students to a lower reading group and use below-grade-level materials indefinitely.",
      "Provide differentiated, research-based Tier 1 instruction and monitor progress with frequent data collection.",
      "Contact parents to inform them that their children likely have learning disabilities."
    ],
    "c": 2,
    "r": "In a multi-tiered RtI framework, universal Tier 1 high-quality instruction with frequent progress monitoring is the first response to students performing below benchmark; targeted Tier 2 support follows for non-responders, and a CSE referral is appropriate once intervention data are documented. The immediate-CSE-referral option is the strongest distractor because it bypasses the data-driven intervention process; in New York, eligibility cannot be found when the determinant factor is lack of appropriate reading instruction. Telling parents the children 'likely have learning disabilities' makes an unsupported diagnostic claim, and permanently lowering materials denies grade-level access."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 7th-grade student with ADHD does not qualify for special education services under IDEA but continues to struggle academically due to difficulty sustaining attention. Which plan MOST appropriately addresses this student's needs?",
    "a": [
      "An informal verbal agreement between the teacher and the student's parents.",
      "An Individualized Education Program (IEP) developed by the CSE.",
      "A behavioral intervention plan created solely by the classroom teacher.",
      "A Section 504 accommodation plan developed by the school's 504 team."
    ],
    "c": 3,
    "r": "Section 504 of the Rehabilitation Act (29 U.S.C. § 794) protects students whose impairment substantially limits a major life activity (such as concentrating) but who do not require specially designed instruction; a 504 plan provides the formal, documented accommodations and is managed by the school's 504 team, not the CSE. The IEP option is the strongest distractor because IDEA eligibility requires both a qualifying disability classification and a need for special education, criteria this student does not meet. An informal verbal agreement provides no enforceable protection, and a teacher-only behavior plan is neither a formal plan nor matched to the attention-based need."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A high school science teacher wants to proactively reduce barriers for all learners, including students with disabilities, before any accommodations are needed. Which instructional design approach BEST aligns with this goal?",
    "a": [
      "Designing lessons using multiple means of representation, action and expression, and engagement from the outset.",
      "Grouping students with disabilities separately to deliver modified content.",
      "Relying on trained paraprofessionals to adapt materials on an as-needed basis during instruction, so that supports are individualized to each learner in real time as difficulties appear.",
      "Providing retroactive accommodations only after a student demonstrates failure."
    ],
    "c": 0,
    "r": "Universal Design for Learning is a proactive framework that builds multiple means of representation, action and expression, and engagement into instruction at the design stage, reducing barriers before individual accommodations are needed. The strongest distractor, C, describes as-needed adaptation by paraprofessionals: individualized, but reactive rather than designed in, and it shifts responsibility away from the teacher of record. D is reactive by definition, and B separates students and lowers expectations instead of designing access for all."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A parent disagrees with the CSE's decision to place her child with autism in a self-contained setting and requests a more inclusive placement. Under IDEA, what is the parent's FIRST available formal recourse?",
    "a": [
      "Petition the school board to overturn the CSE decision at the next public meeting.",
      "Withdraw the child from public school and enroll in a private placement at district expense immediately.",
      "File a complaint directly with the U.S. Department of Education Office for Civil Rights.",
      "Request mediation or file for an impartial due process hearing."
    ],
    "c": 3,
    "r": "IDEA's procedural safeguards give parents mediation and an impartial due process hearing as the formal mechanisms to resolve disagreements over identification, evaluation, or placement. The OCR option is the strongest distractor because OCR enforces Section 504/ADA and Title VI/IX complaints; IDEA placement disputes go through the state's due process system, not OCR. Unilateral private placement may later yield reimbursement only through that same due process route and carries financial risk, and a school-board petition is not an IDEA dispute-resolution mechanism."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 5th-grade student with an emotional disability frequently disrupts class. The school uses PBIS. Rather than repeatedly removing the student from class, which approach is MOST consistent with PBIS at the Tier 2 level?",
    "a": [
      "Referring the student to the CSE to consider a more structured placement where behavioral needs can be addressed with a lower student-to-staff ratio and specialized staff.",
      "Implementing a Check-In/Check-Out system tied to a daily behavior report card and home-school communication.",
      "Ignoring the behavior to avoid reinforcing it with attention.",
      "Increasing the frequency of punitive consequences until the behavior extinguishes."
    ],
    "c": 1,
    "r": "Tier 2 PBIS interventions are targeted, evidence-based supports for students who do not respond sufficiently to universal Tier 1 practices; Check-In/Check-Out (CICO) is a validated Tier 2 strategy that adds structured feedback, positive adult contact, and home-school communication. The strongest distractor, A, jumps to a more restrictive placement, skipping the tiered, data-driven supports PBIS uses before a change in placement is considered. Escalating punishment (D) ignores function, and planned ignoring (C) is inappropriate for disruptive behavior that may not be maintained by attention."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A CSE is determining an appropriate placement for a 3rd-grade student with an intellectual disability. The team must base its placement decision PRIMARILY on which IDEA principle?",
    "a": [
      "The most supportive and structured setting available, to guarantee the student receives the maximum level of specialized instruction and related services from the start.",
      "The placement that is easiest for the school to staff and fund.",
      "The least restrictive environment in which the student can receive an appropriate education with supplementary aids and services.",
      "A self-contained classroom, because it is the default placement for students with intellectual disabilities."
    ],
    "c": 2,
    "r": "IDEA's LRE mandate (34 C.F.R. § 300.114) requires that students with disabilities be educated alongside nondisabled peers to the maximum extent appropriate, with removal occurring only when the nature or severity of the disability prevents satisfactory education even with supplementary aids and services. The default self-contained option is the strongest distractor because IDEA prohibits categorical placement by disability label; each decision must be individualized to the student's needs. Choosing the most restrictive setting inverts the mandate, and administrative convenience or cost may never drive a placement decision."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A 4th grader tells her teacher that her stepfather hit her with a belt last night, and the teacher sees welts on the backs of her legs. The teacher tells the principal, who says, 'Let me look into it first. Don't call anyone until I talk to the family this afternoon.' What should the teacher do?",
    "a": [
      "Wait for the principal's follow-up, since notifying the building administrator satisfies a teacher's reporting duty under New York law.",
      "Call the Statewide Central Register herself right away, because the reporting duty is personal and no one's permission is required.",
      "Ask the student to write down exactly what happened so her account is preserved before anyone contacts the family or an outside agency.",
      "Contact the stepfather that afternoon to hear his explanation, so that any report the school files later is accurate and fair to the family."
    ],
    "c": 1,
    "r": "Under Social Services Law 413, a teacher with reasonable cause to suspect abuse by a parent or other person legally responsible for the child must report immediately by phone to the Statewide Central Register. The duty is personal: telling the principal does not satisfy it, and a school may not require staff to get permission before reporting. The strongest distractor, deferring to the principal, fails for exactly that reason. Having the child write a statement turns the teacher into an investigator, and contacting the stepfather could put the child at further risk."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A middle school teacher is approached by a local newspaper reporter who is writing a story about a student who won a science competition. The reporter asks the teacher to confirm the student's GPA and provide a copy of the student's science project grades. What is the teacher's MOST appropriate response?",
    "a": [
      "Share the GPA and grades, since the student's achievement is already a matter of public record after winning a publicly announced award and the story will reflect well on the school community.",
      "Provide only the science project grades, since those are directly relevant to the competition and not sensitive information.",
      "Decline to share any records and direct the reporter to the school's main office, explaining that student education records are protected.",
      "Ask the student's parents to contact the reporter directly so the teacher avoids being involved in the situation."
    ],
    "c": 2,
    "r": "Under FERPA (20 U.S.C. Section 1232g), education records, including grades and GPA, are confidential and may not be disclosed to third parties without prior written consent from a parent or eligible student; the teacher should decline and route the request through the appropriate office. Sharing the records because the achievement is publicly known is the strongest distractor, but public recognition of an award does not waive FERPA protection over a student's academic records. Releasing only the project grades is wrong because individual course or project grades are protected records, not directory information."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A high school special education teacher disagrees with a general education colleague's approach to adjusting assignments for a student with a learning disability. The general education teacher is substantially reducing the amount of content (a modification) rather than changing the format or response mode the IEP specifies (an accommodation). What is the MOST professionally appropriate action for the special education teacher to take?",
    "a": [
      "Modify the assignments herself and deliver them directly to the student without telling the general education teacher.",
      "Document the discrepancy carefully in her own records and raise it formally at the annual IEP review, when the full team will be present to address implementation concerns.",
      "Schedule a collaborative meeting to review the IEP together, clarify the accommodation–modification distinction, and agree on implementation that honors the IEP as written.",
      "Report the general education teacher to the principal immediately for failing to follow the IEP."
    ],
    "c": 2,
    "r": "IDEA (2004) requires that IEPs be implemented as written, and collaborative problem-solving between co-teachers is the professionally appropriate first response to a disagreement about implementation. Escalating directly to administration before attempting professional dialogue is the strongest distractor because it feels decisive, but it bypasses the collaborative process and may unnecessarily damage collegial relationships. Quietly modifying the work herself fragments instruction, and waiting until the annual review leaves the IEP unimplemented in the meantime."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "During a hallway transition, a teacher observes a student being called derogatory names related to his perceived sexual orientation by two peers. The targeted student looks visibly distressed. Under New York's Dignity for All Students Act (DASA), what is the teacher's MOST appropriate immediate response?",
    "a": [
      "Privately tell the targeted student to ignore the comments and focus on getting to class.",
      "Speak separately with the two students who were name-calling, ask them not to repeat the behavior, and check in with the targeted student later in the week to see whether it has stopped.",
      "Wait to see if the behavior recurs before intervening, since a single incident may not constitute harassment under DASA.",
      "Intervene immediately to stop the behavior, ensure the targeted student's safety, and report the incident to the building's Dignity Act Coordinator."
    ],
    "c": 3,
    "r": "DASA (NY Education Law Article 2, Sections 10-18) requires school personnel to intervene when they observe harassment or discrimination based on actual or perceived characteristics, including sexual orientation, and to report such incidents to the designated Dignity Act Coordinator. Waiting to see whether the behavior recurs is the strongest distractor, but DASA does not require a pattern; a single observed act of harassment triggers the obligation to act. Telling the student to ignore it or quietly warning the aggressors fails to stop the conduct and bypasses the protected, documented reporting process the law requires."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A 2nd grader has received Tier 2 reading intervention for six weeks. Her mother hands the teacher a signed letter asking that her daughter be evaluated for special education. The teacher believes the intervention is starting to work. What is the teacher's MOST appropriate response?",
    "a": [
      "Explain that the school cannot consider an evaluation until the student has completed every tier of the RtI process and the progress-monitoring data show she has not responded.",
      "Hold the letter until the next progress-monitoring review so the intervention team can decide whether the request is warranted before passing it along.",
      "Forward the letter promptly to the CSE chairperson or building administrator, because a parent's written request is a referral that RtI cannot delay or deny.",
      "Suggest that the mother withdraw the letter for now and resubmit it at the spring conference if her daughter is still struggling by then."
    ],
    "c": 2,
    "r": "In New York a parent may refer a child directly, and a parent's written request for an evaluation is a referral that goes promptly to the CSE chairperson (a building administrator who receives one forwards it immediately). Under 8 NYCRR 100.2(ii), a district's RtI notice to parents must tell them of their right to request an evaluation, and both federal guidance (OSEP Memo 11-07) and NYSED guidance state that RtI cannot be used to delay or deny an evaluation. The strongest distractor, telling the mother she must wait until RtI is complete, sounds like sound practice but misstates the law: RtI data inform the evaluation, they do not gate it. Holding the letter for a team review and urging the mother to withdraw it both obstruct a right the parent holds. The teacher can still share that the intervention appears to be helping."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A Title I elementary school is revising its family engagement approach. The principal asks a teacher committee what ESSA Section 1116 actually requires beyond \"inviting parents to events.\" Which description is most accurate?",
    "a": [
      "A parent representative on the school leadership team who votes on all instructional decisions for the building, including curriculum adoption and staffing.",
      "A jointly developed written parent and family engagement policy and a school-parent compact, built with families and reviewed with them regularly.",
      "Monthly newsletters and a family portal login for every household, since digital access to grades satisfies the federal engagement requirement.",
      "An annual open house in the fall, with translated flyers sent home whenever the budget allows the district to provide them."
    ],
    "c": 1,
    "r": "Title I, Section 1116 of ESSA requires schools to develop a written parent and family engagement policy and a school-parent compact jointly with families, hold an annual meeting, and build capacity for engagement. A single open house, a newsletter, or portal access falls short of the jointly developed policy and compact, and the statute does not give a parent representative decision authority over staffing or curriculum."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A 10-year-old student with a learning disability is due for an annual IEP review. Under IDEA, which of the following BEST describes the parent's role in the Committee on Special Education (CSE) meeting?",
    "a": [
      "Parents may observe the CSE meeting but are not considered members of the team unless they hold an educational credential.",
      "Parents are required members of the CSE whose meaningful participation must be ensured, and whose informed written consent is required before an initial evaluation and the initial provision of services.",
      "Parents must give written consent before every change to the IEP, including each annual revision, every change in related services, and any adjustment to testing accommodations, or the document is legally void.",
      "Parents may attend but have no right to participate in decisions; final authority rests entirely with the CSE professionals."
    ],
    "c": 1,
    "r": "Under IDEA (34 C.F.R. §§ 300.321, 300.322), parents are required members of the CSE and the school must take steps to ensure their meaningful participation; informed written consent is required before an initial evaluation and before the initial provision of special education services (34 C.F.R. § 300.300). Another option overstates the law: after initial placement, IDEA requires prior written notice for changes (not fresh consent for every IEP revision), and a new IEP at an annual review does not require renewed consent. Another option is wrong because parents are not merely advisory; their participation is a legally protected, substantive right."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A fifth-grader's parents are divorced. The noncustodial father, who has no court order limiting his educational rights, emails the teacher asking for copies of his son's report cards and progress reports. The custodial mother has told the teacher she does not want the father \"involved with the school.\" What should the teacher do?",
    "a": [
      "Decline both parents' requests and route all future records questions through the district's attorney.",
      "Ask the son whether he is comfortable with his father receiving the reports before responding to the request.",
      "Provide records access to the father, because under FERPA both parents retain full rights to their child's education records unless a court order or legally binding document specifically revokes them.",
      "Follow the custodial mother's stated wishes and withhold the records, on the understanding that after a divorce the custodial parent alone controls all school communication and educational decision-making for the child."
    ],
    "c": 2,
    "r": "FERPA gives both parents, custodial and noncustodial, equal rights to inspect their child's education records unless the school has evidence of a court order, state statute, or legally binding document that specifically revokes those rights. A custodial parent's preference does not override federal law, a child cannot waive or grant a parent's rights, and refusing both parents denies legally required access."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A parent calls a teacher to ask about a classmate's behavioral issues, stating the classmate has been bullying their child. The teacher possesses behavioral intervention records for the student in question. Which response BEST upholds legal and ethical obligations?",
    "a": [
      "Refer the concerned parent directly to the other student's parents so the two families can resolve the bullying between themselves, since the school is not permitted to share any information about another child anyway.",
      "Share the classmate's disciplinary records so the parent can understand the full situation.",
      "Acknowledge the concern, document the bullying complaint, explain that another student's records are confidential under FERPA, and describe how the school will address the bullying.",
      "Tell the parent that school bullying is handled exclusively by the principal and end the call."
    ],
    "c": 2,
    "r": "FERPA (20 U.S.C. § 1232g) prohibits disclosure of another student's education records without that family's consent, so the teacher cannot share the classmate's behavioral records. The correct response acknowledges the complaint, documents it, protects confidentiality, and commits to school-based follow-up, all consistent with EAS Competency 4 and New York's Dignity for All Students Act (DASA), which requires staff to report and address bullying. Referring families to each other abdicates the school's DASA obligation."
  }
];

const POSTTEST = [
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Mr. Thompson is planning a unit on American history. Most of his students are from Caribbean and West African immigrant families. To make the curriculum more culturally sustaining, he should:",
    "a": [
      "Invite students to share personal family stories only during a designated \"culture day\" at the end of the unit.",
      "Supplement the standard textbook with primary sources, literature, and historical narratives that center Caribbean and African diasporic perspectives alongside mainstream accounts.",
      "Center the unit on the contributions of Caribbean and West African immigrant groups, replacing most of the standard curriculum so that students see themselves reflected in each lesson.",
      "Reduce the complexity of readings to ensure ELL students can access the content."
    ],
    "c": 1,
    "r": "The correct answer is right because culturally sustaining pedagogy (Paris, 2012) requires integrating diverse cultural and community knowledge as a persistent, substantive part of the curriculum, not a one-time add-on. The strongest distractor is wrong: confining culture to a single \"culture day\" tokenizes it, does not constitute genuine integration, and may reinforce othering."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "A third-grade teacher notices that students who receive free or reduced-price lunch are disproportionately represented in the low reading group. Which action most directly addresses the intersection of poverty and reading achievement?",
    "a": [
      "Audit the grouping process for bias, send home supplemental reading resources, and ensure the low group receives rigorous instruction from a qualified teacher.",
      "Maintain the current ability grouping, since it ensures each student receives instruction matched to demonstrated skill level, and revisit placements after the next benchmark assessment.",
      "Eliminate all reading groups so no student is labeled.",
      "Refer all students in the low group for special education evaluations."
    ],
    "c": 0,
    "r": "The correct answer is right because research shows rigid, low-track groups often reflect socioeconomic bias and receive less rigorous instruction, compounding disadvantage; auditing grouping practices and ensuring high-quality instruction with home support addresses root equity issues. The strongest distractor is wrong: low reading achievement alone, without evidence of a disability, does not warrant a CSE referral."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "An ELL who has attended U.S. schools for three years scored at the Transitioning level on last spring's state English language proficiency test and receives integrated ENL services in ELA. She converses easily in English, but her written arguments in ELA remain underdeveloped. The teacher should:",
    "a": [
      "Ask the ENL teacher to discontinue her integrated ENL support, since her easy conversational English shows that she no longer needs formal language services in ELA.",
      "Lower her writing expectations to match her current output, so that her ELA grades reflect effort and growth rather than her English proficiency.",
      "Continue scaffolded writing instruction (sentence frames, graphic organizers, modeled academic discourse) with the ENL teacher, as CALP takes five to seven years.",
      "Submit a written request for referral to the CSE to evaluate a possible written-expression disability, since three years of English instruction should be enough for grade-level argumentative writing."
    ],
    "c": 2,
    "r": "The correct answer is right because Transitioning (Intermediate) is a Part 154 ELL level, not an exit: the student remains an ELL entitled to ENL services, and the academic language (CALP) needed for written argument typically takes five to seven years even after conversational fluency (BICS) develops. The strongest distractor, a CSE referral, is premature: IDEA bars a disability finding when limited English proficiency is the determinant factor (34 CFR 300.306(b)), and her profile matches normal second-language development. Ending ENL support is not a teacher's decision; Part 154 ends ELL status only through a Commanding score or Expanding plus a proficient ELA result. Lowering expectations withholds the rigor she needs."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Ms. Williams wants to build stronger relationships with her predominantly immigrant students' families, many of whom speak languages other than English at home. The most effective first step is:",
    "a": [
      "Schedule a well-publicized community night with a professional interpreter early in the year, so that every family has at least one fully accessible opportunity to connect with the school.",
      "Send all communications home in English only, since families should practice English.",
      "Establish ongoing multilingual communication (translated newsletters, interpreter phone calls, and a bilingual family liaison) while learning key phrases in families' home languages.",
      "Ask students to serve as interpreters for routine parent communications, reserving professional interpreters for formal meetings, to make the best use of limited district resources."
    ],
    "c": 2,
    "r": "The correct answer is right because sustained, multilingual outreach with a designated liaison signals genuine partnership and removes language barriers to engagement; under Title VI (and, in New York, Part 154 notice rules), schools must communicate essential information to limited-English-proficient parents in a language they understand. The strongest distractor is wrong: it places an inappropriate and ethically problematic translation burden on children, who may filter or alter communications and should not be placed in an adult intermediary role."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "A fifth-grade student has a documented learning disability in written expression (IEP) but demonstrates exceptional verbal reasoning and creative problem-solving. The general education teacher should:",
    "a": [
      "Focus instructional time on remediating the writing disability first, since fluent grade-level written expression is the gateway skill the student needs before enrichment becomes appropriate.",
      "Recognize the student as twice-exceptional and use UDL options (oral responses, dictation tools, visual formats) so strengths shine while writing develops.",
      "Notify the gifted coordinator that the student's IEP disqualifies them from gifted services.",
      "Place the student in the special education resource room for all core subjects to address the disability."
    ],
    "c": 1,
    "r": "The correct answer is right because twice-exceptional students have both a disability and exceptional abilities; UDL's multiple means of action and expression let strengths be assessed and developed while accommodations support the area of disability. The strongest distractor is wrong: it ignores the student's giftedness and the student's strengths. Another option is also wrong because an IEP does not legally preclude gifted services."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "A Jewish student asks to be excused from school on Yom Kippur, which falls on a test day. The teacher's most appropriate response is:",
    "a": [
      "Require the student to take the test before the holiday or forfeit the grade.",
      "Grant the excused absence and provide an equivalent make-up opportunity, consistent with New York Education Law §3210 protections for religious observance.",
      "Allow the absence but assign a zero for the test since the student chose to be absent.",
      "Ask the family to provide advance written documentation of the religious observance before granting the absence, so that the accommodation is applied consistently across all requests."
    ],
    "c": 1,
    "r": "The correct answer is right because Education Law 3210(1)(b) permits absence for religious observance, making Yom Kippur an excused absence, and the Dignity for All Students Act prohibits discrimination based on religion and religious practice. An equivalent make-up opportunity keeps the student from being penalized for the observance. The strongest distractor, allowing the absence but assigning a zero, penalizes the observance itself and is discriminatory in effect. Forcing an early test or forfeiting the grade punishes the observance in another way, and requiring proof that the holiday is a genuine observance before honoring it puts the family's faith under scrutiny; the routine parent note that the district attendance policy requires for any absence is enough."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "A teacher reviews her discipline referral data and notices she has sent Black male students to the principal's office at three times the rate of other students for subjective infractions such as \"disrespect\" and \"defiance.\" What is the most professionally responsible next step?",
    "a": [
      "Remove the referral records from the student files to avoid labeling.",
      "Share the disaggregated referral data with the students' parents and ask them to reinforce respectful classroom conduct at home, since consistent behavioral expectations across home and school are known to reduce office referrals over time.",
      "Engage in reflective practice to examine whether implicit bias may be influencing how behavior is perceived, consult a PBIS coach, and adopt objective behavioral criteria applied consistently.",
      "Conclude that the behavioral pattern is student-driven and increase consequences to establish consistency."
    ],
    "c": 2,
    "r": "The correct answer is right because research documents that Black male students are disproportionately disciplined for subjective infractions, often reflecting implicit bias rather than objective behavioral differences; reflective practice and PBIS-aligned, objective criteria directly address the equity issue. The strongest distractor is wrong: it reinforces the disparity by attributing it solely to student behavior without examining the teacher's own decision-making."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 6th-grade social studies teacher notices that her ELL student, who has been in U.S. schools for three years, can discuss current events verbally during class but produces very thin written arguments on essays. The teacher wonders whether the student should be retained. Which response is MOST appropriate?",
    "a": [
      "The profile is consistent with a student who has BICS but is still developing CALP, so the teacher should provide academic-writing scaffolds rather than pursue retention.",
      "The student should be referred to the CSE, because a persistent gap between verbal and written performance after three full years of instruction is a recognized indicator of a processing disorder.",
      "Retention is appropriate, because three years is enough time to develop full academic proficiency in English.",
      "The student needs more time in Stand-Alone ENL before being allowed to participate in mainstream content instruction at all."
    ],
    "c": 0,
    "r": "Three years is still within the typical 5 to 7 year window for CALP to approach grade-level norms (Cummins), so the verbal-written discrepancy is expected, and the appropriate response is targeted academic-writing scaffolding such as sentence frames, structured note-taking, and models. The strongest distractor: a referral is premature because the team has not yet shown the difficulty is not primarily due to limited English proficiency, which IDEA's eligibility rules (34 CFR 300.306(b)) require before classification. Retention is not supported by research for ELLs and does not address the underlying language-development need, and pulling the student entirely out of grade-level content removes the meaningful access ELLs are owed."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "A high school principal tells an ENL teacher that, because the school is small, ELL students who score at the Transitioning level will simply be placed in general education classes with no additional ENL support. How should the ENL teacher respond?",
    "a": [
      "Agree with the principal's plan, because Transitioning-level students are already approaching proficiency and a body of research suggests they make meaningful gains through full immersion in mainstream general education classes.",
      "Suggest the principal create a separate self-contained classroom for those students taught by a paraprofessional.",
      "Explain that under Part 154 every identified ELL is entitled to ENL instruction from a certified ENL teacher, with Units of Study tied to proficiency level, regardless of school size.",
      "Recommend that the students be reclassified as Former ELLs immediately to resolve the compliance concern."
    ],
    "c": 2,
    "r": "Commissioner's Regulations Part 154 require ENL instruction by certified teachers for every identified ELL regardless of school size, with Integrated ENL as the baseline and the required Units of Study tied to proficiency level; Transitioning students in grades 9-12 must receive at least 180 minutes per week. Agreeing is the strongest distractor because it reflects the common misconception that near-proficient students no longer need services. Immediate reclassification misuses the exit process, which requires meeting a state exit criterion (Commanding on the annual English language proficiency assessment, or Expanding plus a proficient ELA score), not administrative convenience. A paraprofessional-staffed class is also noncompliant, since Part 154 requires certified teachers."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A 9th-grade biology teacher is planning a unit on cell division for a class that includes four ELL students at the Entering and Emerging levels. Which instructional strategy is MOST aligned with sheltered instruction and the needs of these students?",
    "a": [
      "Assign the ELL students a simplified worksheet while the rest of the class engages with the grade-level lesson.",
      "Pre-teach key vocabulary (mitosis, cytokinesis, chromosome) using visual diagrams, word walls, and home-language cognates before introducing the full lesson.",
      "Ask the ELL students to observe and take structured notes during the lesson, then review the content afterward in a small group with the ENL teacher, who can reteach it at their level.",
      "Deliver the entire lesson in the students' home language to ensure they comprehend the science content."
    ],
    "c": 1,
    "r": "Pre-teaching vocabulary with visuals, word walls, and cognate connections is a core sheltered-instruction technique (aligned with the SIOP model) that makes grade-level academic language accessible without lowering content rigor, directly supporting CALP development for Entering and Emerging learners. Assigning a separate simplified worksheet is the strongest distractor: although differentiation is appropriate, a standalone simplified task segregates ELLs from grade-level content, conflicting with both best practice and the access principle in NYSED's ENL framework. Having students observe silently denies them productive language practice, and delivering the lesson entirely in the home language would require a certified bilingual teacher and a bilingual program, which is not a general-education classroom strategy."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A parent of a 5th-grade ELL student tells his teacher he wants his daughter removed from all ENL services immediately because she is embarrassed by the pull-out schedule. What is the teacher's MOST appropriate response?",
    "a": [
      "Refer the decision to the principal and take no further action.",
      "Honor the request immediately, since parental consent governs all school service decisions.",
      "Explain that the parent may choose ENL instead of bilingual education but may not waive ENL, which continues until she meets a state exit criterion, and offer to adjust delivery to reduce stigma.",
      "Remove the student from pull-out ENL services as the parent requested, document the decision carefully in the cumulative file, and notify the district ELL coordinator that the family chose to end all language services."
    ],
    "c": 2,
    "r": "Under Part 154, parents choose between bilingual education and ENL but may not waive language services; the district must provide ENL until the student meets a state exit criterion (Commanding on the annual English language proficiency assessment, or Expanding plus a proficient ELA score). Removing services and documenting the request is the strongest distractor because it looks like respecting parental rights, but ELLs' right to meaningful access rests on Title VI and the EEOA (Lau v. Nichols; Castaneda v. Pickard) as implemented through Part 154, so ENL is not waivable. The teacher can ease the embarrassment by shifting more support into Integrated ENL rather than ending services; honoring the request outright or deferring to the principal abandons the obligation."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "During a whole-class discussion of a novel, an 8th-grade ELL student at the Emerging level remains silent even when called on directly. The teacher wants to assess the student's comprehension without creating anxiety. Which strategy is MOST appropriate?",
    "a": [
      "Excuse the student from all oral participation until she reaches a higher proficiency level.",
      "Use structured low-stakes response techniques such as visual response cards, written quick-writes, or partner talk with sentence starters to elicit evidence of comprehension.",
      "Administer the standard end-of-unit test under normal conditions, since it provides the most reliable baseline measure of comprehension for comparison with the rest of the class.",
      "Mark the student as non-participatory and send a note home asking the parents to encourage more speaking practice."
    ],
    "c": 1,
    "r": "Structured low-stakes formats (response cards, quick-writes, partner talk with sentence starters) align with UDL's principle of multiple means of action and expression and yield authentic formative data without triggering the affective filter that suppresses output in anxious learners (Krashen). Excusing the student from participation is the strongest distractor, but withholding participation denies access to learning and conflicts with Part 154's expectation that ELLs are fully integrated into content instruction with appropriate support. Marking the student non-participatory misreads a predictable Emerging-level pattern as a behavior problem, and a high-stakes end-of-unit test is the wrong instrument when a low-stakes formative measure is what the situation calls for."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A recently arrived 10th-grade newcomer from a conflict zone is placed in an ENL newcomer program. The student is withdrawn, startles easily, and has difficulty concentrating. The ENL teacher suspects the student may have experienced significant trauma. Which is the MOST appropriate immediate step?",
    "a": [
      "Alert the school counselor and building mental health supports, document observations, and adjust classroom routines to provide predictability and psychological safety.",
      "Administer the annual English language proficiency test immediately to establish a language baseline before providing any other support.",
      "Contact the family right away to learn exactly what traumatic events occurred, so the teacher can avoid triggering topics and address the trauma directly and sensitively during instruction.",
      "Submit a written request for referral to the CSE right away for a special education evaluation because of the concentration difficulties."
    ],
    "c": 0,
    "r": "Trauma-informed practice calls for immediate collaboration with mental health professionals rather than independent teacher diagnosis, and for building a predictable, low-stress environment that supports the preconditions for learning while specialists assess needs. The immediate request for a CSE referral is the strongest distractor: concentration difficulties that may be trauma responses or part of a newcomer adjustment cannot be the basis for a disability referral without first considering situational and language factors, consistent with IDEA's rule that limited English proficiency may not be the determinant factor in an eligibility decision (34 CFR 300.306(b)). Probing the family for traumatic details could re-traumatize the student and is outside the teacher's role, and the annual English language proficiency test is given only in its spring testing window, not as an emergency response to a mental-health concern."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 2nd-grade teacher has several Spanish-English bilingual students. During a math lesson she notices students quietly using Spanish with each other to work through a word problem and is unsure whether to allow it. What does current research and best practice recommend?",
    "a": [
      "Allow and strategically leverage translanguaging, treating students' full linguistic repertoire as a cognitive resource that deepens understanding and supports English development.",
      "Separate the Spanish-speaking students from the rest of the class to prevent off-task conversation.",
      "Redirect the students to English during math instruction, since maximizing time in the target language is the most direct path to the academic English they will need on state assessments.",
      "Refer the students to a bilingual specialist, since using Spanish during instruction shows they are not ready for mainstream math."
    ],
    "c": 0,
    "r": "Translanguaging theory (Garcia & Wei) and a substantial body of research show that strategic use of the home language supports conceptual understanding and ultimately English academic-language development rather than impeding it; allowing and building on home-language use affirms students' identities and deepens sense-making. The English-only redirection is the strongest distractor: it rests on a deficit assumption and contradicts current NYSED ENL guidance, which endorses leveraging students' full linguistic repertoire and recognizes the home language as a resource (Cummins' Common Underlying Proficiency). Referring the students to a specialist pathologizes normal bilingual behavior, and separating them treats an asset as a discipline problem."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "During a 10th-grade history class, a student with a traumatic brain injury has an IEP goal targeting organizational skills and a related service of occupational therapy twice per week. The school schedules OT sessions during lunch because the therapist's schedule is limited. The parent objects. Which statement BEST reflects the school's obligation?",
    "a": [
      "Parents cannot dictate the schedule of related services once the IEP is signed.",
      "The school may delay OT services until a mutually convenient time is found, even if this extends several weeks.",
      "Scheduling occupational therapy during the lunch period is a reasonable administrative solution, because the student misses none of her academic instruction and the IEP specifies only the frequency of the service, not the time of day it occurs.",
      "Related services must be delivered as specified in the IEP, and scheduling conflicts may not deprive the student of nonacademic benefits, like lunch, available to nondisabled peers."
    ],
    "c": 3,
    "r": "IDEA requires that related services be provided as written in the IEP; routinely scheduling them during lunch can deprive the student of a nonacademic benefit available to peers and may constitute a denial of FAPE in the least restrictive environment. The 'no academic instruction missed' option is the strongest distractor because it equates absence from academic class with full program access, ignoring the nonacademic benefits of lunch that LRE protects. Indefinitely delaying a required service withholds FAPE, and the claim that parents have no voice ignores their role as IEP team members."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A 4th-grade student has been receiving Tier 2 reading intervention for 12 weeks with documented insufficient progress. The intervention teacher has collected bi-weekly progress-monitoring data showing a flat trend line. What is the MOST appropriate next step?",
    "a": [
      "Intensify supports to Tier 3 and refer to the CSE for a comprehensive evaluation.",
      "Switch to a different Tier 2 program and restart the 12-week cycle.",
      "Continue the current Tier 2 intervention for an additional 12 weeks before drawing conclusions.",
      "Immediately discontinue all interventions and wait for the student to mature."
    ],
    "c": 0,
    "r": "When valid Tier 2 data show insufficient response over an adequate period, the RtI framework calls for intensifying to individualized Tier 3 support and initiating a CSE referral; the flat trend line is the data-based documentation that justifies a comprehensive evaluation, and a referral may be made at any time without delay. Extending an ineffective intervention is the strongest distractor because it misuses progress-monitoring data and postpones needed services. Restarting a fresh 12-week cycle similarly delays evaluation, and discontinuing all support to 'wait for maturation' abandons the student and violates child-find."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 4th-grade student who is deaf/hard of hearing uses a classroom FM amplification system specified in her IEP. On several mornings the transmitter battery has been dead, and the student misses portions of instruction until it is noticed. Which arrangement best reflects the school's obligations and sound collaborative practice?",
    "a": [
      "Seat the student in the front row as a backup and continue instruction normally when the device fails.",
      "Have the parents charge the transmitter at home each night, since the device supports their daughter's access.",
      "Establish a documented daily equipment check as part of the classroom routine, with the teacher trained on the device and a rapid-repair contact through the educational audiologist or AT coordinator.",
      "Ask the student to raise her hand whenever she cannot hear so the teacher knows to switch to written directions."
    ],
    "c": 2,
    "r": "IDEA makes the district responsible for ensuring assistive technology in the IEP actually functions; a proactive, documented equipment-check routine with trained staff and a repair pathway prevents recurring loss of access. Placing the burden on the child to self-report, shifting maintenance to the family, or relying on preferential seating alone leaves the access failure in place and amounts to non-implementation of the IEP."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A middle school teacher is designing a unit on the American Revolution. To apply UDL principles and support students with learning disabilities alongside all other learners, which strategy is MOST appropriate at the planning stage?",
    "a": [
      "Create one standard lesson and attach a modified worksheet for students with IEPs afterward.",
      "Reserve choice of assessment format for the students with IEPs, keeping one standard format for everyone else so that expectations remain consistent across the rest of the class.",
      "Assign a paraprofessional to restate all directions individually to students with disabilities during each lesson.",
      "Offer students multiple ways to access content (text, video, audio) and varied options for demonstrating mastery (essay, podcast, visual timeline)."
    ],
    "c": 3,
    "r": "UDL calls for flexible, proactively designed instruction offering multiple means of representation and of action and expression for all learners, which minimizes the need for after-the-fact changes. Retrofitting a single standard lesson with a modified worksheet is the strongest distractor because it is reactive accommodation rather than universal design and creates a two-tiered system. Relying on a paraprofessional to restate directions shifts the design responsibility off the teacher, and offering choice only to students with IEPs both stigmatizes and abandons the 'for all learners' core of UDL."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A 6th-grade student with a physical disability reports to her teacher that classmates regularly mock her assistive device and call her names. Under New York's Dignity for All Students Act (DASA), which action is the teacher MOST obligated to take?",
    "a": [
      "Orally report it to the principal or the Dignity Act Coordinator within one school day, then file a written report within two school days of the oral report.",
      "Mediate a peer discussion during lunch, ask the class to be more respectful of differences, and monitor over the next several weeks to see whether the mocking behavior continues.",
      "Handle the situation informally with the students involved to avoid escalating the conflict, and notify an administrator only if the name-calling continues next week.",
      "Advise the student to ignore the comments and focus on her academics, since reacting tends to reward classmates with the attention they are seeking."
    ],
    "c": 0,
    "r": "Under DASA and 8 NYCRR 100.2, a school employee who witnesses or receives a report of harassment or bullying, including bias based on disability, must orally notify the principal, superintendent, or designee (often the Dignity Act Coordinator) no later than one school day later and file a written report no later than two school days after the oral report; the principal or designee then investigates. The strongest distractor, B, is well-intentioned but bypasses the required reporting and investigation. Informal handling (C) and telling the student to ignore it (D) both fail the reporting duty and leave the harassment unaddressed."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 15-year-old student with a mild intellectual disability has an upcoming annual IEP review. The team wants to ensure compliance with transition requirements. Which element is MOST critical to include?",
    "a": [
      "Age-appropriate transition assessments and measurable postsecondary goals in education/training, employment, and, where appropriate, independent living skills.",
      "A behavior intervention plan focused solely on classroom conduct.",
      "A graduation plan that eliminates electives to maximize core academic time.",
      "A statement that formal transition planning will begin at age 18, when the student is closer to graduation and can participate more meaningfully in postsecondary decisions."
    ],
    "c": 0,
    "r": "IDEA requires measurable postsecondary goals based on age-appropriate transition assessments, plus transition services and a course of study aligned to those goals across post-school domains. In New York these must appear beginning with the IEP in effect when the student turns 15 (earlier than IDEA's federal age-16 floor), so a 15-year-old's review must include them now. The 'begin at 18' option is the strongest distractor because it contradicts New York's age-15 trigger and would leave the student without legally required transition supports during critical planning years. A conduct-only behavior plan and an electives-elimination graduation plan are neither transition assessments nor postsecondary goals."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A 9th-grade student with an emotional disability and an IEP is suspended for 12 consecutive school days after a physical altercation. Under IDEA, what procedural requirement is TRIGGERED at this point?",
    "a": [
      "The student's IEP services may be paused for the remainder of the disciplinary removal period, provided the school documents the length of the suspension and formally notifies the parents of the action in writing.",
      "The school may extend the suspension indefinitely because the behavior was dangerous.",
      "Parents must waive due process rights before the student may return to school.",
      "The school must conduct a manifestation determination review within 10 school days to determine whether the behavior was caused by or directly related to the disability."
    ],
    "c": 3,
    "r": "Under IDEA (34 C.F.R. § 300.530(e)), a removal exceeding 10 consecutive school days is a change of placement that requires the district, parent, and relevant IEP team members to hold a manifestation determination review within 10 school days; if the behavior is a manifestation, the student may not be expelled and the IEP/behavior plan must be addressed. The 'indefinite suspension' option is the strongest distractor because IDEA's disciplinary protections bar removal without the MDR and require continued FAPE, even for dangerous behavior (with narrow 45-day interim placements for weapons, drugs, or serious bodily injury). Services continue during a removal, and no parental waiver of due process is required for return."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "An 8th grader with an IEP gets into a fistfight with a classmate. No weapon, drugs, or serious bodily injury is involved, and he has no other removals this year. After a superintendent's hearing, the district decides to suspend him for 20 school days. Which step does IDEA REQUIRE in connection with this decision?",
    "a": [
      "None beyond the superintendent's hearing, because a student with an IEP is subject to the same code of conduct and suspension lengths as any other student.",
      "Written parental consent before the suspension takes effect, because any disciplinary removal of a student with an IEP is a change in placement that requires consent.",
      "Within 10 school days of the decision, the district, the parent, and relevant CSE members must review whether the conduct was a manifestation of his disability.",
      "A written judgment from his special education teacher, sent to the principal before the 10th day of the suspension, on whether the behavior relates to his disability."
    ],
    "c": 2,
    "r": "A removal of more than 10 consecutive school days is a change in placement for a student with a disability, so IDEA requires a manifestation determination within 10 school days of the decision, made by the district, the parent, and relevant CSE members, who decide whether the conduct was caused by, or had a direct and substantial relationship to, the disability, or resulted from a failure to implement the IEP. If the conduct is a manifestation, the student generally returns to his placement and the team conducts an FBA and develops or reviews a BIP. The strongest distractor, treating him exactly like a general education student, ignores these protections. Parental consent is not the safeguard for disciplinary removals (notice and the manifestation review are), and no single teacher makes the manifestation decision."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A teacher volunteers as a coach for the school's robotics club. An adult community member, who is not a parent of any student at the school, emails the teacher asking whether a specific student on the team has an IEP, because she wants to partner that student with her own child for a community competition. What is the teacher's MOST appropriate response?",
    "a": [
      "Decline to disclose whether the student has an IEP, since disability status is part of the student's education record protected under FERPA and IDEA.",
      "Confirm or deny the IEP status, since club activities are extracurricular and not governed by academic privacy rules.",
      "Forward the email to the student's case manager and let the special education department handle the response.",
      "Ask the student and her family whether they are comfortable sharing her IEP status with the community member, and respond to the email only after receiving their written permission."
    ],
    "c": 0,
    "r": "A student's IEP status, and disability status more broadly, is part of the education record protected under both FERPA (20 U.S.C. Section 1232g) and IDEA, regardless of the extracurricular context in which the inquiry arises; it is never directory information. Forwarding the email to the case manager is the strongest distractor because it shows awareness of the issue, but it does not by itself fulfill the teacher's immediate duty to refuse disclosure and could read as uncertainty about the obligation. Asking the student (a minor) to authorize disclosure improperly shifts the confidentiality decision onto the child."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "In the faculty lounge, with a parent volunteer and a student teacher at the next table, a colleague begins describing a student's IEP classification and the details of the family's custody dispute. Which response by the teacher is MOST appropriate?",
    "a": [
      "Join the conversation briefly to add context from her own classroom, since everyone present works with students in the school community.",
      "Redirect the conversation in the moment, then privately remind the colleague that student information is shared only with staff who need it.",
      "Ask the parent volunteer and the student teacher to move to another table so the colleague can finish the discussion with fewer people listening.",
      "Say nothing in the moment, then file a formal written complaint about the colleague with the State Education Department without first speaking to her."
    ],
    "c": 1,
    "r": "FERPA limits disclosure of personally identifiable information from education records, such as an IEP classification, to school officials with a legitimate educational interest, and the NYS Code of Ethics calls on educators to respect confidentiality. A parent volunteer has no legitimate interest in this student's records, and family custody details do not belong in a common room. Redirecting stops the disclosure, and a private, collegial reminder addresses the conduct in proportion. The strongest distractor, clearing nearby listeners, still treats an open lounge as an acceptable place for the discussion. Joining in compounds the breach, and going straight to a state complaint without addressing it locally is disproportionate."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A kindergarten teacher notices that one of her students has unexplained bruising on her arms on multiple occasions over a three-week period. The student has become increasingly withdrawn in class. The teacher is not certain whether abuse is occurring. Under New York State law, what is the teacher's MOST appropriate action?",
    "a": [
      "Report her reasonable suspicion immediately to the Statewide Central Register, since mandated reporters need only reasonable cause to suspect, not certainty.",
      "Consult the school social worker and nurse to gather additional observations over the next week before making a formal report, to avoid the serious harm of a false allegation.",
      "Speak with the student's parents at the next conference to ask about the bruising and give them the opportunity to explain.",
      "Document the observations in her grade book and wait until the end of the quarter to see if a clearer pattern emerges."
    ],
    "c": 0,
    "r": "Under NY Social Services Law Section 413, mandated reporters, including teachers, must report reasonable suspicion of child abuse or maltreatment immediately to the Statewide Central Register; certainty is not required, and the duty belongs to the individual reporter. Consulting the social worker to gather more evidence first is the strongest distractor because it feels prudent, but delaying to confirm a suspicion can itself constitute a failure to report under the statute. Documenting and waiting similarly delays a mandatory report, and questioning the parents risks tipping off a suspected perpetrator and is not the teacher's role."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "While proctoring the NYS Grade 5 math assessment, a teacher sees a former student of hers stuck on an item. The student looks up and whispers, \"Can you just read this one to me?\" Reading aloud is not among this student's testing accommodations. What must the teacher do?",
    "a": [
      "Decline to read the item, redirect the student to keep working, and continue proctoring according to the state's administration manual.",
      "Read the item aloud to the student but paraphrase it in simpler, everyday words rather than reading it verbatim, on the theory that rephrasing avoids disclosing the exact secured test content to the student.",
      "Read the single item quietly, since one question will not meaningfully change the student's scale score.",
      "Allow a nearby classmate who has finished to quietly explain what the question is asking."
    ],
    "c": 0,
    "r": "State assessment security and administration rules bind proctors to the administration manual; providing a read-aloud that is not a documented accommodation is a testing irregularity that can invalidate the score and expose the educator to Part 83 moral-character review. Paraphrasing is a greater alteration than verbatim reading, and involving another student both breaches security and disrupts standardized conditions."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "At an annual review, a parent asks the CSE to add 1:1 aide support to her daughter's IEP. After discussion, the district members decline the request. The parent asks, \"So what happens now? Do I just get told no?\" What is the district required to provide?",
    "a": [
      "Nothing further is required of the district, because a parent request that has been discussed in good faith and then declined at a duly convened annual review meeting needs no additional written documentation.",
      "A revised IEP that includes the aide on a 30-day trial basis while the disagreement is documented.",
      "Prior written notice explaining what was refused, the reasons and the data relied upon, and a copy of the procedural safeguards describing the parent's dispute-resolution options.",
      "A referral of the dispute to the building principal, who decides whether the aide is added."
    ],
    "c": 2,
    "r": "IDEA requires prior written notice whenever a district proposes or refuses to initiate or change identification, evaluation, placement, or FAPE; the notice must describe the refused action, explain the basis with the evaluation data considered, and inform parents of their procedural safeguards, including mediation, state complaint, and due process. Silence after a refusal violates the notice requirement, a mandatory trial period is not required by the statute, and a principal has no authority to overrule the CSE."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A high school teacher notices that a student's academic performance has declined sharply over two marking periods. The student's family has not responded to two written notices sent home. What is the MOST effective and equitable strategy for the teacher to pursue?",
    "a": [
      "Document the attempted contacts, try direct phone calls at different times of day, and enlist the family outreach coordinator or social worker if there is still no response.",
      "Wait until the next scheduled report card conference to raise the concern in person.",
      "Submit a written request for referral to the CSE right away, since the family's lack of response may signal that the student has a disability.",
      "Send a third written notice by certified mail indicating that continued non-response may result in a mandatory parent conference or a truancy referral to the district office."
    ],
    "c": 0,
    "r": "Escalating outreach through varied modalities (phone, varied times) and involving school family-engagement staff is the evidence-based, equitable response to non-response; it recognizes that families may face access barriers such as work schedules, literacy, or language rather than indifference. The strongest distractor, rushing a written request for referral to the CSE, is inappropriate: academic decline plus an unreached family does not by itself suggest a disability, and in New York a teacher's request for referral must state the reasons, describe the interventions already tried (or why none were), and describe the extent of parent contact. Here no interventions have been tried and the family has not yet been reached, so a request would be premature."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A second-grade teacher has a student who is classified as an English Language Learner (ELL). The parents speak Haitian Creole and have limited English proficiency. The teacher wants to share data from the student's most recent ENL progress monitoring report at an upcoming conference. What must the school provide to ensure the parents can meaningfully participate?",
    "a": [
      "The bilingual education teacher's contact information so the parents can schedule a separate meeting conducted in Haitian Creole at a time convenient for the family.",
      "An English copy of the report so parents can study it before the meeting.",
      "A summary of results in plain English delivered by the student.",
      "A qualified interpreter and translated written materials in Haitian Creole, at no cost to the family."
    ],
    "c": 3,
    "r": "Title VI of the Civil Rights Act of 1964 and New York State guidance require schools to provide meaningful access to programs and activities for parents with limited English proficiency, which includes qualified interpreters and translated documents at no cost. Having the student interpret violates professional and ethical standards because it burdens the child, compromises accuracy, and undermines parents' ability to make informed decisions about their child's education."
  },
  {
    "s": "C4",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A middle school uses a school-wide PBIS framework. A parent contacts the assistant principal to express frustration that she was not informed about the behavioral expectations tier her son has been placed on, nor was she involved in developing his individualized behavior support plan. Which statement BEST reflects appropriate school practice under PBIS and family partnership principles?",
    "a": [
      "Family involvement is encouraged but optional at Tiers 2 and 3; schools meet their obligation by informing parents of tier placement at regularly scheduled report card conferences.",
      "At Tiers 2 and 3, schools should proactively communicate tier placement, share progress data, and involve parents in developing individualized behavior support plans.",
      "Because the student has no IEP, the school retains full discretion over behavioral programming without any parental input.",
      "PBIS is a general education intervention, so schools are not required to involve parents at any tier."
    ],
    "c": 1,
    "r": "Effective PBIS implementation at Tiers 2 and 3 requires family partnership: parents should be informed of tier placement, provided with data on their child's progress, and included as collaborators in individualized support-plan development to ensure consistency across school and home, a core EAS Competency 4. The other options understate this obligation; although Tier 2/3 supports are not IEPs, best-practice standards and New York's Multi-Tiered System of Supports (MTSS) guidance treat meaningful family engagement as essential, not discretionary, at higher tiers."
  }
];

const MODULES = {
  "Knowing Learners & Building Classroom Community": {
    "icon": "🧭",
    "concepts": [
      {
        "title": "Strategies to Learn About Students",
        "body": "Effective teachers use multiple data sources to understand each learner before and during instruction. Formal methods include reviewing cumulative records, IEPs (mandated under IDEA 2004), Section 504 plans for students whose impairment substantially limits a major life activity, and English-learner identification data (the Home Language Questionnaire and the NYSITELL, New York's initial proficiency screener). Because these records are protected, FERPA limits access to school officials with a legitimate educational interest. Informal methods, such as student interest inventories, family surveys, personal narrative writing, and structured observation, surface cultural assets, interests, and prior knowledge that records miss. 'All About Me' activities and conversations in students' home languages reveal multilingual learners' communicative strengths and help teachers anticipate the gap between conversational fluency (BICS) and academic language (CALP). Consistent anecdotal records and observation protocols let teachers track social-emotional development alongside academics, ensuring gifts and talents are recognized across multiple domains, not only through dominant-culture academic performance. The goal is an asset-based, multi-source profile that informs differentiated, equitable instruction."
      },
      {
        "title": "Teacher Self-Reflection to Strengthen Practice",
        "body": "Self-reflection is a professional expectation embedded in the New York State Code of Ethics for Educators and in the EAS framework, which names self-reflection as a way to enhance interactions with all students. Teachers examine their own cultural lens (assumptions, biases, and unexamined privilege) to identify how it shapes instructional decisions, classroom interactions, and assessment. Structured tools include reflective journals, video analysis of one's own teaching, and peer observation with evidence-based feedback. Reflective practice is cyclical: collect evidence, analyze patterns, revise practice, observe the impact, then repeat. For EAS purposes, candidates connect self-reflection explicitly to equity. Does my feedback differ by student race or language background? Are my wait-time and questioning patterns equitable across the class? Do the texts I select represent more than one cultural tradition? Reflection that surfaces these patterns and drives deliberate instructional adjustments, rather than reflection for its own sake, is the practitioner standard the EAS assesses. The distinguishing feature is that the teacher, not the student, is the object of analysis."
      },
      {
        "title": "Culturally Responsive Classroom Environments",
        "body": "Two related but distinct frameworks ground this work. Gloria Ladson-Billings theorized culturally relevant pedagogy (1995), and Geneva Gay theorized culturally responsive teaching (2000); both hold that rigorous academic instruction is most effective when it affirms students' cultural identities and treats community knowledge as an intellectual resource rather than a deficit. In such a classroom, the physical environment reflects diverse contributions (multilingual word walls, representative literature, student artifacts), and curriculum incorporates texts and problems students recognize as connected to their lives. Instruction can draw on community cultural wealth, the aspirational, linguistic, familial, social, navigational, and resistant capital described by Yosso (2005), as pedagogical assets. In New York, these practices are reinforced by the Dignity for All Students Act (DASA), which requires school environments free from harassment and discrimination based on a student's actual or perceived race, color, weight, national origin, ethnic group, religion, religious practice, disability, sex, sexual orientation, and gender (including gender identity and expression). Culturally responsive practice is thus both pedagogically sound and, in New York, legally reinforced."
      },
      {
        "title": "Building Classroom Community Among Diverse Groups",
        "body": "Classroom community is the relational infrastructure that makes academic risk-taking possible. Research-based structures include morning meetings (Responsive Classroom), structured cooperative learning built on Johnson and Johnson's five elements (positive interdependence, individual accountability, promotive face-to-face interaction, interpersonal and small-group skills, and group processing), classroom circles, and service-learning that positions every student as a contributor. Community building deliberately addresses intergroup dynamics: protocols such as jigsaw distribute participation and authority across students from different racial, linguistic, and ability backgrounds. Positive Behavioral Interventions and Supports (PBIS) is a school-wide, multi-tiered framework for teaching and reinforcing shared behavioral expectations; paired with data-based decision-making, it can reduce the exclusionary discipline that disproportionately affects students of color and students with disabilities. Restorative practices (including restorative circles and peer mediation) repair harm and rebuild relationships rather than simply removing students. Explicit social-emotional learning, organized around CASEL's competencies (self-awareness, self-management, social awareness, relationship skills, and responsible decision-making), complements academic routines to sustain an inclusive, affirming community for all learners."
      },
      {
        "title": "Understanding Cultural and Family Backgrounds",
        "body": "Family engagement is both a legal obligation and a high-leverage practice. Title I (Section 1116 of ESSA) requires meaningful parent and family engagement, and IDEA mandates parent participation in IEP development, prior written notice, and procedural safeguards. Effective teachers move beyond compliance to build two-way partnerships using asset-based communication, learning what families know, value, and hope for their children rather than defaulting to deficit framing. Strategies include home visits, family literacy nights, and accessible communication formats in home languages. For English-learner families, Title VI of the Civil Rights Act of 1964 requires schools to communicate essential information (enrollment, report cards, discipline, special education, and program notices) to limited-English-proficient parents in a language they understand, using translated documents and qualified interpreters rather than students; New York's Part 154 adds that ELL identification, program-placement, and orientation notices go to parents in their preferred language. A related duty covers the students themselves: Lau v. Nichols (1974), decided under Title VI, and the Equal Educational Opportunities Act of 1974 require schools to give ELLs meaningful access to instruction. Teachers should also recognize how acculturation stress, immigration-related fear, and a history of discriminatory schooling can dampen family participation. A funds-of-knowledge approach (Moll et al.) treats household and community practices as legitimate starting points for learning, bridging home and school."
      },
      {
        "title": "Recognizing Gifts, Talents, and Individual Needs Across Diverse Populations",
        "body": "Teachers must recognize the full range of learner variability. IDEA lists 13 disability categories in the federal regulations (New York's Part 200 uses 13 parallel classifications with NYS terms such as 'learning disability' and 'emotional disability'), and a student qualifies for special education only when the disability also creates a need for specially designed instruction. Section 504 of the Rehabilitation Act protects a broader group: students whose physical or mental impairment substantially limits a major life activity, usually served through a 504 plan of accommodations and services. Response to Intervention (RtI), a multi-tiered system of high-quality core instruction, universal screening, increasingly intensive intervention, and progress monitoring, provides support before any disability determination and can also flag students who need enrichment. In New York, every district must have an RtI process for K-4 reading, and a CSE may not use the severe-discrepancy model to find a learning disability in reading for a student in kindergarten through grade 4; RtI may never be used to delay or deny an evaluation a parent requests. A central equity concern is misidentification: teachers must guard against attributing a CLD student's struggle to disability when limited English proficiency, lack of appropriate instruction, or cultural mismatch is the better explanation, while also addressing the historic underidentification of gifted CLD students. Universal Design for Learning (CAST) proactively reduces barriers through multiple means of representation, action and expression, and engagement, so that disability, giftedness, and language development are all served in the same environment."
      },
      {
        "title": "New York's Culturally Responsive-Sustaining (CR-S) Education Framework",
        "body": "New York's own statement of what a culturally responsive classroom looks like is the Culturally Responsive-Sustaining (CR-S) Education Framework, released by NYSED in 2018 and still posted as current state guidance. It builds on culturally relevant pedagogy (Ladson-Billings), culturally responsive teaching (Gay), and culturally sustaining pedagogy (Paris), and it treats culture broadly: race, language, religion, gender, sexual orientation, ability, nationality, and economic background all shape identity. The framework rests on four principles. (1) Welcoming and Affirming Environment: students see themselves and their families in the space, and relationships, routines, and norms signal that every identity belongs. (2) High Expectations and Rigorous Instruction: all students are held to rigorous standards and given the scaffolds to reach them; affirmation never means lowered demand. (3) Inclusive Curriculum and Assessment: materials and tasks reflect multiple perspectives, connect to students' lives, and let students show learning in more than one way. (4) Ongoing Professional Learning and Support: educators examine their own biases and keep building skill, which ties directly to the EAS expectation of self-reflection. The framework assigns roles to students, families, and community members as well as teachers. Two common EAS traps: a warm room with lowered expectations violates principle 2, and a single heritage month falls short of principle 3. Classrooms that pair affirmation with rigor are associated with stronger engagement, belonging, and achievement for students from historically marginalized groups."
      }
    ],
    "practice": [
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 4th-grade teacher has several newly enrolled students who are recent immigrants with limited English proficiency. Before designing her first unit, she wants to gather information that will help her build on each student's strengths. Which of the following actions would BEST help her accomplish this goal?",
        "a": [
          "Administer a grade-level standardized reading assessment in English and use the results to assign flexible reading groups, updating placements after each benchmark cycle.",
          "Review the Home Language Questionnaire, ensure each student is screened with the NYSITELL, and conduct interest inventories in the students' home languages.",
          "Ask the school counselor to observe each new student for two weeks before sharing any information with the teacher.",
          "Assign a classroom buddy to each new student and rely on peer reports to understand the students' backgrounds and needs."
        ],
        "c": 1,
        "r": "The correct answer is right because it pairs the required English-learner identification process (the Home Language Questionnaire and the NYSITELL screener establish proficiency level and services) with an asset-based informal tool (interest inventories in the home language) that surfaces students' interests and strengths and helps the teacher anticipate the gap between conversational fluency (BICS) and academic language (CALP). The strongest distractor is wrong: a grade-level English reading assessment mainly reflects current English proficiency, not academic potential or cultural assets, and using it to group these students risks misidentifying limited English proficiency as low ability."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "After reviewing video recordings of his own instruction, a middle school teacher notices that he consistently calls on the same six students and rarely waits more than two seconds for a response before redirecting. According to the EAS framework, this teacher is engaging in which professional practice?",
        "a": [
          "Self-reflection, analyzing his own teaching behaviors to identify equity gaps and improve practice.",
          "Culturally responsive teaching, documenting cultural participation patterns among his students in order to inform curriculum and questioning choices.",
          "Differentiated instruction, adjusting pacing to meet individual student needs.",
          "Formative assessment, using observational data to monitor student understanding."
        ],
        "c": 0,
        "r": "The correct answer is right because the teacher is using video evidence to examine his own instructional behavior, specifically inequitable patterns in who he calls on and how long he waits. The EAS framework and the New York State Code of Ethics for Educators frame this kind of self-examination, aimed at enhancing interactions with all students, as self-reflection. The strongest distractor is wrong: formative assessment analyzes data about student learning, whereas here the object of analysis is the teacher's own practice, not the students' understanding."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A high school teacher is redesigning her classroom library and discussion norms to better serve a class with students from seven different countries and three students with IEPs. She wants the environment to affirm all students' identities while meeting her legal obligations under the Dignity for All Students Act (DASA). Which combination of actions BEST reflects this goal?",
        "a": [
          "Curate a multilingual, culturally diverse library, establish anti-harassment norms aligned with DASA's protected categories, and apply UDL so texts and discussions are accessible to the students with IEPs.",
          "Display student work samples on a bulletin board and let students choose their own seating arrangement each day.",
          "Stock the classroom library primarily with texts by authors from the students' seven home countries and encourage most class discussion in the home languages, so that every child sees their own identity reflected in the room each day.",
          "Send a letter asking families to donate books from their home cultures and postpone establishing community norms until all of the materials have arrived."
        ],
        "c": 0,
        "r": "The correct answer is right because it integrates three sound practices at once: culturally responsive curation (a diverse, multilingual library), compliance with DASA's mandate for an environment free of harassment based on its protected categories, and UDL's proactive accessibility, which addresses disability and linguistic variability in the same design. The strongest distractor, stocking the library almost entirely with texts from the seven home countries and moving most discussion into home languages, sounds affirming but narrows shared discussion, does nothing to set DASA-aligned norms, and does not make texts or discussion accessible to the students with IEPs."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 2nd-grade teacher notices that a Latina student who scored Commanding on the state's annual English language proficiency test, exited ELL status, and now receives Former ELL services rarely participates in group work, and her academic performance has declined. When the teacher contacts the family, the grandmother explains that the family recently received threatening correspondence related to their immigration status and is very anxious. What is the MOST appropriate next step for the teacher?",
        "a": [
          "Ask that the student be returned to ELL status and full ENL services, because her recent performance resembles that of an English learner.",
          "Submit a written request for a CSE referral, since an academic decline after exiting ELL status may indicate a learning disability previously masked by her English-learner status, and early identification protects her rights.",
          "Tell the family that immigration matters are outside the school's scope and keep the conversation focused entirely on academic skill remediation.",
          "Acknowledge the family's stress, connect them with the school social worker and community resources, and use low-stakes structures such as cooperative learning and restorative circles to re-engage the student."
        ],
        "c": 3,
        "r": "The correct answer is right because it demonstrates an asset-based family partnership, responsiveness to acculturation stress and family fear as factors affecting participation, and use of community-building structures (cooperative learning and restorative practices, consistent with PBIS and SEL) to address the social and academic regression. The strongest distractor is wrong: IDEA's eligibility rules require ruling out limited English proficiency or a lack of appropriate instruction as the determinant factor (34 CFR 300.306(b)), so referring for evaluation while an obvious environmental cause is unaddressed is premature and risks disproportionate identification of culturally and linguistically diverse students. A teacher cannot return a student to ELL status; under Part 154 the student already keeps Former ELL services for two years after exit."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 3rd-grade teacher planning a measurement unit learns through family surveys that several students' parents work in construction, tailoring, and restaurant kitchens. Applying a funds-of-knowledge approach, what should she do with this information?",
        "a": [
          "Deliberately avoid referencing any family occupations in the measurement lessons, so that students from households with lower-status or lower-income jobs are never put in a position to feel embarrassed in front of their peers.",
          "Use the survey results to form ability groups that reflect the likely academic support available in each home.",
          "Save the information for career day so families can present their jobs to the class in the spring.",
          "Design measurement tasks that draw on the estimating, cutting, and scaling practices of those household trades, positioning students' family expertise as mathematical knowledge."
        ],
        "c": 3,
        "r": "A funds-of-knowledge approach (Moll et al.) treats household practices as intellectual resources for academic instruction, not just enrichment; anchoring measurement in trades students know converts family expertise into curricular capital. Deferring the information to career day leaves instruction unchanged, avoidance reflects deficit framing, and predicting academic support from parent occupation is stereotyping, not asset-based teaching."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 10th-grade teacher returns essays to a diverse class. Research on \"wise feedback\" and stereotype threat suggests which feedback framing will most support students from negatively stereotyped groups?",
        "a": [
          "\"This shows real effort. Writing is hard for a lot of students from schools like your last one, so don't be too hard on yourself.\"",
          "\"I've marked the errors gently and removed some tougher requirements so the grade won't discourage you.\"",
          "\"I'm giving you these comments because I have high standards and I know you can meet them; here is specifically what to revise.\"",
          "\"Compare your essay with the exemplar I posted and see where yours falls short of the strongest papers in the class.\""
        ],
        "c": 2,
        "r": "Wise feedback pairs an explicit statement of high standards with an assurance that the student can reach them, plus concrete guidance; this combination has been shown to increase revision and trust for students contending with stereotype threat. Softening demands communicates low expectations, invoking the student's background activates the stereotype, and pure social comparison provides neither assurance nor actionable direction."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A district's gifted program is 78% White in a district where White students are 40% of enrollment. Identification currently depends on teacher nomination followed by testing. Which change most directly addresses the underrepresentation of culturally and linguistically diverse students?",
        "a": [
          "Replace the gifted program with whole-class enrichment so identification decisions are no longer necessary.",
          "Retain the existing teacher-nomination process but require each teacher to nominate at least one student of color from every class each year, so the demographic mix of the gifted program gradually comes to reflect the school.",
          "Adopt universal screening of all students with measures normed for diverse populations, using local norms and multiple criteria rather than relying on teacher nomination as the gateway.",
          "Lower the qualifying cutoff score for students from underrepresented groups by ten percentile points."
        ],
        "c": 2,
        "r": "Nomination-dependent systems are a documented source of bias in gifted identification; universal screening with multiple criteria and appropriate norms removes the subjective gate and has been shown to substantially increase identification of CLD and low-income gifted students. Nomination quotas keep the biased gateway, differential cutoffs invite legal and validity problems, and eliminating the program denies services rather than fixing identification."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "Two 8th-graders have an escalating conflict that ends in a shoving match. Both are suspended for a day. On their return, the dean asks their teacher to help prevent recurrence. Which approach is most consistent with restorative practices?",
        "a": [
          "Have each of the two students write a private letter of apology that the teacher reads over and quietly files, without any further structured discussion or face-to-face contact between the students involved in the conflict.",
          "Warn both students that the next incident will result in a longer suspension and a parent meeting with the principal.",
          "Facilitate a structured restorative conference in which both students describe the harm done, hear its impact, and agree on specific repair steps, with follow-up check-ins.",
          "Assign the students to opposite sides of the room and build a schedule that keeps them apart for the rest of the year."
        ],
        "c": 2,
        "r": "Restorative practices repair harm and rebuild relationships through structured dialogue, accountability, and agreed repair steps with follow-up; this addresses the conflict rather than merely managing proximity. Permanent separation and escalating threats are containment strategies that leave the harm unaddressed, and filed apology letters lack the face-to-face accountability and relationship repair that define the restorative model."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "Before the school year begins, a 6th-grade teacher wants an efficient way to learn about her incoming students as individuals. Which combination of sources will give her the most complete asset-based picture?",
        "a": [
          "The class list sorted by reading level, so instruction can be differentiated before students arrive.",
          "Cumulative records and IEPs/504 plans, plus student interest inventories, a family survey, and a short personal-narrative writing invitation in the first week.",
          "The prior year's state test scores and final report card grades for every student on the roster.",
          "Build a first-week seating chart based on the previous teachers' behavior notes about each incoming student, so that potential classroom management problems can be anticipated and prevented from the very first day of school."
        ],
        "c": 1,
        "r": "An asset-based learner profile triangulates formal sources (records, IEPs, language data) with informal tools that surface interests, cultural assets, and family perspectives; no single academic metric captures the whole learner. Test scores and levels alone describe achievement, not identity or strengths, and organizing a room around prior behavior notes imports other adults' judgments and primes deficit expectations."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 9th-grader privately tells his teacher that he is transgender, asks to be called by a new name and male pronouns in class, and says he is not ready for his parents to know. Under DASA and NYSED guidance, what should the teacher do?",
        "a": [
          "Poll the class to be sure other students are comfortable with the change before adopting it.",
          "Refer the student to counseling and continue the roster name in the meantime so records stay consistent.",
          "Use the requested name and pronouns in class, maintain the student's confidentiality, and consult the building's DASA coordinator about supports, without outing the student to his family.",
          "Explain gently that the school is not able to use a different name or pronouns for the student until the change has been made legally and, in any case, the student's parents have been formally notified of the request."
        ],
        "c": 2,
        "r": "DASA protects students from discrimination and harassment based on gender identity and expression, and NYSED guidance directs schools to honor a student's asserted name and pronouns and to protect the student's privacy, including from disclosure to family that the student has not authorized. No legal name change is required for classroom use, peer approval is not a condition of a student's rights, and defaulting to the roster name disregards the student's stated identity."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 4th-grade teacher in a largely Bangladeshi and Guyanese school has decorated her room with family photos and student-made flags. Observations show that she asks her newcomer ELLs only yes/no questions and gives them easier texts than the rest of the class 'so they don't feel bad.' Using New York's Culturally Responsive-Sustaining Education Framework, which next step would BEST strengthen her practice?",
        "a": [
          "Add more cultural displays and a monthly heritage celebration, since a stronger welcoming environment will raise the newcomers' confidence enough that they participate more.",
          "Continue the easier texts and simpler questions until the newcomers test at a higher proficiency level, then move them gradually onto grade-level work and questioning.",
          "Ask the ENL teacher to take over academic instruction for the newcomers, so that the classroom teacher can focus her own time on building community with them.",
          "Keep grade-level texts and higher-order questions for the newcomers, adding visuals, sentence frames, and home-language supports so they can reach them."
        ],
        "c": 3,
        "r": "The correct answer is right because the CR-S principle of High Expectations and Rigorous Instruction calls for holding every student to rigorous standards and adding scaffolds, not lowering demand out of sympathy; her room already reflects the Welcoming and Affirming Environment principle. The strongest distractor, waiting to raise demand until proficiency rises, sounds supportive but keeps newcomers in a watered-down track that slows both language and content growth. More displays repeat a strength she already has, and handing instruction to the ENL teacher abandons her own responsibility for the students."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A middle school leadership team wants to use New York's CR-S Framework to guide a year of school improvement. Which plan BEST reflects the framework as a whole?",
        "a": [
          "Purchase a new multicultural literature collection for every classroom library, since inclusive materials are the core requirement of culturally responsive-sustaining education.",
          "Hold one schoolwide cultural festival each spring, planned by the PTA, so that families from every background can showcase their traditions for the whole school community.",
          "Pair a review of curriculum for inclusiveness with schoolwide rigor expectations, student and family input on climate, and teacher study of their own practice.",
          "Require teachers to complete a one-time online module on cultural competence, then evaluate each teacher on whether multicultural posters appear in the room."
        ],
        "c": 2,
        "r": "The correct answer is right because the CR-S Framework has four interlocking principles (a welcoming and affirming environment, high expectations and rigorous instruction, inclusive curriculum and assessment, and ongoing professional learning) and gives students and families roles alongside staff; only this plan touches all of them. The strongest distractor, new multicultural libraries, addresses inclusive curriculum alone and treats materials as the whole framework. A single festival is the add-on approach the framework moves beyond, and a one-time module with poster checks is neither ongoing learning nor a measure of practice."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A first-year teacher keeps a weekly journal about her lessons. Her mentor suggests making the reflection more useful for equity. Which revision would BEST strengthen her self-reflection?",
        "a": [
          "Tally whom she calls on and the feedback each student gets, look for patterns by student group, change one practice, and then recheck the data.",
          "Write longer journal entries after every lesson describing how she felt during class, so that she builds a richer, more detailed record of her emotional reactions across the year.",
          "Ask her students to complete an end-of-year survey rating her teaching, and then use the class averages to set her professional goals for her second year in the classroom.",
          "Read a book on culturally responsive teaching each semester and summarize its main ideas in her journal, so that her reflection draws consistently on current research."
        ],
        "c": 0,
        "r": "The correct answer is right because effective self-reflection is cyclical and evidence-driven: gather data on one's own practice, analyze it for patterns across student groups, revise, and observe the effect. Tallies of participation and feedback make otherwise invisible inequities visible. The strongest distractor, reading and summarizing research, builds knowledge but never examines the teacher's own classroom behavior. Longer feelings-based entries lack evidence, and an end-of-year survey arrives too late to change practice for this year's students."
      }
    ]
  },
  "Inclusive, Evidence-Based Instruction & UDL": {
    "icon": "🧩",
    "concepts": [
      {
        "title": "Universal Design for Learning (UDL)",
        "body": "UDL is a research-based framework (CAST, 2018) that guides teachers to proactively reduce barriers by designing flexible instruction from the start, not retrofitting accommodations afterward. It rests on three principles tied to distinct learning networks: (1) Multiple Means of Representation (the 'what' of learning), offering content through text, visuals, audio, and manipulatives so all learners can perceive and comprehend; (2) Multiple Means of Action and Expression (the 'how'), allowing students to demonstrate understanding through writing, speech, drawing, or digital tools; (3) Multiple Means of Engagement (the 'why'), sustaining motivation through choice, relevance, and appropriate challenge. UDL benefits all learners, not only students with disabilities: English language learners, SIFE, gifted learners, and students experiencing instability all benefit from flexible pathways. On the EAS, UDL items typically ask you to identify which classroom design choice proactively reduces barriers rather than adds a fix after the fact. Key distinction: UDL is universal design built into the lesson, not individualized accommodation; it creates the inclusive environment in which individualized supports (IEPs, 504 plans) operate, and it does not replace them."
      },
      {
        "title": "Research-Based vs. Evidence-Based Practice",
        "body": "The EAS framework defines these two terms itself, and its definitions differ from common textbook usage, where 'evidence-based practice' is often treated as the stricter term, so learn the framework's version for the exam. Research-based practices have been shown to improve learner outcomes through systematic observation or experiment, rigorous data analysis, replicated results, and publication in a peer-reviewed journal. Evidence-based strategies have been empirically shown to improve learner outcomes but are not necessarily grounded in systematic experiments or published in peer-reviewed journals (for example, a strategy backed by consistent school outcome data). On the EAS, research-based is the higher bar. Federal law uses its own vocabulary: IDEA requires that special education and related services be based on peer-reviewed research to the extent practicable (34 CFR 300.320(a)(4)), and ESSA defines 'evidence-based' through four tiers (strong, moderate, promising, and demonstrates a rationale), with the top three meeting the standard for certain funded interventions. Under any of these standards, choosing an approach because it is popular, familiar, or traditional is not enough. Practices with strong peer-reviewed support include explicit instruction, peer-assisted learning strategies, and systematic phonics instruction. RtI and PBIS, the academic and behavioral arms of a Multi-Tiered System of Supports, put this into practice by requiring research-based core instruction at Tier 1 before support is intensified; New York's RtI regulation (8 NYCRR 100.2(ii)) requires research-based instruction and interventions matched to student need."
      },
      {
        "title": "Students with Interrupted/Inconsistent Formal Education (SIFE)",
        "body": "Under NYSED, SIFE are English language learners who, upon enrollment, have attended U.S. schools for fewer than 12 months and are two or more years below grade level in home-language literacy and/or in mathematics because of inconsistent or interrupted schooling before arrival. 'Low-literacy SIFE' have home-language literacy at or below the third-grade level. NYSED requires that SIFE receive ENL (or bilingual) services plus additional support addressing foundational literacy and numeracy gaps. SIFE needs differ from those of typical ELLs: instruction must simultaneously build academic language and the foundational content peers acquired in earlier grades, without conflating limited schooling with cognitive disability. Cummins' BICS/CALP framework is essential: BICS (conversational fluency) develops within about 1-2 years, while CALP, the decontextualized academic language school demands, takes roughly 5-7 years. Misidentifying a SIFE student as having a learning disability when the real factor is interrupted education or limited English proficiency violates IDEA's exclusionary-factor rule (34 CFR 300.306(b)), which bars a disability determination when the determinant factor is limited English proficiency or lack of appropriate instruction in reading or math."
      },
      {
        "title": "Students Experiencing Homelessness, Foster Care, and Poverty",
        "body": "The McKinney-Vento Homeless Assistance Act, implemented in New York through Education Law 3209, protects students who lack a fixed, regular, and adequate nighttime residence: students sharing housing because of loss of housing or economic hardship (doubled up), students living in motels, shelters, cars, or public spaces, and unaccompanied youth. They must be enrolled immediately, even without records, proof of residency, or immunization documentation, and every district designates a McKinney-Vento liaison to coordinate services. In New York, the designator (the parent, guardian, or unaccompanied youth), not the district, chooses the school district of origin, the district of current location, or a district in a regional placement plan, using the STAC-202 form, and transportation to the school of origin is provided. A student may stay in the school of origin for the duration of homelessness, through the end of the school year in which the family becomes permanently housed, and one more year if that is the student's final year in the building. Districts must also remove barriers created by fees, fines, and absences. Since December 2016, children awaiting foster care placement are no longer covered by McKinney-Vento; students in foster care instead receive parallel protections under ESSA: remaining in the school of origin unless a best-interest determination finds otherwise, immediate enrollment if they move, agency points of contact, and a transportation plan. Poverty broadly shapes academic risk; students may face food insecurity, housing instability, limited technology access, and high mobility, all of which intersect with learning. Trauma-informed practice, consistent routines, and culturally responsive approaches reduce barriers across adverse circumstances. Teachers should also recognize diverse family structures (single-parent, multigenerational, same-sex-parent, grandparent-headed, kinship care) and design school-home communication that does not presume a two-parent household. EAS items here often ask you to identify the teacher action that upholds both legal protections and an equitable climate: not charity framing, but rights-affirming, asset-based practice."
      },
      {
        "title": "Gifted Students and Curriculum Modification",
        "body": "New York defines gifted pupils (Education Law Article 90; CR Part 142) as those who show evidence of high performance capability and exceptional potential, such as general intellectual ability, special academic aptitude, or outstanding ability in the visual or performing arts, and who need programs beyond the regular school program to realize their potential. Unlike students with disabilities, gifted students have no federal IDEA entitlement, and New York does not mandate gifted identification or programming, though districts must screen new entrants for possible giftedness (CR Part 117). Appropriate modifications include acceleration (faster pacing or grade skipping), curriculum compacting (pre-assessing and replacing mastered content with enrichment), tiered assignments (varied complexity from one essential question), and independent study or project-based extensions. Key EAS distinction: simply assigning more of the same work (more problems, longer essays) is not enrichment; it is busywork that can undermine motivation. UDL's principle of appropriate challenge applies to gifted learners as much as to students who need additional support. Teachers should use pre-assessment data to gauge readiness and match cognitive demand to each learner's instructional level."
      },
      {
        "title": "Fair, Equitable Assessment to Inform Instruction",
        "body": "Equitable classroom assessment means the tools, processes, and interpretations teachers use do not systematically advantage or disadvantage students by race, language, disability status, or socioeconomic background. Key principles: (1) Validity, the task must measure the intended learning, not an irrelevant factor like English proficiency when the target is science content; (2) Multiple measures, no single score should drive instructional decisions; (3) Formative vs. summative, formative assessment (exit tickets, observations, think-alouds) guides daily instruction while summative assessment evaluates cumulative learning; (4) Accommodations vs. modifications, students with IEPs or 504 plans may receive accommodations (extended time, read-aloud) that do not alter the construct measured, while modifications change the standard or expectation itself. Under FERPA, personally identifiable assessment data is protected; disclosing it without consent (absent an exception such as a school official with legitimate educational interest) violates federal law. Under IDEA's Child Find duty, results suggesting an unmet disability-related need should prompt a referral to the CSE, after ruling out limited English proficiency or inadequate instruction as the determinant factor. Reviewing assessments for cultural, linguistic, or experiential bias is a professional responsibility for all NYS teachers."
      },
      {
        "title": "Inclusive Practice for Students of All Genders and Sexual Orientations",
        "body": "The EAS framework names students of different genders and sexual orientations among the groups teachers must serve effectively and inclusively. In New York the legal floor is clear. The Dignity for All Students Act (DASA) protects students from harassment, bullying, and discrimination based on actual or perceived sexual orientation and gender, defined to include gender identity and expression, and the state Human Rights Law, amended by the Gender Expression Non-Discrimination Act (GENDA, 2019), bars discrimination based on gender identity or expression, including in schools. NYSED's 2023 guidance on transgender and gender expansive students directs schools to use the name and pronouns a student asserts without requiring legal documents or parent permission, to protect the student's privacy about gender identity, to provide access to facilities and activities consistent with that identity, and to plan supports with the student; it also notes that FERPA lets parents review education records. Federally, the 2024 Title IX rule was vacated in January 2025, so New York protections rest on DASA and the Human Rights Law. In the classroom, inclusive practice means monitoring your own interaction patterns for gender bias (who is called on, praised, or redirected, and for what); avoiding gendered grouping and routines such as boys-versus-girls competitions; including LGBTQ+ people and families in texts and examples where they naturally fit (after Mahmoud v. Taylor, 2025, parents with religious objections are entitled to notice and the chance to opt their children out of such instruction, so follow district opt-out procedures); interrupting slurs and anti-gay remarks every time and reporting harassment under DASA; and supporting student-led clubs such as Gender and Sexuality Alliances, which the federal Equal Access Act protects in secondary schools that allow other noncurricular clubs. National school climate surveys consistently link these supports to lower victimization and better attendance for LGBTQ+ students."
      }
    ],
    "practice": [
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A fifth-grade teacher is planning a unit on the American Revolution. She wants to ensure that all students, including two students with IEPs, three English language learners, and one student identified as gifted, can access the content and demonstrate understanding. Which of the following instructional planning approaches BEST reflects Universal Design for Learning?",
        "a": [
          "Follow the core textbook lesson sequence and provide one-on-one re-teaching only to students who struggle after each assessment.",
          "Assign the gifted student independent research and group the remaining students by reading level for differentiated small-group instruction throughout the unit.",
          "Design the unit from the start with layered text options, visual timelines, choice boards for demonstrating mastery, and discussion supports, so all learners access the same content flexibly.",
          "Develop the unit using grade-level text, then create modified packets for students with IEPs and simplified vocabulary sheets for the ELLs once the core plan is complete, so each group's needs are individually addressed."
        ],
        "c": 2,
        "r": "The correct answer is right because UDL requires proactive, flexible design built in from the start, offering multiple means of representation, action and expression, and engagement for all learners at once. The strongest distractor, building the unit on grade-level text and then creating modified packets and simplified vocabulary sheets once the core plan is complete, is retrofitting: supports are added after the design is finished, which is the opposite of UDL's proactive approach and routes students with IEPs and ELLs into a separate, parallel track."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A middle school recently enrolled a 13-year-old student who arrived from Central America. Records indicate she attended school only sporadically between ages 6 and 11 due to displacement, and her literacy in Spanish is approximately at a second-grade level. She is cheerful, socially adept, and converses in both Spanish and emerging English. Her teacher notices she struggles significantly with written academic tasks. Which of the following responses is MOST appropriate?",
        "a": [
          "Recognize that her profile is consistent with SIFE, ensure she receives ENL or bilingual services plus foundational literacy support, and avoid conflating interrupted schooling with a disability.",
          "Place her in a bilingual class and wait six months before making any instructional adjustments, since CALP takes years to develop.",
          "Provide only oral instruction and eliminate writing tasks, since written language appears to be her primary deficit.",
          "Submit a written request for referral to the CSE for a learning-disability evaluation, since performance several years below grade level in her home language is a classic marker of a learning disability rather than a language issue."
        ],
        "c": 0,
        "r": "The correct answer is right because IDEA's exclusionary-factor rule (34 CFR 300.306(b)) prohibits identifying a disability when the determinant factor is limited English proficiency or lack of appropriate instruction. Her strong conversational fluency (BICS) alongside weak academic literacy, after years of sporadic schooling, is the hallmark SIFE profile and calls for ENL or bilingual services plus foundational literacy support. The strongest distractor, an immediate CSE referral, looks like decisive action, but referring her before she has received appropriate SIFE instruction ignores that rule, because interrupted schooling is the likely cause of the gap."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A third-grade teacher is designing the culminating assessment for a science unit. Two students are English language learners at the Entering/Emerging level, and one student has an IEP that includes extended time and an oral-response accommodation. The teacher wants the assessment to fairly measure science content knowledge for all students. Which assessment design decision BEST supports equitable measurement?",
        "a": [
          "Create a separate, simplified assessment with fewer questions for ELLs and students with IEPs to reduce frustration.",
          "Administer the same written assessment to every student and compare the raw scores directly, since identical testing conditions are what make results fair and interpretable across the class.",
          "Design the assessment with visual supports and allow oral or drawn responses, so the tool measures science understanding rather than English writing proficiency.",
          "Exempt the ELLs from the summative assessment this unit, since their developing English makes scoring invalid."
        ],
        "c": 2,
        "r": "The correct answer is right because assessment validity requires the instrument to measure the intended construct, science knowledge, not a confounding factor like English writing proficiency. Visual supports and oral or drawn responses are accommodations that preserve the construct for the ELLs and honor the IEP's oral-response accommodation. The strongest distractor, giving everyone the identical written test, sounds fair, but it measures English writing for the ELLs and denies the IEP accommodation, so the scores would not validly reflect science knowledge. A separate simplified test is a modification that changes the standard and yields data that cannot inform grade-level instruction."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A school counselor informs a fourth-grade teacher that one of her students is currently living in a shelter and is classified as experiencing homelessness under McKinney-Vento. The student has been absent three times in two weeks and arrives without supplies. Which combination of teacher actions BEST reflects the legal and instructional obligations associated with this student's situation?",
        "a": [
          "Coordinate with the district's McKinney-Vento liaison, provide materials without penalty, and apply trauma-informed, asset-based practices while keeping academic expectations high.",
          "Refer the student for a special education evaluation, since repeated absences and a lack of materials suggest a possible learning disability.",
          "Excuse all assignments and assessments for the rest of the semester to relieve stress and support the student's well-being.",
          "Contact the family to communicate that consistent attendance is required under state law and that missing supplies will incur the same grade penalties that class policy establishes for all students."
        ],
        "c": 0,
        "r": "The correct answer is right because McKinney-Vento charges the district liaison with coordinating services, and best practice keeps academic expectations high while removing the logistical barriers (supplies, attendance penalties) that flow from housing instability. The strongest distractor, telling the family that attendance is required and supply penalties apply, sounds like holding standards, but McKinney-Vento requires districts to remove barriers to enrollment and retention, including those caused by fees, fines, and absences, so applying standard penalties to a student living in a shelter conflicts with the law and its intent. Excusing all work lowers expectations, and a disability referral misreads housing instability as a learning problem."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A school improvement team is selecting a supplemental reading intervention with federal funds. One vendor's program is supported by two large randomized controlled trials showing positive effects; another is supported by a well-designed correlational study with statistical controls for selection bias; a third offers only a logic model. Under ESSA's evidence framework, how should the team rank the options?",
        "a": [
          "The RCT-supported program meets ESSA's 'strong evidence' tier, the controlled correlational study meets 'promising,' and the logic model alone meets only 'demonstrates a rationale,' the lowest tier.",
          "None can be purchased until the district runs its own local pilot study, which ESSA requires before adoption.",
          "All three qualify equally, since ESSA requires only that a program be 'research-based' in the general sense.",
          "The logic-model program should rank highest of the three, because a clearly articulated theory of change for local students matters more than experimental studies that were conducted with different populations in other districts."
        ],
        "c": 0,
        "r": "ESSA defines four evidence tiers: strong (well-designed experimental studies), moderate (quasi-experimental), promising (correlational with controls), and 'demonstrates a rationale.' Randomized controlled trials anchor the top tier, the controlled correlational study sits at promising, and a logic model alone occupies the bottom. The tiers are explicitly not equal, theory does not outrank causal evidence, and ESSA requires no local pilot before adoption."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A family living in a shelter arrives midyear to enroll a 2nd-grader. They have no proof of residency, no immunization records, and no prior report cards. The registrar says enrollment must wait until documents arrive. What does the McKinney-Vento Act require?",
        "a": [
          "The school must enroll the student immediately, even without the usual documents, and the district's homeless liaison must help obtain records and coordinate services.",
          "The school should refer the newly arrived family to the shelter's on-site education coordinator, who can arrange tutoring and supervised study time until the district completes the standard enrollment and records-verification process.",
          "The school may enroll the student provisionally for up to 30 days while the family gathers the required documentation.",
          "The family must first enroll through the district's central office, which verifies shelter residency before assigning a school."
        ],
        "c": 0,
        "r": "McKinney-Vento requires immediate enrollment of students experiencing homelessness even when normally required records (proof of residency, immunization records, prior transcripts) are missing, and every district must designate a liaison to obtain documents and coordinate services. Provisional windows, central-office preconditions, and tutoring in lieu of enrollment all delay the access the statute forbids delaying."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A 4th-grader enters foster care in October and moves to a home across the district line. Her caseworker asks whether she must change schools. Under ESSA's foster care provisions, which answer is correct?",
        "a": [
          "Yes, the student must change schools, because a student's school assignment always follows the attendance zone of the current foster home, and the transfer takes effect on the date the child is formally placed there.",
          "She remains in her school of origin unless a best-interest determination concludes a transfer serves her better, and if she stays, the child-welfare and education agencies must arrange transportation.",
          "She may stay only through the end of the current marking period, after which she must enroll near the foster home.",
          "The decision belongs to the foster parents alone, since they now hold educational decision-making rights."
        ],
        "c": 1,
        "r": "ESSA requires educational stability for students in foster care: the default is remaining in the school of origin unless a collaborative best-interest determination indicates otherwise, and LEAs must work with child-welfare agencies to provide transportation to the school of origin. Automatic zone reassignment, unilateral foster-parent choice, and marking-period deadlines all contradict the stability presumption."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A 5th-grade math pre-assessment shows that three students have already mastered the upcoming fractions unit at 95%+ accuracy. Which response reflects appropriate curriculum compacting?",
        "a": [
          "Document mastery from the pre-assessment, exempt them from instruction on mastered objectives, and replace it with planned extension work at greater depth or complexity.",
          "Have the three students complete the regular unit anyway to reinforce and verify their mastery under classroom conditions.",
          "Excuse them from math for the unit and let them use the time as unstructured free choice.",
          "Ask the three students who tested out to serve as peer tutors for classmates throughout the fractions unit, on the reasoning that explaining already-mastered material to others deepens the tutors' own conceptual understanding."
        ],
        "c": 0,
        "r": "Curriculum compacting pre-assesses, credits demonstrated mastery, and substitutes deliberately planned enrichment or acceleration for content already learned. Re-teaching mastered material is the busywork compacting exists to eliminate, standing tutoring assignments turn advanced students into staff rather than challenging them, and unstructured free time replaces instruction with nothing."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A principal notices a teacher grades every exit ticket and enters each into the gradebook, but plans the next day's lesson identically regardless of the results. What is the core problem with this practice?",
        "a": [
          "Daily exit tickets are excessive and should be scaled back; brief formative checks are best given no more than once per week, so that students do not become fatigued by constant low-stakes assessment of their learning.",
          "The teacher should grade only a random sample of tickets to keep the workload manageable.",
          "The tickets are being treated as summative scores while their formative purpose (adjusting instruction based on evidence of learning) is being ignored.",
          "Exit tickets are unreliable measures and should not be used in classrooms that serve diverse learners."
        ],
        "c": 2,
        "r": "The defining feature of formative assessment is that evidence feeds back into instructional decisions; collecting scores without adjusting teaching converts a formative tool into low-stakes summative grading and forfeits its benefit. The problem is use, not the instrument's reliability, sampling strategy, or frequency; brief daily checks are appropriate when they actually inform next-day instruction."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "During planning, a co-teaching pair debates supports for a science test. Providing a student with text-to-speech for the directions and questions is proposed by one teacher; the other proposes cutting the constructed-response section for that student. What distinction should guide them?",
        "a": [
          "Both proposals are accommodations, since each one changes only how the student takes the test and neither one alters the specific content standards the test covers.",
          "Text-to-speech is an accommodation that keeps the construct intact; dropping the constructed-response section is a modification that changes what is measured.",
          "Both proposals are modifications, because any change at all to standard test administration, including reading the directions aloud, alters the construct being measured.",
          "The distinction matters only on state assessments, so on a teacher-made classroom test the co-teachers may adopt either support without involving the IEP team."
        ],
        "c": 1,
        "r": "Accommodations change access (format, timing, setting, response mode) without altering the measured construct; modifications change the content or performance expectation itself. Reading directions and items aloud on a science test preserves the science construct, while removing an entire response type changes what is assessed. The strongest distractor, calling both accommodations, overlooks that deleting a section removes content the test is designed to measure. The decision about a modification belongs to the IEP or 504 team and affects how scores are interpreted on classroom tests as well as state tests."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A 10th-grade student tells his English teacher that he is gay and that two classmates have been leaving anonymous notes with slurs in his locker. He asks her not to tell anyone because he is afraid. Under New York law, what should the teacher do?",
        "a": [
          "Keep the conversation confidential as he asked, since reporting the notes could out him, and check in with him privately each week to see whether the notes have stopped.",
          "Call his parents that afternoon to explain the situation, since families must be informed whenever their child is being targeted because of his sexual orientation.",
          "Hold a whole-class discussion about anti-gay slurs the next day, describing the notes in detail so the anonymous students understand the harm they have caused.",
          "Tell him she must report the harassment so it can be stopped, then notify the principal or Dignity Act Coordinator within one school day, sharing only what is needed."
        ],
        "c": 3,
        "r": "The correct answer is right because DASA requires a school employee who witnesses or receives a report of harassment or bullying to notify the principal, superintendent, or designee orally within one school day and in writing within two school days, and sexual orientation is a protected category. The teacher can be honest with the student about that duty while limiting disclosure to what the investigation needs. The strongest distractor, keeping the secret, feels supportive but leaves the harassment unaddressed and breaks the reporting duty. Calling parents could out the student without his consent, and describing the notes to the class publicizes the incident and could identify him."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A kindergarten teacher notices that she routinely asks boys to carry equipment and girls to pass out papers, and that her science center attracts mostly boys. Which change would BEST address gender bias in her classroom?",
        "a": [
          "Create a separate science center time just for girls each week, so that they get a protected turn with the materials without competition from the boys in the class.",
          "Assign jobs on a rotating chart regardless of gender, invite every child to the science center by name, and stock it with images and materials that show all genders.",
          "Keep the current routines, since young children naturally prefer gender-typical tasks and requiring changes could make some of them uncomfortable at school.",
          "Ask families at fall conferences whether they want their children assigned to gender-typical or mixed classroom jobs, and then follow each family's stated preference."
        ],
        "c": 1,
        "r": "The correct answer is right because it removes gender as the basis for roles, actively invites every child into science, and changes the materials so all children see themselves in the activity, addressing the patterns her own reflection uncovered. The strongest distractor, a girls-only science time, increases access but reinforces the message that the center belongs to boys the rest of the week. Keeping the routines accepts the bias as natural, and letting each family choose gender-typed jobs builds inequity into the classroom by design."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A team is choosing between two fluency strategies. Strategy X has been studied in multiple controlled experiments with replicated results published in peer-reviewed journals. Strategy Y produced steady gains in the district's own progress-monitoring data but has never been formally studied or published. How does the EAS framework classify these strategies?",
        "a": [
          "Both are research-based, because each has data showing improved learner outcomes, and the framework treats any systematically collected outcome data as research.",
          "Strategy X is evidence-based and Strategy Y is research-based, because evidence-based requires peer-reviewed experiments while research-based requires only data.",
          "Neither qualifies, because the framework accepts only strategies listed by the federal What Works Clearinghouse as research-based or evidence-based practices.",
          "Strategy X is research-based; Strategy Y is evidence-based, with empirical gains but no systematic experiments or peer-reviewed publication."
        ],
        "c": 3,
        "r": "The correct answer is right because the EAS framework defines research-based practices as those shown effective through systematic observation or experiment, rigorous data analysis, replication, and peer-reviewed publication, and evidence-based strategies as those empirically shown to improve outcomes without necessarily meeting those criteria. The strongest distractor reverses the two definitions, a common error because many textbooks and ESSA use 'evidence-based' as the higher bar; on the EAS, research-based is the stricter term. The framework does not limit either category to a federal clearinghouse list."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "In January, a family loses its apartment in one Long Island district and moves into a motel in a neighboring district. The mother wants her 7th-grader to finish the year at his current middle school. The new district's registrar says the student must enroll where the motel is located. Under New York's implementation of McKinney-Vento, which statement is correct?",
        "a": [
          "The registrar is right, because a homeless student must attend school in the district where the family is currently living so that transportation costs stay manageable.",
          "The student may stay only until the end of the current semester, after which the district of current location assigns him a school based on the motel address.",
          "The mother, as the designator, may choose the school of origin, and he can stay there with transportation while homeless and through the end of that school year.",
          "The two districts' superintendents decide jointly which school serves the student's best interest, and the family may then appeal their decision to the Commissioner."
        ],
        "c": 2,
        "r": "The correct answer is right because in New York the designator (the parent, guardian, or unaccompanied youth), not the district, chooses among the school district of origin, the district of current location, or a district in a regional placement plan, using the STAC-202 form; transportation to the school of origin is provided, and the student may stay for the duration of homelessness and through the end of the school year in which the family becomes permanently housed. The strongest distractor, a joint superintendent decision, resembles the best-interest process for students in foster care, which is a different law. Assigning a school by the motel address or ending enrollment at the semester contradicts the designator's choice and the school-of-origin protections."
      }
    ]
  },
  "Diversity as an Asset & School-Community Collaboration": {
    "icon": "🤝",
    "concepts": [
      {
        "title": "Infusing Diverse Perspectives Across the Curriculum",
        "body": "Infusing diverse perspectives means intentionally embedding multiple cultural, linguistic, and social viewpoints into instructional content, not as add-on units but as ongoing curricular practice. This goes beyond \"heroes and holidays\" representation; teachers select primary sources, authors, and case studies that reflect students' own communities alongside global traditions. Diverse perspectives should appear across all disciplines: a math teacher contextualizes data interpretation using statistics meaningful to the local community; a science teacher draws on Indigenous ecological knowledge alongside Western frameworks. The EAS framework expects teachers to understand that curriculum centering only dominant cultural narratives can marginalize students and depress engagement. Universal Design for Learning (UDL) supports this through multiple means of representation, so students access content through culturally resonant examples. Effective infusion requires ongoing critical self-reflection about whose knowledge is centered, whose is omitted, and how those choices affect student identity and academic belonging. Assessments should likewise offer culturally relevant, accessible contexts so all students can demonstrate knowledge without unnecessary cultural or linguistic barriers."
      },
      {
        "title": "Using Classroom and Community Diversity to Enhance Learning",
        "body": "Student diversity (linguistic, cultural, socioeconomic, family-structural, racial) is a pedagogical resource, not a deficit to remediate. Teachers who leverage this asset invite students to contribute funds of knowledge (Moll et al., 1992): the practical, cultural, and household expertise students carry from home into academic learning. Classroom strategies include structured academic controversy, literature circles with culturally diverse texts, and collaborative projects where varied perspectives improve the quality of inquiry itself. At the community level, teachers can integrate local history, neighborhood demographics, and culturally specific practices as authentic data sources. New York's Dignity for All Students Act (DASA) reinforces this asset orientation by requiring schools to maintain an environment free of discrimination and harassment based on protected categories including race, color, weight, national origin, ethnic group, religion, disability, sex, and gender. When emergent bilinguals' home languages are positioned as cognitive resources (using students' L1 to build conceptual bridges), research shows stronger English academic development alongside preserved heritage language. Teachers should avoid \"color-blind\" approaches; explicitly valuing differences signals to all students that their full identities belong in academic spaces."
      },
      {
        "title": "Identifying and Incorporating School- and Community-Based Resources",
        "body": "Effective teachers recognize that learning extends beyond classroom walls and tap into a network of school-based and community-based resources. School-based resources include intervention specialists, ENL (English as a New Language) teachers, bilingual educators, school counselors, psychologists, and the Committee on Special Education (CSE) referral process for students who may need IDEA-protected supports. Under Section 504 of the Rehabilitation Act, students with a disability who do not qualify for special education may still receive accommodations coordinated through a building-level 504 team. Community-based resources include cultural organizations, faith communities, public libraries, community health centers, and local businesses that can provide mentors, guest speakers, and real-world project contexts. Parent coordinators and community liaisons bridge school and home, particularly for families whose primary language is not English or who have limited prior experience with U.S. school systems. Multi-Tiered Systems of Support (MTSS), including Response to Intervention (RtI), connect classroom teachers to tiered school-based supports; in New York, every district must have an RtI process for K-4 reading, and a CSE may not use severe discrepancy to find a learning disability in reading in grades K-4. Mapping these resources and knowing referral pathways is a core teacher competency the EAS assesses directly."
      },
      {
        "title": "Creating a Safe, Supportive Classroom That Fully Integrates Students with Disabilities",
        "body": "Full integration of students with disabilities begins with IDEA (Individuals with Disabilities Education Act), which mandates a free appropriate public education in the least restrictive environment (LRE). Most students with disabilities receive services in general education classrooms, meaning all teachers, not only special educators, are responsible for implementing IEP accommodations and modifications. Co-teaching models (one teach/one assist, parallel, station, alternative, and team teaching) operationalize this shared responsibility. Psychologically safe classrooms are built through consistent routines, explicit social-emotional learning, Positive Behavioral Interventions and Supports (PBIS), and restorative practices rather than reliance on exclusionary discipline. DASA requires all staff to address harassment and bias proactively. UDL's three principles (multiple means of engagement, representation, and action and expression) provide a classroom architecture that benefits students with disabilities, emergent bilinguals, and all learners simultaneously. Teachers must protect the confidentiality of a student's disability status (FERPA and IDEA confidentiality provisions apply) and never disclose it to peers, while still fostering a community norm of mutual respect and support. Classroom climate surveys and student feedback loops help teachers assess whether students genuinely feel included."
      },
      {
        "title": "Supporting Emergent Bilinguals Through Language-Responsive Instruction",
        "body": "English Language Learners (emergent bilinguals) hold civil-rights protections under Title VI of the Civil Rights Act of 1964, which Lau v. Nichols (1974) applied to language-minority students, and under the Equal Educational Opportunities Act of 1974, which requires schools to take appropriate action to overcome language barriers; Castaneda v. Pickard (1981) supplies the three-prong test courts use to judge whether a program meets that duty. Title III of ESSA provides supplemental funding, and New York's Commissioner's Regulations Part 154 govern identification and services. Teachers must distinguish BICS (Basic Interpersonal Communicative Skills, conversational fluency typically acquired in 1 to 2 years) from CALP (Cognitive Academic Language Proficiency, academic language typically requiring 5 to 7 years; Cummins). A student who appears orally fluent may still need significant scaffolding for academic reading and writing; misreading BICS as full proficiency is a common instructional error. Under Part 154, New York offers two program types: Bilingual Education (Transitional Bilingual Education or Dual Language), which a district must provide when 20 or more ELLs in the same grade share a home language, and English as a New Language (ENL), delivered as Stand-alone ENL (taught by a certified ESOL teacher) and Integrated ENL (content-area or ELA instruction co-taught by an ESOL teacher and a content teacher, or taught by one dually certified teacher). Co-planning between content teachers and ENL teachers makes academic content linguistically accessible without lowering cognitive demand. Scaffolds such as sentence frames, graphic organizers, bilingual glossaries, and think-alouds support CALP development. Because Title VI treats language-based discrimination as a form of national-origin discrimination, language difference must never trigger exclusion or ridicule."
      },
      {
        "title": "Family and Community Engagement as a Collaborative Partnership",
        "body": "Research consistently links meaningful family engagement to improved student outcomes, and IDEA legally requires parental participation in IEP development and placement decisions. However, engagement must extend to genuine partnership, not one-way communication. Culturally responsive family engagement acknowledges that families communicate, participate, and define \"support\" differently across cultural contexts, and that logistical barriers (work schedules, transportation, language, prior negative school experiences) are structural, not indications of disinterest. Effective strategies include home visits or community-site meetings, multilingual communication (required by Title VI for families with limited English proficiency), flexible scheduling, and positioning families as experts on their children. Under FERPA, parents have the right to inspect, review, and request amendment of their child's education records. Community liaisons and parent coordinators, common in many large New York districts, formalize this bridge role. The EAS expects teachers to recognize that equitable engagement requires proactive, culturally humble outreach rather than waiting for families to navigate the school's structures on their own."
      },
      {
        "title": "Variant Forms of English: Dialects as Linguistic Assets",
        "body": "The EAS framework specifically includes students from homes where a variant form of English is used. Every speaker uses a dialect. Varieties such as African American English (AAE), Appalachian English, Chicano English, and the English-based Creoles of the Caribbean (for example, Jamaican, Trinidadian, and Guyanese Creole) are rule-governed linguistic systems with consistent grammar and sound patterns, not broken or careless English (Labov, 1972; Smitherman, 1977). A dialect difference is not a speech or language disorder, a position the American Speech-Language-Hearing Association has held since 1983, and it is not a learning disability, so referrals must separate dialect features from true disorders. The legal anchor is Martin Luther King Jr. Elementary School Children v. Ann Arbor School District Board (1979): a federal court held under the Equal Educational Opportunities Act that the district had to take students' home language (then called Black English) into account when teaching them to read standard English. Research-based practice treats Standard American English as an additional register, not a replacement. Teachers use contrastive analysis, comparing home and school patterns side by side as in Wheeler and Swords' code-switching approach; teach explicitly when each register fits audience and purpose; and value students' home language in discussion, narrative dialogue, and literature by authors who write in those varieties. Constant correction of home dialect in every setting tells students their families talk wrong and is linked to disengagement. Expectations stay high: dialect speakers master academic English when it is taught explicitly and respectfully."
      },
      {
        "title": "Teaching Appreciation of Diversity: Banks' Approaches and Dignity Act Instruction",
        "body": "Promoting students' understanding and appreciation of diversity is something teachers teach, not only something they model. James Banks' four approaches to multicultural curriculum reform give a common yardstick. (1) Contributions: inserting heroes, holidays, foods, and isolated cultural elements while the mainstream curriculum stays unchanged. (2) Additive: adding content, concepts, or a unit (for example, one novel by a Latina author) without changing the curriculum's structure or perspective. (3) Transformation: changing the structure of the curriculum so students study events, issues, and concepts from the perspectives of several groups (for example, studying westward expansion through Indigenous, settler, Chinese immigrant, and Mexican perspectives). (4) Social action: students make decisions on social issues they have studied and take action to address them (for example, researching and proposing a fix for a school accessibility barrier). The first two are the most common and the least likely to change how students think; EAS items typically reward transformation or social action. In New York this work also has a statutory basis. Education Law 801-a, expanded by the Dignity for All Students Act, requires K-12 instruction in civility, citizenship, and character education, including tolerance, respect for others, and dignity, with awareness of and sensitivity to discrimination and harassment and civility toward people of different races, weights, national origins, ethnic groups, religions, religious practices, mental or physical abilities, sexual orientations, genders, and sexes. Effective instruction is sustained rather than a one-time assembly: students learn to recognize stereotypes and bias, practice perspective-taking, discuss differences respectfully, and act as upstanders when they see bullying."
      }
    ],
    "practice": [
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 7th-grade ELA teacher notices that her students, many of whom are recent immigrants, seem disengaged when reading the assigned anthology texts. She wants to increase authentic engagement with literature. Which approach best reflects the EAS principle of using classroom and community diversity to enhance learning?",
        "a": [
          "Supplement the anthology with stories and poetry by authors from students' home cultures, and invite students to share family narratives as mentor texts for their own writing.",
          "Allow students to choose any book from the school library for independent reading, so they can self-select based on personal interest regardless of the cultural content or reading level.",
          "Focus instruction on grade-level vocabulary from the anthology to ensure students build the academic English they will need on standardized assessments.",
          "Ask the families of immigrant students to provide translations of the anthology texts in the home language for the class to use."
        ],
        "c": 0,
        "r": "The correct choice leverages students' cultural and linguistic funds of knowledge as curricular content, the asset-based approach the EAS framework requires: diverse perspectives are infused into the curriculum rather than treated as supplemental. Open self-selection from any library text promotes voice but does not intentionally use community and cultural diversity as a pedagogical tool. Drilling anthology vocabulary is deficit-oriented and ignores engagement. Asking families to translate texts shifts the teacher's professional responsibility onto families and still centers the original culturally distant material."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A general education 4th-grade teacher has a student whose IEP specifies extended time, preferential seating, and access to a graphic organizer template for all written assignments. During a district-wide writing assessment, the teacher is unsure whether to provide these accommodations because the test feels \"more official.\" What should the teacher do?",
        "a": [
          "Provide all IEP-specified accommodations during the assessment, because the IEP must be implemented in both instructional and assessment contexts as documented.",
          "Defer entirely to the building principal, since assessment decisions exceed a classroom teacher's authority.",
          "Withhold the accommodations during the district assessment to obtain a true baseline of the student's independent performance, then restore them for regular classroom work afterward.",
          "Provide only the extended time, since a graphic organizer might give the student an unfair advantage over peers without IEPs."
        ],
        "c": 0,
        "r": "An IEP must be implemented as written across instructional and assessment settings; failing to provide documented accommodations is a failure to implement the IEP and a violation of the student's right to a free appropriate public education under IDEA. Withholding accommodations does not produce a valid baseline; it measures performance without legally required supports and misrepresents what the student knows. Deferring wholesale to the principal abdicates the teacher's own legal responsibility, and selectively providing only one accommodation likewise fails to implement the IEP as written."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A high school biology teacher wants to build connections between her curriculum and the local community. Her school is in a neighborhood with a large Puerto Rican community and sits near a protected urban wetland. Which instructional approach best exemplifies identifying and incorporating community-based resources to enhance learning?",
        "a": [
          "Show a documentary about rainforest ecosystems so students can compare local and global environmental challenges.",
          "Partner with a local environmental nonprofit staffed by community members to conduct water-quality testing of the wetland, framing the data within the community's relationship to the land.",
          "Assign a research paper on global biodiversity using peer-reviewed journal articles, since practice with college-level scientific sources strengthens academic writing for every student in the room.",
          "Invite the school's ENL teacher to co-teach one lesson so emergent bilingual students receive language support during the ecology unit."
        ],
        "c": 1,
        "r": "The correct choice integrates a community-based organization, culturally relevant local geography, and authentic scientific inquiry, precisely the combination of school and community resources the EAS framework expects teachers to leverage. A library-based paper and a rainforest documentary are valid academic tasks but draw on neither the local community nor its members. Co-teaching with the ENL teacher is sound practice for supporting emergent bilinguals, but it is a single language-support episode rather than the broader use of community resources to enrich the curriculum for all learners."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "Ms. Torres teaches 2nd grade and has a newly arrived student, Amara, whose home language is Wolof. Amara communicates easily on the playground but struggles significantly with written reading comprehension tasks. Ms. Torres concludes that Amara has no language barrier because \"she talks fine at recess.\" Which response best explains the flaw in Ms. Torres's reasoning and what she should do?",
        "a": [
          "Ms. Torres should ask Amara's family to speak only English at home so Amara builds proficiency more quickly.",
          "Ms. Torres should promptly submit a written request for a CSE referral, since a persistent gap between oral fluency and reading comprehension is the pattern most commonly associated with a learning disability.",
          "Ms. Torres is correct; playground fluency indicates Amara is ready for grade-level literacy instruction without additional language scaffolds.",
          "Ms. Torres is confusing BICS with CALP; she should provide academic-language scaffolds with the ENL teacher and review proficiency data before considering any disability referral."
        ],
        "c": 3,
        "r": "Ms. Torres is conflating BICS (conversational fluency, often reached in 1-2 years) with CALP (academic language, typically 5-7 years; Cummins), a well-documented error. Amara should receive academic-language scaffolds and have her English proficiency formally assessed, consistent with New York's ENL identification process under Commissioner's Regulations Part 154. An immediate CSE referral is premature: under IDEA (34 CFR 300.306(b)), limited English proficiency may not be the determinant factor in an eligibility decision, so language acquisition must be addressed and adequate language data gathered first. Telling the family to abandon the home language is harmful and undercuts the L1's role in building academic English."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A high school counselor tells a teacher that a first-generation student 'has no college knowledge at home.' The teacher, drawing on Yosso's community cultural wealth framework, would most accurately respond that the family likely possesses:",
        "a": [
          "Aspirational and navigational capital (sustained hopes for their child's future and hard-won strategies for maneuvering institutions) that the school can build on in college planning.",
          "Cultural capital only in nondominant forms that, while genuinely meaningful within the home and community, offer little practical leverage in the formal college admissions and financial-aid process.",
          "Social capital that will become useful only after the student enrolls and joins campus networks.",
          "A knowledge deficit that the school must remediate through a mandatory parent information course before the student applies."
        ],
        "c": 0,
        "r": "Yosso's framework names six forms of capital (aspirational, linguistic, familial, social, navigational, and resistant) that communities of color possess and schools routinely overlook. Framing the family through what it lacks is precisely the deficit thinking the framework challenges; the asset response identifies existing strengths (aspirations, institutional navigation skills) and connects them to the college process now, not after enrollment."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 2nd-grade class is planning a 'foods of our community' tasting celebration. Two students keep halal, one keeps kosher, and one family avoids pork for religious reasons the teacher does not fully understand. What is the best planning approach?",
        "a": [
          "Ask the four families to send in their own separate food so the class menu does not need to change.",
          "Plan the menu with family input from the start, label ingredients, and ensure appealing options that everyone can eat, treating the dietary practices as part of the community being celebrated.",
          "Serve a standard menu and quietly excuse the four students to the library during the tasting portion.",
          "Cancel the food-tasting component of the celebration entirely and substitute a slideshow about world foods, since the range of religious dietary rules in the class makes a shared eating event too complicated to run fairly."
        ],
        "c": 1,
        "r": "An event celebrating community diversity should be designed so religiously observant students are full participants; co-planning with families, transparent labeling, and universally shareable options accomplish that and model respect for the practices themselves. Excusing students from their own class celebration excludes them, requiring separate food othering them, and cancellation treats religious diversity as a burden rather than an asset."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A middle school teacher assigns nightly homework requiring internet research. She learns that roughly a quarter of her students have no reliable home internet and several share one phone among siblings. Which revision best addresses the equity issue?",
        "a": [
          "Redesign homework so it can be completed without connectivity (packets, downloaded resources, school-time access) while connecting families with district and community low-cost internet programs.",
          "Grade homework on completion rather than accuracy so that access differences do not affect marks.",
          "Keep the connectivity-dependent assignments as designed but extend all of the deadlines by forty-eight hours, so that students without home internet have additional time to complete the research at a public library branch.",
          "Make homework optional for students who report lacking internet access at home."
        ],
        "c": 0,
        "r": "Equitable design removes the barrier from the task itself rather than shifting the burden to students; offline-completable work plus proactive connection to access programs preserves the same learning expectations for everyone. Deadline extensions still require the missing resource, optional homework creates a two-track curriculum, and completion grading lowers the learning signal without addressing access at all."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A kindergarten teacher's family-information form has lines for 'Mother' and 'Father,' and her Family Tree project assumes a two-parent household. Several students live with two mothers, grandparents, or in kinship foster care. What should she do?",
        "a": [
          "Keep the forms but tell affected families individually that they may cross out and rewrite the labels however they wish.",
          "Retire the assumption entirely: use 'Parent/Guardian' language on forms and redesign the project around 'the people who care for me,' so every family structure is representable by default.",
          "Postpone all family-related projects until later in the school year, when the teacher will know each household's particular structure well enough to quietly adapt the assignment for individual children on a case-by-case basis.",
          "Keep the project but let affected children draw a 'family they wish they had' if the real structure feels complicated to represent."
        ],
        "c": 1,
        "r": "Inclusive design changes the default rather than patching exceptions; guardian-neutral forms and a caregiving-centered project let every child participate accurately without special arrangements that mark some families as deviations. Individual workarounds and 'wish' drawings signal that real families are problems to be managed, and postponement avoids rather than solves the design flaw."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 6th-grade science teacher is beginning a unit on weather and climate. Her students' families include a fisherman, a building superintendent, and a community gardener. Which use of these community resources best enhances the unit?",
        "a": [
          "Invite the three community members as expert informants (reading weather at sea, managing building heat, planting by season) and have students design investigation questions connecting their knowledge to the unit's concepts.",
          "Interview the three adults herself and summarize their insights for students during the unit introduction.",
          "Feature the three occupations on a careers bulletin board so students see science jobs in their neighborhood.",
          "Invite a university-affiliated meteorologist to present to the class instead of local residents, on the principle that classroom guest speakers should model the highest available level of formal scientific expertise for students."
        ],
        "c": 0,
        "r": "Treating community members as knowledge-holders whose practical expertise students interrogate scientifically operationalizes funds of knowledge and community partnership; students do the intellectual work of connecting lived expertise to disciplinary concepts. A bulletin board and a teacher-mediated summary keep the community at arm's length, and defaulting to outside credentialed expertise passes over the community assets the item is designed to leverage."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 7th-grader who arrived from Ukraine two months ago has begun putting his head down in class, snapping at group mates, and refusing work he previously attempted. His teacher's first interpretive move should be to:",
        "a": [
          "Initiate the school's progressive discipline sequence so behavioral expectations are established early.",
          "Consider acculturative stress, disrupted schooling, and possible trauma as explanations, gather information from the family and ENL staff, and involve counseling supports before treating the behavior as willful defiance.",
          "Reduce his workload substantially until the behaviors stop, then reintroduce demands gradually.",
          "Submit a written request for a CSE referral without delay, since an abrupt behavior change of this kind (withdrawal, irritability, and refusal of previously attempted work) is generally a reliable early indicator of an emotional disability."
        ],
        "c": 1,
        "r": "Newcomers frequently show behavior changes that reflect acculturative stress, grief, or trauma rather than defiance or disability; sound practice is to rule in contextual explanations with family and ENL input and to mobilize supports first. Jumping to discipline punishes distress, a disability referral two months after resettlement confuses situational factors with an internal condition, and simply removing demands neither identifies nor addresses the cause."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 2nd-grade student who speaks Jamaican Creole at home says 'aks' for 'ask' and 'dem' for 'them.' His reading comprehension and vocabulary are at grade level. His teacher wants to refer him for a speech-language evaluation. Which response BEST reflects current understanding of dialect?",
        "a": [
          "Refer him promptly, since early speech therapy is the most efficient way to replace nonstandard pronunciations before they become fixed habits that affect his reading.",
          "Recognize these as regular features of his home variety rather than a disorder, and teach Standard English pronunciation explicitly as an added register.",
          "Ask his family to speak only Standard English at home for the rest of the year, so that his school pronunciation improves without the need for extra instruction.",
          "Correct each nonstandard pronunciation the moment it occurs during read-alouds, so that he learns quickly which spoken forms are acceptable in school settings."
        ],
        "c": 1,
        "r": "The correct answer is right because features such as 'aks' and 'dem' are systematic, rule-governed patterns of Caribbean Creole and other English varieties, not evidence of a speech or language disorder, and his grade-level comprehension and vocabulary confirm the point. Teachers add Standard English as a register through explicit, respectful instruction. The strongest distractor, a speech-language referral, treats a dialect difference as a disorder and risks misidentification. Asking the family to drop its home language undercuts identity and family communication, and constant correction during reading interrupts comprehension and signals that his speech is wrong."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "In a 9th-grade ELA class, several students write narrative dialogue in African American English, and a colleague says the teacher should require Standard English in all writing. Which approach BEST serves the students' academic growth and the EAS framework's expectations?",
        "a": [
          "Accept the home variety where it fits the genre, such as narrative dialogue, and use contrastive analysis to teach when formal Standard English is expected.",
          "Require Standard English in every assignment, since students will be judged on it in college and the workplace, and mark home-dialect forms as errors throughout.",
          "Allow any variety in every assignment, including formal essays and test responses, and avoid teaching Standard English so that no student ever feels judged.",
          "Place the students in a separate writing group focused on grammar drills until their home dialect no longer appears anywhere in their independent writing."
        ],
        "c": 0,
        "r": "The correct answer is right because research-based dialect instruction treats Standard English as an additional register: through contrastive analysis, students learn to choose the variety that fits audience and purpose, while their home language is valued where it belongs, as in dialogue. The strongest distractor, requiring Standard English everywhere, frames the home variety as error, is linked to disengagement, and does not teach the register-choice skill students actually need. Dropping Standard English instruction leaves students unprepared for formal tasks, and a grammar-drill group is a deficit-based track."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 5th-grade teacher's social studies unit on immigration currently features one day on Ellis Island. She wants to move to Banks' transformation approach. Which revision BEST accomplishes this?",
        "a": [
          "Add a 'Famous Immigrants' poster project in which each student researches one well-known immigrant and presents a short illustrated biography to the class.",
          "Add a full week at the end of the unit on Angel Island and the Chinese Exclusion Act, while keeping the existing Ellis Island lessons and textbook sequence.",
          "Rebuild the unit around a central question students investigate through sources from Ellis Island, Angel Island, the southern border, and refugee arrivals.",
          "Hold an international food day at the end of the unit so that families can share dishes from their countries of origin with the class."
        ],
        "c": 2,
        "r": "The correct answer is right because the transformation approach changes the structure of the curriculum so students examine a topic through the perspectives of several groups and construct their own conclusions. The strongest distractor, adding a week on Angel Island, brings in an important perspective but leaves the unit's structure and Ellis Island framing intact, which is the additive approach. A famous-immigrants poster project and a food day are contributions-level activities that celebrate individuals and customs without changing how students think about immigration."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "After several students in a 7th-grade class mock a classmate's hijab, the teacher handles the incident under the school's DASA procedures. She also wants to use instruction to prevent future incidents. Which plan BEST reflects New York's Dignity Act instruction requirement and research on reducing bias?",
        "a": [
          "Teach a short unit on stereotypes and religious diversity with perspective-taking discussions and upstander practice, and revisit it through class norms all year.",
          "Show a one-time assembly video on bullying to the full grade, then return to the regular curriculum, since the incident has already been formally reported and resolved.",
          "Ask the student who wears a hijab to explain her religion to the class, so that her classmates understand it and the incident becomes a learning moment for everyone.",
          "Post the district's anti-bullying policy in the room and remind students that any further comments will lead to disciplinary consequences under the code of conduct."
        ],
        "c": 0,
        "r": "The correct answer is right because Education Law 801-a, as expanded by DASA, requires instruction in tolerance, respect for others, and dignity, including civility toward differences in religion and religious practice, and bias declines with sustained instruction in perspective-taking and bystander intervention rather than one-time events. The strongest distractor, posting the policy with a warning, addresses compliance but teaches nothing about why the behavior harms others. A single assembly fades quickly, and asking the targeted student to explain her faith puts her on display and shifts the burden onto her."
      }
    ]
  },
  "Language Acquisition Foundations": {
    "icon": "🗣️",
    "concepts": [
      {
        "title": "Stages of Second-Language Acquisition",
        "body": "Krashen and Terrell's Natural Approach identifies five sequential stages ELLs move through: (1) Pre-production (Silent Period): the learner builds receptive vocabulary, responds nonverbally, and may say little for weeks to months; (2) Early Production: one- to two-word responses, high-frequency phrases, approximately 1,000 receptive words; (3) Speech Emergence: simple sentences, formulaic language, grammatical errors still prominent; (4) Intermediate Fluency: complex sentences, ability to express opinion, content gaps remain; (5) Advanced Fluency: near-native command of social and academic language, though academic vocabulary gaps may persist years longer. EAS items frequently test whether teachers calibrate task demands and linguistic scaffolds to stage. A student in pre-production should not be penalized for silence; a student in intermediate fluency still needs explicit academic vocabulary instruction. Stage is not fixed: anxiety, topic familiarity, and L1 proximity to English speed or slow movement. Recognizing stage informs ENL service-delivery decisions and helps teachers distinguish a normal stage of language development from a disability rather than misidentifying difference as disability."
      },
      {
        "title": "BICS vs. CALP",
        "body": "Jim Cummins distinguishes Basic Interpersonal Communicative Skills (BICS) from Cognitive Academic Language Proficiency (CALP). BICS is context-embedded, face-to-face social language that typically develops within one to three years; it relies on paralinguistic cues (gesture, intonation, shared context) and is comparatively undemanding cognitively. CALP is context-reduced, cognitively demanding academic language, the discourse of textbooks, standardized tests, and disciplinary writing. CALP takes roughly five to seven years (longer for students with interrupted schooling) to approach grade-level native-speaker proficiency. The BICS-CALP gap is the central EAS assessment trap: a student who converses fluently on the playground may still lack the academic language to comprehend a persuasive essay prompt or a mathematics word problem. Overestimating proficiency on the basis of BICS leads to premature exit from ENL services and academic underperformance. CALP is largely transferable across languages, so strong L1 academic literacy accelerates English CALP development, supporting the asset-based rationale for bilingual programs and for sustained academic-language scaffolding even after conversational fluency emerges."
      },
      {
        "title": "Factors Affecting Second-Language Acquisition",
        "body": "Multiple variables moderate how quickly and fully ELLs acquire English. L1 literacy is among the strongest predictors: students who read and write proficiently in their home language transfer phonological awareness, decoding strategies, and academic-discourse schemas to English (Cummins's Common Underlying Proficiency model). Students with Interrupted/Inconsistent Formal Education (SIFE) are defined in Part 154 as ELLs who have attended U.S. schools for less than 12 months and are two or more years below grade level in home-language literacy and/or math because of interrupted or inconsistent schooling; they need targeted foundational literacy and math support in addition to ENL, and SIFE status ends when they reach Transitioning. Krashen's Affective Filter Hypothesis holds that anxiety, low motivation, and low self-confidence raise a metaphorical filter that blocks comprehensible input; low-anxiety classrooms that supply rich comprehensible input lower the filter. Teacher expectations operate alongside this mechanism: deficit framing, low-rigor tasks, and exclusion from grade-level content suppress achievement, while high expectations with strong scaffolding support it. Age of arrival matters: younger arrivals typically achieve stronger phonological outcomes, while older arrivals leverage stronger L1 academic foundations. Socioeconomic status, family stability, and prior trauma also shape acquisition trajectories. None of these factors, alone or combined, makes language difference a disability."
      },
      {
        "title": "Types and Benefits of Bilingualism",
        "body": "Bilingualism is not a uniform condition. Additive bilingualism occurs when a second language is acquired without displacing the first, and is associated with metalinguistic awareness and strong academic outcomes. Subtractive bilingualism occurs when English acquisition erodes L1 proficiency, typically in English-only environments, and is associated with loss of family communication, cultural-identity fracture, and weaker long-term English academic outcomes. Simultaneous bilingualism describes children acquiring two languages from birth; sequential bilingualism describes acquiring L2 after L1 is established (typically after about age three). Research generally documents cognitive and metalinguistic benefits of bilingualism, though the size of executive-function effects is debated. NYS recognizes multiple program models under CR Part 154: Transitional Bilingual Education (TBE) uses L1 as a bridge to English with planned reduction of L1 instruction; Dual Language programs develop full proficiency in both languages; NYSED recognizes two-way programs, which enroll ELLs together with English-proficient peers, and one-way programs, which serve students who share a home language. The EAS framework treats bilingualism as an asset for the whole classroom community, not merely a deficit to remediate."
      },
      {
        "title": "Primary Language as Right and Asset",
        "body": "Federal and state law protect ELLs' right to a meaningful education they can access. Lau v. Nichols (1974) held that identical instruction does not constitute equal education when students cannot understand English; districts must take affirmative steps. The Equal Educational Opportunities Act (EEOA, 1974) requires states and districts to overcome language barriers through appropriate action. In NYS, CR Part 154 requires identification of ELLs within 10 school days of initial enrollment (Home Language Questionnaire, an individual interview in English and the home language, and the NYSITELL when the interview indicates it), placement in bilingual education or ENL, an annual English language proficiency assessment (the NYSESLAT through spring 2026; WIDA ACCESS for ELLs beginning spring 2027), and parent notification in the parent's preferred language. Title III of ESSA funds supplemental language-instruction programs. The home language is simultaneously a legal right and a pedagogical asset: previewing content in L1 (preview-review), cognate instruction, and translanguaging, the strategic use of a student's full linguistic repertoire, accelerate academic concept development and signal that home language has value in school. Asset-based framing is testable, since EAS scenarios often ask teachers to identify strategies that leverage, rather than suppress, the home language."
      },
      {
        "title": "Legal Rights of ELLs in New York State",
        "body": "ELLs are protected by interlocking federal and state law. Title VI of the Civil Rights Act bars discrimination based on national origin; Lau v. Nichols applied Title VI to language access. Title III of ESSA funds language-instruction programs and requires annual reporting of ELL progress. CR Part 154 (revised 2015) sets NYS-specific identification, placement, service-unit, and exit requirements. IDEA and Section 504 apply to ELLs with disabilities, and language difference may not be the basis for a special-education referral or eligibility; evaluations must be conducted in the student's native language or mode of communication unless clearly not feasible. FERPA protects the confidentiality of student records, including Home Language Questionnaire data. The Dignity for All Students Act (DASA) requires a safe, inclusive environment and names national origin and ethnic group among protected characteristics; each school designates at least one Dignity Act Coordinator to address harassment and bias. Parents of ELLs receive required notices in their preferred language and may choose ENL instead of bilingual education, but they cannot decline language services altogether. After exiting ELL status, Former ELLs receive at least two school years of Former ELL services (at least 90 minutes per week of integrated ENL or another approved service) and keep ELL testing accommodations for two years."
      },
      {
        "title": "Patterns of Language Development: Interlanguage, Overgeneralization, and Code-Switching",
        "body": "First- and second-language acquisition share predictable patterns. Children acquiring English as a first language move from babbling to single words, then two-word telegraphic speech (\"more juice\"), then rule-governed grammar, and they acquire grammatical morphemes in a fairly consistent order (Brown, 1973). Second-language learners also build a rule system of their own, an interlanguage (Selinker, 1972), that moves closer to English over time. Errors are evidence of that system at work. Overgeneralization (\"goed,\" \"mouses,\" \"he can swims\") shows a learner applying a rule too broadly, the same pattern native-speaking toddlers produce. Transfer errors reflect the first language: a Mandarin speaker may omit articles and plural endings, and a Spanish speaker may place adjectives after nouns (\"the house big\"). Fossilization describes interlanguage errors that stabilize and persist over time, even with continued exposure to English; targeted feedback on a persistent pattern helps prevent it. Code-switching, alternating between languages within a conversation, is a normal, rule-governed bilingual skill, not a sign of confusion. The two processes also differ: older second-language learners bring literacy, world knowledge, and metalinguistic awareness, while their exposure, motivation, and anxiety vary far more than a toddler's. On the EAS, the key move is reading error patterns as developmental before treating them as signs of a disability, and responding with recasts and targeted mini-lessons rather than blanket correction."
      }
    ],
    "practice": [
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A kindergarten newcomer from Yemen has been in class for six weeks. She follows classroom routines, points, gestures, and laughs with peers, but has not yet spoken in English or Arabic at school. Her teacher is worried something is wrong. Based on second-language acquisition research, what is the most appropriate interpretation and response?",
        "a": [
          "The student should be required to produce at least one spoken English word per activity so that output keeps pace with input.",
          "The prolonged silence suggests the family is not exposing the child to enough English outside of school, so the teacher should encourage the parents to switch to speaking English with her at home whenever they can.",
          "The student is likely in the preproduction or \"silent period\" stage; the teacher should continue providing rich comprehensible input and low-pressure nonverbal response options rather than forcing speech.",
          "Six weeks of silence at school across both languages warrants an immediate CSE referral for a communication disorder."
        ],
        "c": 2,
        "r": "A silent (preproduction) period lasting weeks to months is a well-documented, typical stage of early second-language acquisition, especially for young children; comprehension develops ahead of production. Forcing output raises the affective filter, a referral this early confuses typical L2 development with a disorder, and telling families to abandon the home language undermines the L1 foundation that supports English development."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A third-grade teacher notices that her newly arrived ELL, who speaks no English, becomes visibly anxious during whole-class read-alouds and refuses to attempt any spoken responses. To lower the student's affective filter and support language acquisition, which instructional adjustment is MOST appropriate?",
        "a": [
          "Refer the student for a speech-language evaluation, since sustained refusal to speak in class can indicate a communication disorder or selective mutism that requires specialist support.",
          "Require the student to attempt spoken responses daily, since structured practice is the fastest path to fluency.",
          "Seat the student apart from peers during literacy activities to reduce distraction and embarrassment.",
          "Provide nonverbal response options (gestures, picture cards, thumbs up or down) and allow a silent period while building comprehensible input."
        ],
        "c": 3,
        "r": "Krashen's Affective Filter Hypothesis holds that anxiety blocks the intake of comprehensible input; lowering the filter through low-stakes, nonverbal response options and honoring the silent period is appropriate for a pre-production learner. Requiring daily spoken responses is the strongest distractor because it seems to maximize practice, but compelling speech before the student is ready raises the affective filter and suppresses acquisition. Referral for a speech-language evaluation misreads a normal silent period as a disorder, and seating the student apart cuts her off from the input and peer interaction she needs."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A high school social studies teacher is planning a unit on the U.S. Constitution for a class that includes several intermediate-fluency ELLs. Which strategy BEST reflects an asset-based approach to the students' bilingualism while developing CALP?",
        "a": [
          "Group the ELLs together for the unit with simplified texts written at a lower readability level, ensuring full comprehension before they rejoin the whole-class constitutional discussions.",
          "Allow ELLs to preview key constitutional concepts in their home language and construct a bilingual concept map before English discussion.",
          "Postpone abstract content for ELLs until they reach the Commanding level of English proficiency.",
          "Provide all instruction in English only to maximize ELLs' immersion time and accelerate reclassification."
        ],
        "c": 1,
        "r": "Previewing content in L1 and using translanguaging (a bilingual concept map) leverages Cummins's Common Underlying Proficiency, since academic concept knowledge built in L1 transfers to L2, accelerating CALP while treating the home language as an asset. The English-only immersion option is the strongest distractor because immersion-only settings are common in practice, but research and CR Part 154 support strategic L1 use; immersion-only approaches risk subtractive bilingualism and slower concept acquisition. Simplifying texts strips rigor (amplify, do not simplify), and postponing abstract content denies grade-level access."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "Parents of a newly identified ELL enroll their daughter in a school where both a Transitional Bilingual Education (TBE) program and a stand-alone ENL program are available. The parents tell the teacher they do not want their daughter placed in the bilingual program; they prefer ENL-only services. Under NYS law, which response by the teacher is MOST legally appropriate?",
        "a": [
          "Acknowledge the parents' right to decline bilingual-program placement, document their decision, and ensure the student still receives mandated ENL services.",
          "Explain that the bilingual program is required by CR Part 154 and the parents cannot opt out once the school offers it.",
          "Refer the decision to the Committee on Special Education, which oversees all language-placement decisions for ELLs.",
          "Inform the parents that program placement decisions are made by the building principal in consultation with the ENL team, so a family preference cannot override the school's recommendation."
        ],
        "c": 0,
        "r": "CR Part 154 mandates identification and the delivery of language-instruction services, but it preserves parents' right to decline bilingual-program participation; a district cannot force bilingual enrollment over parental objection, and the refusal must be documented while mandated ENL services continue. The 'cannot opt out' option is the strongest distractor because Part 154 does require services, but it does not strip parental choice over the bilingual model. The Committee on Special Education has no jurisdiction over ENL or bilingual placement, which is governed by Part 154, not special-education law."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "An ELL in a 1st-grade class responds to questions with one or two words, understands far more than she produces, and joins routines readily. Matching instruction to her current stage of second-language acquisition, her teacher should primarily:",
        "a": [
          "Use yes/no, either/or, and short 'wh-' questions with visual support, accepting one- and two-word answers while modeling slightly expanded responses.",
          "Ask open-ended 'why' and 'how' questions that require full-sentence answers from the start, on the theory that pushing her spoken production to match her stronger comprehension will accelerate her overall language growth.",
          "Have her repeat full teacher sentences chorally before every response so complete syntax becomes habitual.",
          "Suspend questioning until she initiates conversation on her own, to avoid pressuring output prematurely."
        ],
        "c": 0,
        "r": "The profile describes early production: comprehension exceeds output, and one- to two-word answers are stage-typical. Appropriate questioning matches the stage (either/or, short wh-) while the teacher recasts and expands to model the next level. Demanding full-sentence 'why' explanations overshoots the stage, total withdrawal of questioning removes needed interaction, and rote choral repetition produces imitation rather than meaningful language use."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A 4th-grade teacher chooses a read-aloud for a class that includes Emerging-level ELLs. Guided by Krashen's comprehensible input hypothesis, she should select:",
        "a": [
          "Text pitched well above the students' current grade level, on the reasoning that continuous immersion in rich and complex language forms is what will eventually allow those forms to be acquired most efficiently.",
          "Alternating passages of English and the students' home languages so every sentence is understood twice.",
          "Text slightly beyond students' current proficiency ('i+1'), made comprehensible through visuals, gestures, context, and paraphrase.",
          "Text fully within students' current independent level so that no unfamiliar structures interrupt comprehension."
        ],
        "c": 2,
        "r": "Krashen's hypothesis holds that acquisition occurs when learners receive input a step beyond current competence ('i+1') that is made comprehensible through context and support. Input far beyond proficiency is noise rather than intake, input entirely at the current level provides nothing new to acquire, and sentence-by-sentence translation is a delivery method, not the calibrated challenge the hypothesis describes."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "An Emerging-level ELL writes, 'Yesterday I goed to my cousin house.' Her teacher wants to respond in the way most consistent with second-language acquisition research. She should:",
        "a": [
          "Ignore the error entirely, since attention to form at any level interferes with fluency development.",
          "Have the class review irregular verbs together so the student hears the correction without being singled out.",
          "Return the sentence to the student marked in red, with the full rule for irregular past-tense verbs written out in the margin, and ask her to copy the corrected form three times to reinforce the accurate structure.",
          "Recast naturally ('Oh, you went to your cousin's house! What did you do there?') and note the pattern for a future brief mini-lesson, recognizing 'goed' as developmental overgeneralization."
        ],
        "c": 3,
        "r": "'Goed' is overgeneralization of the regular past-tense rule, a sign the learner is actively constructing the grammar, not regressing. Recasts preserve meaning-focused communication while supplying the target form, and selective, planned form-focused instruction addresses patterns without derailing communication. Punitive copying and public whole-class corrections raise the affective filter, while ignoring form altogether forfeits the benefit of well-timed feedback."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "The parents of a kindergarten ELL tell the teacher they have decided to stop speaking Spanish at home so their daughter 'learns English faster.' What is the most research-aligned response?",
        "a": [
          "Support the plan, since maximizing English exposure at home accelerates proficiency and simplifies the child's linguistic environment.",
          "Explain that a strong home language foundation supports English development through transfer, that bilingualism carries cognitive and identity benefits, and encourage the family to keep speaking the language in which they are most expressive.",
          "Suggest a compromise in which the family speaks English on weekdays and Spanish only on weekends.",
          "Advise the family that the school alone carries responsibility for the child's English development, so whatever language choices they happen to make at home will have little real effect on how quickly she becomes proficient."
        ],
        "c": 1,
        "r": "Research on linguistic interdependence shows skills and concepts developed in the home language transfer to English, and rich interaction in the parents' strongest language builds the deeper foundation; abandoning L1 risks subtractive bilingualism and weakened family communication without accelerating English. Scheduling gimmicks dilute the same benefit, and dismissing home influence understates the family's central role in language development."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "Parents allege that a district's ENL program is ineffective. Under the three-part test from Castañeda v. Pickard, a court would examine all of the following EXCEPT whether the program:",
        "a": [
          "Produces results, after a legitimate trial period, showing that language barriers are actually being overcome.",
          "Uses the specific instructional model that federal regulation designates as most effective for English learners.",
          "Is based on a sound educational theory recognized by experts in the field.",
          "Is implemented with adequate resources, staffing, and practices to carry the theory out."
        ],
        "c": 1,
        "r": "Castañeda established a three-prong test: sound theory, adequate implementation, and demonstrated results after a legitimate trial. Federal law deliberately does not mandate any single instructional model; districts retain flexibility in approach as long as the program passes all three prongs. A designated federal model is therefore the element a court would not look for."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A district offers a strong Dual Language strand and describes its goal as 'additive bilingualism.' A new board member asks what that term means in practice. Which explanation is accurate?",
        "a": [
          "Students receive additional periods of English instruction added onto the regular school day until they test proficient.",
          "Students add English as rapidly as possible so that it can replace the home language for academic purposes by the upper elementary grades.",
          "Students add English while continuing to develop the home language, ending with age-appropriate proficiency and literacy in both.",
          "Students' families add English at home while the school maintains the home language during the school day."
        ],
        "c": 2,
        "r": "Additive bilingualism means the second language is acquired alongside continued growth in the first, yielding biliteracy, which is the design goal of Dual Language programs. Replacement of the home language describes subtractive bilingualism, extra English periods describe a scheduling arrangement rather than a language-development philosophy, and shifting English development to the family reverses how the model actually distributes languages."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A 2nd-grade ELL who has been in U.S. schools for 18 months tells her teacher, \"Yesterday I runned and I falled down,\" and during centers she moves between Spanish and English while talking with a bilingual friend. A colleague worries she is \"confused between two languages\" and may have a language disorder. Which interpretation BEST reflects second-language acquisition research?",
        "a": [
          "Mixing Spanish and English shows the two language systems have not yet separated, so the family should use only English at home until the mixing stops.",
          "\"Runned\" and \"falled\" are overgeneralizations of the past-tense rule, and code-switching is a normal bilingual skill, so neither signals a disorder.",
          "Both behaviors are early warning signs of a language disorder, so the teacher should request a speech-language evaluation in English to document the errors.",
          "The errors show she has not learned the past tense at all, so she needs daily drills on irregular verb lists before she continues with grade-level writing."
        ],
        "c": 1,
        "r": "Overgeneralizing -ed to irregular verbs shows the learner has acquired the regular rule and is applying it too broadly, the same pattern native-speaking children show; code-switching with a bilingual peer is rule-governed and normal. The referral option is the strongest distractor because the colleague raised it, but nothing here departs from typical development, and an English-only evaluation would be discriminatory for a Spanish-speaking ELL. Asking the family to drop Spanish risks subtractive bilingualism, and the errors show partial rule learning, not an absence of past tense."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "An ENL teacher reviews writing from a 6th-grade ELL whose home language is Mandarin. The student writes fluently but consistently omits articles (\"She opened door\") and leaves off plural endings after numbers (\"three book\"). Which response is MOST likely to improve the student's accuracy?",
        "a": [
          "Assume the errors will fade on their own through more independent reading, since explicit attention to grammar at this stage interferes with fluency.",
          "Mark every error in red on each assignment so the student has a complete record of her mistakes and can correct each one independently.",
          "Refer the student for evaluation of a written-expression disability, since errors that appear consistently across many assignments suggest a disorder.",
          "Teach brief lessons contrasting how Mandarin and English signal articles and plurals, then give focused feedback on those two patterns."
        ],
        "c": 3,
        "r": "Mandarin has no articles and does not mark plurals on nouns, so these are predictable transfer errors; making the contrast explicit and focusing feedback on two patterns targets the source and helps prevent fossilization. Waiting for the errors to fade is the strongest distractor because input does matter, but transfer errors without targeted feedback are the ones most likely to fossilize. Marking every error overwhelms the writer, and consistency of a transfer pattern is evidence of first-language influence, not a disability."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A 15-year-old enrolls in a Buffalo high school after three years in a refugee camp with only sporadic schooling. He has been in U.S. schools for two months, the district has identified him as an ELL, and SIFE screening shows his home-language literacy and math are more than two years below grade level. Which conclusion and action BEST fit NYS requirements?",
        "a": [
          "He meets the NYS SIFE definition, so the school should pair ENL with targeted foundational literacy and math support while keeping him in grade-level content.",
          "Gaps of more than two years in reading and math indicate a likely intellectual disability, so he should be referred for a self-contained special education class.",
          "He cannot be classified as SIFE because he is over 14, so he should receive standard ENL services in his grade-level classes and nothing more.",
          "He should enter 9th-grade classes without ENL so he can catch up on credits, since adolescents acquire English fastest through full immersion."
        ],
        "c": 0,
        "r": "Under Part 154, SIFE are ELLs in U.S. schools less than 12 months who are two or more years below grade level in home-language literacy and/or math because of interrupted schooling; he meets both conditions, and SIFE need foundational support on top of ENL while they keep access to grade-level content. The disability referral is the strongest distractor because the gaps are large, but they are explained by interrupted schooling, and IDEA bars eligibility when lack of appropriate instruction is the determinant factor. SIFE has no age cap, and ENL cannot be withheld."
      }
    ]
  },
  "Literacy & Language Development for ELLs": {
    "icon": "📖",
    "concepts": [
      {
        "title": "BICS vs. CALP: Two Dimensions of English Proficiency",
        "body": "Jim Cummins distinguished Basic Interpersonal Communicative Skills (BICS) from Cognitive Academic Language Proficiency (CALP). BICS, the conversational fluency supported by contextual cues, gestures, and a shared physical setting, typically develops within 1 to 3 years of immersion. CALP, the decontextualized, discipline-specific academic language needed to read a textbook, write an argument, or analyze a primary source, takes roughly 5 to 7 years to approach native-peer norms. This gap is pedagogically critical: a student who chats fluently with classmates at lunch may still lack the academic vocabulary and discourse structures to succeed on a content-area assessment. New York ENL services target CALP development explicitly, and the state's five Part 154 proficiency levels (Entering, Emerging, Transitioning, Expanding, Commanding) are assigned from the annual assessment of listening, speaking, reading, and writing. EAS candidates must recognize that reclassifying or exiting an ELL on the basis of conversational fluency alone is inappropriate. Under Commissioner's Regulations Part 154, exit from ELL status has only two routes, both based on state assessments (Commanding on the annual English language proficiency assessment, or Expanding plus a proficient grades 3-8 ELA score or 65 or higher on the ELA Regents), never observed social fluency, because BICS does not signal the academic-language readiness a student needs to learn grade-level content in English."
      },
      {
        "title": "L1 Transfer: How First-Language Literacy Supports English Acquisition",
        "body": "Cummins' Linguistic Interdependence Hypothesis holds that conceptual knowledge and literacy strategies developed in a student's first language (L1) transfer to English once sufficient L2 input is available, the Common Underlying Proficiency model. A student who can infer meaning from context in Spanish, summarize a passage in Mandarin, or decode syllabically in Arabic brings those metalinguistic tools to English reading. Cognate recognition (e.g., Spanish comunicacion and English communication) is a high-yield transfer strategy for Romance-language speakers. Teachers support positive transfer by activating prior L1 knowledge before reading, using bilingual glossaries, and allowing students to draft or brainstorm in L1 before composing in English. Interference, or negative transfer, arises when L1 structures differ markedly from English, for example subject-object-verb word order, the absence of definite articles, or a different phonemic inventory that yields predictable pronunciation and spelling patterns. Instruction that names the contrast explicitly through contrastive analysis reduces interference more effectively than simply repeating correct English models, because it makes the cross-linguistic difference visible rather than leaving the student to infer it."
      },
      {
        "title": "ENL and Bilingual Program Models in New York",
        "body": "Part 154 of the Commissioner's Regulations requires services for every identified ELL and authorizes two program types: English as a New Language (ENL) and Bilingual Education. ENL is delivered through two modes, Stand-alone ENL (English language development taught by a certified ESOL teacher) and Integrated ENL (core content taught together with English language development, either co-taught by an ESOL teacher and a content teacher or taught by one dually certified teacher); ENL is mandatory and cannot be declined. Bilingual Education uses both the home language and English and comes in two state models: Transitional Bilingual Education, which moves students toward English over time, and Dual Language, which develops biliteracy in both languages (two-way programs also enroll English-proficient peers; one-way programs serve students who share a home language). Home Language Arts is a component of bilingual programs, not a separate ENL service. The Part 154 Units of Study tables tie required ENL minutes to the student's proficiency level on the NYSITELL or the annual English language proficiency assessment, so Entering and Emerging students receive the most time, and Stand-alone ENL is required only at those lower levels. Parents must receive annual notification of their child's ELL identification and program options in a language they understand, and they may decline Bilingual Education, though not ENL."
      },
      {
        "title": "Scaffolding and Authentic Tasks for ELL Literacy",
        "body": "Scaffolding provides temporary, adjustable support that lets ELLs engage with grade-level texts and tasks before they could succeed independently, and the support is gradually withdrawn as competence grows. Common literacy scaffolds include graphic organizers (semantic maps, T-charts), sentence frames and starters calibrated to proficiency level, visual supports and realia, think-alouds that make comprehension strategies transparent, and tiered vocabulary instruction targeting Tier 2 cross-disciplinary academic words and Tier 3 domain-specific terms (Beck, McKeown, and Kucan). Authentic tasks, such as writing for a real audience, reading genuine informational texts, and debating a live issue, sustain motivation and provide richer language exposure than decontextualized drills. The Sheltered Instruction Observation Protocol (SIOP) operationalizes these principles: every lesson pairs a content objective with a language objective, making the linguistic demands of the task explicit. Universal Design for Learning complements scaffolding by offering multiple means of representation (captioned video, audio text), of action and expression (an oral response option, speech-to-text), and of engagement (culturally relevant, high-interest topics), reducing barriers for the whole class while still permitting targeted ELL supports."
      },
      {
        "title": "Content-Area Literacy: Using Literacy as a Learning Tool",
        "body": "Content-area, or disciplinary, literacy means using reading and writing to construct disciplinary knowledge, not merely to demonstrate it afterward. For ELLs this requires explicit attention to genre and text structure: a science lab report, a historical document analysis, and a literary essay each carry distinct organization, vocabulary registers, and argument moves. Teachers support ELL content literacy by pre-teaching key Tier 2 and Tier 3 vocabulary with visual and contextual support, modeling annotation and close-reading strategies, using text sets that offer multiple entry points (visual, simplified-language, and grade-level versions of the same content), and building background knowledge before reading. Writing-to-learn strategies such as quick-writes, structured notes, and exit tickets give ELLs low-stakes practice producing academic language. In New York the Next Generation Learning Standards embed literacy expectations across English language arts, science, social studies, and mathematics, so every content teacher shares responsibility for ELL language development, not just the ENL teacher. This shared responsibility is also the rationale for the Integrated ENL co-teaching model authorized under Part 154."
      },
      {
        "title": "Adapting Instruction Across NYS ELL Proficiency Levels",
        "body": "New York's Part 154 framework defines five English proficiency levels: Entering, Emerging, Transitioning, Expanding, and Commanding. They were assigned from the NYSESLAT through spring 2026, and NYSED states the same levels continue to guide services as WIDA ACCESS for ELLs becomes the annual test in spring 2027. Effective teachers differentiate literacy instruction across these levels rather than withholding academic content until full proficiency. At the Entering and Emerging levels, instruction emphasizes high-frequency vocabulary, heavy visual support, choral and partner reading, and tasks that lower output pressure while building receptive language. At the Transitioning and Expanding levels, scaffolds remain but grow more cognitively demanding: students produce extended written responses, take part in structured academic discussion, and read longer authentic texts with strategic support. At the Commanding level, students approach native-peer performance yet may still need help with low-frequency academic vocabulary and culturally unfamiliar topics. Across all levels, formative assessment drives differentiation; teachers use writing samples, reading records, and observational data to adjust scaffold intensity. Misjudging a student's level, for example treating an Expanding student as Entering, leads to under-challenging instruction that stalls growth, while the Part 154 Units of Study tables separately set the minimum ENL minutes each level must receive."
      },
      {
        "title": "Learning to Read in a New Language: How ELL Literacy Development Compares",
        "body": "ELLs and native English speakers learn to read through the same core components: phonemic awareness, phonics, fluency, vocabulary, and comprehension, the components NYS requires in explicit, systematic K-4 reading instruction. The National Literacy Panel on Language-Minority Children and Youth (August & Shanahan, 2006) found that ELLs benefit from instruction in these components, with important differences. Native speakers arrive with thousands of oral English words and a feel for English syntax, so decoding links print to words they already know. Many ELLs can decode accurately long before they understand what they read, because oral vocabulary and background knowledge lag behind word reading. Oral English proficiency therefore matters more for ELL comprehension, and instruction must build it alongside decoding. Phonology differs too: sounds absent from the home language (for example, several English short vowels for Spanish speakers, or /th/ for many learners) affect pronunciation and spelling, and students literate in a language with a different writing system (Arabic, Mandarin, Russian) must learn new print conventions such as left-to-right directionality or the English alphabet. Home-language literacy is a major advantage: phonological awareness, the alphabetic principle, comprehension strategies, and cognate knowledge transfer, so a student who reads well in Spanish is not starting from zero. Teachers should learn what students can do in the home language, teach transferable skills explicitly by naming what is the same and what is different, and never treat accurate decoding as proof of comprehension."
      }
    ],
    "practice": [
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 9th-grade ELA teacher receives a newly enrolled SIFE student whose Spanish literacy is assessed at approximately a 3rd-grade level. The class is beginning a unit on Romeo and Juliet. Which instructional decision best serves this student?",
        "a": [
          "Ask the ENL teacher to take over all of her literacy instruction so the ELA class can proceed without adjustments.",
          "Have her sit with the class during the unit but assess her only on attendance and effort until her English improves.",
          "Provide access to the same unit through scaffolds: a plot summary in Spanish, a graphic novel or modified text version, focused foundational literacy instruction, and structured oral tasks tied to the play's themes.",
          "Excuse the newly arrived student from the Romeo and Juliet unit altogether and place her on independent phonics software instead, keeping her there until her decoding skills reach an approximate grade-level benchmark."
        ],
        "c": 2,
        "r": "NYSED requires that SIFE students receive both foundational literacy support and meaningful access to grade-level content; scaffolded parallel access (home-language summaries, adapted text, oral engagement with the same themes) does both. Removing her to a software program denies core content, grading on effort alone lowers expectations without teaching, and outsourcing her entirely to the ENL teacher abandons the content teacher's shared responsibility under Part 154."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 7th-grade Spanish-speaking ELL at the Emerging level is beginning a unit on persuasive writing. The teacher wants to leverage positive L1 transfer. Which strategy is MOST directly aligned with the Linguistic Interdependence Hypothesis?",
        "a": [
          "Assigning a simplified English text at the student's independent reading level to build fluency before introducing persuasion.",
          "Grouping the student with English-proficient peers for the entire writing unit, so that she hears rich English-language models continuously throughout the drafting process.",
          "Providing a Spanish-language mentor text for persuasive writing so the student can apply familiar genre knowledge while drafting in English.",
          "Asking the student to write the first draft entirely in English to maximize exposure to academic English structures."
        ],
        "c": 2,
        "r": "Cummins' Interdependence Hypothesis holds that genre knowledge built in L1, here how a persuasive argument is structured, transfers to L2. A Spanish mentor text activates that existing schema and supports positive transfer. Requiring an all-English first draft is the strongest distractor because it maximizes English exposure, but at the Emerging level it suppresses the L1 resource and raises cognitive load without the conceptual bridge the hypothesis describes. A simplified English text builds fluency but does not tap L1 genre knowledge, and an all-English peer group supplies input but is not what the hypothesis specifically predicts."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A high school biology teacher co-teaches with an ENL teacher in an Integrated ENL setting. Before a complex reading on cellular respiration, the ENL teacher distributes a graphic organizer with labeled diagrams and sentence frames such as 'The process of ___ releases energy because ___.' A student at the Expanding level asks why they need the frames since they 'already know English.' What is the BEST rationale the ENL teacher could offer?",
        "a": [
          "The frames model the cause-and-effect structures of scientific explanation, academic language Expanding students are still building despite strong social English.",
          "The frames are given to every student in the class under UDL guidelines, so they are a general classroom routine rather than a support tied to her own language development.",
          "The frames are a social-language support meant to help her talk smoothly with lab partners during the hands-on portions of the cellular respiration activity.",
          "The frames are required by the student's IEP and cannot be removed or adjusted without first holding a CSE meeting to amend the plan."
        ],
        "c": 0,
        "r": "At the Expanding level, students produce extended English but are still developing CALP, including the cause-and-effect syntax (\"releases energy because...\") that scientific explanation demands; the frames make that structure explicit so she can show her reasoning in writing. The UDL option is the strongest distractor because frames can help everyone, but it denies the targeted academic-language purpose that justifies them for her. Nothing indicates an IEP, and the frames target written academic discourse, not social (BICS) talk with lab partners."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "An Entering-level ELL in a 3rd-grade class arrives mid-year speaking Haitian Creole. The classroom teacher asks the ENL specialist which immediate literacy practice is MOST appropriate given the student's proficiency level and the goal of building content-area literacy at the same time.",
        "a": [
          "Provide primarily oral instruction during the first semester, introducing written English tasks gradually once the student demonstrates consistent comfort at the Emerging level.",
          "Place the student in a separate pull-out room for all literacy instruction until conversational English is established, typically 1 to 3 years.",
          "Administer the 3rd-grade ELA benchmark assessment immediately to establish a baseline before providing any scaffolds.",
          "Use visual supports, bilingual glossaries, and realia tied to current content units so the student can access meaning while developing English vocabulary."
        ],
        "c": 3,
        "r": "At the Entering level, visual supports, realia, and bilingual glossaries are the highest-leverage tools: they reduce the language barrier to content access without withholding grade-level curriculum, consistent with the meaningful-access requirements that govern ELL programs (Title VI and the EEOA, as applied in Lau v. Nichols and Castaneda v. Pickard). The strongest distractor is wrong: blanket pull-out segregation delays content learning, risks placing the student in a dead-end track that civil-rights law disfavors, and misapplies the BICS timeline, since conversational-English development does not require isolation from grade-level content. Withholding all written tasks and front-loading a benchmark test with no scaffolds are likewise inappropriate at the Entering level."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "An ENL teacher is choosing vocabulary to pre-teach before a 5th-grade article on volcanoes. The candidates are: 'the,' 'because of,' 'process,' 'analyze,' 'magma,' and 'pyroclastic.' Following tiered-vocabulary guidance for ELLs, which words deserve the most sustained instructional investment?",
        "a": [
          "'Process' and 'analyze,' high-utility Tier 2 academic words that recur across texts and disciplines, while teaching the Tier 3 volcano terms briefly in context.",
          "'The' and 'because of,' since function words carry the grammar that ELLs most often lack.",
          "'Magma' and 'pyroclastic' deserve the most instructional time, because the technical geology terms are the hardest words in the passage and the classroom glossary already defines the remaining vocabulary well enough on its own.",
          "All six equally, since ELLs cannot be assumed to know any of the words in advance."
        ],
        "c": 0,
        "r": "Tier 2 general academic words like 'process' and 'analyze' appear across content areas and repay deep instruction with broad transfer; Tier 3 technical terms are important but narrow, usually well supported by the text and visuals, and teachable quickly in context. Function words are rarely the bottleneck at this level, and undifferentiated equal investment ignores the utility principle that drives tiered selection."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 6th-grade ELA teacher worries that her Transitioning-level ELLs 'can't handle' the grade-level novel and considers giving them a below-level abridged version all year. Which guidance reflects both research and ELLs' legal right to meaningful curricular access?",
        "a": [
          "Let each ELL choose the version they prefer, since self-selection maximizes engagement.",
          "Use the below-level abridged version of the novel with the ELLs throughout the unit, on the reasoning that success with simpler text this year builds the reading confidence they will need to tackle grade-level text next year.",
          "Alternate novels: abridged in the fall to establish fluency, grade-level in the spring once scores rise.",
          "Keep ELLs in the grade-level novel with scaffolds (chunked reading, glossaries, background-building, structured discussion), since a steady diet of simplified text denies access to the language and content they are owed."
        ],
        "c": 3,
        "r": "Lau v. Nichols and the EEOA establish ELLs' right to meaningful access to the curriculum, and research shows a steady diet of simplified text caps exposure to the academic language ELLs must acquire; scaffolding grade-level text provides both access and challenge. Semester sequencing and student self-selection still institutionalize reduced exposure, and 'confidence first' reasoning is the classic rationale for the access gap itself."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 3rd-grade ELL's most recent English language proficiency results, confirmed by classroom data, show Expanding-range listening and speaking but Emerging-range reading and writing. How should her teachers use this modality profile?",
        "a": [
          "Target literacy-specific scaffolds (decoding support, shared writing, print-referenced vocabulary work) while leveraging her stronger oral English as the bridge into reading and writing tasks.",
          "Treat the reading and writing scores as clear underestimates of her true ability, since a student who converses at the Expanding level in English cannot realistically be functioning at only the Emerging level with printed text.",
          "Average the four modalities and plan all supports at the Transitioning level for simplicity.",
          "Focus instruction on listening and speaking, since strengthening the strongest modalities lifts the others over time."
        ],
        "c": 0,
        "r": "Proficiency data broken out by modality exist precisely so instruction can be differentiated: this student needs print-focused scaffolding, and her stronger oral language is the natural asset to build on (oral rehearsal before writing, discussion before reading). Averaging erases the actionable pattern, investing in existing strengths ignores the documented need, and uneven modality profiles are common and valid, not measurement error."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "An Emerging-level ELL submits a paragraph with a strong central idea but errors in articles, plurals, and verb endings on nearly every line. Which feedback approach best supports her writing development?",
        "a": [
          "Return the entire paragraph to the student for full revision and keep returning it until it is completely free of grammatical errors, on the principle that accepting flawed written work lowers the standard for everyone.",
          "Correct nothing, since any error feedback at the Emerging level damages willingness to write.",
          "Mark every error so the student has a complete record of the forms she has not yet mastered.",
          "Respond first to the ideas, then give targeted feedback on one or two high-leverage error patterns with examples, deferring the rest to later cycles."
        ],
        "c": 3,
        "r": "Selective, patterned feedback (meaning first, then one or two teachable error categories) is what Emerging writers can actually absorb and act on; it sustains the willingness to write while moving accuracy forward. Comprehensive marking overwhelms and discourages, zero feedback forfeits learning that well-chosen correction provides, and demanding error-free revision from an Emerging-level writer sets an unattainable bar."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "Before her class reads an article on urban heat islands, a teacher of Transitioning-level ELLs spends ten minutes eliciting what students know about hot streets, shade, and rooftops in their own neighborhood, charting their ideas in a concept web. This practice most directly supports reading comprehension by:",
        "a": [
          "Serving as a formative assessment that determines which students should be excused from the reading.",
          "Replacing the need for during-reading supports such as glossaries or chunked text.",
          "Improving decoding accuracy, since discussed words are easier to sound out when encountered in print.",
          "Activating and building schema so that new text information can attach to existing knowledge structures during reading."
        ],
        "c": 3,
        "r": "Comprehension research shows readers construct meaning by integrating text with prior knowledge; activating relevant schema, especially through learners' own community experience, gives ELLs conceptual hooks that lower the language load of the text. The activity does not practice decoding, does not eliminate the need for during-reading scaffolds, and its purpose is preparation for the text, never triage out of it."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 4th-grade teacher of Spanish-speaking ELLs is planning vocabulary instruction for a text containing 'observe,' 'describe,' 'transform,' and 'estimate.' Which strategy takes fullest advantage of her students' linguistic assets?",
        "a": [
          "Provide English-only definitions with pictures, since visual support is the most universal scaffold.",
          "Avoid mentioning Spanish equivalents so students learn to process the English words directly, without leaning on translation as a crutch.",
          "Teach the words through daily spelling practice, since orthographic mastery precedes meaning.",
          "Teach explicit cognate awareness (observar, describir, transformar, estimar), including how to verify cognates and spot false friends."
        ],
        "c": 3,
        "r": "A large share of English academic vocabulary has Spanish cognates, and explicit cognate-awareness instruction, including caution about false cognates, converts students' home-language knowledge directly into English comprehension, the essence of asset-based literacy teaching. Withholding the connection discards free leverage, pictures alone are weaker than pictures plus cognates, and spelling drill addresses form without meaning."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A Transitioning-level 2nd grader reads a grade-level passage aloud quickly and accurately, but when asked to retell it she recalls only isolated words and cannot answer simple questions about the plot. Her teacher had planned to move her to a higher reading group because of her fluency. What is the BEST next step?",
        "a": [
          "Move her to the higher group as planned, since accurate, fluent decoding at grade level shows her comprehension will catch up without added support.",
          "Refer her for a reading disability evaluation, since a gap between decoding and comprehension in 2nd grade is a recognized sign of a comprehension disorder.",
          "Recognize that ELLs often decode ahead of comprehension, and add vocabulary, background building, and oral discussion before and after reading.",
          "Switch her to a phonics-only program, since fluent reading without comprehension shows she is guessing at words rather than truly decoding them."
        ],
        "c": 2,
        "r": "Many ELLs decode accurately before they have the oral vocabulary and background knowledge to understand the text, so fluency is not evidence of comprehension; building vocabulary, background, and oral language targets the actual gap. Moving her up is the strongest distractor because her fluency is real, but placing her in harder text without comprehension support would widen the gap. The pattern is typical of second-language reading development rather than a disorder, and her accurate decoding shows phonics is not the need."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 3rd grader who moved from Puerto Rico last year reads at grade level in Spanish. As he learns to read in English, he spells \"happy\" as \"japi\" and \"ship\" as \"chip.\" How should his teacher interpret and respond to these spellings?",
        "a": [
          "He is applying Spanish sound-spelling patterns, a sign of transferable phonics knowledge, so the teacher should explicitly contrast English /h/ and /sh/ spellings with Spanish.",
          "His Spanish literacy is interfering with his English, so the teacher should ask the family to pause Spanish reading at home until his English spelling becomes consistent.",
          "He has weak phonemic awareness, so he should start a kindergarten-level phonemic awareness program before receiving any more grade-level spelling instruction.",
          "The spellings are random errors that weekly spelling tests and corrective feedback will fix once he memorizes the conventional form of each high-frequency word."
        ],
        "c": 0,
        "r": "In Spanish, \"j\" spells the /h/ sound, and Spanish has no /sh/ sound, so \"ch\" is the closest spelling he knows; these are logical, sound-based spellings that show strong phonological awareness and alphabetic knowledge transferring from Spanish. Pausing Spanish is the strongest distractor because it names the source correctly, but home-language literacy is an asset, and abandoning it removes the foundation that transfers. The errors are systematic, not random, and his skills are well beyond a kindergarten phonemic awareness program."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "In an Integrated ENL 8th-grade science class, Emerging- and Transitioning-level ELLs are preparing to write lab conclusions. The co-teachers want to build the oral academic language students will need for the writing. Which activity BEST serves this goal?",
        "a": [
          "Students silently read a model lab conclusion and copy its sentences into their notebooks so they can memorize the structure before writing their own.",
          "The teacher explains how scientists write conclusions while students take notes, saving all student talk until after the written conclusions are finished.",
          "Students complete a crossword puzzle of lab vocabulary on their own, then write their conclusions independently without discussing their results.",
          "Partners use a structured talk protocol with frames such as \"Our data show ___, which suggests ___\" to explain their results aloud before writing."
        ],
        "c": 3,
        "r": "Structured academic talk lets ELLs rehearse the language of scientific reasoning orally, with frames that model the target structures, before they write; oral rehearsal is a well-supported bridge to academic writing. Copying a model is the strongest distractor because mentor texts are useful, but copying without talk or analysis builds no productive language. A teacher explanation with no student talk and a solo vocabulary puzzle give students no practice producing the discourse the writing requires."
      }
    ]
  },
  "ELL Assessment, Program Models & Collaboration": {
    "icon": "🌐",
    "concepts": [
      {
        "title": "NYS Proficiency Levels and the WIDA Assessment Transition",
        "body": "New York reports ELL proficiency on its own five-level Part 154 scale: Entering, Emerging, Transitioning, Expanding, and Commanding. These levels set required ENL and bilingual service minutes and drive exit decisions. Do not confuse them with WIDA's six levels (Entering, Emerging, Developing, Expanding, Bridging, Reaching). In October 2025 New York joined the WIDA Consortium for assessment only: the NYSESLAT was given for the last time in spring 2026 (those results still govern 2026-27 placement and exit), and WIDA ACCESS for ELLs, plus WIDA Alternate ACCESS for ELLs with the most significant cognitive disabilities, becomes the annual English language proficiency test in spring 2027. The NYSITELL remains the identification test through 2026-27; the WIDA Screener replaces it in fall 2027. NYSED is not adopting the WIDA English Language Development Standards: instruction stays anchored to the NYS Next Generation Learning Standards and the NYS Academic and Linguistic Demands, and the five Part 154 levels continue to guide services. Exit follows only two Part 154 pathways: Commanding on the annual assessment, or Expanding plus a proficient grades 3-8 ELA score or 65 or higher on the ELA Regents. A teacher's impression of conversational fluency is never an exit route, because BICS (roughly two years to develop) does not signal the CALP (five to seven years) that grade-level academic work requires (Cummins)."
      },
      {
        "title": "ENL Program Models: Integrated and Stand-Alone",
        "body": "Under NYS Commissioner's Regulations Part 154, English as a New Language (ENL) is delivered through two complementary settings, not a simple either/or by level. In Integrated ENL, a certified ESOL teacher and a content-area teacher co-teach in a general-education classroom (or one dually certified teacher teaches it) and are jointly responsible for both grade-level content and language development. In Stand-Alone ENL, students receive English language development in a separate setting taught by a certified ENL teacher. The Part 154 Units of Study tables require a baseline of Integrated ENL for every ELL at all proficiency levels, with Stand-Alone units required in addition at the Entering and Emerging levels and permitted through flexible units at Transitioning; total required minutes decrease as proficiency rises (K-8: 360 minutes per week at Entering and Emerging, 180 at Transitioning and Expanding, 90 for Commanding/Former ELLs). Integrated is therefore the universal baseline that preserves access to grade-level content, while Stand-Alone provides the intensive support lower-level students also need. Both settings require certified teachers (an ESOL-certified teacher, or a dually certified content teacher for Integrated ENL), never a paraprofessional, and service levels follow the student's proficiency level on the NYSITELL or the annual English language proficiency assessment."
      },
      {
        "title": "Bilingual Program Models: Transitional and Dual Language",
        "body": "NYS recognizes two bilingual models under Commissioner's Regulations Part 154. Transitional Bilingual Education (TBE) uses the student's home language as a temporary bridge to English; instruction begins largely in the home language and shifts toward English over time, with home-language support phased out as English develops. Because the home language serves mainly as a bridge rather than a long-term goal, the research literature classifies TBE as a weaker, potentially subtractive form of bilingual education compared with Dual Language. Dual Language develops bilingualism, biliteracy, and cross-cultural competence; NYSED recognizes two-way programs (ELLs learning alongside English-proficient peers) and one-way programs (students who share a home language); instruction is delivered in two languages on a sustained ratio (commonly 50/50 or 90/10) across subjects and grades, making it an additive model in which both languages are valued. Research on well-implemented Dual Language programs shows ELLs reaching English academic outcomes equal to or above English-only peers by the upper elementary grades. When advising families, teachers should accurately describe each model's goals and timeline and explain that families may decline bilingual instruction under Part 154 while still receiving required ENL services in either setting."
      },
      {
        "title": "Evaluating, Selecting, and Adjusting Materials and Assessments",
        "body": "Selecting materials for ELLs means weighing linguistic demand alongside content rigor. Examine texts for sentence complexity, vocabulary load, syntactic structures, and cultural assumptions that create barriers unrelated to content knowledge. Graphic organizers, visuals, bilingual glossaries, home-language anchor texts, and multimedia are evidence-based scaffolds that lower language load while preserving cognitive demand. Assessment selection must separate two constructs: content knowledge versus English proficiency. Using assessments normed on English-proficient students without supports can systematically underestimate an ELL's content knowledge, an inequitable practice. NYSED permits ELL testing accommodations on state tests such as extended time, a separate location, word-to-word bilingual glossaries (no definitions or explanations), simultaneous use of English and translated editions where NYSED provides them, oral translation for lower-incidence languages without a translated edition, and writing responses in the home language; translated editions, oral translation, and home-language responses are not allowed on the ELA exams, and the English language proficiency test has its own rules. Consistent with UDL, assessments should offer multiple means of action and expression so ELLs can demonstrate learning through varied modalities, and formative tools such as oral responses, observational checklists, and portfolios should be adjusted to capture progress. When adjusting tasks, scaffold up by adding support rather than simplifying down, preserving access to grade-level standards and avoiding a watered-down curriculum that widens opportunity gaps."
      },
      {
        "title": "Collaborating with ENL and Bilingual Educators",
        "body": "Collaboration between general-education teachers and ENL or bilingual educators is a pedagogical and regulatory expectation, not optional enrichment. In Integrated ENL co-teaching under Part 154, both teachers share planning, instruction, and assessment. In Stand-Alone contexts, collaboration means co-planning units so ENL instruction aligns with content objectives, sharing language-development data, and coordinating scaffolds. General-education teachers should share upcoming topics, key vocabulary, and text selections in advance so language objectives can be embedded. Best practice includes co-constructing language objectives alongside content objectives using language functions (define, compare, argue), analyzing English language proficiency results and classroom data together, and jointly communicating with families. Disagreements about a student's readiness to exit services are settled by the objective Part 154 exit criteria (Commanding on the annual English language proficiency assessment, or Expanding plus a proficient state ELA score), which collaboration cannot override. General-education teachers should not submit a written request for a special education referral for an ELL based solely on language-related academic struggles before adequate language support has been provided and progress monitored; doing so risks misidentification and conflicts with IDEA, which requires nondiscriminatory evaluation in the student's native language (34 CFR 300.304) and bars an eligibility finding when limited English proficiency is the determinant factor (34 CFR 300.306(b)). NYS sets no waiting period, however: a newly enrolled ELL with a suspected disability may be referred at any time by a parent or a district designee, and school staff may submit a written request for referral at any time."
      },
      {
        "title": "Collaborating with Families of ELLs",
        "body": "Under ESSA (Title I, section 1112(e)(3)), Title VI of the Civil Rights Act, and CR Part 154, districts must notify families of a student's ELL identification, program placement, and annual proficiency results in a language the family can understand; this is a legal mandate, not a courtesy. Families have the legal right to decline bilingual instruction (while still receiving required ENL services) and must be told of this right in accessible language. Genuine family collaboration goes beyond translating documents to building partnerships that treat families' cultural and linguistic backgrounds as assets. Teachers should use trained, qualified interpreters for conferences rather than asking students to interpret, which is inappropriate and ethically problematic. Asset-based engagement includes community liaisons, multilingual communication, and inviting families' knowledge of their children's prior schooling and home literacy. FERPA (20 U.S.C. 1232g) protects all student education records, including English language proficiency test scores and ENL placement decisions, from disclosure to unauthorized parties. When families appear disengaged, teachers should examine structural barriers such as meeting times, transportation, childcare, and fear of immigration consequences rather than assuming a lack of interest in education."
      },
      {
        "title": "The NYS ELL Pathway: Identification, Placement, and Exit",
        "body": "Part 154 sets a fixed sequence for every new entrant. Step 1 is the Home Language Questionnaire (HLQ), given to parents by qualified personnel. Step 2, if the HLQ shows a language other than English, is an individual interview with the student in English and the home language, including a review of work samples. Step 3 applies to students with disabilities: a Language Proficiency Team decides whether the identification test is given. Step 4 is the NYSITELL, given once, in person, to students the interview flags (the WIDA Screener replaces it in fall 2027). Identification must be finished within 10 school days of initial enrollment, and parents receive written notice within 5 school days of identification in their preferred language. A student who transfers between NYS districts is not retested; ELL status and level follow the student. Before placement, parents attend an orientation explaining bilingual education and ENL. Bilingual education is the default where it is offered; parents have 10 school days to choose ENL instead, but they cannot waive services altogether. A district must create a bilingual program when 20 or more ELLs in the same grade share a home language, and parents may request a review of the identification within 45 school days. For newly identified ELLs who may be SIFE, districts use the SIFE Oral Interview Questionnaire and, for grades 3 to 9, the Multilingual Literacy SIFE Screener. Every year ELLs take the state English language proficiency test (WIDA ACCESS for ELLs beginning spring 2027). Exit has exactly two routes: Commanding, or Expanding plus a proficient grades 3-8 ELA score or 65 or higher on the ELA Regents. Former ELLs then receive at least two years of Former ELL services and keep ELL testing accommodations for two years."
      },
      {
        "title": "ELLs with Disabilities: Two Entitlements at Once",
        "body": "An ELL who has a disability is entitled to both Part 154 language services and special education under IDEA; one never replaces the other. NYSED's January 2024 field memo spells out the rules. Bilingual and ENL services are general education core instruction, so a student found eligible for special education keeps them, and the CSE decides how they are delivered (for example, ENL in a special class, a bilingual special class, or bilingual integrated co-teaching) and whether bilingual special education or bilingual related services are needed. The CSE for an ELL must include at least one member certified to provide bilingual services or to teach ESOL. Scheduling or staffing problems never justify replacing ENL with resource room or another special education service. A CSE cannot end ELL status because it believes the disability explains the proficiency score; the two Part 154 exit pathways are the only routes. There is no waiting period before a newly enrolled ELL can be referred and evaluated, but the evaluation must be conducted in the student's native language unless that is clearly not feasible, using qualified bilingual evaluators or interpreters (34 CFR 300.304), and the team must rule out limited English proficiency and lack of appropriate instruction as the determinant factor (34 CFR 300.306(b)); for a learning disability it must also rule out cultural factors (34 CFR 300.309). Signs that point beyond typical language acquisition include difficulties that appear in the home language as well as English, that persist despite well-implemented ENL and targeted intervention, and that peers with similar language and schooling backgrounds do not show. Both errors cause harm: over-identification places language learners in special education, and under-identification (\"just give her time to learn English\") denies services a student needs. IEPs list disability-related testing accommodations even when they overlap with ELL accommodations, and WIDA Alternate ACCESS serves ELLs with the most significant cognitive disabilities beginning spring 2027."
      }
    ],
    "practice": [
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 6th-grade student scored Commanding on the spring 2026 NYSESLAT and has exited ELL status. In October, her math teacher notices she is struggling with multi-step word problems and asks the ENL coordinator whether \"anything is still owed\" to this student. Which answer is correct under NYS regulations?",
        "a": [
          "She should retake the NYSITELL so services can restart at the level indicated by the new score.",
          "As a Former ELL she is entitled to at least two years of monitoring with continued support services, and she remains eligible for ELL testing accommodations for two years after exiting.",
          "Nothing is owed; once a student exits ELL status, she is treated identically to never-ELL peers in every respect from that day forward.",
          "She must be re-enrolled in Stand-Alone ENL for one Unit of Study, since word-problem difficulty shows the exit decision was premature."
        ],
        "c": 1,
        "r": "Part 154 requires districts to monitor Former ELLs and provide continued support (such as integrated ENL or other services) for at least two years after exit, and exited students retain access to ELL testing accommodations for two years. The NYSITELL is only an initial identification screener, services cannot simply restart without re-identification, and one area of difficulty does not invalidate a Commanding exit score."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 2nd-grade ENL teacher in an Integrated ENL (co-teaching) classroom is planning a science unit on animal adaptations with the general-education teacher and wants to write formal lesson objectives. Which pair of objectives best reflects best practice for Integrated ENL co-teaching?",
        "a": [
          "Content: Students will identify three animal adaptations. Language: Students will improve their reading skills.",
          "Content: Students will identify and compare three animal adaptations. Language: Students will use compare/contrast sentence frames in written and oral responses.",
          "Content: Students will complete a worksheet on animal adaptations. Language: Students will copy vocabulary words from the board three times each.",
          "Content: Students will listen to a teacher read-aloud about adaptations. Language: Students will answer yes/no and either/or questions about the text with a partner."
        ],
        "c": 1,
        "r": "Effective co-teaching for ELLs requires distinct, measurable content AND language objectives that are explicitly connected. The correct option specifies both the content skill (identify and compare adaptations) and a language function (compare/contrast) paired with a concrete linguistic scaffold (sentence frames), consistent with a language-function approach and Part 154 co-teaching expectations. An objective such as 'improve reading skills' is unmeasurable and not tied to the content task; copying words and answering yes/no questions are low-demand activities, not language-development objectives, and do not support intentional academic language growth during content instruction."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "The parents of a Mandarin-speaking 1st-grader have received a district notice explaining that their child has been identified as an ELL and that a Transitional Bilingual Education (TBE) seat is available. The family asks the child's teacher to explain how TBE differs from the Dual Language program also offered at the school so they can decide which to choose. Which explanation is most accurate?",
        "a": [
          "TBE is required by law, and families cannot choose Dual Language unless the district recommends it.",
          "Dual Language is designed for students who already have some proficiency in English, while TBE serves newcomers who arrive speaking little or no English at enrollment.",
          "TBE and Dual Language are essentially identical; the only real difference is class size.",
          "TBE uses Mandarin as a temporary bridge with a planned shift toward English-only instruction, while Dual Language develops full bilingualism and biliteracy in both languages."
        ],
        "c": 3,
        "r": "The key distinction is program goal and language trajectory. TBE uses the home language mainly as a bridge to English and then phases it out, so it is classed as a weaker, potentially subtractive model. Dual Language is an additive model with a sustained commitment to both languages, targeting bilingualism and biliteracy; two-way programs enroll ELLs together with English-proficient peers, and one-way programs serve students who share a home language. Families must be accurately informed of these differences to exercise their right under Part 154 to choose or decline a program. The strongest distractor reverses the models' audiences: Dual Language is not reserved for students who already speak some English, and newcomers can enroll in either model. TBE is not legally mandated over Dual Language, and the two models are not interchangeable."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "In September, a district sends the parents of newly identified ELLs a packet describing program placement options. The packet is in English only, and several Spanish- and Bengali-speaking families return nothing. The ENL coordinator says the district \"met its obligation by mailing the letters.\" What is wrong with this position?",
        "a": [
          "The district should have skipped notification and placed the students directly, since program placement is not a parental decision.",
          "Nothing is wrong; mailing written notice to the home address is the full extent of the district's legal duty.",
          "Part 154 and Title VI require that parent notifications about ELL identification and placement be provided in a language the parents understand, so English-only notice to these families is not legally sufficient.",
          "The error is procedural only: the packet should also have been posted on the district website for accessibility."
        ],
        "c": 2,
        "r": "Commissioner's Regulations Part 154 requires that parents receive information about identification, program options, and placement in the language they best understand, and Title VI requires meaningful communication with limited-English-proficient parents. Mailing English-only letters to Spanish- and Bengali-speaking homes fails that standard. Website posting does not cure inaccessible language, and parents do have placement choices, including the right to select or decline bilingual programs."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 3rd-grader transfers in October from another New York district, where she was identified as an ELL and scored Emerging on the spring 2026 NYSESLAT. The receiving school's secretary schedules a new NYSITELL 'to restart the process.' What should the ENL coordinator do?",
        "a": [
          "Cancel the screener: her NYS identification and most recent proficiency level transfer with her, so she should be placed promptly in Emerging-level services.",
          "Administer both the NYSITELL and a district benchmark, then average the results to set her service level.",
          "Allow the NYSITELL to proceed, since each district must establish its own baseline for services and cannot rely on identification records from another district.",
          "Pause all ENL services until the spring English language proficiency test provides current data."
        ],
        "c": 0,
        "r": "The NYSITELL is only for initial identification; a student already identified within New York State carries her ELL status and most recent proficiency level to the new district, which must continue mandated services at that level without interruption. Re-screening delays required services, waiting for the next annual proficiency test suspends them altogether, and averaging scores has no basis in Part 154."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A building schedule is being built for an Entering-level 4th-grade ELL. The scheduler proposes one 40-minute Integrated ENL period daily and nothing else. Under Part 154's Units of Study requirements, how should the ENL teacher respond?",
        "a": [
          "Approve the schedule, since daily integrated support exceeds what most districts provide at any level.",
          "Explain that Entering-level students are required to receive more Units of Study than higher levels, including a Stand-Alone ENL component in addition to Integrated ENL, so the proposed single period is insufficient.",
          "Request that the student be moved to a self-contained ENL class for the full day until she reaches Emerging.",
          "Accept the schedule provisionally and compensate with an after-school homework club taught by a volunteer."
        ],
        "c": 1,
        "r": "Part 154 scales required Units of Study to proficiency level: students at Entering (and Emerging) are entitled to the most service, delivered through a combination of Stand-Alone and Integrated ENL, and the requirement is met with certified ENL instruction during the school day. One integrated period falls short, full-day segregation is not the required model, and volunteer-run after-school time cannot substitute for mandated instructional units."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A CSE is planning the initial evaluation of a Spanish-speaking 2nd-grade ELL referred for a suspected learning disability. Which evaluation practice does IDEA require?",
        "a": [
          "Use nonverbal measures exclusively, so that language plays no role anywhere in the evaluation.",
          "Assess in English only, since English performance is what ultimately determines academic success in a New York classroom and on state tests.",
          "Postpone the evaluation until the student scores Transitioning or above, when English testing becomes valid.",
          "Evaluate in the language and form most likely to yield accurate information (here including Spanish), using multiple measures and qualified bilingual evaluators or interpreters."
        ],
        "c": 3,
        "r": "IDEA (34 CFR 300.304) requires that evaluations be administered in the child's native language or other mode most likely to yield accurate academic, developmental, and functional information, using multiple valid measures, so that language difference is not mistaken for disability. English-only testing builds the bias in, exclusively nonverbal batteries discard needed information about language-based learning, and delaying evaluation of a genuinely suspected disability violates child find."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "An ENL teacher and a 7th-grade science teacher share an Integrated ENL class. The science teacher plans all lessons alone and hands the ENL teacher a copy each Monday 'to see what she can add.' Which change would most improve the model?",
        "a": [
          "Rotate full control of the class weekly so each teacher independently experiences both roles.",
          "Have the ENL teacher work with the four ELLs at a designated back table during each science lesson while the content teacher leads everyone else, so that the delivery of the mandated language services is clearly documented.",
          "Establish regular co-planning in which the pair writes paired content and language objectives together and divides instructional roles in both delivery and assessment.",
          "Keep the current arrangement but add a shared folder where the ENL teacher can deposit supplementary worksheets."
        ],
        "c": 2,
        "r": "Integrated ENL is a co-teaching model built on shared planning and shared instructional responsibility; paired content-and-language objectives created jointly are its hallmark. Receiving finished plans to decorate keeps the ENL teacher an aide, permanently stationing ELLs at a back table recreates segregated pull-out inside the room, weekly control swaps abandon collaboration rather than building it, and a worksheet folder is cooperation at the shallowest possible level."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "In fall 2026 a new principal asks an ENL teacher to \"give the NYSITELL again in May so we can show growth.\" Which explanation of the state instruments is correct?",
        "a": [
          "The NYSITELL may be readministered each spring, provided the district reports the results to the state by June 30 along with its other ELL data.",
          "Measuring annual growth is optional; a district with its own benchmark system of equivalent rigor may use it in place of the state's annual test.",
          "The NYSITELL is a one-time identification test; annual progress and exit are measured by the state's annual test, WIDA ACCESS for ELLs beginning spring 2027.",
          "The NYSITELL and the annual proficiency test are interchangeable forms of one state assessment, so either may be given in the spring window to document growth."
        ],
        "c": 2,
        "r": "The NYSITELL is given once, at initial enrollment or reentry, to identify ELLs and set the initial level. Annual progress and exit eligibility come from the state's annual English language proficiency test: the NYSESLAT through spring 2026 and WIDA ACCESS for ELLs beginning spring 2027. The \"interchangeable forms\" option is the strongest distractor because both tests measure English proficiency, but they serve different legal functions and the identification test cannot be repeated for growth. No local benchmark can replace the required state assessment."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 5th-grade teacher receives her class's English language proficiency levels in September: two students at Entering, one at Expanding. She asks the ENL teacher how the levels should change what she does in the content classroom. Which answer best reflects proficiency-aligned scaffolding?",
        "a": [
          "Entering students need heavy visual, home-language, and sentence-level supports with reduced output demands; the Expanding student needs discourse-level scaffolds (paragraph frames, academic connectors) with near-grade-level output expectations.",
          "The Expanding-level student no longer requires any scaffolding, so the teacher's support planning for this class should center almost exclusively on the two newcomers who are still at the Entering level of proficiency.",
          "Levels describe test performance rather than instruction, so classroom practice and scaffolding should not vary by a student's proficiency label.",
          "All three should receive identical supports so that no student is stigmatized by visibly different materials."
        ],
        "c": 0,
        "r": "Proficiency levels exist to calibrate scaffolding: newcomers need meaning-level access (visuals, L1 supports, frames at the word and sentence level), while an Expanding student is refining extended academic discourse and needs supports pitched there. Identical treatment misserves both ends, ignoring the levels wastes the data, and Expanding students still require targeted support until they meet a state exit criterion (Commanding, or Expanding plus a proficient ELA score)."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A family enrolls a 1st grader in a Rochester school in October. The Home Language Questionnaire shows that Nepali is the main language spoken at home. Which sequence follows NYS Part 154?",
        "a": [
          "Give the NYSITELL on the first day so the student can be placed right away, then interview the family later in the year if the score seems unclear.",
          "Have qualified staff interview the student in English and Nepali, give the NYSITELL if indicated, and finish identification within 10 school days.",
          "Place the student in ENL based on the questionnaire alone, then give the NYSITELL in the spring together with the annual proficiency test.",
          "Ask the classroom teacher to observe the student for 30 school days and request formal language testing only if the child appears to struggle."
        ],
        "c": 1,
        "r": "Part 154 requires the HLQ, then an individual interview in English and the home language that decides whether the NYSITELL is given, with identification completed within 10 school days of enrollment. Testing first is the strongest distractor because the NYSITELL is part of the process, but the interview comes first and gates it. Placing a student from the HLQ alone skips identification, and an observation period exceeds the 10-day timeline."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A district identifies a Spanish-speaking 4th grader as an ELL at the Emerging level. The school runs a Transitional Bilingual Education class for that grade. Which action BEST follows Part 154 placement procedures?",
        "a": [
          "Place the student in ENL, since ENL is the default program for all identified ELLs and a bilingual seat is offered only when parents request one in writing.",
          "Place the student in the bilingual class without contacting the family, since bilingual education is the default and parents play no formal role in placement.",
          "Hold a parent orientation in Spanish, place the child in bilingual education unless the parents choose ENL within 10 school days, and document the choice.",
          "Ask the parents whether the child should receive any language services at all, since families may waive Part 154 services if they prefer an English-only setting."
        ],
        "c": 2,
        "r": "Part 154 makes bilingual education the default where it is offered, but parents first attend an orientation in their preferred language and have 10 school days to choose ENL instead; the district documents the decision. Placing the child without contact is the strongest distractor because bilingual education is the default, but parents must be informed and may choose ENL. ENL is not the default where a bilingual program exists, and services cannot be waived."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 7th-grade ELL scored at the Expanding level on her most recent annual English language proficiency assessment and earned a Level 3 on the grades 3-8 ELA test in the same school year. Her ENL teacher believes she needs another year of services. Under Part 154, what is her status?",
        "a": [
          "She meets an exit criterion, so she exits ELL status and receives at least two years of Former ELL services and testing accommodations.",
          "She remains an ELL until she scores Commanding, since Commanding on the annual assessment is the only way to exit ELL status in New York.",
          "Her status depends on the ENL teacher's recommendation, since teachers may keep a student in ELL services when they judge her not yet ready.",
          "She exits ELL status and receives no further language support, since exited students are treated the same as peers who were never ELLs."
        ],
        "c": 0,
        "r": "Part 154 has two exit pathways: Commanding, or Expanding plus a proficient score (Level 3 or higher) on the grades 3-8 ELA test or 65 or higher on the ELA Regents in the same year. She meets the second, so she exits and receives at least two years of Former ELL services and testing accommodations. \"Commanding only\" is the strongest distractor because many sources teach a single exit route, but NYSED states the two pathways are the sole criteria. Teacher judgment is not an exit or retention route, and Former ELL services are required."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 5th-grade ELL at the Entering level has just been found eligible for special education with a learning disability. At the IEP meeting, an administrator proposes replacing her Stand-alone ENL period with resource room because \"the schedule cannot fit both.\" What should the CSE do?",
        "a": [
          "Approve the change, since special education services take priority over ENL once a student has an IEP, and the CSE has authority over all of her services.",
          "Approve the change for this year only, then restore Stand-alone ENL once she meets her resource room goals at the next annual review.",
          "End her ELL status, since her low proficiency scores are now explained by her disability rather than by second-language acquisition.",
          "Reject the change: she keeps her ENL entitlement, and the CSE, which must include a bilingual- or ESOL-certified member, decides how both are delivered."
        ],
        "c": 3,
        "r": "NYSED's January 2024 memo states that an ELL with a disability keeps Part 154 services, that scheduling or staffing can never justify substituting resource room for ENL, and that the CSE for an ELL must include a bilingual- or ESOL-certified member who helps decide delivery. Approving the swap is the strongest distractor because the CSE does decide how services are delivered, but it cannot remove ENL. A temporary swap is still a substitution, and a CSE cannot exit a student because it attributes scores to a disability."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 4th-grade teacher is concerned about an ELL's slow progress in reading. The student's parents speak Arabic and have limited English. Before meeting with the family, which step BEST supports a productive collaboration?",
        "a": [
          "Ask the student's older brother, a 9th grader at the high school, to interpret during the meeting, since a family member will put the parents at ease.",
          "Plan with the ENL teacher, gather work samples and data, book a trained Arabic interpreter, and prepare to ask about the child's reading in Arabic.",
          "Send home a detailed English-language letter listing every reading concern so the parents have time to find someone to translate it before the meeting.",
          "Postpone the meeting until the spring proficiency results arrive, since the family will not be able to act on classroom data or work samples before then."
        ],
        "c": 1,
        "r": "Effective collaboration combines the ENL teacher's expertise, shared data, a trained interpreter, and an invitation for parents to share what they know about the child's home-language reading, which also helps separate language difference from a possible disability. Using the brother is the strongest distractor because families often suggest it, but asking a child to interpret sensitive academic concerns risks inaccurate communication and places an inappropriate burden on him. An English-only letter shifts the language burden to the family, and waiting months withholds information parents are entitled to."
      }
    ]
  },
  "Disability Characteristics & Individualized Instruction": {
    "icon": "♿",
    "concepts": [
      {
        "title": "IDEA Disability Categories & Teaching Implications",
        "body": "IDEA (2004) lists 13 disability categories (34 CFR 300.8), and New York's Part 200 regulations (8 NYCRR 200.1(zz)) list 13 school-age classifications that use some state-specific terms: \"learning disability\" (federal: specific learning disability) and \"emotional disability\" (federal: emotional disturbance). New York does not use developmental delay for school-age students. Each classification carries typical instructional implications. Learning disability, the most prevalent, often involves deficits in phonological processing or working memory, calling for structured literacy and chunked multi-step directions. Autism may call for visual schedules, predictable routines, and social-narrative supports. Emotional disability calls for embedded PBIS-aligned behavioral supports and consistent, predictable environments. Intellectual disability calls for concrete, functional-context tasks with systematic instruction and distributed practice. Other health-impairment, which includes ADHD, frequently calls for preferential seating, movement breaks, and extended time. Teachers must distinguish the category's typical learning profile from the individual student's profile documented in the IEP: the IEP, not the label, drives daily instructional decisions. Section 504 of the Rehabilitation Act protects all students with disabilities from discrimination. A 504 plan serves students whose impairments substantially limit a major life activity but who do not need special education under IDEA; it most often lists accommodations and is developed by a school 504 team rather than through a CSE meeting."
      },
      {
        "title": "Individualized Education Program (IEP): Structure & Instructional Integration",
        "body": "Under IDEA, the Committee on Special Education (CSE) in New York develops the IEP for eligible students. The document must include present levels of academic achievement and functional performance (PLAAFP), annual measurable goals, special education services and supports, the extent of participation in general education, testing accommodations, and, in New York, transition planning beginning with the IEP in effect when the student turns 15. At least one general education teacher of the student is a required CSE member when the student is, or may be, in general education. Daily integration means embedding IEP goals into core instruction: a student whose IEP goal targets reading fluency practices timed oral reading during the regular ELA block, not only in pullout. Related-service recommendations (speech-language, OT, counseling) should coordinate with classroom routines, so an SLP's articulation targets can be reinforced during morning meeting. The IEP must state when periodic reports on progress toward annual goals will be provided to families (for example, quarterly or concurrent with report cards), and those reports must be provided as written. A material failure to implement the services or accommodations in an IEP can deny the student a free appropriate public education (FAPE), and parents may respond with a state complaint or a due process complaint."
      },
      {
        "title": "Curriculum Modifications vs. Accommodations",
        "body": "This distinction is frequently tested on the EAS. An accommodation changes how a student accesses or demonstrates learning without altering the grade-level standard: examples include extended time, large-print materials, text-to-speech, preferential seating, and frequent breaks. A modification changes what the student is expected to learn or be held accountable for: examples include reduced content that omits learning objectives, an alternate grading scale, or below-grade-level material substituted for grade-level content. Modifications are documented in IEPs (for students receiving special education) and may have implications for diploma type in New York. Accommodations may appear in both IEPs and 504 plans and do not by themselves alter diploma requirements. Universal Design for Learning (UDL) front-loads flexibility through multiple means of representation, action and expression, and engagement, reducing the need for after-the-fact changes. Teachers should audit lesson materials proactively: captioned video, adjustable-font digital text, and manipulatives benefit all learners while fulfilling IEP obligations for students who require them. Note that 504 plans authorize accommodations; reducing what a student must master is a modification and is outside the scope of a typical 504 plan."
      },
      {
        "title": "Assistive Technology & Adaptive Equipment",
        "body": "IDEA requires the IEP team to consider whether a student needs assistive technology (AT) devices and services. AT is defined broadly as any item, equipment, or system that maintains or improves the functional capabilities of a student with a disability. Low-tech AT includes graphic organizers, pencil grips, highlighter tape, and slant boards. Mid-tech includes digital timers and audio recorders. High-tech includes AAC (augmentative and alternative communication) devices, screen readers, speech-to-text software, and eye-gaze systems. If the IEP specifies an AT device, the district must provide it at no cost to the family. Teachers are responsible for embedding the AT into daily routines, so a student with a speech-generating device uses it during whole-class discussion, not only in a therapy room. Adaptive physical equipment (walkers, specialized seating, assistive listening systems) must also be integrated into general education settings consistent with least restrictive environment (LRE) requirements. AT trials should be documented and outcome data used to inform the CSE's review of the device's continued appropriateness."
      },
      {
        "title": "Response to Intervention (RtI) & Multi-Tiered Support Systems",
        "body": "New York uses RtI within a Multi-Tiered System of Supports (MTSS) as a prevention framework. Since July 1, 2012, every district must have an RtI process for kindergarten through grade 4 reading, because a CSE may no longer use the severe-discrepancy criterion to identify a learning disability in reading in those grades (8 NYCRR 200.4(j)). Tier 1 is high-quality, evidence-based core instruction for all students. Tier 2 adds targeted, small-group supplemental intervention for the roughly 15% of students showing insufficient Tier 1 response. Tier 3 provides intensive, individualized intervention for the approximately 5% who need it most, and data at this tier can inform a referral to the CSE. A student may not be found eligible for special education if the determinant factor is lack of appropriate instruction in reading or math or limited English proficiency, so RtI data must document that quality instruction was delivered before concluding that a learning disability exists. Universal screening identifies students at risk, and progress monitoring with curriculum-based measures drives decisions about movement between tiers. New York (8 NYCRR 100.2(ii)) also requires written notice to parents when a student needs intervention beyond core instruction, describing the data to be collected, the strategies to be used, and the parents' right to request a special education evaluation. Importantly, RtI is not a waiting game: a referral for evaluation may be made at any time, and unnecessarily delaying an evaluation to run more tiers can violate IDEA's child-find obligation."
      },
      {
        "title": "Least Restrictive Environment (LRE) & Continuum of Services",
        "body": "IDEA's LRE mandate requires that students with disabilities be educated with nondisabled peers to the maximum extent appropriate. New York's continuum of services, ordered from least to most restrictive, includes: general education with related services and supplementary aids; consultant teacher services (direct and/or indirect support in the general education class); resource room (supplemental small-group instruction for part of the day); integrated co-teaching (ICT, a general education class co-taught by a general and special education teacher); special class (a self-contained setting such as 15:1 or 12:1+1); separate (specialized) school; and home or hospital instruction. The CSE team, not an individual teacher, determines placement, which must be the least restrictive setting where the student's goals can be met with appropriate supports. Removal from general education must be justified in the IEP by documenting why supplementary aids and services are not adequate there. Placement is reviewed at least annually and is distinct from the eligibility determination. New York's Dignity for All Students Act (DASA) adds an obligation to maintain an environment free from harassment and discrimination. LRE applies across academic, nonacademic, and extracurricular activities."
      },
      {
        "title": "Sensory, Physical, Communication & Low-Incidence Disabilities",
        "body": "Beyond learning disability, other health-impairment, emotional disability, and autism, New York's 13 school-age classifications (8 NYCRR 200.1(zz)) include speech or language impairment (a high-incidence classification), intellectual disability, multiple disabilities, and the lower-incidence sensory and physical classifications: deafness, hearing impairment, deaf-blindness, visual impairment including blindness, orthopedic impairment, and traumatic brain injury. Each carries predictable implications, but the IEP, not the label, sets the supports. Students who are deaf or hard of hearing need a clear view of the speaker's face, captioned media, visual cues and written directions, reduced background noise, and consistent use of any IEP-specified hearing assistance technology (such as an FM or DM system) or sign language interpreter; the teacher speaks directly to the student, not to the interpreter. Students with visual impairments need materials in accessible formats (large print, braille, tactile graphics, screen readers) at the same time as peers, spoken descriptions of visual content, and a consistent room layout; a teacher of the visually impaired and an orientation and mobility specialist typically consult. Students with orthopedic impairments need physical access to every space and activity and may need adapted tools or alternative response modes. In New York, traumatic brain injury includes injuries from an external force and from certain medical conditions such as stroke or anoxia, but not congenital injuries or birth trauma; it often produces fluctuating attention, memory, processing speed, and fatigue, so teachers chunk tasks, give written checklists, schedule breaks, and report changes so the plan keeps pace with recovery. Speech or language impairment can affect articulation, fluency, voice, or receptive and expressive language; teachers allow wait time, avoid finishing the student's sentences, and reinforce speech-language targets in class. Other special learning needs include students served under Section 504 and twice-exceptional students, who are gifted and also have a disability and need both enrichment and disability-related supports."
      },
      {
        "title": "Testing Accommodations & Alternate Assessment in New York",
        "body": "Testing accommodations are changes in testing materials or procedures that let a student show what he or she knows without changing what the test measures. In New York, the CSE records testing accommodations in the IEP (a 504 team records them in the 504 plan), and they apply to state assessments and, consistent with the plan, to classroom and districtwide tests. Accommodations generally fall into four groups: flexibility in scheduling or timing (extended time, breaks), setting (separate location, small group), method of presentation (tests read, large print, braille, directions clarified), and method of response (use of a scribe, word processor, or recording answers in the test booklet). Accommodations used on tests should match those the student uses during daily instruction, and a teacher may not add, drop, or alter them on his or her own. Classroom grades should reflect mastery of the standard, not penalize the use of an accommodation. A small group of students participates in the New York State Alternate Assessment (NYSAA) instead of the general assessments. The CSE decides eligibility using NYSED criteria: a severe disability (ESSA's term is the most significant cognitive disability) shown by significantly limited cognitive ability, significant deficits in communication or language and in adaptive behavior, and the need for a highly specialized program. Low achievement, a particular classification, or a need for accommodations is not a reason to assign the NYSAA, and statewide participation is limited to about 1 percent of tested students. Parents must understand that a student who takes the NYSAA will exit with the Skills and Achievement Commencement Credential rather than a Regents or local diploma."
      }
    ],
    "practice": [
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A fifth-grade student with an IEP goal targeting reading fluency receives resource room support for 45 minutes per day. The general education teacher notices the student struggles with oral reading during whole-class lessons but has not implemented any IEP-related strategies in the classroom. Which action most directly fulfills the general education teacher's IDEA obligations?",
        "a": [
          "Wait for the resource room teacher to address fluency needs during the daily 45-minute session, since that teacher holds primary responsibility for progress on IEP goals.",
          "Refer the student back to the CSE for a more restrictive placement because the current services are insufficient.",
          "Contact the student's parents to request that they hire a private reading tutor to supplement school services.",
          "Embed the student's IEP fluency goal into whole-class ELA activities by providing timed oral reading practice with the specified scaffolds."
        ],
        "c": 3,
        "r": "IDEA requires a general education teacher to implement the IEP supports for which she is responsible, and IEP goals should be practiced across the school day, not only in pullout. Embedding timed oral reading with the specified scaffolds does both. The strongest distractor, A, reflects the misconception that IEP goals belong only to the special educator; the resource room teacher shares responsibility for progress but does not hold it alone. B is premature because in-class supports have not yet been tried, and C shifts the district's obligation onto the family."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A seventh-grade student with ADHD has a 504 plan that includes extended time on tests and preferential seating. The student's social studies teacher reduces the number of essay questions on the unit exam from four to two, arguing this will help the student manage time. Which statement best describes the teacher's action?",
        "a": [
          "The teacher used a universal design strategy that benefits all students by reducing testing fatigue, and such whole-class adjustments require no plan authorization.",
          "The teacher provided an appropriate IEP modification that aligns with the student's disability category.",
          "The teacher applied a modification that changes what is assessed, which is not authorized by the student's 504 plan.",
          "The teacher correctly implemented a 504 plan accommodation by reducing the task demand."
        ],
        "c": 2,
        "r": "Cutting the number of essay questions removes assessed content, which changes what the student is held accountable for: a modification. This student's 504 plan lists only extended time and preferential seating, and a teacher may not add or substitute changes the plan does not authorize. The strongest distractor, D, is tempting because reducing workload feels like a timing support, but extended time changes conditions while dropping questions changes content. B is wrong because the student has a 504 plan, not an IEP, and A mislabels an individual change as universal design."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A third-grade teacher is designing a science lesson on ecosystems for a class that includes a student with Autism Spectrum Disorder who uses an AAC device. The student's IEP specifies that the AAC device must be available during all instructional activities. Which instructional approach best reflects both IDEA's AT obligation and UDL principles?",
        "a": [
          "Delay AAC use until the student demonstrates readiness through traditional verbal responses.",
          "Assign a paraprofessional to operate the AAC device on the student's behalf during whole-class instruction, so lesson pacing is preserved while the student still participates.",
          "Allow the student to use the AAC device only during small-group work to minimize disruption during whole-class lessons.",
          "Incorporate the AAC device into whole-class participation routines, such as answering questions during discussion, while providing visual supports for all students."
        ],
        "c": 3,
        "r": "An AT device specified in the IEP must be available across instructional activities, so the student should use her AAC device during whole-class participation, and pairing it with visual supports for everyone applies UDL's multiple means of action and expression. The strongest distractor, B, sounds supportive because paraprofessional help can be an IEP service, but having an adult operate the device replaces the student's own communication, which defeats its purpose. A (waiting for verbal readiness) and C (restricting the device to small groups) both withhold the access her IEP guarantees."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A school-based team has provided Tier 2 RtI reading intervention to a second-grade student for 14 weeks. Progress-monitoring data show minimal growth despite consistent implementation of the evidence-based intervention. The classroom teacher argues the team should continue Tier 2 for another semester before referring to the CSE to allow more time for growth. Which response best reflects IDEA's child-find requirements?",
        "a": [
          "The team should intensify support to Tier 3 and collect at least one more full cycle of progress-monitoring data first, since a referral is premature until every intervention tier has been tried.",
          "A parent or team member may request a CSE evaluation at any time; documented insufficient response to quality instruction is a sufficient basis, and delay may violate child find.",
          "The team should consult the ENL coordinator first to rule out limited English proficiency before initiating any CSE referral.",
          "The teacher is correct: IDEA requires a minimum of one full school year of Tier 2 data before a CSE referral is permissible."
        ],
        "c": 1,
        "r": "Child find requires that a student suspected of having a disability be referred and evaluated without undue delay; a parent may refer at any time and school staff may request a referral, and 14 weeks of documented non-response to a well-implemented Tier 2 intervention is reasonable grounds for suspicion. IDEA sets no minimum number of tiers or weeks, so A and D are wrong. The strongest distractor, C, borrows a real rule (limited English proficiency cannot be the determinant factor for eligibility), but nothing in the scenario suggests the student is an English language learner, so the step only manufactures delay."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A 3rd-grade student with autism has an IEP goal for flexible transitions between activities. His teacher notices meltdowns cluster at unstructured moments: lining up, switching subjects, indoor recess. Which proactive strategy best fits his profile?",
        "a": [
          "Remove the student from the room at the first sign of agitation each time so the class is not disrupted.",
          "Wait to intervene until a meltdown occurs, then deliver a calm-down consequence so the student learns the expectation.",
          "Keep the daily classroom routine deliberately varied and unpredictable, on the theory that repeated exposure to unexpected changes will gradually build the student's tolerance for transitions over the course of the year.",
          "Post and preview a visual schedule, give timed warnings before transitions, and teach a brief transition routine, adjusting the environment before difficulties occur."
        ],
        "c": 3,
        "r": "Predictability supports (visual schedules, transition warnings, and taught routines) are antecedent strategies that prevent dysregulation for many students with autism and align with the flexible-transition goal. Deliberately increasing unpredictability escalates the very trigger identified, routine removal is reactive and excludes the student from instruction, and waiting for the meltdown abandons the proactive design the data call for."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A high school student with an emotional disability has a Behavior Intervention Plan built on a Functional Behavioral Assessment that identified escape from difficult writing tasks as the function of his outbursts. Which intervention is best matched to that function?",
        "a": [
          "Send him to the office whenever an outburst occurs, so the class can continue without interruption.",
          "Increase the length of writing assignments gradually so he becomes desensitized to the demand.",
          "Teach and reinforce a break-request skill and embed scaffolds that make writing tasks accessible, so the appropriate behavior meets the same need the outburst served.",
          "Award the student earned free time at the end of any full day in which no outburst has occurred, regardless of what happens during the writing block itself, so that appropriate behavior is consistently reinforced."
        ],
        "c": 2,
        "r": "Function-based intervention teaches a replacement behavior that obtains the same outcome (escape) more appropriately while reducing the task's aversiveness; a taught break request plus writing scaffolds directly addresses an escape function. Office referral delivers the escape the outburst was seeking and reinforces it, an end-of-day reward is too distal and untied to the writing context, and simply lengthening tasks intensifies the aversive demand."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A 4th-grade student is classified with an Other Health Impairment for ADHD. During a lesson, a paraprofessional completes the student's graphic organizer for him 'to keep him moving.' The special education teacher should explain that:",
        "a": [
          "The student should be moved out of the general education setting and into a resource room, where a certified special education teacher, rather than a paraprofessional, can complete the graphic-organizer tasks alongside him.",
          "The para should instead prompt and scaffold the student to complete the organizer himself (cueing, chunking, checking in) so support builds independence rather than replacing the student's thinking.",
          "The support is appropriate because it keeps the student on pace with peers and reduces his frustration.",
          "Graphic organizers should be removed from his plan, since needing help to fill one out shows the tool is too advanced."
        ],
        "c": 1,
        "r": "Effective paraprofessional support fosters independence through prompting, cueing, and fading, not task completion that substitutes for the student's cognition; doing the work for him fosters prompt dependence and masks his actual skill. Relocation is unwarranted for a support-delivery problem, and the organizer is an appropriate scaffold; the issue is how the adult is using it, not the tool itself."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A student with a specific learning disability in reading has an IEP accommodation for text-to-speech. A social studies teacher argues that letting him listen to the textbook 'isn't really reading' and gives him lower participation credit on reading days. What is the accurate response?",
        "a": [
          "The teacher is right that listening is not reading, but the accommodation must still be provided even if it lowers the learning value.",
          "The student should read print on reading days and use text-to-speech only for homework, to keep classroom assessment consistent.",
          "The social studies teacher may grade the student lower on reading days, as long as he documents in his own records that the text-to-speech accommodation was available in case the student had chosen to read the material in print.",
          "Text-to-speech is an accommodation that changes how the student accesses text, not the social studies content being assessed; withholding credit for using it penalizes the student for his disability and fails to implement the IEP."
        ],
        "c": 3,
        "r": "For a student whose disability affects decoding, text-to-speech removes the access barrier so the social studies construct, not decoding, is what's measured; grading down its use penalizes the disability and constitutes failure to implement the IEP, which can deny FAPE. Restricting the accommodation to homework and 'available if he'd chosen print' both narrow what the IEP guarantees, which a teacher may not unilaterally do."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A CSE is writing present levels for a 7th-grader with an intellectual disability. To make annual goals measurable, which formulation is strongest?",
        "a": [
          "The student will read a greater number of books at home with the support of his family over the year and will come to enjoy reading as a satisfying and meaningful lifelong activity beyond the school setting.",
          "The student will try hard in reading and show a positive attitude toward comprehension tasks.",
          "Given a 2nd-grade-level passage, the student will answer literal comprehension questions with 80% accuracy across three consecutive sessions by the annual review.",
          "The student will improve his reading comprehension to the best of his ability throughout the year."
        ],
        "c": 2,
        "r": "A measurable IEP goal specifies the condition, the observable behavior, and the criterion for mastery; the passage-level, accuracy, and consistency benchmark meets all three and can be progress-monitored. 'Best of his ability,' 'try hard,' and 'enjoy reading' name effort or dispositions that cannot be objectively measured or charted, so they cannot anchor an enforceable annual goal."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A 6th-grade student who is deaf uses a sign language interpreter listed in her IEP. During discussion, the science teacher turns to the interpreter and says, \"Ask her what she thinks.\" He also shows an uncaptioned video because the interpreter \"can sign it.\" Which change BEST supports the student's access?",
        "a": [
          "Speak directly to the student, show captioned media, and give the interpreter lesson materials in advance so the student can follow both the content and the discussion.",
          "Move the student to the back of the room beside the interpreter so she can watch the interpreter and the rest of the class at once without turning around during discussion.",
          "Keep routing questions through the interpreter, since the interpreter is responsible for managing all of the student's communication, and skip videos she cannot hear.",
          "Ask the interpreter to summarize each video after it ends, so the student gets the main points without having to split her attention between captions and the screen."
        ],
        "c": 0,
        "r": "Teachers address a deaf student directly; the interpreter conveys the message but is not the student's spokesperson. Captions give direct access to video content, and previewing materials lets the interpreter prepare technical vocabulary. The strongest distractor, D, sounds efficient, but an after-the-fact summary gives the student less than her hearing peers receive. B places her far from the teacher and visual content, and C misreads the interpreter's role and removes content from her program."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A 9th-grader returns to school after a traumatic brain injury from a car accident. Teachers report that he does well early in the day but tires quickly, forgets multistep directions, and processes information slowly by afternoon. Which approach BEST fits his profile?",
        "a": [
          "Keep his pacing and workload the same as his peers so he rebuilds stamina, on the view that fatigue after a brain injury resolves faster when daily academic demands are not reduced.",
          "Chunk tasks, give written checklists for multistep directions, schedule rest breaks, and share observations with the CSE so supports can be adjusted as his recovery changes his needs.",
          "Request an intellectual disability evaluation, since slowed processing and memory problems after an injury show a lowered overall cognitive ability that is likely to remain stable from now on.",
          "Set one fixed package of supports for the whole school year, since revising the plan before the annual review would disrupt the predictable consistency that a recovering student needs."
        ],
        "c": 1,
        "r": "Traumatic brain injury often produces fatigue, memory, and processing changes that fluctuate as the student recovers, so chunking, external memory aids, and breaks address the profile, and frequent communication with the CSE keeps the plan current; an IEP can be reviewed before the annual review when needs change. The strongest distractor, D, values consistency but ignores how needs shift during recovery. A withholds needed supports, and C confuses an acquired, changing injury with a stable intellectual disability."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A 5th-grader's IEP lists extended time (1.5x) and a separate location for tests. Her math teacher provides both on the state assessment but not on weekly classroom quizzes, explaining that testing accommodations \"are only for state exams.\" Which response BEST reflects New York practice?",
        "a": [
          "The teacher is correct, because IEP testing accommodations govern state assessments only, and the timing and setting of teacher-made quizzes are left to the teacher's judgment.",
          "The teacher may replace the extended time with a shorter quiz, since reducing the number of items gives the student the same practical benefit on weekly classroom assessments.",
          "The teacher should have the parent sign a waiver for classroom quizzes, because accommodations on teacher-made tests require separate written parent consent each school year.",
          "IEP testing accommodations should be provided on classroom tests as well as state tests, consistent with the plan, so the student uses familiar supports and shows what she knows."
        ],
        "c": 3,
        "r": "In New York, testing accommodations recorded in the IEP apply to classroom and districtwide tests as well as state assessments, consistent with the plan, and they should mirror the supports the student uses in daily instruction. The strongest distractor, B, looks like a fair trade, but cutting items is a modification that changes what is assessed and is not what the IEP authorizes. A misstates the scope of IEP accommodations, and no annual waiver or separate consent exists for classroom use (C)."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "At an annual review, a parent asks the CSE to move her 7th-grade son, who has a learning disability and reads three years below grade level, to the New York State Alternate Assessment (NYSAA) so his scores will improve. Which response is MOST accurate?",
        "a": [
          "He is unlikely to qualify: eligibility requires a severe cognitive disability with significant communication and adaptive deficits, and NYSAA students exit with a credential, not a diploma.",
          "He qualifies at the parent's request, because any student whose reading achievement is two or more years below grade level may take the alternate assessment in place of the general state test.",
          "The decision belongs to his English teacher, who knows his classroom performance best and may approve the alternate assessment without convening the CSE or changing the IEP.",
          "He qualifies because his IEP already lists testing accommodations, and needing accommodations on the general assessment is the main criterion NYSED uses for NYSAA eligibility."
        ],
        "c": 0,
        "r": "The CSE determines NYSAA eligibility using NYSED criteria: a severe disability shown by significantly limited cognitive ability, significant deficits in communication or language and adaptive behavior, and the need for a highly specialized program. Low achievement and a need for accommodations are expressly not sufficient, and a NYSAA student exits with the Skills and Achievement Commencement Credential, not a diploma. The strongest distractor, D, is tempting because accommodations relate to testing, but needing them is a reason to take the general assessment with supports. B and C misstate who decides and on what basis."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A 4th-grader scores in the gifted range on a cognitive assessment and offers advanced ideas in discussion, but his written work is brief and disorganized, and he has an IEP for a learning disability in written expression. Which approach BEST meets his needs?",
        "a": [
          "Phase out his IEP supports over the year, because his high ability shows he can compensate for the writing difficulty if he is expected to work without accommodations.",
          "Postpone enrichment until his writing reaches grade level, so that his instructional time is concentrated on the area of weakness before his strengths are extended.",
          "Provide enrichment matched to his strengths while implementing IEP supports such as speech-to-text and graphic organizers, so the disability does not mask his ability.",
          "Ask the CSE to declassify him and place him in the gifted program, because a student who is gifted cannot also meet the criteria for a disability classification."
        ],
        "c": 2,
        "r": "Twice-exceptional students need both: challenge matched to their strengths and the disability-related supports in the IEP. Speech-to-text and graphic organizers let his ideas reach the page so his writing reflects his thinking. The strongest distractor, B, sounds responsible, but withholding enrichment until a weakness is fixed leaves a gifted student under-challenged and disengaged. A and D wrongly treat giftedness and disability as mutually exclusive."
      }
    ]
  },
  "Disability Law, RtI/PBIS & the CSE Process": {
    "icon": "⚖️",
    "concepts": [
      {
        "title": "IDEA 2004: Core Protections & Eligibility",
        "body": "The Individuals with Disabilities Education Act (IDEA 2004) guarantees eligible students a free appropriate public education (FAPE) in the least restrictive environment (LRE), and in New York this entitlement runs through the school year in which the student turns 21. Eligibility requires two prongs: the student has one of the 13 disability classifications (e.g., learning disability, autism, emotional disability), AND the disability adversely affects educational performance such that the student needs special education. IDEA mandates procedural safeguards: prior written notice before any proposed change to identification, evaluation, or placement; parental consent for initial evaluation and for initial placement; and the right to an independent educational evaluation (IEE), at public expense if parents disagree with the district's evaluation. Evaluations must be nondiscriminatory, use multiple measures, and be administered in the child's native language or mode of communication. Reevaluations occur at least every three years (triennial) unless the parent and district agree one is unnecessary, and not more than once a year unless they agree otherwise. The IEP team, which includes a general education teacher when the student may participate in general education, determines how FAPE is delivered along the LRE continuum."
      },
      {
        "title": "Section 504 of the Rehabilitation Act",
        "body": "Section 504 is a civil rights statute prohibiting disability discrimination in programs receiving federal funds, including all public schools. Unlike IDEA, it uses a broad functional definition of disability: any physical or mental impairment that substantially limits one or more major life activities (e.g., learning, reading, concentrating, walking, or major bodily functions). Students who do not qualify under IDEA's 13 classifications, or who do not need specially designed instruction, may still qualify for a 504 Plan. A 504 Plan most often lists accommodations (e.g., extended time, preferential seating, read-aloud) and may also include related aids and services such as nursing support or counseling (34 CFR 104.33). Unlike an IEP, it does not require measurable annual goals, and a student who needs specially designed instruction should be referred to the CSE. Section 504 is unfunded by the federal government, but it does carry its own procedural protections: evaluation before placement, notice to parents, periodic reevaluation, an impartial due process hearing, and grievance procedures, distinct from IDEA's. General education teachers are typically the primary implementers of 504 Plans and carry a legal obligation to deliver documented accommodations. Key EAS distinction: 504 secures equal access through accommodations and related aids and services; IDEA provides specially designed instruction, with related services, through an IEP for students who need special education."
      },
      {
        "title": "Confidentiality: FERPA and IDEA",
        "body": "The Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records in schools receiving federal funds. Parents, and students once they turn 18 or enroll in a postsecondary institution (eligible students), may inspect and review records, request amendments, and generally must consent before personally identifiable information is disclosed to outside parties. Under IDEA, parallel confidentiality provisions specifically protect evaluation data, IEPs, and placement records. School staff may access disability information only when they have a legitimate educational interest, that is, when they are responsible for the student's education or provide services. Disclosing a student's IEP or disability classification at a faculty meeting to colleagues who do not serve the student, even with good intentions, lacks a legitimate educational interest and violates FERPA. IDEA also requires districts to inform parents when personally identifiable information is no longer needed so it can be destroyed. New York's Dignity for All Students Act (DASA) intersects by prohibiting harassment based on disability, but DASA does not loosen FERPA's disclosure limits. On the EAS, expect scenarios testing whether a disclosure to an uninvolved colleague or community member is permissible; it is not."
      },
      {
        "title": "Response to Intervention (RtI) and PBIS",
        "body": "Response to Intervention (RtI) is a multi-tiered framework, situated within Multi-Tiered Systems of Support (MTSS), that delivers high-quality, evidence-based instruction matched to need with frequent progress monitoring. Tiers move from universal core instruction (Tier 1) to targeted small-group intervention (Tier 2) to intensive individualized intervention (Tier 3). IDEA 2004 permits districts to use RtI data instead of an IQ-achievement discrepancy when identifying a specific learning disability (SLD); in New York, a CSE may not use the severe-discrepancy criterion to identify a learning disability in reading in kindergarten through grade 4, so every district must have an RtI process for K-4 reading (8 NYCRR 200.4(j)). Positive behavioral interventions and supports (PBIS) apply the same tiered logic to behavior: school-wide expectations at Tier 1, targeted group supports at Tier 2, and individualized function-based plans at Tier 3. IDEA requires that when a student's behavior impedes their learning or that of others, the IEP team consider the use of positive behavioral interventions and supports and other strategies to address it. Critically, an RtI process may not be used to delay or deny a special education evaluation; child find and a parent's right to request an evaluation operate independently of how many tiers have been tried."
      },
      {
        "title": "The CSE Process: Referral, Evaluation & IEP Development",
        "body": "Under New York's Education Law Article 89 and Part 200, the Committee on Special Education (CSE) is the multidisciplinary team that determines eligibility and develops the IEP. Required members include the parent(s); a general education teacher if the student is or may be in general education; a special education teacher or provider; a school psychologist; a district representative qualified to commit resources (the LEA representative); an individual who can interpret the evaluation results (a role another member may fill); and the student when appropriate. The process begins with a written referral. A parent (or a district designee or certain public agencies) may refer the student directly; a teacher or other professional staff member, a physician, or a judicial officer submits a written request for referral, and within 10 school days the district must either request the parent's consent to evaluate or give the parent a copy of the request and explain the parent's right to refer. The district must obtain parental consent, complete the individual evaluation within 60 calendar days of consent, and then arrange for the recommended special education programs and services within 60 school days of receipt of consent. The IEP must include present levels of academic achievement and functional performance (PLAAFP), measurable annual goals, special education services, accommodations and modifications, participation in state assessments, and, beginning with the IEP in effect when the student turns 15, measurable postsecondary goals and transition services. The CSE reviews the IEP at least annually, reevaluates at least triennially, and provides parents a copy."
      },
      {
        "title": "Teacher Responsibilities in Implementation & Referral",
        "body": "General education teachers act at every stage of the special education process. Within RtI and PBIS, the classroom teacher delivers Tier 1 instruction with fidelity, collects and graphs progress-monitoring data, and collaborates on Tier 2 and Tier 3 supports. When a referral is made, the teacher contributes observational and academic-performance data to the evaluation. Once an IEP is in place, the teacher must be informed of, have access to, and implement the specific accommodations, modifications, and supports for which they are responsible, and they should know the student's annual goals. A material failure to implement the IEP, even unintentionally, can constitute a denial of FAPE; a minor, isolated deviation generally does not. Teachers must also honor confidentiality, sharing IEP or disability information only with staff who have a legitimate educational interest. Teachers participate in the annual review by reporting progress toward goals, and a parent's request for an evaluation must be honored regardless of how interventions are progressing. In New York, building-level support or pupil-personnel teams provide additional school-based problem-solving before and alongside the formal CSE process, but they do not replace a parent's right to request a CSE referral."
      },
      {
        "title": "Discipline Protections, FBA/BIP & NYS Limits on Restraint",
        "body": "IDEA and New York's Part 201 regulations protect students with disabilities in discipline. A school may remove a student with a disability for up to 10 consecutive school days as it would any student. A removal of more than 10 consecutive school days, or a series of shorter removals totaling more than 10 school days in a year that forms a pattern, is a disciplinary change in placement. Within 10 school days of deciding on such a change, the district, the parent, and relevant members of the CSE hold a manifestation determination review: was the conduct caused by, or directly and substantially related to, the disability, or was it the direct result of the district's failure to implement the IEP? If so, the CSE conducts or reviews a functional behavioral assessment (FBA), implements or revises a behavior intervention plan (BIP), and generally returns the student to the prior placement. For weapons, illegal drugs, or serious bodily injury, a student may be placed in an interim alternative educational setting for up to 45 school days even when the conduct is a manifestation. After a student has been removed for 10 school days in a school year, the district must provide services during any further removal so the student can keep progressing in the general curriculum and toward IEP goals. Under 8 NYCRR 200.22, an FBA identifies the function of the behavior, and the BIP specifies the baseline, antecedent changes, replacement behaviors, reinforcement, and a schedule for monitoring progress. Since August 2, 2023, New York prohibits corporal punishment, aversive interventions, prone restraint, mechanical restraint, and seclusion in schools. Physical restraint is allowed only in an emergency, when less restrictive measures would not prevent imminent danger of serious physical harm, only by staff with annual training, never as a planned intervention, and never written into an IEP, BIP, or 504 plan; parents must be notified the same day. Timeout, a monitored separation in a non-locked setting, is allowed only under regulated conditions. The teacher's role is to collect ABC data for the FBA, implement the BIP consistently, and document incidents."
      }
    ],
    "practice": [
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A third-grade teacher notices a student struggling significantly with decoding and reading fluency. For the past month the teacher has provided only whole-class differentiated instruction, with no individualized data collected. The reading specialist suggests next steps. Which response reflects the most professionally and instructionally appropriate action by the teacher at this point?",
        "a": [
          "Begin a targeted, evidence-based Tier 2 reading intervention with systematic progress monitoring, while informing the family of their right to request an evaluation at any time.",
          "Take no action for the remainder of the year, since lack of appropriate instruction must first be ruled out before anything else can occur.",
          "Notify the parents that the child will be placed on a 504 Plan for reading accommodations without conducting any further evaluation.",
          "Request that the school psychologist administer a cognitive assessment to determine whether an IQ-achievement discrepancy exists before further intervention time is invested."
        ],
        "c": 0,
        "r": "After only one month of whole-class differentiation with no individualized data, the sound next step is to implement a tiered, evidence-based intervention with progress monitoring so the teacher gathers data on the student's response. New York requires every district to have an RtI process for K-4 reading, and a CSE may not use severe discrepancy to find a learning disability in reading in those grades (8 NYCRR 200.4(j)). Crucially, RtI cannot be used to delay or deny an evaluation, so the teacher must also recognize the family's right to request a CSE referral at any time. The strongest distractor, the immediate IQ test, is misguided because a discrepancy finding cannot establish a reading learning disability for this third grader in New York, and skipping intervention leaves lack of appropriate instruction unexamined. A 504 Plan cannot be assigned without evaluation, and doing nothing all year improperly treats RtI as a barrier to, rather than a precursor of, identification."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "Ms. Torres teaches seventh grade. One of her students has an IEP that includes extended time on tests and preferential seating. During a department meeting, a colleague who does not teach or serve the student asks Ms. Torres about the student's disability so the colleague can 'understand the kid better.' Ms. Torres should:",
        "a": [
          "Provide the full IEP to the colleague and ask the colleague to keep it confidential.",
          "Explain that the student receives certain accommodations but decline to share the disability or IEP details, since the colleague lacks a legitimate educational interest.",
          "Share the student's IEP and disability classification, because colleagues have a general professional interest in student welfare.",
          "Direct the colleague to the student's cumulative record in the main office, since records maintained by the school are generally available for review by certified staff in the building."
        ],
        "c": 1,
        "r": "FERPA and IDEA confidentiality provisions limit disclosure of disability and IEP information to staff with a legitimate educational interest, meaning those who are responsible for or provide services to the student. A colleague who does not serve the student has no need to know, so sharing the IEP or disability classification would violate federal confidentiality requirements. Asking the colleague to keep an improperly disclosed IEP confidential does not cure the violation, and pointing the colleague to records they may access for an unauthorized purpose is equally impermissible; the correct response shares only what is necessary (that accommodations exist) and withholds protected details."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A high school student was recently diagnosed with Type 1 diabetes. The condition requires scheduled blood-sugar monitoring and occasional rest, but her academic performance is strong and she does not need specially designed instruction. The building team is determining the most appropriate support structure. Which option best reflects the legally correct approach?",
        "a": [
          "Take no formal action, because the student's grades are satisfactory and no federal law applies when academic performance is not affected.",
          "Refer the student to the CSE to develop an IEP, because Type 1 diabetes is expressly recognized under IDEA's Other Health Impairment category and entitles her to special education.",
          "Place the student in a resource room for part of the day so special education staff can monitor her health needs.",
          "Develop a Section 504 plan providing accommodations such as monitoring breaks and access to snacks, because the condition substantially limits a major life activity."
        ],
        "c": 3,
        "r": "Section 504 applies when a physical or mental impairment substantially limits a major life activity, including major bodily functions such as endocrine function, even when academic performance is intact. A 504 Plan providing monitoring breaks and snack access is the appropriate vehicle. An IEP is not warranted here because the student does not need specially designed instruction (diabetes could fall under IDEA's Other Health Impairment only if it adversely affected performance enough to require special education). Taking no action ignores the school's standing civil rights obligation under Section 504, and placing the student in a resource room is unnecessarily restrictive and unrelated to her instructional needs."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "During an IEP meeting, the parents of a 10-year-old student with autism state that they disagree with the district's most recent psychological evaluation and want the district to fund an independent educational evaluation (IEE). Under IDEA, which statement most accurately describes the district's obligation?",
        "a": [
          "The district must immediately fund the IEE without question, because parents have an unconditional right to one at public expense whenever they ask.",
          "The district may deny the request outright because the evaluation was conducted by a licensed school psychologist following IDEA procedures.",
          "The district must either fund the IEE at public expense or, without unnecessary delay, file for a due process hearing to show its own evaluation was appropriate.",
          "The district should table the IEP meeting and schedule informal mediation, which IDEA requires the parties to attempt before any independent evaluation request can be considered."
        ],
        "c": 2,
        "r": "When parents disagree with the district's evaluation and request an IEE at public expense, IDEA gives the district only two lawful options: fund the IEE, or file for a due process hearing, without unnecessary delay, to defend the appropriateness of its own evaluation. It may not simply deny the request. The right is not unconditional, because the district may contest it through due process rather than automatically paying; a qualified evaluator and proper procedures do not strip parents of this safeguard; and mediation, while available, is voluntary and is not a prerequisite to an IEE request."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A student with a disability has been removed from school for disciplinary reasons on his 11th cumulative day this year through a series of short suspensions that form a pattern of removal. Under IDEA, what is triggered?",
        "a": [
          "The school must expel the student, since exceeding 10 days demonstrates the placement has failed.",
          "The parents must request a due process hearing before any further procedural protections apply.",
          "Nothing is triggered yet, because under IDEA a manifestation determination review is required only when a student is removed for a single disciplinary period that exceeds ten consecutive school days in a row.",
          "Because the series constitutes a pattern amounting to a change of placement beyond 10 cumulative days, the district must hold a manifestation determination review and continue providing FAPE."
        ],
        "c": 3,
        "r": "IDEA's discipline protections attach not only to a single removal over 10 consecutive days but also to a series of removals that form a pattern constituting a change of placement; at that point a manifestation determination is required and educational services must continue. The 'consecutive-only' reading misstates the rule, expulsion is not automatic, and the protections are the district's obligation, not contingent on a parent filing."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A general education teacher is frustrated that a parent 'keeps requesting evaluations' for a 2nd-grader who is receiving Tier 2 reading support. The teacher wants to tell the parent to wait until the RtI cycle finishes. Which statement about New York's rules is accurate?",
        "a": [
          "A parent may refer her child in writing at any time; the CSE chairperson must promptly notify the parent and request consent for an initial evaluation, and RtI may not be used to delay it.",
          "The parent must put the request in a notarized letter before the district's timeline begins.",
          "Once a documented Tier 2 intervention is underway, the collected RtI data automatically substitute for a formal special education evaluation, so no separate comprehensive evaluation of the student is actually necessary.",
          "The teacher is correct: in New York a full RtI cycle must be completed before any evaluation can be requested."
        ],
        "c": 0,
        "r": "Under 8 NYCRR 200.4(a), a parent's written referral goes to the CSE chairperson, who must immediately notify the parent and seek consent to evaluate; the building administrator may offer a meeting about general education supports, but the referral is withdrawn only if the parent agrees in writing. NYS RtI rules (100.2(ii)) inform parents of their right to request an evaluation and cannot be used to delay one. The strongest distractor, C, is wrong because RtI data inform but never replace a comprehensive individual evaluation. No notarized letter is required (B), and D misstates the rule."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "During an initial CSE evaluation, the team relies solely on a single cognitive test administered by the school psychologist to determine eligibility. A parent member objects. Under IDEA's evaluation requirements, the objection is:",
        "a": [
          "Well-founded, because IDEA requires a variety of assessment tools and multiple sources of information and prohibits using any single measure as the sole criterion for eligibility.",
          "The parent's objection is unfounded, because a single well-validated cognitive test, when it is administered and interpreted by a properly licensed school psychologist, is by itself sufficient to support an eligibility decision.",
          "Premature, because concerns about assessment methods can only be raised after the eligibility decision is issued.",
          "Valid only if the parent first obtains an independent educational evaluation to contradict the school's test."
        ],
        "c": 0,
        "r": "IDEA (34 CFR 300.304) requires that eligibility rest on a variety of assessment tools and strategies and multiple sources of information, and it bars any single measure from serving as the sole criterion. A one-test determination violates that standard regardless of the examiner's credentials, the objection is timely during the evaluation, and no prior IEE is a precondition to raising it."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A school-wide PBIS team reviews office-referral data and finds Tier 1 supports are working for about 80% of students, but a stable 15% need more targeted help and 5% need intensive support. What is the intended PBIS response to this distribution?",
        "a": [
          "Refer the 20% who need more support to the CSE, since needing intervention indicates a likely disability.",
          "Replace Tier 1 with the Tier 2 program, since one in five students needs more than universal support.",
          "Layer Tier 2 targeted group interventions for the 15% and Tier 3 individualized supports for the 5%, while maintaining Tier 1 for all students.",
          "Sharply increase office referrals and disciplinary consequences for the roughly twenty percent of students who need more support, since the current universal Tier 1 supports are clearly failing to deter their behavior."
        ],
        "c": 2,
        "r": "A multi-tiered system layers supports: universal Tier 1 for all, targeted Tier 2 for students who need more, and intensive Tier 3 for the few with the greatest need. The roughly 80/15/5 distribution is the model working as designed. Dismantling Tier 1 removes the foundation, wholesale CSE referral confuses need for intervention with disability, and escalating punishment contradicts PBIS's teach-and-reinforce logic."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A 14-year-old with a learning disability is due for an annual review, and the IEP being written will be in effect when he turns 15. A CSE member suggests leaving transition planning out until next year because \"federal law does not require it until 16.\" Which statement is correct?",
        "a": [
          "Transition planning is optional until the student earns enough credits to be classified as a junior, regardless of his age or the IEP year.",
          "Transition services are required only for students pursuing a Regents diploma, so whether this IEP needs them depends on his diploma track.",
          "New York requires measurable postsecondary goals and transition services beginning with the IEP in effect when the student turns 15, so they belong in this IEP.",
          "The member is correct, because states may not impose transition requirements earlier than the age-16 floor that IDEA sets for every student's IEP nationwide."
        ],
        "c": 2,
        "r": "8 NYCRR 200.4(d)(2)(ix) requires measurable postsecondary goals and transition services in the first IEP in effect when the student is 15, a year earlier than the federal age-16 requirement, so this IEP must include them. The strongest distractor, D, is wrong because IDEA sets a minimum and states may require transition planning earlier, as New York does. Credit standing (A) and diploma track (B) are not triggers; age is."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A team drafting a BIP for a 3rd-grader who throws objects proposes that staff use a brief prone hold whenever he throws something and that he spend cool-down time in a small room with the door held shut. Under current New York regulations, which response is correct?",
        "a": [
          "Neither element may be used: prone restraint and seclusion are banned, and restraint may never be a planned BIP intervention, so the team should use function-based strategies.",
          "The plan may be used if the parent signs written consent, because parental agreement allows any behavioral intervention the team selects to be written into a BIP.",
          "The prone hold is prohibited, but the closed-door room is allowed as long as an adult watches the student through a window for the entire cool-down period and logs it.",
          "Both elements are allowed if every staff member involved has completed annual crisis-intervention training and each use is reported in writing to the parent on the same day."
        ],
        "c": 0,
        "r": "Since August 2, 2023, 8 NYCRR 200.22 and Regents Rule 19.5 prohibit prone restraint and seclusion in New York schools, and physical restraint is an emergency-only response that may never be written into an IEP, BIP, or 504 plan. The strongest distractor, D, borrows real requirements (annual training, same-day parent notice) that apply only to emergency restraint, not to planned holds. Parent consent cannot authorize prohibited practices (B), and observing a student in a room he is prevented from leaving is still seclusion (C)."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A 7th-grader with an IEP has already been suspended for a total of 10 school days this year. He is now suspended for three more days for an unrelated minor incident, and the district determines the removals do not form a pattern. What must the district do during these additional days?",
        "a": [
          "Nothing additional, because services during a suspension are owed only after a manifestation determination finds that the conduct was caused by the disability.",
          "Hold a manifestation determination review before the suspension begins, because any removal beyond the 10th school day requires one regardless of whether a pattern exists.",
          "Return him to class at once, because a student with an IEP may not be suspended for more than 10 school days in a school year for any reason under IDEA.",
          "Provide services that allow him to keep participating in the general curriculum and progress toward his IEP goals, even though the removals are not a change in placement."
        ],
        "c": 3,
        "r": "Once a student with a disability has been removed for 10 school days in a school year, the district must provide services during any later removal (34 CFR 300.530(d); NYS Part 201), even when the removal is not a change in placement. The strongest distractor, B, is wrong because an MDR is required for a disciplinary change in placement, which the district found did not occur here. Services do not depend on a manifestation finding (A), and IDEA does not cap removals at 10 days outright (C)."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A 3rd-grade teacher suspects a student has a disability after documented weak response to Tier 2 and Tier 3 reading intervention. Under New York's Part 200 procedures, what is the teacher's role in starting the special education process?",
        "a": [
          "Sign the consent for evaluation on the parent's behalf once the RtI data show inadequate progress, so that the 60-day evaluation timeline can begin without further delay.",
          "Submit a written request for referral; within 10 school days the district must seek parent consent to evaluate or give the parent the request and explain the right to refer.",
          "Wait for the parent to make the referral, because in New York only a parent may begin the special education process for a student in an elementary school.",
          "Place the student in a resource room on a trial basis and ask the CSE to review the results at the next annual review of the school's RtI program."
        ],
        "c": 1,
        "r": "Under 8 NYCRR 200.4(a)(2), professional staff submit a written request for referral, and within 10 school days the district must either request parent consent to evaluate or provide the parent a copy of the request and inform the parent of the right to refer. The strongest distractor, C, reflects a real NYS nuance (parents make referrals directly), but staff are not shut out; they start the process through a request for referral. Only a parent can consent to evaluation (A), and placement before evaluation and a CSE recommendation is not permitted (D)."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A parent signs consent for an initial evaluation on October 1. The school psychologist tells the classroom teacher, \"We have 60 school days to finish the testing.\" Which statement correctly describes New York's timelines?",
        "a": [
          "The 60-school-day figure is correct for the evaluation, and the recommended services must then begin within an additional 30 school days after the CSE meeting.",
          "There are no fixed timelines for an initial evaluation, as long as the district acts in good faith and keeps the parent informed of its progress in writing.",
          "The evaluation must be completed within 60 calendar days of consent, and recommended programs and services must be arranged within 60 school days of consent.",
          "The evaluation must be completed within 30 calendar days of consent, and services must start within 30 school days after the CSE makes its recommendation."
        ],
        "c": 2,
        "r": "Under 8 NYCRR 200.4(b)(7) the initial evaluation must be completed within 60 days (calendar days) of receiving consent, and under 200.4(e)(1) the district must arrange recommended programs and services within 60 school days of receiving consent for a student not previously identified. The strongest distractor, A, repeats the psychologist's common error of counting the evaluation in school days and adds a second window that does not exist for public school placements. B and D misstate the rules."
      }
    ]
  },
  "Collaboration, Assistive Technology & Service Delivery": {
    "icon": "🧰",
    "concepts": [
      {
        "title": "Collaboration & Consultation Models",
        "body": "General education teachers are not expected to be special education experts, but IDEA (2004) requires that students with disabilities be educated in the least restrictive environment (LRE), which depends on structured collaboration between general and special educators. In a consultation model, the special educator acts as an indirect service provider, advising the classroom teacher on accommodations, modifications, and instructional strategies rather than delivering direct instruction to students. This differs from co-teaching, where both educators share instructional delivery. Effective consultation follows a problem-solving cycle: identifying the concern, gathering data, designing an intervention, monitoring progress, and evaluating outcomes. In New York, the Committee on Special Education (CSE) recommends the services and placement; the collaborating educators then implement those recommendations with fidelity and document the supports provided. Collaboration extends to related-service providers (speech-language pathologists, occupational therapists, school psychologists), teaching assistants and aides, and families. FERPA permits sharing personally identifiable information from education records only with school officials who have a legitimate educational interest, so consultative discussions about a student must stay within that circle and out of casual or public settings."
      },
      {
        "title": "Service-Delivery Models Under IDEA & NYS Regulations",
        "body": "New York's Part 200 regulations (8 NYCRR 200.6) define a continuum of services the CSE may recommend, generally ordered from least to most restrictive. Four core models recur on the EAS. (1) Consultant Teacher (200.6[d]): a special educator provides indirect services (advising the general educator) and/or direct services (working with identified students inside the general education class) for a minimum of two hours per week, with a caseload not exceeding 20 students. (2) Resource Room (200.6[f]): supplementary specialized instruction in groups of no more than five students per teacher, for at least three hours per week and no more than 50 percent of the school day; caseloads are capped at 20 (25 in grades 7 to 12). (3) Integrated Co-Teaching, or ICT (200.6[g]): a general educator and a special educator jointly plan and deliver instruction to a class of students with and without disabilities, with no more than 12 students with disabilities except under a limited variance. (4) Special Class (200.6[h]): instruction primarily with other students with disabilities, recommended only when the LRE analysis supports it. Ratios are matched to need: 15:1 when needs are primarily for specialized instruction; 12:1+1 when management needs interfere with instruction; 8:1+1 for intensive management needs; 6:1+1 for highly intensive management needs; and 12:1+(3:1) for students with severe multiple disabilities. The CSE may also recommend related services, home or hospital instruction, and twelve-month (summer) services for students who need them to prevent substantial regression (200.6[k]). Placement must be individualized, data-driven, and documented in the IEP, moving toward a more restrictive setting only as the student's needs require."
      },
      {
        "title": "Assistive Technology: Definition, Selection & Implementation",
        "body": "IDEA defines an assistive technology (AT) device as any item, piece of equipment, or product system used to increase, maintain, or improve the functional capabilities of a student with a disability; AT services are the supports that help a student select, acquire, and use such a device. AT spans a continuum from low-tech (pencil grips, slant boards, highlighted text) to mid-tech (amplification devices, talking calculators) to high-tech (dynamic-display AAC devices, text-to-speech software, screen readers). IDEA requires the IEP team to consider whether the student needs AT devices and services; if AT is identified it must be documented in the IEP and provided in the home or other settings when the team determines the student needs it there to receive FAPE. Evaluation typically involves an AT specialist, the special educator, the general educator, the student, and the family. The general educator's role includes learning the device or software, embedding its use into instruction, and reporting progress to the team. Examples include Dragon NaturallySpeaking and Kurzweil 3000; AAC ranges from picture-exchange systems to high-tech apps such as LAMP. Universal Design for Learning (UDL) complements AT by building accessibility into materials from the start, though it does not eliminate the need for individualized devices."
      },
      {
        "title": "Integrated Co-Teaching: Roles, Structures & Legal Requirements",
        "body": "Integrated Co-Teaching (ICT) is heavily tested on the EAS because it directly shapes how general educators collaborate in inclusive classrooms. Under 8 NYCRR 200.6(g), an ICT class must minimally include one certified general education teacher and one certified special education teacher, who share planning, instruction, and assessment. Co-teaching is commonly organized into six structures: one teach/one observe, one teach/one assist, station teaching, parallel teaching, alternative teaching, and team teaching. The EAS stresses that the special educator is a co-instructor with defined teaching responsibilities, not an aide; the IEP drives the accommodations and modifications the special educator delivers for eligible students. A hard enrollment limit applies: the number of students with disabilities in an ICT class shall not exceed 12, unless the district obtains a variance, and every student's IEP must still be honored regardless of the class blend. Teaching assistants or 1:1 aides may also be present, but they support instruction under the supervision of certified staff and do not substitute for the certified special education teacher required by the regulation."
      },
      {
        "title": "Supporting Instruction in Inclusive Settings: Paraprofessionals & Related Services",
        "body": "General educators frequently share inclusive classrooms with paraprofessionals (teaching assistants and 1:1 aides) and receive support from related-service providers. IDEA requires that related services, including speech-language therapy, occupational therapy, physical therapy, counseling, and orientation and mobility services, be provided when a student needs them to benefit from special education. In inclusive settings, providers increasingly use a push-in model, delivering services within the natural classroom context. The classroom teacher communicates student-performance data to providers and coordinates instructional language and vocabulary so supports reinforce one another. Paraprofessionals assist students under the supervision of certified teachers; they do not make independent instructional or eligibility decisions. Over-reliance on a 1:1 aide can unintentionally reduce peer interaction and foster prompt dependence, a documented concern, so teachers should build natural supports and peer-mediated strategies alongside adult support. The Dignity for All Students Act (DASA) applies in these settings: all school employees, including paraprofessionals, are responsible for maintaining an environment free of harassment, bullying, and discrimination, which protects students with disabilities as a DASA-enumerated category."
      },
      {
        "title": "CSE Process, IEP Implementation & Teacher Responsibilities",
        "body": "The Committee on Special Education (CSE) evaluates students suspected of having a disability, determines eligibility under one of the disability classifications recognized in New York, and develops the Individualized Education Program (IEP). A general education teacher of the student is a required CSE member whenever the student is, or may be, participating in the general education environment. That teacher reports present levels of academic achievement and functional performance, implements IEP goals, accommodations, and modifications, and documents progress toward annual goals. FERPA protects the education records generated through the CSE process; teachers may share personally identifiable information only with school officials who have a legitimate educational interest. Section 504 of the Rehabilitation Act covers students whose disability substantially limits a major life activity but who do not qualify under IDEA; a Section 504 plan is developed by a building-level team, not the CSE, and is not subject to the full IDEA procedural safeguards. Teachers must know whether a student is served under an IEP (IDEA) or a 504 plan, because implementation responsibilities differ. Teachers must implement the IEP as written: a material failure to implement can deny FAPE, and any lapse can prompt a parent complaint."
      }
    ],
    "practice": [
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A fourth-grade student with a learning disability in written expression struggles to organize and produce written work in Ms. Rivera's general education class. The student's IEP includes a goal for written expression and states that the IEP team must consider assistive technology. Which next step is MOST consistent with IDEA requirements and best collaborative practice?",
        "a": [
          "Ms. Rivera requests a formal AT evaluation through the CSE, documenting the student's present levels and involving the special educator and an AT specialist.",
          "Ms. Rivera refers the student to the school counselor for support with frustration related to writing tasks.",
          "Ms. Rivera shortens the student's writing assignments so that assistive technology is no longer needed.",
          "Ms. Rivera selects a well-reviewed text-to-speech app herself and begins using it with the student the following week, documenting any improvement in the student's written output."
        ],
        "c": 0,
        "r": "IDEA requires the IEP team, not the classroom teacher alone, to consider and document AT needs; requesting a formal AT evaluation involving the special educator and an AT specialist satisfies that requirement and ensures the IEP reflects any devices or services to be provided. Unilateral selection by the general educator bypasses the team and risks an unevaluated, undocumented accommodation that may not match the student's documented need. Referring only to the counselor treats a symptom (frustration) rather than the documented written-expression need, and simply shortening assignments lowers expectations and sidesteps the AT consideration the IEP mandates."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "Mr. Chen is the general education teacher in an Integrated Co-Teaching (ICT) class. During whole-group instruction his co-teacher, a certified special educator, spends most of the period circulating and passing out materials rather than delivering instruction or working directly with students. Which statement BEST describes the problem with this arrangement?",
        "a": [
          "Under 8 NYCRR 200.6(g), both certified teachers in an ICT class are expected to share instructional responsibility; using the special educator primarily as an aide misrepresents the model.",
          "The special educator should focus on the students who have IEPs, so circulating to check on them is appropriate as long as those students receive the support their plans specify.",
          "The arrangement is acceptable because the general educator is the lead teacher and the special educator's role is supplementary by definition.",
          "ICT regulations require the special educator to lead whole-group instruction at least 50 percent of the time, so the arrangement is noncompliant on that basis."
        ],
        "c": 0,
        "r": "NYS ICT regulations (8 NYCRR 200.6[g]) require an ICT class to include both a certified general and a certified special education teacher who share planning, delivery, and assessment; reducing the special educator to materials distribution turns a co-instructor into an aide and shortchanges the collaborative model. There is no rule requiring the special educator to lead whole-group instruction 50 percent of the time, so that distractor invents a false threshold. ICT is designed to serve the whole blended class through joint instruction, not to assign the special educator exclusively to students with IEPs, and the model does not make the special educator's role merely supplementary."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A high school student with an emotional disability receives resource room services under her IEP. Her resource room teacher tells the general education social studies teacher that, because progress-monitoring data show significant gains, the student will transition to a consultant teacher model. The social studies teacher is unsure what to expect. Which description BEST explains the consultant teacher model?",
        "a": [
          "The special educator will provide indirect support to the general education teacher and/or direct in-class support to the student, without changing the class structure.",
          "The student will no longer receive any special education services because she has met her IEP goals.",
          "The special educator will co-teach every social studies lesson alongside the general education teacher for the remainder of the year, sharing planning and grading responsibilities equally.",
          "The student will move to a self-contained special class for social studies in place of the general education class."
        ],
        "c": 0,
        "r": "Under 8 NYCRR 200.6(d), consultant teacher services consist of indirect services (consultative support to the general educator) and/or direct services to the student within the general education setting, for a minimum of two hours per week, preserving the least restrictive environment. The option describing co-teaching every lesson is ICT (200.6[g]), a separate, more intensive model with joint instruction and a 12-student cap on students with disabilities, not consultant teacher services. A self-contained special class is a more restrictive placement, and a transition driven by progress does not mean services end, since the student remains IDEA-eligible with a continuing IEP."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "During a CSE meeting for a second-grade student with autism, the team discusses placement. The student currently receives instruction in a special class for most of the day. New data show she communicates reliably with an AAC device and has met several social and academic goals. A parent advocate argues that the LRE analysis requires the team to consider a less restrictive setting. Which response from the committee chair is MOST legally appropriate under IDEA?",
        "a": [
          "The special class is appropriate because students with autism typically require intensive support regardless of the data.",
          "The advocate's request can be noted, but placement decisions are made solely by the district and the CSE chair.",
          "Because the student has not yet met every annual IEP goal, the team should defer any change of placement until the next annual review, when a full year of data will be available.",
          "The team must review current data, consider whether supplementary aids and services could support a less restrictive setting, and document its rationale in the IEP."
        ],
        "c": 3,
        "r": "IDEA's LRE mandate requires the CSE to educate students with disabilities with nondisabled peers to the maximum extent appropriate and to consider supplementary aids and services before a more restrictive placement; the team must weigh current data and document its reasoning. Disability category alone cannot justify placement, so the autism presumption violates the individualization requirement. There is no rule barring a placement change until all goals are met or until the annual review, and parents are required members of the CSE, so placement is a team decision, not a district-and-chair-only decision."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "In an Integrated Co-Teaching (ICT) 5th-grade class, the two certified teachers currently use one-teach-one-assist for every lesson, with the special educator always assisting. A coach suggests varying models. Which change best reflects effective co-teaching?",
        "a": [
          "Deliberately vary models (station teaching, parallel teaching, team teaching) matched to the lesson's purpose, with both teachers leading instruction at different times.",
          "Keep one-teach-one-assist permanently, since a single consistent model is least confusing for students.",
          "Have the special educator lead on days the general educator is absent and assist otherwise.",
          "Split the class each period so that the special educator teaches the students who have IEPs together in a back corner of the room while the general education teacher delivers the lesson to all of the remaining students."
        ],
        "c": 0,
        "r": "Effective co-teaching draws on a repertoire of models chosen to fit instructional purpose, with both teachers taking genuine instructional roles; perpetual one-teach-one-assist underuses the second certified teacher. A fixed model wastes co-teaching's flexibility, treating the special educator as a substitute misunderstands the role, and pulling IEP students to a corner recreates segregated instruction within the ICT setting."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A student who is nonverbal uses a picture-based AAC system. Her new teacher, wanting her to 'develop real speech,' proposes limiting AAC use during language lessons. What should the speech-language pathologist advise?",
        "a": [
          "Support the limit, since restricting the device motivates the student to attempt spoken words.",
          "Explain that AAC supports rather than suppresses language and communication development; it should be available across all settings, and withholding it removes the student's means of expression.",
          "Suggest introducing a second, more sophisticated communication device alongside the picture system, so that the novelty gives the student a concrete reason to move away from the simpler pictures and toward richer language.",
          "Recommend that AAC be used only at home so school can focus exclusively on oral practice."
        ],
        "c": 1,
        "r": "Research shows AAC does not hinder and often facilitates speech and language growth; it is the student's voice and must be available across environments so she can communicate and learn. Restricting it during instruction denies access to communication and to the curriculum, motivation-by-deprivation is not evidence-based, and home-only use would leave her without a means to participate at school."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A related-services provider delivers speech therapy through a 'push-in' model during the literacy block rather than pulling the student out. A colleague asks what advantage this offers. The best answer is that push-in service:",
        "a": [
          "Lets the SLP target communication goals within authentic classroom activities and coordinate directly with the teacher, so skills are practiced in the context where they must generalize.",
          "Is always superior to pull-out and should replace it for every student on a caseload.",
          "Reduces the SLP's paperwork because in-class minutes do not need to be documented.",
          "Push-in service is appropriate only for students who have already met most of their IEP goals and therefore no longer require focused, specialized intervention delivered through a separate pull-out therapy setting."
        ],
        "c": 0,
        "r": "Push-in service embeds therapy in authentic contexts and supports generalization and teacher collaboration, which is its central rationale; the appropriate model depends on the student's goals, so it is not universally superior nor limited to students nearing exit. All IEP service minutes must be documented regardless of setting, so reduced paperwork is not a legitimate advantage."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A CSE is considering placement for a 6th-grader with a learning disability who is currently in a self-contained class but whose recent data show strong progress. The LRE analysis under IDEA requires the team to:",
        "a": [
          "Move the student immediately into full-time general education for every subject, since the recent progress data prove conclusively that he no longer requires any specialized instruction or related support services at all.",
          "Determine whether the student can be educated satisfactorily in a less restrictive setting with supplementary aids and services, moving toward general education to the maximum extent appropriate.",
          "Base the decision on which setting has open seats and available staffing for the coming year.",
          "Keep the current placement, since changing it mid-year is disruptive and self-contained settings provide more support."
        ],
        "c": 1,
        "r": "IDEA's least-restrictive-environment mandate requires the team to consider whether the student can succeed in a less restrictive setting with supplementary aids and services before defaulting to a more restrictive one, favoring general education to the maximum extent appropriate. Retaining restriction for convenience and jumping straight to full inclusion without a supports analysis both bypass the individualized LRE determination, and staffing convenience may not drive placement."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A CSE reviews data on a 4th-grader with autism who has been in a 12:1+1 special class all year. Despite a consistently implemented BIP, he shows aggression and elopement several times a day, and staff report he stays engaged only when an adult works closely with him for much of each period. He has no other disabilities, and his academic needs alone would not require a special class. Which New York special class ratio is designed for this level of need?",
        "a": [
          "15:1, designed for students whose needs consist primarily of the need for specialized academic instruction rather than for intensive behavior management.",
          "12:1+1, designed for students whose management needs interfere with instruction to the point that at least one additional adult must be present.",
          "8:1+1, designed for students whose management needs are intensive and call for a significant degree of individualized attention and intervention.",
          "12:1+(3:1), designed for students with severe multiple disabilities whose programs consist primarily of habilitation and treatment services."
        ],
        "c": 2,
        "r": "Under 8 NYCRR 200.6(h)(4), the 8:1+1 special class serves students whose management needs are intensive and require a significant degree of individualized attention and intervention, which matches frequent aggression and elopement and a need for close adult support through much of the day. The strongest distractor, B, describes his current 12:1+1 class, which is designed for management needs that interfere with instruction but are not intensive; the data show it is not meeting his needs. 15:1 (A) addresses primarily academic needs, and 12:1+(3:1) (D) is for students with severe multiple disabilities, which he does not have."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A CSE is considering resource room services for a 10th-grader with a learning disability. One member proposes five periods a day of resource room in an eight-period day, in a group of eight students. Which concern about New York's resource room rules is MOST accurate?",
        "a": [
          "Resource room is not offered to high school students, so the team must choose between consultant teacher services and a full-time special class instead.",
          "The proposal complies, because the rules set only a three-hour weekly minimum for resource room and place no upper limit on time or on group size.",
          "Only the schedule is a problem; group size is set locally, so a group of eight is acceptable as long as a teaching assistant is assigned to the room.",
          "Groups may not exceed five students per teacher, and the student may not spend more than 50 percent of the school day in the resource room."
        ],
        "c": 3,
        "r": "Under 8 NYCRR 200.6(f), resource room instructional groups may not exceed five students per teacher, students may not spend more than 50 percent of the school day in the program, and the minimum is three hours per week; five of eight periods exceeds the 50 percent limit. The strongest distractor, B, correctly recalls the three-hour minimum but ignores the caps. Resource room is available in grades 7 to 12 with a caseload of up to 25 (A), and group size is set by regulation, not locally (C)."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A 2nd-grade teacher learns that a student with low vision will join her class next week. The IEP lists large-print materials, enlarged graphics, and consultation from a teacher of the visually impaired (TVI). Which first step BEST reflects effective collaboration?",
        "a": [
          "Wait until the student arrives to observe how well she can actually see, then decide day by day which materials need to be enlarged for each lesson.",
          "Ask the parents to enlarge and laminate the week's classroom materials at home each weekend so they are ready before the lessons begin.",
          "Meet with the TVI before the student arrives to plan how materials will be provided in accessible formats on time and how the room should be arranged.",
          "Assign a classmate to read the board and handouts aloud to her each day, which builds peer relationships and reduces the need for enlarged materials."
        ],
        "c": 2,
        "r": "Indicator 0003c stresses consulting specialists to identify resources and instruction; meeting with the TVI ahead of time ensures accessible materials are ready at the same time as peers' materials and the room is set up for her. The strongest distractor, A, sounds data-driven, but the IEP already specifies the supports, and waiting means she starts without access. The district, not the family, provides IEP materials (B), and a peer reader is not a substitute for the accommodations her IEP lists (D)."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A parent asks why her son, who has a learning disability and attends an integrated co-teaching class, was not offered summer special education services while a classmate in a 6:1+1 special class was. Which explanation is MOST accurate?",
        "a": [
          "Twelve-month services are limited to students placed in special classes, so a student in an integrated co-teaching class is never eligible for summer services.",
          "Summer special education services go to any student whose grades fell below passing in a core subject during the school year, as with general summer school.",
          "Twelve-month services reward students who met all of their annual IEP goals, so eligibility depends on how many goals the student mastered during the year.",
          "Twelve-month services are based on an individual student's need to prevent substantial regression, and the CSE decides whether a student needs them."
        ],
        "c": 3,
        "r": "Under 8 NYCRR 200.6(k), students are considered for twelve-month services based on their need to prevent substantial regression; students in 6:1+1 classes are among those who typically qualify, but the CSE may also recommend them for other students who need a structured summer program to prevent regression. The strongest distractor, A, overgeneralizes from the listed placements; placement type alone does not rule a student in or out. Failing grades (B) and goal mastery (C) are not the criteria."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "An occupational therapist recommends that a 1st-grader with fine-motor delays use a slant board, a pencil grip, and short movement breaks during writing. The classroom teacher is unsure how these fit into a busy literacy block. Which action BEST reflects effective collaboration?",
        "a": [
          "Leave the supports for OT sessions, since the therapist is responsible for fine-motor goals and classroom time should stay focused on literacy instruction.",
          "Ask the OT to model the supports during a writing lesson, agree on when each one will be used, and share brief notes on how the student responds.",
          "Use the supports only on days the OT visits, so the therapist can observe whether they work before the teacher adopts them in daily writing instruction.",
          "Replace handwriting with typed responses for every writing task, which removes the fine-motor demand and saves time during the literacy block."
        ],
        "c": 1,
        "r": "Related-service recommendations work best when the provider and teacher plan together: modeling, agreed routines, and shared data let the supports carry over into daily writing, where the student needs them. The strongest distractor, C, sounds cautious, but limiting supports to visit days withholds them most of the week. A confines the supports to therapy, and D drops handwriting instruction the student still needs rather than supporting it."
      }
    ]
  },
  "Teacher Responsibilities: Legal & Ethical Judgment": {
    "icon": "🏛️",
    "concepts": [
      {
        "title": "Students' Rights: Accommodations, Due Process, and Discipline",
        "body": "Federal law guarantees students procedural safeguards that teachers must uphold daily. IDEA (2004) mandates that students with disabilities receive a free appropriate public education (FAPE) in the least restrictive environment (LRE) and that parents receive prior written notice before any proposed change in identification, evaluation, placement, or services. Section 504 of the Rehabilitation Act prohibits disability-based discrimination and requires reasonable accommodations, including testing accommodations such as extended time, separate setting, or read-aloud, documented in a 504 Plan. For a student with a disability, a decision to change placement for discipline (a removal of more than 10 consecutive school days, or a pattern of removals) requires a manifestation determination review (MDR) within 10 school days of that decision. Title IX (Education Amendments of 1972) prohibits sex-based discrimination in any federally funded education program, covering sexual harassment, athletic equity, and related retaliation. A teacher must never independently deny an accommodation documented in an IEP or 504 Plan; doing so violates federal law regardless of the teacher's instructional rationale. When uncertain about a student's rights, the appropriate first step is consulting the CSE chairperson or building administrator, not unilaterally deciding."
      },
      {
        "title": "FERPA: Confidentiality and Student Records",
        "body": "The Family Educational Rights and Privacy Act (FERPA, 1974; 34 CFR Part 99) governs access to and disclosure of student education records in schools receiving federal funds. Education records are records directly related to a student and maintained by the school, whether paper, electronic, or recorded. Parents of students under 18, and eligible students (18 or older, or enrolled in postsecondary education), have the right to inspect and review records (the school must comply within 45 days of a request), to request amendment of records they believe are inaccurate or misleading (with a hearing if the request is denied), and to give written consent before personally identifiable information is disclosed. Both parents keep these rights after a divorce or separation, including a noncustodial parent, unless the school has a court order or other legally binding document that specifically revokes them; a custodial parent's preference is not enough. Teachers may not share a student's grades, IEP status, disciplinary history, or other education records with unauthorized people, such as other parents, community members, reporters, or outside providers without signed consent. Exceptions permit disclosure without consent to school officials with a legitimate educational interest, to a school where the student seeks to enroll, to comply with a lawful subpoena or court order, and in a health or safety emergency. Directory information (for example, name, grade level, enrollment status) may be released unless a parent opts out. Posting grades in ways that identify individual students, including by ID numbers classmates can link to a student, or discussing one student's performance with another parent, violates FERPA. New York Education Law 2-d adds student data privacy and security requirements, including a Parents' Bill of Rights for Data Privacy and Security, which is why teachers should use only district-vetted digital tools that collect student information."
      },
      {
        "title": "NY DASA: Anti-Bullying, Harassment, and Discrimination",
        "body": "New York's Dignity for All Students Act (DASA, Education Law Article 2, effective July 1, 2012; cyberbullying added July 1, 2013) requires public schools, including charter schools, to provide a safe, supportive learning environment free from harassment, bullying, and discrimination. Protected characteristics, actual or perceived, include race (which includes traits historically associated with race, such as hair texture and protective hairstyles like braids, locks, and twists), color, weight, national origin, ethnic group, religion, religious practice, disability, sexual orientation, gender (including gender identity or expression), and sex. The list is illustrative: bullying for any reason is prohibited. DASA reaches conduct on school property, at school functions, and off campus when it creates or would foreseeably create a risk of substantial disruption at school, which is how off-hours cyberbullying is covered. Every school must have at least one trained Dignity Act Coordinator whose name and contact information are shared with staff, students, and families. Anyone seeking a New York teaching certificate after December 31, 2013 must complete six clock hours of approved DASA training as a one-time certification requirement. When a teacher witnesses or receives a report of harassment, bullying, or discrimination, the teacher must report it orally to the principal, superintendent, or designee (usually the Dignity Act Coordinator) no later than one school day later and file a written report no later than two school days after the oral report; informal resolution does not replace reporting. The principal or designee then investigates and takes prompt action reasonably calculated to end the behavior, and retaliation against anyone who reports in good faith is prohibited. The Jack Reid Law (enacted October 2025) extends DASA-style anti-bullying and harassment requirements to nonpublic schools; DASA itself continues to govern public and charter schools. DASA works alongside, not in place of, federal civil rights law when conduct is based on sex, race, or disability."
      },
      {
        "title": "Mandated Reporting of Suspected Child Abuse and Maltreatment",
        "body": "In New York, teachers are mandated reporters under Social Services Law Section 413. When a teacher has reasonable cause to suspect that a child is abused or maltreated by a parent or other person legally responsible for the child, the teacher must report immediately by phone to the NYS Statewide Central Register (SCR) on the mandated-reporter line, 1-800-635-1522, and then file the written report (form LDSS-2221A) with the local department of social services within 48 hours. The threshold is reasonable suspicion, not certainty: physical indicators (unexplained bruises, burns, or injuries), behavioral signs (sudden withdrawal, fear responses, age-inappropriate sexual behavior), or a child's direct disclosure can each be enough. The duty is personal. Telling the principal does not satisfy it, and a school may not require staff to get permission or give prior notice before calling; after making the report, the teacher also notifies the person in charge of the school or a designee. Good-faith reporters are immune from civil and criminal liability, while willful failure to report is a Class A misdemeanor and can create civil liability. Teachers do not investigate or confront the suspected abuser, and they discuss the report only with people who have a legal role in it. A different law applies when the suspected abuser is a school employee or volunteer: under Education Law Article 23-B, a teacher who receives an allegation of child abuse in an educational setting promptly completes a written report and delivers it to the building administrator, who, on reasonable suspicion, notifies the parents and forwards the report to law enforcement. Mandated reporter training was updated twice recently: content on implicit bias and adverse childhood experiences (completion deadline April 1, 2025) and on identifying abuse of children with intellectual and developmental disabilities (completion deadline November 17, 2026)."
      },
      {
        "title": "Advocating for Students and Analyzing Professional Conduct",
        "body": "The EAS framework expects teachers to act as professional advocates serving the best educational and developmental interests of their students. Advocacy includes identifying unmet needs and bringing them to appropriate personnel. In New York, a teacher who suspects a disability does not refer the student directly: the teacher submits a written request for referral (stating the reasons, the interventions already tried, and the contacts made with the parent), which is forwarded immediately to the CSE chairperson, and within 10 school days the district must either request parent consent to evaluate or give the parent a copy of the request and offer a meeting. This is how a classroom teacher supports the district's Child Find obligation, and RtI may not be used to delay or deny an evaluation a parent requests. Advocacy also means communicating student progress accurately to families and challenging policies or practices, through appropriate channels, that impede student access or equity. Ethical judgment requires recognizing when a colleague's conduct may harm a student. If a teacher observes another staff member violating a student's rights (for example, denying a legally required accommodation, using demeaning language, or imposing discriminatory discipline), the professional response is to report the concern to an administrator, not to ignore it or handle it informally. The EAS distinguishes appropriate advocacy (using due process, documentation, and the chain of command) from inappropriate action (unilateral defiance of policy, public disclosure of confidential information, or confrontation without administrative support). Teachers balance collegial loyalty against their primary obligation to student welfare and legal compliance."
      },
      {
        "title": "Parents/Guardians: Rights, Responsibilities, and School-Home Communication",
        "body": "Federal and state law grant parents/guardians significant rights in their children's education. Under IDEA, parents are members of the IEP team (the CSE in New York), must give informed consent before an initial evaluation and before initial placement, and retain the right to request meetings, an independent educational evaluation (IEE), mediation, and an impartial due process hearing when disputes arise. Under Section 504, parents have the right to notice of any action affecting identification, evaluation, or placement, and to an impartial hearing. FERPA grants parents access to, and amendment rights over, education records. Teachers must communicate with parents in a language they can understand, an obligation reinforced by Title VI of the Civil Rights Act for families with limited English proficiency, which may require qualified interpreter or translation services. Parents also carry responsibilities: they are expected to participate in IEP and 504 meetings when notified, to share relevant health and developmental history, and to reinforce school supports at home. Teachers should document parent contacts (date, format, content, outcome) to maintain a record of good-faith communication. Reaching out proactively, before problems escalate, is both a legal best practice and a professional obligation."
      },
      {
        "title": "Student Discipline, Due Process, and Safety Interventions in NYS",
        "body": "Student discipline in New York is governed by Education Law 3214, the district code of conduct required under the SAVE law (8 NYCRR 100.2(l)), and constitutional due process. A teacher may remove a disruptive student from the classroom under the code of conduct. The teacher must tell the student why and, unless the student poses a continuing danger, give the student an informal chance to respond before removal (otherwise within 24 hours). The principal must notify the parent within 24 hours of the removal and hold an informal hearing within 48 hours, and the student does not return until the principal decides or the removal period set in the code ends. A principal may suspend for up to five school days; parents must receive written notice in their dominant language, sent by a method reasonably calculated to arrive within 24 hours of the decision, and may request an informal conference with the principal at which they can question complaining witnesses. A suspension of more than five school days requires a superintendent's hearing with reasonable notice, the right to counsel, and the right to present evidence and question witnesses. For a student with a disability, a removal of more than 10 consecutive school days, or a pattern of removals, is a change in placement that requires a manifestation determination. Some responses are prohibited outright: corporal punishment, aversive interventions, prone restraint, mechanical restraint, and seclusion. Physical restraint is allowed only as an emergency response to imminent danger of serious physical harm when less restrictive interventions would not prevent it, only by trained staff, never as a planned intervention written into an IEP, BIP, or 504 plan, and parents must be notified the same day. Under the 2025 phone-free schools law, students may not be suspended solely for violating the device policy, and devices listed in an IEP or 504 plan are exempt. The teacher's job is to follow the code of conduct, document incidents factually, and route serious discipline to administrators rather than impose unofficial penalties."
      },
      {
        "title": "The NYS Code of Ethics and Professional Boundaries",
        "body": "The Board of Regents adopted the Code of Ethics for Educators in 2002. Its six principles say that educators (1) nurture the intellectual, physical, emotional, social, and civic potential of each student; (2) create, support, and maintain challenging learning environments for all; (3) commit to their own learning in order to develop their practice; (4) collaborate with colleagues and other professionals in the interest of student learning; (5) collaborate with parents and community, building trust and respecting confidentiality; and (6) advance the intellectual and ethical foundation of the learning community. The Code guides judgment; it is not a disciplinary rulebook. Discipline of certified educators proceeds separately, through moral character review under 8 NYCRR Part 83 and, for tenured teachers, Education Law 3020-a. EAS items under Competency 0004 often ask whether a teacher's response to a student, parent, colleague, or community member is appropriate. The best response usually keeps the student's welfare first, protects confidential information, stays within the teacher's role and uses established channels, and is documented and professional in tone. Common boundary problems include private social media or texting relationships with students, posting about identifiable students, accepting significant gifts or favors, discussing a student with people who have no educational role, and promising a student secrecy about something the teacher must report. When a parent or community member raises a complaint, the professional response is to listen without defensiveness, share only what that person is entitled to know, explain the process, and follow up. When a colleague's conduct may harm a student, the teacher raises it with an administrator; when it involves an allegation of child abuse in an educational setting, Education Law Article 23-B requires a prompt written report to the building administrator."
      },
      {
        "title": "Compulsory Attendance and Chronic Absenteeism: Parent and School Duties",
        "body": "New York's compulsory education law (Education Law 3205) requires full-time instruction for each child from age 6 through the last day of the school year in which the student turns 16. A child who turns 6 on or before December 1 must attend starting that September. Boards of education may also require kindergarten for children who are 5 on or before December 1, and may require 16- and 17-year-olds who are not employed to attend through the school year in which they turn 17. The person in parental relation is legally responsible for the child's attendance (Education Law 3212), which can be met through public school, nonpublic school, or substantially equivalent home instruction. Each district must adopt a comprehensive attendance policy (8 NYCRR 104.1) that records every absence, tardy, and early departure, defines which are excused, and describes the outreach the school uses to improve attendance. NYS tracks chronic absenteeism, defined as missing 10 percent or more of enrolled school days for any reason, excused or not, because absences add up before they look serious. The teacher's role is early, nonpunitive outreach: notice patterns, contact the family to learn the cause (illness, caregiving, transportation, housing instability, bullying, anxiety), and connect the family with the counselor, social worker, attendance team, or McKinney-Vento liaison. A student experiencing homelessness must be enrolled immediately even without records. When a parent's failure to ensure attendance is impairing the child's education and school outreach has not resolved it, a teacher, as a mandated reporter, may have reasonable cause to suspect educational neglect and must call the SCR. A report is not a substitute for supports, and absences a parent is actively working to resolve are handled through school interventions."
      }
    ],
    "practice": [
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 10th-grade student with a learning disability has an IEP specifying extended time (time and a half) on all tests. During a state practice exam, the general education teacher tells the student, 'You don't need the extra time. This is just practice, and it will be better preparation for the real test.' Which of the following best describes the teacher's action?",
        "a": [
          "The teacher should have first secured the parents' consent before allowing extended time on a practice assessment.",
          "The teacher acted appropriately because IEP accommodations are suggestions, not mandates, in general education settings.",
          "The teacher violated the student's federally protected rights by unilaterally withholding a documented IEP accommodation.",
          "The teacher exercised appropriate professional judgment because the accommodation applies only to formal state assessments."
        ],
        "c": 2,
        "r": "IEP accommodations are binding in every setting the IEP specifies, including classroom and practice assessments, and an individual teacher has no authority to suspend them on instructional grounds. The strongest distractor, that the accommodation applies only to formal state assessments, fails because this IEP says 'all tests,' and practicing without the accommodation also removes the conditions the student will actually test under. Accommodations already written into the IEP need no new parental consent at the point of delivery, and they are mandates, not suggestions."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A teacher posts on her personal, public social media account: \"Rough day. One of my little friends in period 3 earned himself ANOTHER trip to the office. You all know exactly who I mean 🙄.\" Parents at the school follow the account. Which statement best evaluates the post?",
        "a": [
          "The post is acceptable because it names no student and includes no photo, and confidentiality rules protect only formal written records, not general comments about a class period.",
          "The post is unprofessional: followers from the school can identify the student from context, and publicizing his discipline breaches confidentiality and the Code of Ethics.",
          "The post is a problem only if the district has adopted a social media policy and the teacher signed an acknowledgment of that specific clause in the handbook.",
          "The post is acceptable because it was made outside contract hours on a personal device, and off-duty speech by a public employee is fully protected as free expression."
        ],
        "c": 1,
        "r": "Confidentiality turns on identifiability, not on whether a name appears: 'period 3' plus 'you all know exactly who I mean' identifies the student to followers from the school community, and publicly mocking a child's discipline violates the NYS Code of Ethics (Principle 5, respecting confidentiality) and district expectations. The strongest distractor, that no name or photo means no problem, ignores indirect identification and treats discipline information as fair game. Off-duty posting about an identifiable student is not shielded, and professional-ethics duties exist with or without a signed handbook clause."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "Two high school students engage in a pattern of social-media posts mocking a classmate's weight and appearance. The targeted student's friends report it to the classroom teacher during class, and the targeted student has been visibly distressed and reluctant to participate for two weeks. What should the teacher do first?",
        "a": [
          "Address the behavior directly with the two students and require them to apologize to the targeted student in front of the class.",
          "Contact the parents of all three students to arrange a restorative conversation between the families.",
          "Document the report and the observable impact on the student, then report the incident to the school's Dignity Act Coordinator.",
          "Refer the matter to the school counselor and let the counselor decide whether the conduct rises to bullying under DASA."
        ],
        "c": 2,
        "r": "DASA requires a school employee who witnesses or receives a report of harassment or bullying, including off-campus cyberbullying that foreseeably disrupts school, to report orally to the principal, superintendent, or designee (typically the Dignity Act Coordinator) within one school day and in writing within two school days of the oral report. The teacher's role is to document and report, not to adjudicate. The strongest distractor, requiring a public apology, feels responsive but can further harm the targeted student and replaces the documented process the law requires. Arranging a family restorative meeting or leaving the judgment to the counselor detours the teacher's own reporting duty."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A middle school teacher notices that a student frequently wears long sleeves in warm weather and flinches when adults approach quickly. When the teacher privately asks whether everything is okay at home, the student says, 'Please don't tell anyone.' The teacher has no other concrete proof of abuse but has a persistent sense that something is wrong. What is the teacher's most appropriate next step?",
        "a": [
          "Refer the student to the school counselor for a well-being check and let the counselor determine whether a report to the Statewide Central Register is actually warranted.",
          "Report the suspicion immediately to the NYS Statewide Central Register, because reasonable suspicion, not certainty, triggers the mandatory reporting duty.",
          "Discuss the concern with the building principal first to determine whether a formal report is warranted.",
          "Honor the student's request for confidentiality and keep observing the student before taking any formal action."
        ],
        "c": 1,
        "r": "Under Social Services Law 413 a mandated reporter must report when there is reasonable cause to suspect abuse or maltreatment; concealing clothing in warm weather, flinching, and a guarded plea for secrecy meet that threshold. The strongest distractor, checking with the principal first, fails because the duty is personal and a school may not require prior approval; the teacher calls the SCR and then notifies the person in charge of the school. Referring to the counselor or honoring the request for secrecy substitutes delay for the immediate report the law requires."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A first-year teacher is unsure whether a colleague's plan to post students' ranked test scores on the classroom wall, listed by student ID number rather than name, is permissible. What is the most accurate guidance under FERPA?",
        "a": [
          "FERPA protects indirect identifiers, such as ID numbers classmates can link to a student, so this posting risks unlawful disclosure.",
          "It is permissible as long as the teacher takes the posting down within 24 hours, before most families would have a chance to see it.",
          "FERPA does not apply to classroom assessments; it covers only the official transcript and the cumulative file kept in the main office.",
          "It is fine because ID numbers, not names, are used, so no individual student can be personally identified from the posted list."
        ],
        "c": 0,
        "r": "FERPA's definition of personally identifiable information includes indirect identifiers, such as a student ID number that peers can associate with a particular student; posting ranked scores keyed to those numbers can disclose protected education records without consent. A short display window does not cure the disclosure, and FERPA protections extend to graded classroom records, not just the transcript."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A teacher suspects a colleague is inflating grades for athletes to keep them eligible. The New York State Code of Ethics for Educators would guide the teacher first to:",
        "a": [
          "Confront the colleague publicly in a staff meeting to force accountability.",
          "Say nothing, since grading is each teacher's private professional prerogative.",
          "Raise the concern through appropriate professional channels, upholding integrity and the responsibility to maintain fair and honest evaluation of student learning.",
          "Quietly adjust her own students' grades upward to a comparable degree, so that her class remains competitive with the colleague's inflated grades and her students are not disadvantaged in class rank by comparison."
        ],
        "c": 2,
        "r": "The NYS Code of Ethics obligates educators to maintain integrity and act in students' best interests, which includes addressing suspected dishonesty through appropriate professional channels rather than ignoring it. Silence tolerates a fairness violation, public confrontation is neither constructive nor procedurally sound, and matching the misconduct compounds the ethical breach rather than resolving it."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A father emails his son's teacher asking to inspect everything in the boy's school file, including evaluations and discipline reports. The family is not in any dispute with the school, and no meeting is scheduled. Under FERPA, how must the school respond?",
        "a": [
          "Let him inspect and review the records within a reasonable time, no later than 45 days after the request, and answer reasonable questions about them.",
          "Require the father to state in writing why he wants the records, since parents may see them only for a documented educational purpose.",
          "Give him only a summary prepared by the principal, because parents may see evaluations only when a school psychologist is present to interpret them.",
          "Mail him free photocopies of every record within five school days, because FERPA requires schools to supply copies on demand."
        ],
        "c": 0,
        "r": "FERPA gives parents the right to inspect and review their child's education records: the school must comply within a reasonable time, no more than 45 days after the request, and respond to reasonable requests for explanation (IDEA adds that, for a student with a disability, access comes without unnecessary delay and before any IEP meeting or hearing). A parent does not have to justify the request. The strongest distractor, free copies within five days, misstates the rule: a school must provide copies only when failing to do so would effectively prevent the parent from inspecting the records, and there is no five-day deadline. Nothing limits a parent to a principal's summary or requires a psychologist to be present."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 3rd grader's IEP mandates speech-language therapy twice a week. Her teacher realizes the student has not been seen for speech in four weeks because the provider has been on leave and no coverage was arranged. What is the teacher's MOST appropriate action?",
        "a": [
          "Say nothing, because staffing gaps are an administrative matter and raising them could expose the district to a complaint.",
          "Notify the administrator or CSE chairperson in writing, listing the missed session dates, so the district can arrange coverage and make-up services.",
          "Run speech-language sessions herself during independent reading time, using articulation activities she finds online, until the provider returns.",
          "Wait until the annual review and then recommend reducing the speech mandate, since the student seems to be managing without the service."
        ],
        "c": 1,
        "r": "Advocating to meet student needs is a core teacher responsibility. The IEP is a binding commitment, and missed mandated services must go to the people who can fix the gap: the administrator or CSE chairperson can arrange coverage and make-up sessions, and a written record of the dates supports that. The strongest distractor, running sessions herself, looks helpful but substitutes unqualified instruction for the related service the IEP requires and leaves the gap unreported. Staying silent puts the institution ahead of the student, and waiting to cut the mandate treats a service failure as evidence the service is unnecessary."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "After losing their apartment, a family moves in with relatives in another district. The mother wants her 5th grader to keep attending his current school, but the main office tells her he must transfer because the family no longer lives in the attendance zone. The student's teacher hears the exchange. What is the teacher's MOST appropriate step?",
        "a": [
          "Tell the mother the office is correct, because enrollment follows residence and the relatives' address now determines which school the boy attends.",
          "Let the transfer proceed and send the new school a summary of the student's progress so the move goes as smoothly as possible.",
          "Advise the mother to keep listing her old address on school forms so her son can stay enrolled without drawing attention.",
          "Alert the district's McKinney-Vento liaison, since a student doubled up after losing housing may stay in his school of origin, with transportation."
        ],
        "c": 3,
        "r": "Under McKinney-Vento and Education Law 3209, a student sharing housing because of loss of housing is homeless, and the parent, as designator, may choose the school of origin for the duration of homelessness, with transportation provided. Every district has a liaison to resolve these questions, and the student stays enrolled while any dispute is settled. The strongest distractor, smoothing the transfer, sounds cooperative but gives up a right the family holds. Residence-based enrollment rules do not control here, and coaching the parent to misstate her address is dishonest and unnecessary."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A school counselor asks a teacher to email a student's full psychological evaluation to a private tutor the family hired, saying 'the parents are fine with it.' What should the teacher do before sending anything?",
        "a": [
          "Send only the summary page, since disclosing part of an evaluation does not require the parents' written consent.",
          "Confirm the district has the parents' signed, written consent naming the tutor, and route the release through the records office instead of emailing it.",
          "Refuse outright, since evaluation records may never be shared with anyone outside the school under any circumstances.",
          "Send it as requested, since the counselor has relayed that the parents consented and the tutor is working on the student's behalf."
        ],
        "c": 1,
        "r": "FERPA requires written, signed parental consent specifying the records and the recipient before disclosing personally identifiable education records to an outside party; a verbally relayed 'they're fine with it' is not documented consent, and formal releases go through the records process. Partial disclosure still discloses protected content, but a blanket refusal is also wrong: records may be shared with proper consent."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "During a fire drill, a teacher realizes a student who uses a wheelchair cannot exit via the usual stairwell route in her plan. Her professional responsibility for student safety requires that she:",
        "a": [
          "Assign a classmate to stay behind with the student until first responders arrive.",
          "Leave all of the evacuation planning to the building's designated safety officer, on the understanding that the logistics of emergency egress fall outside the professional role and responsibilities of a classroom teacher.",
          "Carry the student down the stairs herself in an emergency, improvising as needed.",
          "Work with administration in advance to put an individualized emergency evacuation plan in place (accessible egress, an area of refuge, and assigned assistance) and practice it."
        ],
        "c": 3,
        "r": "Student safety obligations require proactive, individualized emergency planning for students with mobility needs (accessible routes, areas of refuge, assigned trained assistance, and practice), arranged in advance with administration. Improvised carrying risks injury, leaving a peer behind endangers two students, and deferring entirely disclaims the teacher's shared duty to know and rehearse the plan for her own students."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A teacher wants to use a free online reading app that asks students to create accounts with their names, grade, and email addresses. Before assigning it, her most important professional obligation is to:",
        "a": [
          "Confirm the app is engaging and age-appropriate, then assign it to boost motivation.",
          "Require students to use nicknames so the app cannot collect real identities.",
          "Assign it only to students whose parents happen to ask about extra practice.",
          "Check that the tool complies with student-data-privacy requirements and district approval processes, since sharing students' personal information with a vendor implicates their privacy rights."
        ],
        "c": 3,
        "r": "Directing students to submit personally identifiable information to a third-party vendor implicates student-data-privacy law and district vetting requirements, so verifying compliance and approval comes before assignment. Engagement alone does not clear the privacy hurdle, nickname workarounds do not resolve the underlying data-sharing and approval questions, and limiting the tool to families who ask does not address the privacy obligation for those who use it."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "During a lesson, a 9th grader repeatedly shouts over the teacher and refuses redirection but poses no danger to anyone. Under the district code of conduct, the teacher decides to remove him from class. Which sequence BEST follows New York's teacher-removal requirements?",
        "a": [
          "Remove the student immediately without explanation, because a disruptive student's right to an explanation begins only once a formal superintendent's hearing is scheduled.",
          "Explain the reason for removal and let the student informally give his side before he leaves, then inform the principal, who notifies the parent within 24 hours.",
          "Remove the student and call the parent personally that evening, since a teacher-initiated removal is resolved between the teacher and the family without the principal.",
          "Keep the student out of class until a parent attends a conference with the teacher, however many days that takes, because the teacher sets the length of a removal."
        ],
        "c": 1,
        "r": "Education Law 3214(3-a) requires the teacher to give the reasons and, when the student is not a continuing danger, an informal chance to respond before removal; the principal must notify the parent within 24 hours and offer an informal hearing within 48 hours. The strongest distractor, calling the parent directly and leaving the principal out, fails because the principal must be informed and is responsible for parent notice and the hearing. Teacher removal requires no superintendent's hearing, and the student cannot be held out indefinitely: he returns when the principal decides or the code's removal period ends."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A principal suspends a 6th grader for three school days for fighting. The family's dominant language is Bengali. Which action is REQUIRED as the suspension takes effect?",
        "a": [
          "A superintendent's hearing with the right to counsel, held before the suspension begins, because any out-of-school suspension triggers full hearing rights.",
          "A manifestation determination meeting within 10 school days, because every suspended student is entitled to one regardless of disability status.",
          "A phone call to the family in English, followed by a written summary at the next scheduled parent-teacher conference so the family has a record.",
          "Written notice in Bengali sent to arrive within 24 hours, describing the incident and the family's right to an informal conference with the principal."
        ],
        "c": 3,
        "r": "For a suspension of five days or fewer, 8 NYCRR 100.2(l)(4) requires immediate written notice, by a method reasonably calculated to arrive within 24 hours, in the parents' dominant language, describing the incident and the right to an informal conference at which they may question complaining witnesses. The strongest distractor, the superintendent's hearing, applies only to suspensions longer than five school days. Manifestation determinations apply to students with disabilities facing a change in placement, and an English call with a later summary fails both the timing and the language requirements."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A draft behavior intervention plan for a 4th grader who sometimes runs from class and hits during transitions includes this line: 'If Jayden refuses to return to class, staff will use a two-person hold until he complies.' As a member of the team, what is the BEST response to this line?",
        "a": [
          "Object that NYS bars restraint as a planned BIP intervention and allows it only in emergencies involving imminent danger of serious harm, then propose proactive supports.",
          "Approve it, provided the hold is performed only by staff with current annual training and the parent receives a written incident summary within three school days.",
          "Suggest replacing the hold with a short stay in a locked calm-down room, which is less intrusive than physical contact and keeps the student and staff safe until he is ready.",
          "Approve it if the parent signs written consent, since informed parental consent allows the team to include restraint procedures in the student's behavior plan."
        ],
        "c": 0,
        "r": "Under 8 NYCRR 200.22 and Regents Rule 19.5 (amended 2023), physical restraint may be used only as an emergency response to imminent danger of serious physical harm, never as a planned intervention written into an IEP, BIP, or 504 plan, and never to gain compliance. The strongest distractor, approving it with trained staff and documentation, describes real requirements for emergency restraint but cannot make a planned hold lawful. A locked room is seclusion, which is banned outright, and parental consent does not override the prohibition."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 10th grader sends her English teacher a follow request on the teacher's personal Instagram account and a direct message: 'Can we talk here? Stuff at home is bad and I don't want anyone at school to know.' Which response BEST reflects the teacher's professional and legal obligations?",
        "a": [
          "Accept the request so the student has a trusted adult to reach after hours, and keep the conversation private as she asked, since breaking her trust could end the disclosure.",
          "Ignore the message entirely and say nothing at school, because responding to any student contact on personal social media would itself violate district policy.",
          "Decline the personal connection, meet with her at school, explain that some things cannot be kept secret, involve the counselor, and report if abuse is suspected.",
          "Reply that she should talk with her parents first, and wait to see whether she raises the issue again before involving anyone else at school."
        ],
        "c": 2,
        "r": "Private social media relationships with students cross the professional boundaries the Code of Ethics and district policies protect, yet the message is a possible warning sign the teacher cannot ignore. Moving the conversation to a school setting, being honest that some disclosures must be shared, involving support staff, and reporting reasonable suspicion of abuse to the SCR meets every duty. The strongest distractor, accepting and keeping it secret, feels caring but creates an improper private channel and promises confidentiality the teacher cannot legally keep. Ignoring the message or waiting abandons a student who may be at risk."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 3rd grader tells her teacher that a teaching assistant grabbed her arm hard enough to leave marks during recess, and the teacher sees the bruises. Under New York law, what must the teacher do?",
        "a": [
          "Call the Statewide Central Register right away, because every suspected abuse of a child must be phoned in there no matter who the alleged abuser is or where it happened.",
          "Promptly complete a written report of the allegation and deliver it to the building administrator, who notifies parents and police on reasonable suspicion.",
          "Speak privately with the teaching assistant first to hear his side of the story, so that an unfounded allegation does not unfairly damage a colleague's career.",
          "Notify the union representative and the student's parents, and let them decide together whether the matter is serious enough to bring to the principal."
        ],
        "c": 1,
        "r": "Allegations of child abuse by a school employee or volunteer in an educational setting fall under Education Law Article 23-B: the teacher promptly completes a written report and delivers it to the building administrator, who, on reasonable suspicion, notifies the parents and forwards the report to law enforcement. The strongest distractor, calling the SCR, reflects the rule for abuse by a parent or person legally responsible for the child; it is not the required route for school staff. Confronting the colleague or routing the decision through the union and parents delays the mandated report."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "By mid-November, a 2nd grader has missed 9 of 50 school days. Each absence has a parent note citing illness, so the main office codes them all as excused. What is the teacher's MOST appropriate response?",
        "a": [
          "Take no action, because excused absences with parent notes do not count toward attendance concerns under the district's comprehensive attendance policy.",
          "Call the Statewide Central Register, because missing nearly a fifth of school days establishes educational neglect regardless of the reason for the absences.",
          "Recognize the student as chronically absent, contact the family to learn what is behind the illnesses, and connect them with the nurse or attendance team.",
          "Tell the family that further absences will lower the student's grades and may lead to retention, so that the parents treat attendance as a priority."
        ],
        "c": 2,
        "r": "Chronic absenteeism counts every absence, excused or not; 9 of 50 days is 18 percent, well above the 10 percent threshold NYS uses. Early, nonpunitive outreach to learn the cause and link the family with supports is the expected teacher response. The strongest distractor, calling the SCR, is premature: documented illness with parent contact does not suggest a parent failing to ensure attendance, and a report is not a substitute for school outreach. Ignoring excused absences misses the pattern, and threatening penalties damages the partnership without addressing the cause."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 10-year-old has missed 35 days this year. The teacher, counselor, and attendance officer have called, met with the mother twice, and offered transportation help, but the mother still keeps the child home most days to watch younger siblings. The child is now far behind in reading. What is the teacher's responsibility at this point?",
        "a": [
          "Continue documenting the absences through the end of the year, because attendance becomes the family's private decision once the school has offered help.",
          "Ask the principal to remove the student from the class roster, because a student who is not attending can no longer be served by the school.",
          "File a petition with family court herself, because enforcing compulsory attendance is each classroom teacher's individual legal duty.",
          "Report to the SCR, because the parent's failure to ensure attendance despite outreach is impairing the child's education and may be educational neglect."
        ],
        "c": 3,
        "r": "Education Law 3205 requires a 10-year-old to attend school, and Education Law 3212 makes the parent responsible for that attendance. When outreach has been tried and a parent's failure to ensure attendance is impairing the child's education, a mandated reporter has reasonable cause to suspect educational neglect and must call the SCR. The strongest distractor, continuing to document, treats attendance as optional when the law makes it compulsory. Dropping a compulsory-age student from the roster is not permitted, and court petitions are a district function, not a classroom teacher's duty."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 1st grader begins receiving small-group Tier 2 reading intervention three times a week in addition to core instruction. The parents have not been told. Under New York's RtI regulation, what must the school provide?",
        "a": [
          "Written notice of the intervention, the data to be collected, strategies to increase the rate of learning, and the parents' right to request an evaluation.",
          "Prior written notice and a request for consent to evaluate, because placing a student in Tier 2 intervention is legally treated as a referral to the Committee on Special Education.",
          "Nothing yet, because written notice is required only after the student fails to respond to Tier 2 and the team is considering a special education referral.",
          "An oral update at the next parent-teacher conference, because RtI is a general education service and the details of intervention are internal instructional decisions."
        ],
        "c": 0,
        "r": "8 NYCRR 100.2(ii) requires written notification to parents when a student needs intervention beyond what all students receive, covering the performance data to be collected and services provided, strategies to increase the rate of learning, and the parents' right to request a special education evaluation. The strongest distractor treats Tier 2 as a CSE referral; RtI is general education, so evaluation consent is not triggered, but written notice is. Waiting until the student fails to respond, or offering only an oral update, does not meet the regulation."
      }
    ]
  },
  "School-Home Relationships & Family Engagement": {
    "icon": "🏠",
    "concepts": [
      {
        "title": "Initiating & Sustaining Effective Communication",
        "body": "Effective teacher-family communication begins before problems arise. Teachers should establish contact at the start of the school year through welcome letters, phone calls, or brief orientation meetings that introduce themselves, set expectations, and invite ongoing dialogue. Communication must be proactive, not limited to conferences or disciplinary incidents, and should include positive updates, not only concerns. Frequency, clarity, and tone all shape whether families feel respected as partners. Teachers should also be aware that formal education records they create and share, such as report cards and grades, are protected under FERPA and may be accessed by parents (and by the student once an eligible student at age 18 or upon postsecondary enrollment); a teacher's private notes kept in sole possession and not shared with others are not education records. Key best practices include maintaining communication logs, responding to family inquiries promptly, and using plain language free of educational jargon. Responsiveness signals professional respect and directly builds family trust. When communication is reactive or punitive in framing, families disengage. Equity demands that teachers audit whether they contact high-need or culturally and linguistically diverse families as consistently as others."
      },
      {
        "title": "Barriers to Communication: Accessibility & Cross-Cultural Factors",
        "body": "Multiple factors can impede meaningful family engagement. Structural barriers include work schedules that conflict with school hours, lack of transportation, and limited access to technology or internet. Linguistic barriers arise when families have limited English proficiency; schools are obligated under Title VI of the Civil Rights Act, as clarified by federal Office for Civil Rights guidance, to provide meaningful access to school programs, which includes translated or interpreted communications and qualified interpreters, not reliance on the student or other children as interpreters. Cultural barriers involve differing conceptions of parental involvement, authority relationships with educators, and historical mistrust of institutions, particularly among Black, Indigenous, and immigrant communities. Cross-cultural competence requires teachers to recognize that deference to educators, limited physical presence at school, or indirect communication styles are not indicators of disengagement; they may reflect cultural norms. New York's Culturally Responsive-Sustaining (CR-S) Education Framework likewise calls on schools to build a welcoming and affirming environment and to treat families' cultural knowledge as an asset. Teachers who conflate cultural difference with deficiency undermine partnership. Effective communicators adapt style and channel (text, app, paper, phone) to what works for each family."
      },
      {
        "title": "Parent-Teacher Conferences: Purpose & Best Practices",
        "body": "Parent-teacher conferences are a structured forum for sharing student progress, aligning expectations, and problem-solving collaboratively. Effective conferences are reciprocal: teachers prepare data (work samples, grades, observations, assessment results) but also create space for family perspectives on the child's learning, strengths, and home context. Conferences must never be the first time a family hears about a serious concern; prior communication establishes context. For students receiving special education services under IDEA, conferences may intersect with or inform CSE (Committee on Special Education) meetings, where parents are guaranteed participatory rights, including being equal members of the IEP team, giving informed consent for evaluation and initial services, and receiving procedural safeguards such as prior written notice of proposed changes. For students with 504 plans, similar collaborative review processes apply. Best practices include scheduling at times accessible to families, offering alternatives to in-person meetings (phone, video), beginning with student strengths, using asset-based language, and ending with specific, agreed-upon next steps. Qualified interpreters must be arranged in advance for families with language needs, not improvised. Documentation of conference outcomes supports continuity across the year."
      },
      {
        "title": "Accommodating Language & Communication Needs",
        "body": "When families have limited English proficiency, schools bear an affirmative obligation, rooted in Title VI and clarified by OCR guidance, to provide meaningful access. This means qualified human interpreters for oral communication, rather than machine translation alone, and translated or competently interpreted versions of essential written materials such as report cards, IEP and CSE meeting notices, and disciplinary correspondence. Using students as interpreters is professionally and legally problematic: it compromises the child's appropriate role, may distort meaning, and denies the family confidential adult-to-adult communication. New York's English as a New Language (ENL) and bilingual education frameworks remind teachers that BICS (Basic Interpersonal Communication Skills), conversational fluency, develops faster than CALP (Cognitive Academic Language Proficiency), so a family member may seem conversationally capable in English while lacking the academic language to fully understand a progress report or IEP. Teachers should identify family language needs early in the year and document them. Schools must also ensure parents and guardians with disabilities can participate, for example providing sign-language interpreters or written summaries for parents who are deaf or hard of hearing, and accessible meeting locations, consistent with the ADA and Section 504."
      },
      {
        "title": "Inviting Family Input & Participation in Decision-Making",
        "body": "Family engagement is not passive reception of information; it encompasses genuine input into educational decisions. IDEA establishes parents of students with disabilities as equal members of the IEP team, with rights to give or withhold informed consent, review records, and challenge decisions through mediation and due process. Beyond special education, teachers should solicit family knowledge of the student's learning history, strengths, preferences, and cultural background as part of instructional planning. Consistent with the spirit of Universal Design for Learning, offering multiple means of engagement, such as surveys, home visits, virtual attendance, and asynchronous feedback forms, helps more families contribute meaningfully despite differing schedules and resources. New York's CSE process requires parent membership on the committee. At the classroom level, inviting families to share cultural knowledge, attend learning events, volunteer, and weigh in on homework or curriculum concerns positions them as partners. Research generally finds that family engagement is positively associated with student outcomes across diverse populations, which makes building these partnerships a pedagogical priority, not merely a relational courtesy. Equitable engagement structures invite participation rather than assuming a single mode of involvement fits every family."
      },
      {
        "title": "Reinforcing In-School Learning at Home",
        "body": "Teachers strengthen learning by creating clear, actionable bridges between school instruction and the home environment. This includes communicating learning goals in accessible language, providing concrete strategies families can use (reading routines, math practice, vocabulary reinforcement), and being specific rather than generic (for example, 'practice these 10 sight words for 5 minutes each evening' rather than 'read more'). Homework and at-home activities must be designed with equity in mind: assuming all families have internet access, a quiet study space, or content expertise reproduces systemic disadvantage. IEP teams under IDEA may include home-based components or parent-implemented goals, and behavior intervention plans developed within a school's PBIS or MTSS framework often work best when families reinforce strategies consistently across settings. Within New York's RtI and broader multi-tiered systems of support, home reinforcement of core (Tier 1) and supplemental (Tier 2) skills can support, though it does not replace, the school's intervention. Teachers should provide differentiated resources such as visuals, short videos, and bilingual tip sheets, and invite feedback on whether strategies are feasible at home. This two-way communication builds genuine partnership and improves generalization of skills across settings."
      },
      {
        "title": "Families in School-Level Decision Making: Shared Decision Making and Title I",
        "body": "Competency 0005 asks teachers to make sure parents of all students, not only the most visible ones, are encouraged to take part in school-based decisions. New York builds this into regulation: under 8 NYCRR 100.11, every school district and BOCES must adopt a plan for the participation of parents and teachers, with administrators, in school-based planning and shared decision making. Parent representatives are selected by school-related parent organizations (and may not be district employees), the plan names the issues decided at the building level and how disputes are resolved, and it is reviewed every two years. In New York City, School Leadership Teams fill this role. In Title I schools, ESSA Section 1116 adds federal requirements: a written parent and family engagement policy developed jointly with parents, an annual meeting explaining the Title I program and parents' rights, a flexible number of meetings (for example, in the morning or evening), a school-parent compact describing how the school and families share responsibility for achievement, and information provided in a format and, to the extent practicable, a language parents understand. Districts receiving more than $500,000 in Title I funds must reserve at least 1 percent for family engagement and involve parents in deciding how it is spent. For individual students, parents are members of the CSE and the 504 team. Equity is the test: if the same small group of English-speaking, daytime-available parents fills every seat, the structure is not reaching all families. Teachers help by personally inviting underrepresented families, providing interpreters and translated materials by default, scheduling meetings at varied times or virtually, explaining how decisions are made and what input is wanted, and reporting back on how family input changed a decision."
      }
    ],
    "practice": [
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A middle school's fall family conference night draws 90% attendance from English-speaking households but under 20% from the school's Arabic- and Spanish-speaking families, even though interpreters were available on site. Follow-up calls reveal many families did not realize interpreters would be present and assumed they could not participate. What is the most effective systemic correction?",
        "a": [
          "Ask the bilingual parents who did attend to telephone the families who missed the event and summarize for them what was discussed with each of their child's teachers, in order to close the communication gap informally.",
          "Extend conference night by two hours so families who hesitate have more time to decide to attend.",
          "Announce interpreter availability in advance through translated notices, home-language phone calls and texts, and community messengers, and normalize the service as standard rather than by special request.",
          "Record the general session in English and post it to the school website for families who could not attend."
        ],
        "c": 2,
        "r": "The barrier was informational: families did not know language access existed. Proactive, translated, multi-channel advance communication, treating interpretation as a default service, directly removes it and fulfills the spirit of Title VI language-access obligations. More hours does not fix an information gap, relaying conference content through other parents raises accuracy and privacy concerns, and an English-only recording is inaccessible to the very families affected."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A high school special education teacher is preparing for a CSE meeting to review a student's IEP. The student's mother, who works two jobs, says she cannot attend during the school day and is hesitant to participate because she 'doesn't know enough about special education.' Which teacher action BEST reflects legally required and equity-responsive family engagement?",
        "a": [
          "Reschedule or offer an alternative format such as a video conference, connect her with a parent member or advocate, and affirm that her knowledge of her child is essential.",
          "Ask the school psychologist to make all IEP decisions on the parent's behalf given her stated uncertainty about special education.",
          "Inform the parent that IEP meetings have a fixed schedule mandated by IDEA and her attendance is required or the meeting cannot proceed.",
          "Proceed with the CSE meeting as scheduled to stay within compliance timelines, document the parent's absence, and mail her the revised IEP afterward with a full written explanation."
        ],
        "c": 0,
        "r": "IDEA (34 CFR 300.322) requires the district to take steps to ensure parent participation, including scheduling at a mutually agreed time and place and using alternatives such as video or telephone conferencing; connecting the mother with a parent member or advocate supports informed participation. The strongest distractor, proceeding as scheduled and mailing the IEP, fails because a CSE may meet without a parent only after documented, unsuccessful attempts to secure participation, and none have been made. IDEA sets no fixed meeting schedule, and the psychologist cannot make decisions on the parent's behalf."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A 2nd-grade teacher is developing a plan to reinforce reading fluency at home. Many students in her class have caregivers with varying literacy levels in English, and several families lack reliable internet access. Which approach BEST demonstrates equitable and effective home-school learning reinforcement?",
        "a": [
          "Send home an English leveled book each week with a note asking caregivers to read the book aloud to their child every night and sign a paper reading log to return each Friday.",
          "Provide printed take-home guides in families' home languages with simple oral and picture-based reading strategies that require no internet access or English literacy.",
          "Assign reading log homework and inform families that consistent completion is required for students to pass the marking period.",
          "Post video tutorial links on the class website and email them to all families each week."
        ],
        "c": 1,
        "r": "Equitable home reinforcement must be usable by every family: home-language guides with oral and picture-based strategies let caregivers support fluency without internet access or English literacy. The strongest distractor, the weekly leveled book and log, avoids the internet barrier but still depends on caregivers reading English aloud, which excludes the families the teacher is trying to reach. Video links exclude families without reliable internet, and tying a passing grade to log completion penalizes students for home circumstances."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "During a parent-teacher conference, the family of a 7th-grader expresses frustration that they were not informed about the student's declining grades until the conference. The teacher responds that she contacts families only when grades drop below 65, per department policy. Which reflection BEST indicates that this teacher needs to revise her communication practice?",
        "a": [
          "The teacher should have waited for the formal report card cycle so that all families received information at the same time.",
          "Department policies take precedence over individual teacher communication decisions, so the teacher acted within her professional authority.",
          "Effective family communication is proactive and ongoing, not crisis-driven; families should receive positive updates and early alerts that leave time for intervention.",
          "The teacher should begin sending weekly mass emails about grades to all families, ensuring no family can claim it was uninformed while keeping the communication workload manageable."
        ],
        "c": 2,
        "r": "Best practice is proactive, continuous communication that includes positive updates and early alerts, so families and teachers can intervene before a problem is entrenched. The strongest distractor, deferring to the department policy, fails because a 65-point threshold is a minimum, not a ceiling, and professional responsibility requires communication that actually serves the student. Waiting for report cards delays intervention further, and mass weekly emails are one-way and do not create the individualized early contact this family needed."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A teacher wants to build genuine two-way partnership with families rather than one-way reporting. Which practice best reflects that goal?",
        "a": [
          "Post grades and assignments to an online portal families can check whenever they wish.",
          "Schedule the standard two formal parent-teacher conferences over the course of the year and encourage families to arrive with a written list of questions, so that the limited meeting time is used as efficiently as possible.",
          "Send home a detailed weekly newsletter describing everything happening in class.",
          "Open the year by inviting families to share their goals, knowledge, and hopes for their child, and create ongoing channels for their input into classroom life."
        ],
        "c": 3,
        "r": "Two-way partnership means families contribute knowledge and shape decisions, not merely receive information; soliciting their goals and building ongoing input channels embodies that reciprocity. Newsletters, scheduled conferences, and portals are useful communication tools but are predominantly one-directional and, by themselves, keep families in a receiving role rather than a partnering one."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A parent arrives at a conference visibly guarded, mentioning that 'school never went well' for her when she was young. Which teacher stance best supports engagement?",
        "a": [
          "Recognize that prior negative schooling experiences can shape family participation, open with the child's strengths, listen for the parent's priorities, and frame the relationship as a partnership.",
          "Move quickly through the required data so the uncomfortable meeting ends sooner.",
          "Recommend the parent attend a workshop on how to support learning at home before the next meeting.",
          "Reassure the guarded parent right away that this school is nothing at all like the one she attended and that she should simply put those earlier negative experiences behind her and start fresh with the new team."
        ],
        "c": 0,
        "r": "Family engagement research links guarded participation to prior institutional experiences and distrust; an asset-based, listening stance that leads with the child's strengths and honors the parent's priorities builds the trust that enables partnership. Rushing the meeting confirms the parent's wariness, dismissing her history minimizes a real barrier, and prescribing a workshop reads as a deficit judgment rather than an invitation."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "At a well-attended curriculum night, a teacher notices that almost no fathers or male caregivers attend, though many are involved at home. The most constructive interpretation and response is to:",
        "a": [
          "Conclude from the attendance pattern that these particular students' fathers are largely uninvolved in their schooling, and concentrate the school's limited outreach efforts on the mothers who reliably do attend events.",
          "Add a separate 'fathers only' event later in the year to boost male attendance numbers.",
          "Leave the pattern alone, since attendance by one parent is sufficient for family engagement.",
          "Examine whether event timing, framing, or messaging unintentionally signals that school events are 'for mothers,' and adjust outreach and format to invite all caregivers explicitly."
        ],
        "c": 3,
        "r": "Participation patterns often reflect how events are timed, framed, and communicated rather than actual involvement; examining and adjusting those design factors to welcome all caregivers is the asset-based, structural response. Assuming fathers are uninvolved is a deficit inference contradicted by the home evidence, a segregated event treats a symptom without diagnosing the barrier, and ignoring the pattern forgoes a chance to broaden engagement."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A district is planning an IEP meeting for a family whose home language is Bengali. To ensure the parents can participate meaningfully, the district must:",
        "a": [
          "Hold the IEP meeting in English as scheduled and then summarize the outcome for the parents afterward in a brief follow-up phone call conducted with the help of a free automated translation application on a phone.",
          "Arrange a qualified interpreter for the meeting and provide translated notice and key documents, at no cost to the family, so the parents can participate meaningfully.",
          "Ask a bilingual older sibling to interpret the meeting to keep the setting familiar and comfortable.",
          "Provide an English copy of the draft IEP a week early so the family can translate it themselves."
        ],
        "c": 1,
        "r": "IDEA and Title VI require districts to take steps so limited-English-proficient parents can meaningfully participate in the IEP process, which includes a qualified interpreter and translated notices and documents at no cost. Expecting the family to self-translate the IEP, relying on a child interpreter for complex confidential decisions, and substituting an app-based after-the-fact summary all fail the meaningful-participation standard."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A teacher wants to make positive-contact calls home, not just problem calls. A colleague warns it will 'raise expectations she can't sustain.' The best rationale for making the positive calls is that proactive positive communication:",
        "a": [
          "Builds trust and a reservoir of goodwill that make later problem-solving conversations more productive, and signals that the teacher sees each child's strengths.",
          "Is mainly a public-relations tactic that improves the teacher's standing with administration.",
          "Matters only for students who are struggling, as a way to soften bad news when it comes.",
          "Should replace difficult conversations, since focusing on positives keeps families satisfied."
        ],
        "c": 0,
        "r": "Proactive positive communication builds relational trust and demonstrates that the teacher sees students' assets, which strengthens the partnership and makes future problem-solving more collaborative. It is not primarily image management, it complements rather than replaces necessary hard conversations, and its benefit extends to all families, not only those whose children are struggling."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A parent emails a teacher an accommodation idea for her child with a disability that is not in the IEP, asking the teacher to 'just start doing it.' What is the most appropriate response?",
        "a": [
          "Tell the parent that any request to change her child's accommodations must first be submitted in writing to the district superintendent's office before the teacher or the IEP team is able to take any action on it.",
          "Begin the accommodation right away, since honoring parent requests strengthens the partnership.",
          "Decline the idea, since only the CSE chair may propose changes to a student's supports.",
          "Thank the parent, note that changes to accommodations go through the IEP team, and offer to bring the idea to the team (or reconvene the CSE) while continuing to implement the current IEP."
        ],
        "c": 3,
        "r": "Accommodations are set by the IEP team, so the collaborative and legally sound path is to welcome the parent's input and route it through the team or a reconvened CSE while faithfully implementing the existing IEP in the meantime. Unilaterally adding a support bypasses the team process, flatly refusing shuts down a partner's contribution, and escalating to the superintendent misstates how IEP changes are actually made."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A school's shared decision-making team has three parent seats, filled for four straight years by the same PTA officers. Families who speak Spanish or Arabic make up 45 percent of enrollment, but none have ever served or attended. A teacher on the team is asked for a recommendation. Which recommendation BEST meets the school's obligation to encourage participation by parents of all students?",
        "a": [
          "Keep the current members, because experienced parents already understand the budget, and the regulation leaves the selection of parent members entirely to the principal.",
          "Post the meeting minutes in English on the school website and in the lobby so any family can follow the team's decisions and send in comments if they wish.",
          "Work with parent organizations to recruit underrepresented families personally, provide interpreters and translated materials, and vary meeting times or formats.",
          "Add a separate advisory group for multilingual families that meets once a year, so their views are collected without changing the membership of the decision-making team."
        ],
        "c": 2,
        "r": "Under 8 NYCRR 100.11, parent representatives on shared decision-making teams are selected by school-related parent organizations, and Competency 0005 asks teachers to ensure parents of all students are encouraged to participate. Personal outreach, language access by default, and flexible scheduling remove the barriers that keep these families out. The strongest distractor, a separate annual advisory group, collects opinions without giving those families a seat where decisions are made. Selection is not the principal's alone, and English-only minutes are one-way information, not participation."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A Title I elementary school's principal drafts the school-parent compact over the summer and plans to send it home in September for parents to sign. A teacher on the planning team raises a concern. Which concern BEST reflects ESSA Section 1116?",
        "a": [
          "The compact must be developed jointly with parents and should describe how the school and families share responsibility for achievement, not just parent duties.",
          "The compact must be signed by every parent before the school can receive its Title I allocation, so waiting until September is too late to begin collecting signatures.",
          "The compact should be replaced by the district code of conduct, which already describes family responsibilities and therefore satisfies the Title I engagement rule.",
          "The compact should go only to families of students below grade level, because Title I family engagement requirements apply only to the students the program serves."
        ],
        "c": 0,
        "r": "ESSA Section 1116 requires each Title I school to develop, jointly with parents, a school-parent compact that outlines how parents, staff, and students share responsibility for improved achievement, along with a jointly developed written engagement policy and an annual meeting. The strongest distractor, signatures as a funding condition, is false: the statute requires joint development, not universal signatures. A code of conduct serves a different purpose, and limiting the compact to families of struggling students conflicts with its purpose of shared responsibility across the program."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A teacher is preparing for a conference with the father of a 5th grader whose writing has declined. The father works nights, has said he felt 'talked down to' at a previous school meeting, and has asked for a phone call instead of coming in. Which plan BEST facilitates a productive conference?",
        "a": [
          "Insist on an in-person meeting during the school day so the full team can attend, because a phone call signals to the family that the concern is not serious.",
          "Schedule a call at a time he chooses, open with the student's strengths and a work sample sent ahead, ask for his observations, and agree on next steps together.",
          "Email a detailed report with scores, rubric criteria, and recommended interventions, then ask him to reply with any questions, which respects his limited time.",
          "Invite the principal and counselor to join the call so the father hears one unified position from the school and understands how serious the decline has become."
        ],
        "c": 1,
        "r": "Responsiveness to the parent's schedule and preferred channel, a strengths-first opening, shared evidence, and genuine two-way dialogue all facilitate communication, especially for a parent who has felt disrespected before. The strongest distractor, the detailed email, saves time but is one-way and technical, the opposite of the reciprocal conference he needs. Insisting on in-person attendance ignores an accessibility barrier, and filling the call with administrators can recreate the power imbalance he described."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A 7th-grade math teacher wants families to reinforce a new unit on proportional reasoning at home. Many parents have told her they 'were never good at math' and that the methods look different from how they learned. Which approach BEST helps families support the learning?",
        "a": [
          "Assign longer nightly problem sets so students get more practice, and ask parents to check that every problem was attempted before signing the page.",
          "Ask parents to teach the method they learned in school, because any correct method reinforces the content and different approaches build flexibility.",
          "Advise families to leave math homework entirely to the student, because parents who are unsure of current methods may end up confusing their children.",
          "Send a short guide with a worked example and everyday uses, such as recipes and unit prices, plus questions parents can ask without solving problems."
        ],
        "c": 3,
        "r": "Effective home reinforcement gives families a concrete, low-barrier role: a worked example, real-world connections, and conversation prompts let parents support reasoning without having to reteach the content. The strongest distractor, telling parents to teach their own method, sounds empowering but can conflict with classroom instruction and puts parents who already lack confidence in the teacher's role. Longer problem sets add burden without building understanding, and excluding parents abandons the partnership."
      },
      {
        "s": "C4",
        "d": "School-Home Relationships & Family Engagement",
        "q": "Before the school year starts, a kindergarten teacher wants to learn about her incoming students from their families, several of whom speak Mandarin, Urdu, or Spanish. Which strategy BEST invites families to share information that will enhance their children's learning?",
        "a": [
          "Ask each child on the first day to tell the class about their family and what language they speak at home, and record what the children say for her files.",
          "Send an English questionnaire asking families to list any problems the teacher should know about, with a request to return it by the first day of school so she is prepared.",
          "Offer short welcome conversations with interpreters, or a translated survey, about the child's interests, strengths, routines, and family hopes for the year.",
          "Wait until the first parent-teacher conference in November, when families will know the teacher well enough to share personal information comfortably and in depth."
        ],
        "c": 2,
        "r": "Families share more when invited early, in their language, and asked about strengths and goals rather than problems; interpreted conversations or translated surveys meet the communication need and treat families as experts on their children. The strongest distractor, the English questionnaire, is early but excludes families who do not read English and frames the request around deficits. Relying on five-year-olds for family information is inaccurate and puts the child in an adult role, and waiting until November loses months of useful knowledge."
      }
    ]
  }
};

const CR_PROMPTS = [
  {
    "id": "cr-diverse",
    "title": "Diverse Student Populations · Case Study",
    "scenario": "Ms. Okafor teaches a Grade 4 inclusive general-education classroom of 24 students at Roosevelt Elementary, a Title I school in a mid-sized urban district. The class reflects a wide range of backgrounds: seven students are English Language Learners (ELLs) at varying points on New York State's five-level Part 154 proficiency scale, as determined by the NYSITELL or the state's annual English language proficiency test (two Entering, three Emerging, two Transitioning), three students have IEPs for learning disabilities, and several students are from low-income households with limited access to print-rich home environments. The majority of students speak Spanish as a home language; two students recently arrived from West Africa and speak Twi as their first language.\n\nThe class is currently in a unit on informational reading and expository writing. Exhibit A shows Ms. Okafor's anecdotal journal noting that her two Entering-level ELL students, Marco and Amara, rarely participate in whole-class discussions and scored below 60% on the most recent close-reading comprehension check. Exhibit B presents a draft two-day lesson plan that relies heavily on whole-class read-aloud of an on-grade-level text followed by an independent written response with no scaffolds, modified texts, or visual supports provided. Academic vocabulary is introduced verbally but never posted or illustrated. Ms. Okafor's journal further notes that Marco and Amara frequently look to peers for cues before attempting tasks and have not yet submitted two writing assignments.",
    "task": "Using the information provided in the exhibits, write a response in which you:\n\n1. IDENTIFY one significant issue related to student diversity, evident in the exhibits, that is affecting the learning of one or more students in Ms. Okafor's classroom;\n\n2. DESCRIBE one specific, research- or evidence-based instructional strategy or modification that Ms. Okafor could implement to address the identified issue; and\n\n3. EXPLAIN why the strategy you described would be effective in addressing the identified issue and supporting the academic growth of the student(s) involved.\n\nYour response will be evaluated on the degree to which it accurately analyzes the exhibits, applies sound pedagogical principles, and supports its claims with specific evidence from the provided materials. The suggested response length is approximately 150 to 200 words.",
    "rubric": [
      {
        "criterion": "Content: addresses all parts of the assignment (identify, describe, explain)",
        "high": "The response fully and clearly addresses all three directives: it identifies a specific diversity-related issue affecting a named student or group, describes a concrete and named instructional strategy or modification, and provides a substantive explanation of why the strategy would be effective. No part of the prompt is omitted or merely implied.",
        "mid": "The response addresses all three directives but one is underdeveloped: for example, the strategy is named but not meaningfully described, or the explanation restates the strategy rather than justifying its effectiveness. The response is generally on-task but incomplete in at least one area.",
        "low": "The response addresses fewer than three directives, or one directive is missing entirely. The issue, strategy, or explanation may be absent, off-topic, or so vague as to provide no actionable instructional information."
      },
      {
        "criterion": "Analysis, Synthesis, and Application of Pedagogical Principles: accurate analysis of the exhibits and accurate application of pedagogical principles",
        "high": "The response demonstrates accurate and insightful analysis of the exhibits, correctly synthesizing evidence across more than one exhibit (for example, connecting the journal data to the lesson-plan gaps). The identified strategy is grounded in sound, recognized pedagogical principles for the relevant diversity domain (linguistic, cultural, readiness, or socioeconomic) and is appropriately applied to the Grade 4 inclusive context.",
        "mid": "The response shows adequate but surface-level analysis of the exhibits. The strategy selected is generally appropriate but may reflect a partial or generic understanding of the relevant pedagogical principles. Connections between exhibits are implicit rather than explicit, or the application to the specific classroom context is underdeveloped.",
        "low": "The response shows little or inaccurate analysis of the exhibits. The strategy selected is inappropriate, misapplied, or not grounded in recognized pedagogical principles. The response may rely on general claims without connecting them to the specific diversity issue or classroom context described in the exhibits."
      },
      {
        "criterion": "Command of Evidence: supported by specific facts, details, or examples from the exhibits",
        "high": "The response consistently cites specific, accurate details from the exhibits (naming students, referencing proficiency levels, paraphrasing exhibit data, or pointing to concrete lesson-plan features) to support every major claim. Evidence is integrated naturally and used to build the argument rather than listed incidentally.",
        "mid": "The response references the exhibits but relies on general or paraphrased information rather than specific details. At least one major claim is supported by exhibit evidence, but other claims rest on assertion alone. The connection between evidence and argument is sometimes unclear.",
        "low": "The response makes little or no reference to the exhibits, or its references are inaccurate. Claims are largely unsupported or supported only by general knowledge unconnected to the provided materials."
      }
    ],
    "exemplar": "The exhibits reveal a significant linguistic diversity issue. Exhibit A identifies Marco and Amara as Entering-level ELLs who scored below 60% on the close-reading comprehension check and have not submitted two writing assignments. Exhibit B shows that the lesson plan provides no visual supports, no scaffolded or modified texts, and introduces academic vocabulary only through verbal explanation. These conditions are particularly inaccessible for students at the Entering proficiency level.\n\nTo address this, Ms. Okafor should implement frontloading with visual vocabulary supports. Before reading, she should pre-teach the four to six key academic vocabulary terms using illustrated word walls, bilingual glossaries, and realia or photographs tied to the text's content.\n\nThis strategy is effective because Entering-level ELLs, like Marco and Amara, lack the receptive English vocabulary needed to access on-grade-level informational text through oral instruction alone. Research on sheltered instruction (Echevarria et al., 2017) shows that pre-teaching vocabulary with visual anchors lowers the language barrier without reducing content rigor, directly addressing the comprehension gap documented in Exhibit A and the missing scaffold identified in Exhibit B."
  },
  {
    "id": "cr-ell",
    "title": "English Language Learners · Case Study",
    "scenario": "Ms. Carter's seventh-grade Earth Science class includes 24 students with varied academic backgrounds. The class is currently studying plate tectonics and related geological processes. Most students read at or near grade level, though several receive reading support services. One student, Marisol, is a 13-year-old who emigrated from the Dominican Republic two years ago and scored at the Transitioning level, an intermediate stage of English proficiency, on New York's most recent annual English language proficiency assessment. Her language data indicate solid social conversational fluency but significant gaps in academic language, particularly in science content vocabulary and expository text comprehension. Marisol participates willingly in small-group discussions and demonstrates strong conceptual understanding when content is delivered visually or through hands-on tasks.\n\nExhibit 1: Teacher Journal (Week 3). \"Marisol struggled with today's textbook chapter on tectonic boundaries. She could label the diagram correctly but could not answer the two short-answer questions that required her to explain cause-and-effect relationships in writing. During the exit ticket she wrote: 'The plates move and then the mountain.' She consistently uses subject-verb-object sentence frames but does not yet produce the subordinate clauses or signal language ('as a result,' 'because of,' 'which causes') needed to express scientific reasoning.\"\n\nExhibit 2: Draft Lesson Plan (Day 4). Objective: Students will explain how convergent plate boundaries produce mountain ranges, using a minimum of three content-vocabulary terms (convergent, subduction, compression). Planned activities include a 15-minute textbook reading, a whole-class discussion, and a written paragraph response. No scaffolds, sentence frames, or vocabulary supports are currently included in the plan.",
    "task": "Using the exhibits provided, write a response in which you: (1) IDENTIFY a specific language or learning need of the English language learner described in the exhibits; (2) DESCRIBE one specific research- or evidence-based instructional strategy or modification that Ms. Carter could use to address that need in the Day 4 lesson; (3) EXPLAIN why that strategy would be effective for this student, drawing on information from the exhibits. Your response should be approximately 150-200 words.",
    "rubric": [
      {
        "criterion": "Content",
        "high": "The response fully accomplishes every part of the assignment: it identifies one specific language or learning need, describes one research-based instructional strategy or modification for the Day 4 lesson in enough detail that another teacher could implement it, and explains why that strategy would be effective for this student. No part is omitted or treated only superficially.",
        "mid": "The response addresses all three parts, but at least one part is underdeveloped, vague, or only partially addressed, for example the strategy is named but not concretely described, or the explanation of effectiveness is present but generic.",
        "low": "The response addresses only one or two parts of the assignment, or all three parts are so vague or brief that the response fails to demonstrate adequate understanding of the task."
      },
      {
        "criterion": "Analysis, Synthesis, and Application of Pedagogical Principles",
        "high": "The response demonstrates accurate knowledge of second-language acquisition and ELL pedagogy and applies it correctly to this student: it correctly interprets the exhibits, identifies a need the data actually support (the BICS-CALP gap in producing academic cause-and-effect language), and proposes a strategy that is appropriate for the student's proficiency level and the content demand. Connections among the need, the strategy, and the pedagogical rationale are explicit and well reasoned.",
        "mid": "The response is generally accurate but shows minor errors or imprecision: the need may be framed vaguely (for example, 'she struggles with writing') without naming the academic-language gap, an exhibit may be slightly misread, or the strategy may be appropriate but loosely matched to the identified need.",
        "low": "The response contains significant inaccuracies: it misreads the exhibits, identifies a need the evidence contradicts (for example, a comprehension deficit or a suspected disability when conceptual understanding is documented), or recommends a strategy that is inappropriate, unsupported, or mismatched to the student's need."
      },
      {
        "criterion": "Command of Evidence",
        "high": "Claims are grounded in specific, correctly cited details from the exhibits (for example, Marisol's exit-ticket sentence, her accurate diagram labeling, the missing signal language noted in the journal, or the absence of scaffolds in the Day 4 plan), and the evidence is explicitly connected to each claim rather than merely listed.",
        "mid": "The response references the exhibits in a general way (for example, 'the journal shows she struggles with writing') but does not quote, paraphrase, or cite specific details precisely enough to fully support the claims made.",
        "low": "The response relies on general statements about ELLs or science instruction without citing specific evidence from the exhibits, or the evidence cited is inaccurate or irrelevant."
      }
    ],
    "exemplar": "Exhibit 1 reveals that Marisol's core language need is producing academic cause-and-effect language in writing. Although she labeled the tectonic diagram correctly, demonstrating conceptual grasp, her exit ticket (\"The plates move and then the mountain\") lacks the subordinating conjunctions and signal words (e.g., \"as a result,\" \"which causes\") required to express scientific reasoning at grade level. This gap is compounded by Exhibit 2: the Day 4 lesson plan includes no scaffolds or language supports despite requiring a written paragraph that uses three technical vocabulary terms.\n\nMs. Carter should embed sentence frames and a word bank directly into the written task, for example: \"When two convergent plates collide, __________ occurs because __________.\" This strategy, grounded in the Sheltered Instruction Observation Protocol (SIOP; Echevarria, Vogt, & Short) and Cummins' distinction between conversational fluency (BICS) and cognitive academic language proficiency (CALP), reduces the linguistic processing load while preserving cognitive rigor. Because Marisol already understands the concept (evidenced by accurate diagram labeling), the frames scaffold her output rather than her comprehension, allowing her to demonstrate knowledge she already possesses while building the academic-language structures the journal shows she still lacks."
  },
  {
    "id": "cr-swd",
    "title": "Students with Disabilities · Case Study",
    "scenario": "Ms. Alvarez teaches a second-grade inclusive classroom of 22 students at an urban elementary school. The class includes students who are English language learners, students reading below grade level, and one student, Marco, who has a specific learning disability in the area of reading (dyslexia) and receives special education services under an IEP. Marco's IEP specifies text-to-speech support for independent reading assignments, extended time (1.5x) on written tasks, and graphic organizers provided in advance of note-taking tasks. His IEP also notes significant difficulties with phonological processing, decoding multisyllabic words, and reading fluency, even though he demonstrates strong oral comprehension and above-average listening vocabulary when content is read aloud to him.\n\nThe class is currently in a science unit on animal habitats. Ms. Alvarez has reviewed Marco's IEP prior to the unit and has noted his accommodations, but she is now designing a new lesson and is uncertain how to fully incorporate those supports. The following exhibits are provided: a student profile summary drawn from Marco's IEP present levels, an excerpt from Ms. Alvarez's teacher journal written after observing Marco during the previous lesson, and a draft lesson plan for the upcoming 45-minute lesson on rainforest habitats.\n\n---\n\n**Exhibit 1: Student Profile (from IEP Present Levels of Academic Achievement)**\nMarco, age 7, is a second-grade student identified with a specific learning disability in reading. On the most recent diagnostic assessment, Marco scored at the 8th percentile in phonological awareness and at the 12th percentile in decoding. His oral reading fluency rate is 28 words correct per minute (wcpm), compared to a second-grade benchmark of 90 wcpm. Despite these decoding challenges, Marco's listening comprehension score fell in the average range (42nd percentile), and his science and social studies vocabulary, as measured by teacher-administered oral assessment, is at or above grade level. Marco is highly motivated by visual materials, hands-on activities, and class discussions. He participates actively during whole-group instruction when content is presented orally. His IEP mandates: (1) text-to-speech access for all independent reading tasks; (2) extended time (1.5x) for written responses; and (3) graphic organizers provided in advance of note-taking tasks.\n\n---\n\n**Exhibit 2: Teacher Journal (Ms. Alvarez, written after Lesson 3 of the unit)**\nToday we read a two-page article on forest habitats from the science workbook. I asked students to read independently and then answer three written comprehension questions. Marco struggled from the start. He spent most of the reading time staring at the page and completed only the first sentence before time was up. When I sat with him and read the passage aloud, he immediately answered all three comprehension questions correctly and added details I had not even asked about. It is clear he knows this content; he just cannot access it through print on his own. I also noticed he seemed frustrated and put his head down twice during independent reading. I want to make sure the next lesson gives him a real way in.\n\n---\n\n**Exhibit 3: Draft Lesson Plan (Rainforest Habitats, 45 minutes)**\nObjective: Students will identify three characteristics of rainforest habitats and explain how animals adapt to them.\nMaterials: Printed two-page informational text (\"Life in the Rainforest\"), science journals, pencils.\nProcedure:\n1. (5 min) Teacher introduces the rainforest using a photo slideshow and a brief oral explanation.\n2. (20 min) Students read the informational text independently and use their science journals to write down three habitat characteristics they find in the text.\n3. (10 min) Whole-group discussion: students share what they recorded.\n4. (10 min) Students independently write a three-sentence response to the prompt: \"Choose one rainforest animal. Explain how it is adapted to its habitat.\"",
    "task": "Using the information provided in the exhibits, write a response in which you:\n1. IDENTIFY one specific aspect of the draft lesson plan (Exhibit 3) that would be a barrier to Marco's full and meaningful participation in the lesson;\n2. DESCRIBE one specific research- or evidence-based strategy or modification the teacher could implement to address that barrier; and\n3. EXPLAIN why that strategy would be effective for this particular student, drawing on evidence from the exhibits.\n\nYour response should be approximately 150 to 200 words.",
    "rubric": [
      {
        "criterion": "Content: the extent to which the response meets the requirements of the assignment",
        "high": "The response fully and explicitly addresses all three parts of the directive: it clearly identifies a specific barrier in the draft lesson plan, describes a concrete research- or evidence-based strategy or modification, and explains why that strategy would be effective for Marco. No required part is omitted or treated superficially.",
        "mid": "The response addresses all three parts, but one part is underdeveloped, vague, or only partially completed (for example, the explanation is present but not tied specifically to Marco's documented needs).",
        "low": "The response addresses fewer than three parts of the directive, omits a required element entirely, or conflates two parts (for example, it describes the barrier and the strategy but never explains effectiveness)."
      },
      {
        "criterion": "Analysis, Synthesis and Application of Pedagogical Principles: the extent to which the response demonstrates understanding of and engagement with the provided exhibits",
        "high": "The response demonstrates accurate analysis of the lesson plan as it relates to Marco's identified needs, correctly synthesizes information across multiple exhibits (for example, connecting the IEP accommodations in Exhibit 1 to the behavior observed in Exhibit 2 and the design of Exhibit 3), and applies a research- or evidence-based strategy accurately and appropriately to the context.",
        "mid": "The response shows adequate but somewhat surface-level analysis, draws on at least one exhibit accurately but misses an opportunity to synthesize across exhibits, and applies a recognizable strategy, though the connection to pedagogical principles is general rather than specific.",
        "low": "The response reflects inaccurate analysis of the exhibits or of Marco's needs, applies a strategy that is not research- or evidence-based or that does not match the identified barrier, or shows little meaningful engagement with the exhibits."
      },
      {
        "criterion": "Command of Evidence: the extent to which the response presents relevant support",
        "high": "The response cites specific, accurate evidence from two or more exhibits (for example, Marco's 28 wcpm fluency rate and 8th-percentile phonological awareness, the text-to-speech and graphic-organizer accommodations, or Ms. Alvarez's journal observation that Marco answered every question correctly once the passage was read aloud) to support each part of the directive. The evidence is accurate and directly relevant.",
        "mid": "The response references at least one exhibit with some specificity, but supporting details are limited, loosely paraphrased, or drawn from only one exhibit. The argument is recognizable but would be stronger with broader grounding in the exhibits.",
        "low": "The response makes little or no reference to specific exhibit evidence, relies on general claims about students with disabilities, or attributes information inaccurately to the exhibits."
      }
    ],
    "exemplar": "The most significant barrier in the draft lesson plan (Exhibit 3) is the 20-minute independent reading task in Step 2. As documented in Exhibit 1, Marco reads at only 28 wcpm against a second-grade benchmark of 90 wcpm and scores at the 8th percentile in phonological awareness, so he cannot independently decode the informational text well enough to extract the habitat characteristics the task requires. Ms. Alvarez's journal (Exhibit 2) confirms this directly: Marco completed only the first sentence before time expired, then answered all three comprehension questions correctly the moment the passage was read aloud to him.\n\nTo address this barrier, Ms. Alvarez should activate Marco's text-to-speech software and provide the graphic organizer his IEP already mandates (Exhibit 1), preloaded with sentence starters, for the science journal task.\n\nThis strategy is effective because it removes the print-access barrier without lowering the cognitive demand of the lesson. Universal Design for Learning calls for multiple means of representation, and because Marco's listening comprehension is in the average range (Exhibit 1), he can fully engage with grade-level science content once the text is rendered auditorily rather than through independent decoding."
  },
  {
    "id": "cr-teacher",
    "title": "Teacher Responsibilities & School-Home Relationships · Case Study (Optional Practice)",
    "scenario": "Mr. Delacroix teaches 6th grade at Lincoln Middle School. One of his students, Jordan, has a Section 504 plan for ADHD that specifies extended time on tests, a quiet testing location, and access to a copy of the teacher's notes. The following exhibits are provided.\n\nExhibit A: Excerpt from Mr. Delacroix's grade-team email thread. A colleague writes, \"Can you just forward me Jordan's 504 and his last progress report? His mom is friends with a parent in my class who asked about him.\" Mr. Delacroix has not yet replied.\n\nExhibit B: Mr. Delacroix's testing log for the last unit exam. It shows that Jordan took the exam in the general classroom with the rest of the class and finished in the standard 40 minutes. A margin note in Mr. Delacroix's handwriting reads: \"Ran out of coverage for the quiet room. Had him stay. He seemed fine.\"\n\nExhibit C: A voicemail transcript from Jordan's mother, left in the home language of the family (Haitian Creole) and auto-translated by the school's phone system: \"Hello, I am calling again about the meeting. I got the English letter but I did not understand all of it. Please, is there someone who can explain in Creole? I want to help Jordan but I do not know what the school needs from me.\"",
    "task": "Optional practice: the EAS exam has no constructed-response assignment for Competencies 0004 and 0005 (they are tested only with selected-response items). This case uses the exam's exhibit-based format to practice the same reasoning.\n\nUsing the information provided in the exhibits, write a response in which you:\n\n1. IDENTIFY one significant issue related to the teacher's professional, legal, or ethical responsibilities, or to effective school-home communication, that is evident in the exhibits;\n\n2. DESCRIBE one specific, appropriate action Mr. Delacroix should take to address the identified issue in a manner consistent with law and professional practice; and\n\n3. EXPLAIN why that action is appropriate, drawing on the relevant legal or professional principle and on evidence from the exhibits.\n\nYour response should be approximately 150 to 200 words.",
    "rubric": [
      {
        "criterion": "Content: addresses all parts of the assignment (identify, describe, explain)",
        "high": "The response fully addresses all three directives: it identifies a specific responsibility or communication issue grounded in the exhibits, describes a concrete and appropriate action, and explains why the action is correct. No part of the prompt is omitted or merely implied.",
        "mid": "The response addresses all three directives but one is underdeveloped, for example the action is named but not described in implementable detail, or the explanation restates the action rather than justifying it with a legal or professional principle.",
        "low": "The response addresses fewer than three directives, or one directive is missing entirely; the issue, action, or explanation may be absent, off-topic, or too vague to be actionable."
      },
      {
        "criterion": "Analysis, Synthesis, and Application of Professional Principles",
        "high": "The response accurately analyzes the exhibits and applies the correct principle (for example, FERPA-protected records and legitimate educational interest in Exhibit A, the duty to implement a 504 accommodation as written in Exhibit B, or the Title VI obligation to communicate with limited-English-proficient families in a language they understand in Exhibit C) appropriately to the middle-school context.",
        "mid": "The response shows adequate but surface-level analysis; the action is generally appropriate but reflects a partial understanding of the governing principle, or the connection between exhibits and principle is implicit rather than explicit.",
        "low": "The response reflects inaccurate analysis, applies the wrong principle, or proposes an action that is not consistent with law or professional practice."
      },
      {
        "criterion": "Command of Evidence: supported by specific facts from the exhibits",
        "high": "The response cites specific, accurate details from the exhibits (the colleague's records request, the missed quiet-room accommodation and standard finishing time, or the mother's untranslated letter and request for Creole) to support each major claim, integrating the evidence into the argument.",
        "mid": "The response references the exhibits but relies on general or paraphrased information; at least one major claim is supported by exhibit evidence while others rest on assertion.",
        "low": "The response makes little or no reference to the exhibits, or its references are inaccurate; claims are largely unsupported."
      }
    ],
    "exemplar": "A significant issue appears in Exhibit B: Mr. Delacroix did not implement Jordan's Section 504 accommodations. His testing log shows Jordan took the unit exam in the general classroom and finished in the standard 40 minutes, and his margin note (\"Ran out of coverage for the quiet room. Had him stay.\") confirms that both the quiet location and the extended time were withheld.\n\nMr. Delacroix should notify the building's 504 coordinator and an administrator, offer Jordan a retake of the exam with every accommodation in place, and explain what happened to Jordan's mother with a Haitian Creole interpreter. Going forward, he should arrange the quiet space and extended time with administration before each test and document that the plan was followed.\n\nThis action is appropriate because a Section 504 plan obligates the school to provide the listed accommodations; failing to do so can be disability discrimination and a denial of the free appropriate public education Section 504 guarantees. A staffing shortage, the reason recorded in the exhibit, does not excuse non-implementation, and a score earned without accommodations does not show what Jordan knows. The retake corrects the harm, and planning ahead prevents a repeat."
  }
];

// ENGINE · Generic. Below this divider should be portable verbatim
// across exam apps. References SUBTESTS / WELCOME / PRETEST / POSTTEST /
// MODULES / CR_PROMPTS from the EXAM CONTENT block above.
// ═══════════════════════════════════════════════════════════════

const calcScores = (questions, answers) => {
  const domainData = {};
  questions.forEach((q, i) => {
    if (!domainData[q.d]) domainData[q.d] = { subtest:q.s, correct:0, total:0 };
    domainData[q.d].total++;
    if (answers[i] === q.c) domainData[q.d].correct++;
  });
  const subtestData = {};
  Object.entries(domainData).forEach(([d, data]) => {
    if (!subtestData[data.subtest]) subtestData[data.subtest] = { correct:0, total:0 };
    subtestData[data.subtest].correct += data.correct;
    subtestData[data.subtest].total += data.total;
  });
  return { domains: domainData, subtests: subtestData };
};

const pct = (c, t) => t === 0 ? 0 : Math.round((c / t) * 100);

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuizPool = () => {
  const pool = {};
  PRETEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  POSTTEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  Object.entries(MODULES).forEach(([d, mod]) => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    (mod.practice || []).forEach(p => { (pool[d] = pool[d] || []).push({ ...p, s: subtest, d }); });
  });
  return pool;
};

// Full-length timed mock exam config. The real EAS 201 is 40 selected-response
// + 3 constructed-response in 2h15m. SR items are drawn framework-weighted from
// the module PRACTICE pool only (never the pretest/posttest banks), so a mock
// form never collides with the diagnostic or final exam.
const MOCK_SR_COUNT = 40;
const MOCK_CR_IDS = ['cr-diverse', 'cr-ell', 'cr-swd']; // mirrors the real 3-CR sitting (one per C1/C2/C3)
const MOCK_TIME_SECONDS = 2 * 3600 + 15 * 60; // 8100s = 2h15m
const MOCK_WEIGHTS = { C1: 10, C2: 10, C3: 11, C4: 9 }; // sums to 40: I-III are 18% SR each (~10.3 items), IV+V are 16% SR (~9.1)
const buildMockSR = () => {
  const bySub = {};
  Object.entries(MODULES).forEach(([d, mod]) => {
    (mod.practice || []).forEach(p => {
      const s = p.s || (PRETEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
      (bySub[s] = bySub[s] || []).push({ ...p, s, d });
    });
  });
  let out = [];
  Object.entries(MOCK_WEIGHTS).forEach(([s, n]) => {
    out = out.concat(shuffle(bySub[s] || []).slice(0, n));
  });
  // top up if any competency pool was short, then trim to exactly MOCK_SR_COUNT
  if (out.length < MOCK_SR_COUNT) {
    const used = new Set(out.map(q => q.q));
    const extra = shuffle(Object.values(bySub).flat().filter(q => !used.has(q.q)));
    out = out.concat(extra.slice(0, MOCK_SR_COUNT - out.length));
  }
  return shuffle(out).slice(0, MOCK_SR_COUNT);
};

const INITIAL_STATE = {
  phase:'welcome', qIndex:0, answers:{}, pretestScores:null, theme:'light',
  completedModules:[], activeModule:null, modPhase:'content', modPQIndex:0, modPAnswers:{},
  conceptProgress:{}, moduleScores:{}, quizHistory:[], crScored:{},
  postAnswers:{}, postScores:null,
  fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[],
  quizDomain:null, quizLen:10, quizQs:null, quizIdx:0, quizAnswers:{},
  crPromptId: (typeof CR_PROMPTS !== 'undefined' && CR_PROMPTS.length > 0) ? CR_PROMPTS[0].id : null, crView:'prompt', crSelfScore:{}, crSubmitted:{},
  // pass-rate + error-analysis layer
  attempts:[], answerLog:[], missBank:{}, errorBankSeeded:false, reviewQs:null,
  // timed mock exam
  mockPhase:null, mockQs:null, mockIdx:0, mockAnswers:{}, mockDeadline:null, mockScores:null, mockCRIdx:0,
};


// ─── PRIMITIVES ────────────────────────────────────────────
const Cap = ({ children, color = T.muted, mb = 0 }) => (
  <div style={{ ...baseStyles.capSm, color, marginBottom: mb }}>{children}</div>
);
const Pill = ({ children, color = T.orange2, bg }) => (
  <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color, background: bg || 'var(--accent-bg)', padding: '3px 11px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.06em', display: 'inline-block', whiteSpace: 'nowrap' }}>{children}</span>
);
const Rule = ({ thick = 1, color = T.hairline, my = 0 }) => (
  <div style={{ height: thick, background: color, marginTop: my, marginBottom: my }} />
);
const Card = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{ background: T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid ${T.hairline}`, borderRadius: 18, padding: 24, boxShadow: T.shadow, ...style }}>{children}</div>
);
const ProgressRow = ({ value, label, color = T.orange }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: T.sans, fontSize: 13 }}>
      <span style={{ color: T.muted }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontFeatureSettings: "'tnum' 1" }}>{value}%</span>
    </div>
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={typeof label === 'string' ? label : undefined}
      style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);
const Btn = ({ children, onClick, variant = 'primary', disabled = false, style = {} }) => {
  const base = { padding: '13px 26px', fontFamily: T.sans, fontSize: 14, fontWeight: 700, letterSpacing: 0, textTransform: 'none', border: 'none', borderRadius: 99, cursor: disabled ? 'default' : 'pointer', transition: 'transform .2s, box-shadow .2s, filter .2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' };
  const variants = {
    primary: { background: disabled ? T.muted : 'var(--text)', color: 'var(--bg)', boxShadow: disabled ? 'none' : '0 4px 18px rgba(23,20,8,.18)' },
    ghost: { background: 'transparent', color: T.ink, border: `1.5px solid ${T.hairline}` },
    accent: { background: disabled ? T.muted : 'var(--gold)', color: 'var(--gold-ink)', boxShadow: disabled ? 'none' : '0 4px 18px rgba(168,127,16,.28)' },
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} className={disabled ? '' : 'btn-cta'} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};
const Page = ({ children, narrow = false }) => (
  <div style={{ maxWidth: narrow ? 880 : 1120, margin: '0 auto', padding: '32px clamp(16px, 5vw, 40px) 96px', position: 'relative', zIndex: 1 }}>{children}</div>
);

// Arrow-key focus movement for role="radiogroup" option lists (roving tabindex).
const radioGroupKeys = (e) => {
  if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll('[role="radio"]:not(:disabled)'));
  if (radios.length === 0) return;
  const idx = radios.indexOf(document.activeElement);
  const delta = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
  radios[(Math.max(idx, 0) + delta + radios.length) % radios.length].focus();
  e.preventDefault();
};

// Media queries can't live in inline styles — the few responsive layout
// rules go in this one global stylesheet instead.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&display=swap');
    /* "Blue Hour" theme, OneLove brand system (locked 2026-08-12, ported
       from the BCBA app). Black is the ground, gold is the single accent,
       green and red carry meaning only (passed / needs work). Day = cream
       under a golden dawn; Night = warm black deepening into forest green.
       The EAS engine's var names (--accent, --surface-2, --berry, --sage)
       are kept as aliases into the brand family. */
    :root {
      --bg-base:#f5f1e4; --bg:var(--bg-base);
      --gold:#a87f10; --gold-2:#c49a2a; --gold-bg:#f0e5c2; --gold-ink:#fff8e8;
      --green-brand:#2e7d46; --green-deep:#1f5c33; --green-brand-bg:#ddeade;
      --red-brand:#b03a26; --red-brand-bg:#f2ddd6;
      --olive:#7d774a; --olive-bg:#e9e6d0;
      --sky0:#dfe4d2; --sky1:#f5efdc; --sky2:#f2ddb0;
      --ridge-1:#b8c4a8; --ridge-2:#9aab8c;
      --glow:rgba(168,127,16,0.28); --star:transparent;
      --surface:rgba(253,251,242,0.82); --surface-2:rgba(253,251,242,0.55); --surface-solid:#fdfbf2;
      --text:#171408; --muted:#5c5340; --border:rgba(23,20,8,0.15);
      --accent:var(--gold); --accent-2:var(--gold); --accent-bg:var(--gold-bg); --accent-border:rgba(168,127,16,0.45);
      --green:var(--green-brand); --green-bg:var(--green-brand-bg); --green-border:rgba(46,125,70,0.45);
      --red:var(--red-brand); --red-bg:var(--red-brand-bg); --red-border:rgba(176,58,38,0.45);
      --berry:var(--green-deep); --sage:var(--green-brand);
      --on-fill:#fdfbf2;
      --shadow:0 4px 24px rgba(23,20,8,0.08);
    }
    :root[data-theme="dark"] {
      --bg-base:#121108;
      --gold:#e0a92e; --gold-2:#c9962a; --gold-bg:rgba(224,169,46,0.14); --gold-ink:#241a04;
      --green-brand:#67a878; --green-deep:#4f8f63; --green-brand-bg:rgba(103,168,120,0.14);
      --red-brand:#d05a40; --red-brand-bg:rgba(208,90,64,0.14);
      --olive:#b0ab7a; --olive-bg:rgba(176,171,122,0.14);
      --sky0:#0b0a06; --sky1:#101b10; --sky2:#1e3a24;
      --ridge-1:#16281a; --ridge-2:#0b130d;
      --glow:rgba(224,169,46,0.3); --star:rgba(240,234,216,0.65);
      --surface:rgba(240,234,216,0.05); --surface-2:rgba(240,234,216,0.04); --surface-solid:#1b1a10;
      --text:#f0ead8; --muted:#97927b; --border:rgba(240,234,216,0.12);
      --accent-border:rgba(224,169,46,0.4);
      --green-border:rgba(103,168,120,0.4);
      --red-border:rgba(208,90,64,0.4);
      --on-fill:#121108;
      --shadow:0 4px 24px rgba(0,0,0,0.5);
    }
    html, body {
      margin:0; color:var(--text);
      font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
      background:
        radial-gradient(ellipse 80% 45% at 50% 0%, rgba(168,127,16,0.10), transparent 70%),
        radial-gradient(ellipse 60% 50% at 0% 100%, rgba(46,125,70,0.07), transparent 70%),
        var(--bg-base);
      background-attachment:fixed;
      transition:background .3s ease, color .3s ease;
    }
    :root[data-theme="dark"] html, :root[data-theme="dark"] body {
      background:
        radial-gradient(ellipse 80% 45% at 50% 0%, rgba(16,27,16,0.9), transparent 75%),
        radial-gradient(ellipse 50% 40% at 85% 100%, rgba(224,169,46,0.07), transparent 70%),
        var(--bg-base);
    }
    /* Blue Hour atmosphere (welcome hero): dusk sky into the page ground,
       two ridgelines, a lamplight glow, stars at night only. */
    .atmo { position:absolute; top:0; left:0; right:0; height:520px; z-index:0; pointer-events:none;
      background:linear-gradient(180deg, var(--sky0) 0%, var(--sky1) 46%, var(--sky2) 78%, transparent 100%); }
    .atmo-stars { position:absolute; inset:0 0 30% 0;
      background-image:
        radial-gradient(1px 1px at 12% 18%, var(--star), transparent),
        radial-gradient(1px 1px at 34% 9%, var(--star), transparent),
        radial-gradient(1.5px 1.5px at 58% 14%, var(--star), transparent),
        radial-gradient(1px 1px at 79% 7%, var(--star), transparent),
        radial-gradient(1px 1px at 90% 22%, var(--star), transparent),
        radial-gradient(1px 1px at 68% 28%, var(--star), transparent),
        radial-gradient(1px 1px at 22% 32%, var(--star), transparent); }
    .atmo-glow { position:absolute; right:-60px; top:150px; width:480px; height:300px;
      background:radial-gradient(closest-side, var(--glow), transparent 72%); }
    .atmo-ridge1 { position:absolute; left:0; right:0; top:320px; height:130px; background:var(--ridge-1); opacity:0.5;
      clip-path:polygon(0 100%, 0 62%, 12% 38%, 22% 58%, 34% 22%, 46% 55%, 58% 30%, 70% 62%, 82% 40%, 92% 66%, 100% 52%, 100% 100%);
      -webkit-mask-image:linear-gradient(180deg, black 55%, transparent 100%); mask-image:linear-gradient(180deg, black 55%, transparent 100%); }
    .atmo-ridge2 { position:absolute; left:0; right:0; top:372px; height:88px; background:var(--ridge-2); opacity:0.55;
      clip-path:polygon(0 100%, 0 55%, 15% 75%, 28% 45%, 41% 78%, 55% 50%, 68% 80%, 81% 55%, 100% 74%, 100% 100%);
      -webkit-mask-image:linear-gradient(180deg, black 45%, transparent 100%); mask-image:linear-gradient(180deg, black 45%, transparent 100%); }
    .ol-split { display: grid; grid-template-columns: 1fr 1px 1fr; }
    .ol-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    @media (max-width: 760px) {
      .ol-navrow { flex-wrap: nowrap !important; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
      .ol-navrow::-webkit-scrollbar { display: none; }
      .ol-navrow button { white-space: nowrap; flex-shrink: 0; }
      .ol-split { grid-template-columns: 1fr; }
      .ol-split .ol-vrule { display: none; }
      .ol-grid2 { grid-template-columns: 1fr; }
    }
    @keyframes conceptIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .concept-in { animation: conceptIn .32s ease forwards; }
    .kt-card:hover { filter: brightness(.97); }
    @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp .5s cubic-bezier(.2,.7,.2,1) both; }
    .fade-up-1{animation-delay:.05s}.fade-up-2{animation-delay:.13s}.fade-up-3{animation-delay:.21s}
    .fade-up-4{animation-delay:.29s}.fade-up-5{animation-delay:.37s}.fade-up-6{animation-delay:.45s}
    .lift { transition: transform .25s cubic-bezier(.2,.7,.2,1), box-shadow .25s, border-color .25s; }
    .lift:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(23,20,8,.13); }
    .btn-cta { } .btn-cta:hover { transform: translateY(-1px); filter: brightness(1.03); }
    .cta-arrow { display:inline-block; transition: transform .25s cubic-bezier(.2,.7,.2,1); }
    .btn-cta:hover .cta-arrow { transform: translateX(4px); }
    @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
    .greeting-accent { background:linear-gradient(90deg,var(--gold-2) 0%,var(--gold) 55%,var(--green-brand) 130%); background-size:200% 100%; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 8s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .fade-up,.greeting-accent,.concept-in { animation:none !important; }
      .fade-up { opacity:1 !important; transform:none !important; }
      .lift,.btn-cta,.cta-arrow { transition:none !important; }
    }
  `}</style>
);

// ─── ONE LOVE BRAND ────────────────────────────────────────
const OneLoveLogo = ({ height = 26, dark = true }) => {
  // Token-based so the wordmark is legible on any themed surface.
  const inkColor = 'var(--text)';
  const heartColor = 'var(--red-brand)';
  return (
    <svg height={height} viewBox="0 0 380 80" xmlns="http://www.w3.org/2000/svg" aria-label="One Love" style={{ display: 'block' }}>
      <text x="170" y="60" textAnchor="end" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="54" letterSpacing="-1.2" fill={inkColor}>One</text>
      <g transform="translate(190, 35)">
        <path d="M 10 4 C 10 -2, 4 -6, 0 -2 C -4 -6, -10 -2, -10 4 C -10 11, 0 17, 0 17 C 0 17, 10 11, 10 4 Z" fill={heartColor}/>
      </g>
      <text x="208" y="60" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontStyle="italic" fontSize="54" letterSpacing="-1.2" fill={inkColor}>Love</text>
    </svg>
  );
};

const OneLoveFooter = () => (
  <footer style={{ borderTop: `1px solid ${T.hairline}`, background: 'var(--surface-2)', padding: '22px 24px 30px', marginTop: 40 }}>
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
      <OneLoveLogo height={22} dark={false}/>
      <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>Behavior Analysts, PLLC</div>
      <p style={{ fontFamily: T.sans, fontSize: 11, lineHeight: 1.55, color: T.muted, margin: 0, maxWidth: 640 }}>
        OneLove Behavior Analysts, PLLC is not affiliated with, endorsed by, or sponsored by the New York State Education Department or the Evaluation Systems group of Pearson. NYSTCE® is a registered mark of its respective owner. This practice tool is provided for educational purposes only and does not guarantee passage of any New York State teacher certification examination.
      </p>
    </div>
  </footer>
);

// Page chrome. Lives at module scope — defining this inside App() made it a
// new component type every render, remounting the whole subtree on each
// state change (scroll/focus loss).
const Shell = ({ nav, children }) => (
  <div style={{ minHeight: '100vh', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
    <GlobalStyles />
    {nav}
    <div style={{ flex: 1 }}>{children}</div>
    <OneLoveFooter/>
  </div>
);

// ─── NAVBAR ────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'welcome',    label: 'Home',     icon: 'home',      always: true },
  { id: 'flashcards', label: 'Cards',    icon: 'cards',     always: true },
  { id: 'quiz',       label: 'Quiz',     icon: 'target',    always: true },
  { id: 'mock',       label: 'Mock Exam', icon: 'timer',    always: true },
  { id: 'pretest',    label: 'Pretest',  icon: 'clipboard', always: true },
  { id: 'cresponse',  label: 'Constructed Response', icon: 'doc', always: true },
  { id: 'progress',   label: 'My Progress', icon: 'compass', always: true },
  { id: 'results',    label: 'Results',  icon: 'chart',     needs: 'pretestScores' },
  { id: 'modules',    label: 'Study',    icon: 'book',      needs: 'pretestScores' },
  { id: 'posttest',   label: 'Post-Test', icon: 'flag',     needs: 'pretestScores' },
  { id: 'comparison', label: 'Report',   icon: 'gradcap',   needs: 'postScores' },
];
const NavBar = ({ st, onNav, onReset, onConfirmReset, onCancelReset, onToggleTheme }) => {
  const active = st.phase === 'module' ? 'modules'
    : (st.phase === 'quizPicker' || st.phase === 'quizRun' || st.phase === 'quizDone') ? 'quiz'
    : st.phase === 'reviewMisses' ? 'progress'
    : st.phase;
  return (
    <div style={{ background: 'var(--surface-solid)', position: 'sticky', top: 0, zIndex: 200, borderBottom: `1px solid ${T.hairline}`, boxShadow: 'var(--shadow)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '9px clamp(12px, 4vw, 40px) 7px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => onNav('welcome')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Home">
          <OneLoveLogo height={24}/>
        </button>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '7px clamp(12px, 4vw, 40px) 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div className="ol-navrow" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
          {NAV_ITEMS.map(item => {
            const avail = item.always || !!st[item.needs];
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => avail && onNav(item.id)} disabled={!avail}
                style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: isActive ? 'var(--gold-ink)' : (avail ? T.ink : T.muted), opacity: avail ? 1 : 0.55, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 99, background: isActive ? 'var(--gold)' : 'transparent', border: 'none', cursor: avail ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'all .2s' }}>
                <Icon name={item.icon} size={13}/>{item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={onToggleTheme} title={st.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={st.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ padding: '4px 9px', borderRadius: 99, border: `1px solid ${T.hairline}`, background: 'transparent', color: T.ink, cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>
            <Icon name={st.theme === 'dark' ? 'sun' : 'moon'} size={14}/>
          </button>
          {!st.confirmReset
            ? <button onClick={onReset} style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T.red, background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: T.sans, fontSize: 9, color: T.red }}>Start over?</span>
                <button onClick={onConfirmReset} style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 700, color: 'var(--on-fill)', background: T.red, padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Yes</button>
                <button onClick={onCancelReset} style={{ fontFamily: T.sans, fontSize: 9, color: T.muted, background: 'none', padding: '3px 8px', borderRadius: 6, border: `1px solid ${T.hairline}`, cursor: 'pointer' }}>No</button>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ─── WELCOME ───────────────────────────────────────────────
const Welcome = ({ onStart }) => (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
  {/* Blue Hour atmosphere: dusk sky, stars (night only), ridgelines, lamplight glow */}
  <div className="atmo" aria-hidden="true">
    <div className="atmo-stars"/>
    <div className="atmo-glow"/>
    <div className="atmo-ridge1"/>
    <div className="atmo-ridge2"/>
  </div>
  <Page>

    {/* Hero */}
    <header className="fade-up fade-up-1" style={{ textAlign: 'center', padding: '20px 0 34px' }}>
      <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted, marginBottom: 16 }}>{WELCOME.imprint}</div>
      <h1 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', lineHeight: 1.04, color: T.ink, letterSpacing: '-.03em', margin: '0 0 18px' }}>
        {WELCOME.title.pre} <span className="greeting-accent">{WELCOME.title.italic}</span> {WELCOME.title.post}
      </h1>
      <p style={{ fontFamily: T.sans, fontSize: '1.06rem', color: T.muted, maxWidth: 620, margin: '0 auto 22px', lineHeight: 1.6 }}>{WELCOME.subtitle}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {WELCOME.alignment.map(item => <Pill key={item} color={T.orange2}>{item}</Pill>)}
      </div>
    </header>

    {/* Know the Test */}
    {WELCOME.testFacts && (
      <section className="fade-up fade-up-2" style={{ marginTop: 18 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Cap color={T.orange2} mb={6}>Know the Test</Cap>
          <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.5rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>{WELCOME.testFacts.heading}</h2>
        </div>
        <div className="ol-grid2" style={{ gap: 16 }}>
          {WELCOME.testFacts.tables.map((tbl, ti) => (
            <Card key={ti} className="lift" style={{ padding: '18px 20px' }}>
              {tbl.title && <Cap color={T.muted} mb={10}>{tbl.title}</Cap>}
              {tbl.rows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: ri < tbl.rows.length - 1 ? `1px solid ${T.hairline}` : 'none', fontFamily: T.sans, fontSize: 14, lineHeight: 1.4 }}>
                  <span style={{ color: T.muted }}>{row[0]}</span>
                  <span style={{ color: T.ink, fontWeight: 700, textAlign: 'right', fontFeatureSettings: "'tnum' 1" }}>{row[1]}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
        {WELCOME.testFacts.note && <p style={{ fontFamily: T.sans, fontSize: 12.5, color: T.muted, lineHeight: 1.6, marginTop: 12, textAlign: 'center' }}>{WELCOME.testFacts.note}</p>}
      </section>
    )}

    {/* Method + Contents */}
    <section className="ol-split fade-up fade-up-3" style={{ padding: '40px 0 0' }}>
      <div style={{ padding: '0 28px' }}>
        <Cap color={T.orange2} mb={6}>The Method</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.5rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 18px' }}>How This Works</h2>
        {WELCOME.steps.map(([title, desc], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-bg)', color: T.orange2, fontFamily: T.sans, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
            <div>
              <h3 style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, margin: '4px 0 3px', color: T.ink }}>{title}</h3>
              <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="ol-vrule" style={{ background: T.hairline, width: 1 }} />
      <div style={{ padding: '0 28px' }}>
        <Cap color={T.orange2} mb={6}>{WELCOME.subareasHeading}</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.5rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 18px' }}>Contents</h2>
        {Object.entries(SUBTESTS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 8, borderRadius: 12, background: 'var(--surface)', border: `1px solid ${T.hairline}` }}>
            <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 13, color: T.orange2, minWidth: 30 }}>{v.roman}</span>
            <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>{v.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <div className="fade-up fade-up-4" style={{ textAlign: 'center', marginTop: 48 }}>
      <p style={{ fontFamily: T.sans, fontSize: '1.02rem', color: T.muted, marginBottom: 20, lineHeight: 1.5, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
        Begin with the diagnostic pretest. The course is sequential.
      </p>
      <Btn onClick={onStart} variant="accent" style={{ padding: '16px 44px', fontSize: 16 }}>Begin the Pretest <span className="cta-arrow">→</span></Btn>
    </div>

    {/* Colophon */}
    <div className="fade-up fade-up-5" style={{ marginTop: 48, paddingTop: 22, borderTop: `1px solid ${T.hairline}`, textAlign: 'center', fontFamily: T.sans, fontSize: 12.5, color: T.muted, lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink, marginBottom: 6 }}>Colophon</div>
      {WELCOME.colophon}
    </div>
  </Page>
  </div>
);

// ─── QUESTION SCREEN ───────────────────────────────────────
const QuestionScreen = ({ questions, answers, qIndex, onAnswer, onNav, onSubmit, phase }) => {
  const q = questions[qIndex];
  const selected = answers[qIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const subtest = SUBTESTS[q.s];
  return (
    <Page narrow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <Pill color={T.orange2}>{WELCOME.subareaWord} {subtest.roman} · {subtest.label}</Pill>
        <span style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, fontWeight: 600 }}>Question {qIndex + 1} of {total}</span>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 14 }}>{q.d}</div>
      <div role="progressbar" aria-valuenow={qIndex + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Question ${qIndex + 1} of ${total}`}
        style={{ height: 6, background: 'var(--border)', borderRadius: 99, marginBottom: 26, overflow: 'hidden' }}>
        <div style={{ width: `${((qIndex + 1) / total) * 100}%`, height: '100%', background: T.orange, borderRadius: 99, transition: 'width .3s' }} />
      </div>
      <Card style={{ marginBottom: 18, padding: '22px 24px' }}>
        <p id={`q-${qIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.55, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
      </Card>
      <div role="radiogroup" aria-labelledby={`q-${qIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => onAnswer(qIndex, i)}
              tabIndex={isSelected || (selected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: `2px solid ${isSelected ? T.orange : T.hairline}`, background: isSelected ? 'var(--accent-bg)' : T.glass, cursor: 'pointer', fontFamily: T.sans, fontSize: 15.5, color: T.ink, transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 13 }}>
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSelected ? T.orange : T.hairline}`, background: isSelected ? T.orange : 'transparent', color: isSelected ? 'var(--on-fill)' : T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ lineHeight: 1.5 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Btn onClick={() => onNav(-1)} variant="ghost" disabled={qIndex === 0} style={{ padding: '11px 22px' }}>← Back</Btn>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, fontWeight: 600 }}>{answeredCount} of {total} answered</span>
        {qIndex < total - 1
          ? <Btn onClick={() => onNav(1)} variant="primary" style={{ padding: '11px 24px' }}>Next →</Btn>
          : <Btn onClick={onSubmit} variant="accent" disabled={answeredCount < total} style={{ padding: '11px 24px' }}>{answeredCount < total ? `${total - answeredCount} unanswered` : `Submit ${phase}`}</Btn>}
      </div>
    </Page>
  );
};

// ─── REVIEW INCORRECT ──────────────────────────────────────
const ReviewIncorrect = ({ items, onBack }) => {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const q = cur.q;
  return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Back to results</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12 }}>
        <Pill color={T.red} bg={T.redBg}>Missed · {WELCOME.subareaWord} {SUBTESTS[q.s]?.roman}</Pill>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>Item {idx + 1} of {items.length}</span>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 14 }}>{q.d}</div>
      <Card style={{ marginBottom: 16, padding: '20px 22px' }}>
        <p style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.5, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {q.a.map((opt, i) => {
          const isCorrect = i === q.c;
          const isUser = i === cur.user;
          let bg = T.glass, border = T.hairline, ring = T.hairline, rbg = 'transparent', rfg = T.muted, marker = null;
          if (isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = 'var(--on-fill)'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓ Correct</span>; }
          else if (isUser) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = 'var(--on-fill)'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗ Your answer</span>; }
          return (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 14, border: `2px solid ${border}`, background: bg, fontFamily: T.sans, fontSize: 15, color: T.ink, display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${ring}`, background: rbg, color: rfg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {marker}
            </div>
          );
        })}
      </div>
      <Card style={{ marginBottom: 24, background: 'var(--accent-bg)' }}>
        <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8 }}>Annotation</div>
        <p style={{ fontFamily: T.sans, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0 }}>{q.r}</p>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
        <Btn onClick={() => setIdx(Math.max(0, idx - 1))} variant="ghost" disabled={idx === 0} style={{ padding: '11px 22px' }}>← Previous</Btn>
        <Btn onClick={() => idx < items.length - 1 ? setIdx(idx + 1) : onBack()} variant="primary" style={{ padding: '11px 22px' }}>{idx < items.length - 1 ? 'Next →' : 'Done'}</Btn>
      </div>
    </Page>
  );
};

// ─── RESULTS ───────────────────────────────────────────────
const Results = ({ scores, weakDomains, onContinue, isPost, pretestScores, sourceQuestions, sourceAnswers }) => {
  const [reviewing, setReviewing] = useState(false);
  const overall = Object.values(scores.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  const overallPct = pct(overall.correct, overall.total);
  const missed = sourceQuestions ? sourceQuestions.map((q, i) => ({ q, i, user: sourceAnswers?.[i] })).filter(x => x.user !== x.q.c) : [];
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <div style={{ marginBottom: 6, color: 'var(--gold)' }}><Icon name="chart" size={44} stroke={1.4}/></div>
        <Cap color={T.orange2} mb={8}>{isPost ? 'Post-Test · Final Examination' : 'Pretest · Diagnostic'}</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 8px' }}>{isPost ? 'Final Results' : 'Diagnostic Results'}</h2>
        <div style={{ fontFamily: T.sans, fontSize: 16, color: T.muted }}>Overall score: <span style={{ color: T.orange2, fontWeight: 800 }}>{overallPct}%</span> ({overall.correct} of {overall.total})</div>
      </header>
      <Card style={{ marginBottom: 18 }}>
        <Cap color={T.orange2} mb={14}>By {WELCOME.subareaWord}</Cap>
        {Object.entries(scores.subtests).map(([k, v]) => (
          <ProgressRow key={k} value={pct(v.correct, v.total)} label={`${WELCOME.subareaWord} ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
        ))}
      </Card>
      <Card style={{ marginBottom: 18 }}>
        <Cap color={T.orange2} mb={14}>By Domain</Cap>
        {Object.entries(scores.domains).map(([d, v]) => {
          const p = pct(v.correct, v.total);
          const needsWork = p < 70;
          return (
            <div key={d} style={{ marginBottom: 12, padding: '12px 14px', borderRadius: 12, background: needsWork ? 'var(--red-bg)' : 'transparent', border: `1px solid ${needsWork ? 'var(--red-border)' : T.hairline}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10 }}>
                <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.ink }}>{d}</span>
                {needsWork && <Pill color={T.red} bg={T.redBg}>Review</Pill>}
              </div>
              <ProgressRow value={p} label={`${v.correct} of ${v.total} correct`} color={needsWork ? T.red : T.green} />
            </div>
          );
        })}
      </Card>
      {isPost && pretestScores && (
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={14}>Growth Across the Course</Cap>
          {Object.entries(scores.domains).map(([d, v]) => {
            const pre = pretestScores.domains[d]; if (!pre) return null;
            const preP = pct(pre.correct, pre.total); const postP = pct(v.correct, v.total); const diff = postP - preP;
            return (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '8px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 14 }}>
                <span style={{ color: T.muted }}>{d}</span>
                <span style={{ color: diff > 0 ? T.green : diff < 0 ? T.red : T.muted, fontWeight: 700, whiteSpace: 'nowrap' }}>{preP}% → {postP}% ({diff > 0 ? '+' : ''}{diff}%)</span>
              </div>
            );
          })}
        </Card>
      )}
      {!isPost && weakDomains.length > 0 && (
        <Card style={{ marginBottom: 18, background: 'var(--accent-bg)' }}>
          <Cap color={T.orange2} mb={10}>Recommended Study</Cap>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, marginBottom: 12, lineHeight: 1.5 }}>{weakDomains.length} {weakDomains.length === 1 ? 'domain' : 'domains'} below 70%. The course advises study before the post-test.</p>
          {weakDomains.map(d => (
            <div key={d} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.ink, padding: '3px 0' }}>→ {d}</div>
          ))}
        </Card>
      )}
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed Question{missed.length > 1 ? 's' : ''}</Btn>
      )}
      {isPost ? (
        <Btn onClick={onContinue} variant="ghost" style={{ width: '100%', padding: '14px' }}>Start a New Course → (clears all progress)</Btn>
      ) : (
        <Btn onClick={onContinue} variant="accent" style={{ width: '100%', padding: '16px' }}>{weakDomains.length > 0 ? `Begin Study Modules (${weakDomains.length})` : 'Proceed to the Post-Test'}</Btn>
      )}
    </Page>
  );
};

// ─── MODULE HUB + LEARNING MODULE ──────────────────────────
const ModuleHub = ({ domains, weakDomains, completedModules, onSelect, onSkip }) => {
  const weakDone = weakDomains.every(d => completedModules.includes(d));
  return (
  <Page narrow>
    <header style={{ textAlign: 'center', marginBottom: 26 }}>
      <Cap color={T.orange2} mb={8}>The Course of Study</Cap>
      <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Your Study Plan</h2>
      <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
        {weakDomains.length > 0 ? 'Modules flagged from your pretest are listed first — start there. Every module is open to study.' : 'No domains fell below 70% on your pretest. Study any module, or proceed to the post-test.'}
      </p>
    </header>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {domains.map((d, i) => {
        const mod = MODULES[d];
        const done = completedModules.includes(d);
        const flagged = weakDomains.includes(d);
        return (
          <Card key={d} className="lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 20px' }}>
            <div aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--green-bg)' : 'var(--gold-bg)', color: done ? T.green : 'var(--gold)' }}>
              <ModuleIcon emoji={mod?.icon} size={22}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                <Cap color={T.muted}>Module {String(i + 1).padStart(2, '0')}</Cap>
                {done && <Pill color={T.green} bg={T.greenBg}>✓ Completed</Pill>}
                {flagged && !done && <Pill color={T.red} bg={T.redBg}>Review</Pill>}
              </div>
              <h3 style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 17, color: T.ink, margin: '0 0 3px', letterSpacing: '-.01em' }}>{d}</h3>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, margin: 0 }}>{mod?.concepts?.length || 0} concepts · {mod?.practice?.length || 0} practice questions</p>
            </div>
            <Btn onClick={() => onSelect(d)} variant={done ? 'ghost' : (flagged ? 'accent' : 'primary')} style={{ padding: '10px 22px' }}>{done ? 'Revisit' : 'Begin →'}</Btn>
          </Card>
        );
      })}
    </div>
    <div style={{ marginTop: 28, textAlign: 'center' }}>
      <p style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 14 }}>{completedModules.length} of {domains.length} modules completed{weakDomains.length > 0 ? ` · ${weakDomains.filter(d => completedModules.includes(d)).length} of ${weakDomains.length} flagged` : ''}</p>
      <Btn onClick={onSkip} variant={weakDone ? 'accent' : 'ghost'} style={{ padding: '14px 36px' }}>{weakDone ? 'Begin Post-Test →' : 'Skip to Post-Test →'}</Btn>
    </div>
  </Page>
  );
};

// Interactive concept-study walkthrough — one concept at a time with the BCBA
// engagement layer (progress dots, Mastery Map, key terms, Quick Check,
// Categorize), recolored to the CST warm palette. Replaces the old static
// read-through of the module's concepts.
// Concept study is the lesson player (src/LessonPlayer.jsx): one idea per
// screen, with a one-page review view. Screen text comes from the generated
// src/data/lessons.js (scripts/build-lessons.cjs).
const ConceptStudy = ({ domain, conceptProgress, onConceptView, onConceptRate, onBack, onStartPractice }) => (
  <LessonPlayer key={domain} domain={domain} concepts={MODULES[domain].concepts}
    enhancements={MODULE_ENHANCEMENTS[domain]} lessons={LESSONS[domain]}
    progress={conceptProgress?.[domain] || {}}
    onConceptView={onConceptView} onConceptRate={onConceptRate} onBack={onBack} onStartPractice={onStartPractice} />
);

const LearningModule = ({ domain, phase, pqIndex, pAnswers, onPAnswer, onBack, onStartPractice, onFinish, conceptProgress, onConceptView, onConceptRate }) => {
  const mod = MODULES[domain];
  const pq = mod.practice[pqIndex];
  const pSelected = pAnswers[pqIndex];
  if (phase === 'content') return (
    <ConceptStudy domain={domain} conceptProgress={conceptProgress} onConceptView={onConceptView} onConceptRate={onConceptRate} onBack={onBack} onStartPractice={onStartPractice} />
  );
  return (
    <Page narrow>
      <Cap color={T.orange2} mb={8}>{domain} · Practice</Cap>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 18 }}>Question {pqIndex + 1} of {mod.practice.length}</div>
      <Card style={{ marginBottom: 16, padding: '20px 22px' }}>
        <p id={`pq-${pqIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.5, color: T.ink, margin: 0, fontWeight: 500 }}>{pq.q}</p>
      </Card>
      <div role="radiogroup" aria-labelledby={`pq-${pqIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {pq.a.map((opt, i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = T.glass, border = T.hairline, ring = T.hairline, rbg = 'transparent', rfg = T.muted;
          if (showFeedback && isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = 'var(--on-fill)'; }
          else if (showFeedback && isSelected && !isCorrect) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = 'var(--on-fill)'; }
          else if (isSelected) { bg = 'var(--accent-bg)'; border = T.orange; ring = T.orange; rbg = T.orange; rfg = 'var(--on-fill)'; }
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => !showFeedback && onPAnswer(pqIndex, i)} disabled={showFeedback}
              tabIndex={isSelected || (pSelected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 14, border: `2px solid ${border}`, background: bg, cursor: showFeedback ? 'default' : 'pointer', fontFamily: T.sans, fontSize: 15, color: T.ink, display: 'flex', gap: 13, alignItems: 'center' }}>
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${ring}`, background: rbg, color: rfg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {showFeedback && isCorrect && <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.green, marginLeft: 'auto' }}>✓</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.red, marginLeft: 'auto' }}>✗</span>}
            </button>
          );
        })}
      </div>
      {pSelected !== undefined && (
        <Card style={{ marginBottom: 18, background: 'var(--accent-bg)' }}>
          <Cap color={T.orange2} mb={8}>Annotation</Cap>
          <p style={{ fontFamily: T.sans, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0 }}>{pq.r}</p>
        </Card>
      )}
      {pSelected !== undefined && (
        pqIndex < mod.practice.length - 1
          ? <Btn onClick={() => onPAnswer('next')} variant="primary" style={{ width: '100%', padding: '14px' }}>Next Question →</Btn>
          : <Btn onClick={onFinish} variant="accent" style={{ width: '100%', padding: '14px' }}>✓ Complete Module</Btn>
      )}
    </Page>
  );
};

// ─── DOMAIN GRID (used by Flashcards + Quiz pickers) ───────
const DomainGrid = ({ onSelect, getCounts }) => {
  // dynamic — one bucket per SUBTESTS key, no hardcoded coupling
  const groups = Object.fromEntries(Object.keys(SUBTESTS).map(k => [k, []]));
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    groups[subtest].push(d);
  });
  return (
    <div>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <Cap color={T.orange2}>{WELCOME.subareaWord} {SUBTESTS[k]?.roman}</Cap>
            <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.ink }}>{SUBTESTS[k]?.label}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
            {domains.map((d) => {
              const meta = getCounts ? getCounts(d) : null;
              return (
                <button key={d} onClick={() => onSelect(d)} className="lift"
                  style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.hairline}`, background: T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: T.shadow, cursor: 'pointer' }}>
                  <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{d}</div>
                  {meta && <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.muted }}>{meta}</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── FLASHCARDS ────────────────────────────────────────────
const Flashcards = ({ st, up }) => {
  if (!st.fcDomain) return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <Cap color={T.orange2} mb={8}>The Reading Cards</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Flashcards</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10 }}>Choose a domain to study its key concepts.</p>
      </header>
      <DomainGrid getCounts={d => `${MODULES[d].concepts.length} concepts`} onSelect={d => {
        const order = shuffle(MODULES[d].concepts.map((_, i) => i));
        up({ fcDomain: d, fcOrder: order, fcPos: 0, fcFlipped: false, fcKnown: [] });
      }} />
    </Page>
  );
  const mod = MODULES[st.fcDomain];
  const order = st.fcOrder.length ? st.fcOrder : mod.concepts.map((_, i) => i);
  const remaining = order.filter(idx => !st.fcKnown.includes(idx));
  const allKnown = remaining.length === 0;
  const safePos = Math.min(st.fcPos, Math.max(0, remaining.length - 1));
  const conceptIdx = remaining[safePos] ?? order[0];
  const concept = mod.concepts[conceptIdx];
  const isKnown = st.fcKnown.includes(conceptIdx);
  const advance = (delta) => {
    if (remaining.length === 0) return;
    const next = (safePos + delta + remaining.length) % remaining.length;
    up({ fcPos: next, fcFlipped: false });
  };
  return (
    <Page narrow>
      <button onClick={() => up({ fcDomain: null, fcOrder: [], fcPos: 0, fcFlipped: false, fcKnown: [] })} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Choose another domain</button>
      <Cap color={T.orange2} mb={6}>{st.fcDomain}</Cap>
      <p style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, marginBottom: 18, fontWeight: 600 }}>
        {allKnown ? `All ${order.length} cards marked known.` : `Card ${safePos + 1} of ${remaining.length} · ${st.fcKnown.length} marked known`}
      </p>
      {!allKnown && (
        <div role="button" tabIndex={0} aria-pressed={st.fcFlipped} aria-label={`Flashcard ${safePos + 1} of ${remaining.length}. Press Space or Enter to flip.`}
          onClick={() => up({ fcFlipped: !st.fcFlipped })}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up({ fcFlipped: !st.fcFlipped }); } }}
          style={{ minHeight: 280, padding: 36, marginBottom: 18, background: T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid ${T.hairline}`, borderTop: `3px solid ${T.orange}`, borderRadius: 18, boxShadow: T.shadow, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', outline: 'none' }}>
          <Cap color={T.orange2} mb={16}>{st.fcFlipped ? 'Detail · tap or press Space to flip' : 'Concept · tap or press Space to flip'}</Cap>
          {!st.fcFlipped
            ? <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 30, color: T.ink, lineHeight: 1.2, letterSpacing: '-.02em' }}>{concept.title}</div>
            : <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, lineHeight: 1.7 }}>{concept.body}</div>}
        </div>
      )}
      {allKnown && (
        <Card style={{ textAlign: 'center', marginBottom: 18 }}>
          <Cap color={T.green} mb={8}>Completed</Cap>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.ink, marginTop: 8 }}>You have marked every card known. Reset the deck or choose a new domain.</p>
        </Card>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Btn onClick={() => advance(-1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>← Prev</Btn>
        <Btn onClick={() => up({ fcFlipped: !st.fcFlipped })} variant="primary" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Flip</Btn>
        <Btn onClick={() => advance(1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Next →</Btn>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => {
          if (allKnown) return;
          const nextKnown = isKnown ? st.fcKnown.filter(i => i !== conceptIdx) : [...st.fcKnown, conceptIdx];
          const nextRemaining = order.filter(idx => !nextKnown.includes(idx));
          up({ fcKnown: nextKnown, fcFlipped: false, fcPos: Math.min(safePos, Math.max(0, nextRemaining.length - 1)) });
        }} disabled={allKnown}
          style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, flex: 2, padding: '12px', borderRadius: 99, border: `1.5px solid ${isKnown ? T.green : T.hairline}`, background: isKnown ? 'var(--green-bg)' : 'transparent', color: isKnown ? T.green : T.ink, cursor: allKnown ? 'default' : 'pointer' }}>
          {isKnown ? '✓ Marked known · tap to unmark' : 'Mark known'}
        </button>
        <Btn onClick={() => up({ fcOrder: shuffle(order), fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 12 }}>Shuffle</Btn>
        <Btn onClick={() => up({ fcKnown: [], fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 12 }}>Reset</Btn>
      </div>
    </Page>
  );
};

// ─── QUIZ PICKER + RESULTS ─────────────────────────────────
const QuizPicker = ({ pool, onStart }) => {
  const [len, setLen] = useState(10);
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <Cap color={T.orange2} mb={8}>The Brief Examination</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Quick Quiz</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10 }}>Choose a domain and quiz length.</p>
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 26, justifyContent: 'center' }}>
        {[5, 10].map(n => (
          <button key={n} onClick={() => setLen(n)}
            style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, padding: '10px 26px', borderRadius: 99, border: `2px solid ${len === n ? T.orange : T.hairline}`, background: len === n ? 'var(--accent-bg)' : 'transparent', color: len === n ? T.orange2 : T.muted, cursor: 'pointer' }}>
            {n} questions
          </button>
        ))}
      </div>
      <DomainGrid getCounts={d => `${pool[d]?.length || 0} questions in pool`} onSelect={d => {
        const available = pool[d] || [];
        if (available.length === 0) return;
        const take = Math.min(len, available.length);
        onStart(d, len, shuffle(available).slice(0, take));
      }} />
    </Page>
  );
};

const QuizResults = ({ domain, qs, answers, onRetry, onPick }) => {
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const p = pct(correct, qs.length);
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 28 }}>
        <Cap color={T.orange2} mb={10}>{domain} · Quick Quiz</Cap>
        <div style={{ fontFamily: T.sans, fontSize: 64, fontWeight: 800, color: p >= 70 ? T.green : T.red, lineHeight: 1, marginBottom: 10, letterSpacing: '-.02em' }}>{p}%</div>
        <p style={{ fontFamily: T.sans, fontSize: 16, color: T.muted }}>{correct} of {qs.length} correct</p>
      </header>
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed</Btn>
      )}
      <Btn onClick={onRetry} variant="primary" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Retry this quiz</Btn>
      <Btn onClick={onPick} variant="ghost" style={{ width: '100%', padding: '14px' }}>← Choose another domain</Btn>
    </Page>
  );
};

// ─── CONSTRUCTED RESPONSE ──────────────────────────────────
const ConstructedResponse = ({ st, up }) => {
  const prompt = CR_PROMPTS.find(p => p.id === st.crPromptId) || CR_PROMPTS[0];
  const draftKey = `${STORAGE_KEY}-cr-draft-${prompt.id}`;
  const [draft, setDraft] = useState('');
  useEffect(() => { try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setDraft(''); } }, [draftKey]);
  const saveDraft = (val) => { setDraft(val); try { localStorage.setItem(draftKey, val); } catch {} };
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const setSelf = (idx, level) => { const next = { ...st.crSelfScore, [idx]: level }; const patch = { crSelfScore: next }; if (Object.keys(next).length === prompt.rubric.length) { patch.crScored = { ...(st.crScored || {}), [prompt.id]: next }; track('cr_selfscored', { promptId: prompt.id, scores: next }); } up(patch); };
  const tally = (() => { const v = Object.values(st.crSelfScore || {}); if (!v.length) return null; return v.reduce((a, x) => { a[x] = (a[x] || 0) + 1; return a; }, {}); })();
  const submitted = !!(st.crSubmitted && st.crSubmitted[prompt.id]);
  const canSubmit = wordCount >= 100;
  const submitDraft = () => { up({ crSubmitted: { ...(st.crSubmitted || {}), [prompt.id]: true }, crView: 'exemplar' }); track('cr_submitted', { promptId: prompt.id, words: wordCount }); };
  const tab = (id, label, locked = false) => {
    const active = st.crView === id;
    return (
      <button onClick={() => !locked && up({ crView: id })} disabled={locked} title={locked ? 'Submit a draft of at least 100 words to unlock the exemplar' : undefined}
        style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, flex: 1, padding: '11px', borderRadius: 99, border: `1.5px solid ${active ? T.orange : T.hairline}`, background: active ? 'var(--accent-bg)' : 'transparent', color: locked ? T.muted : (active ? T.orange2 : T.muted), cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.55 : 1 }}>{locked ? `🔒 ${label}` : label}</button>
    );
  };
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 24 }}>
        <Cap color={T.orange2} mb={8}>The Written Assignment</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>Constructed Response</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 10 }}>{WELCOME.crSubtitle || 'Case-study analysis · constructed-response practice'}</p>
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {CR_PROMPTS.map((p, i) => {
          const active = p.id === st.crPromptId;
          return (
            <button key={p.id} onClick={() => up({ crPromptId: p.id, crView: 'prompt', crSelfScore: {} })} className="lift"
              style={{ flex: 1, minWidth: 240, padding: '14px 18px', borderRadius: 14, border: `2px solid ${active ? T.orange : T.hairline}`, background: active ? 'var(--accent-bg)' : T.glass, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: T.shadow, cursor: 'pointer', textAlign: 'left' }}>
              <Cap color={T.orange2} mb={4}>Case Study {String(i + 1).padStart(2, '0')}</Cap>
              <div style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>{tab('prompt', 'Prompt + Draft')}{tab('rubric', 'Rubric')}{tab('exemplar', 'Exemplar', !submitted)}</div>

      {st.crView === 'prompt' && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Cap color={T.orange2} mb={10}>Scenario</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.scenario}</p>
          </Card>
          <Card style={{ marginBottom: 18, background: 'var(--accent-bg)' }}>
            <Cap color={T.orange2} mb={10}>Your Task</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.task}</p>
          </Card>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <Cap color={T.orange2}>Your Draft</Cap>
              <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{wordCount} words · saved locally</span>
            </div>
            <textarea value={draft} onChange={(e) => saveDraft(e.target.value)} placeholder="Compose your response here. Address each numbered part of the task. Your draft is saved automatically."
              aria-label="Draft response"
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px var(--accent-bg)'; e.target.style.borderColor = T.orange; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = 'var(--border)'; }}
              style={{ width: '100%', minHeight: 320, padding: '18px 20px', borderRadius: 14, border: `1.5px solid ${T.hairline}`, background: 'var(--surface-solid)', color: T.ink, fontSize: 16, lineHeight: 1.65, fontFamily: T.serif, resize: 'vertical', outline: 'none', transition: 'box-shadow .15s, border-color .15s', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <Btn onClick={() => up({ crView: 'rubric' })} variant="accent" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Score with Rubric →</Btn>
              {submitted
                ? <Btn onClick={() => up({ crView: 'exemplar' })} variant="ghost" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Compare to Exemplar →</Btn>
                : <Btn onClick={submitDraft} variant="ghost" disabled={!canSubmit} style={{ flex: 1, minWidth: 160, padding: '14px' }}>{canSubmit ? 'Submit — Unlock Exemplar →' : `Write ${100 - wordCount} more to submit`}</Btn>}
              <Btn onClick={() => saveDraft('')} variant="ghost" style={{ padding: '14px 20px' }}>Clear</Btn>
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, lineHeight: 1.55, margin: '10px 2px 0' }}>The exemplar response stays locked until you submit a draft of at least 100 words, so you write your own answer first, as you must on the real test.</p>
          </div>
        </>
      )}

      {st.crView === 'rubric' && (
        <>
          <Card style={{ marginBottom: 18 }}>
            <Cap color={T.orange2} mb={8}>How to Use This Rubric</Cap>
            <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.6, margin: 0 }}>For each criterion, choose the level that best describes your draft. Be honest — the goal is to identify what to revise.</p>
          </Card>
          {prompt.rubric.map((r, i) => {
            const sel = st.crSelfScore?.[i];
            const Btn3 = (level, label, c, bg) => (
              <button onClick={() => setSelf(i, level)}
                style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, flex: 1, padding: '11px', borderRadius: 10, border: `2px solid ${sel === level ? c : T.hairline}`, background: sel === level ? bg : 'transparent', color: sel === level ? c : T.muted, cursor: 'pointer' }}>{label}</button>
            );
            return (
              <Card key={i} style={{ marginBottom: 14 }}>
                <Cap color={T.orange2} mb={6}>Criterion {String(i + 1).padStart(2, '0')}</Cap>
                <h3 style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 17, color: T.ink, marginBottom: 14, letterSpacing: '-.01em' }}>{r.criterion}</h3>
                <div style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginRight: 8 }}>Strong</span>{r.high}</div>
                <div style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.orange2, marginRight: 8 }}>Developing</span>{r.mid}</div>
                <div style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 14 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginRight: 8 }}>Limited</span>{r.low}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Btn3('high', '3 · Strong', T.green, 'var(--green-bg)')}
                  {Btn3('mid', '2 · Developing', T.orange2, 'var(--accent-bg)')}
                  {Btn3('low', '1 · Limited', T.red, 'var(--red-bg)')}
                </div>
              </Card>
            );
          })}
          {tally && (
            <Card style={{ background: 'var(--accent-bg)' }}>
              <Cap color={T.orange2} mb={8}>Self-Assessment</Cap>
              <p style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, marginBottom: 6 }}>
                Strong (3): <strong>{tally.high || 0}</strong> · Developing (2): <strong>{tally.mid || 0}</strong> · Limited (1): <strong>{tally.low || 0}</strong>
              </p>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, lineHeight: 1.5, margin: 0 }}>Revise any criterion you scored Developing or Limited, then compare to the exemplar response.</p>
            </Card>
          )}
        </>
      )}

      {st.crView === 'exemplar' && (
        <>
          <Card style={{ marginBottom: 16, background: 'var(--green-bg)', border: '1px solid var(--green-border)' }}>
            <Cap color={T.green} mb={6}>Exemplar Response</Cap>
            <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.55, margin: 0 }}>This is one strong response — not the only correct answer. Compare structure, evidence use, and how each task element is addressed.</p>
          </Card>
          <Card>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.7, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.exemplar}</p>
          </Card>
          <Btn onClick={() => up({ crView: 'prompt' })} variant="primary" style={{ width: '100%', marginTop: 18, padding: '14px' }}>← Back to Draft</Btn>
        </>
      )}
    </Page>
  );
};

// ─── PASS-RATE + ERROR-ANALYSIS ENGINE ─────────────────────
// NYSTCE EAS scale: 400–600, passing score 520 (matches the WELCOME
// testFacts copy: "520 (scale 400–600)"). The app has no official
// scaled-score conversion, so percent is projected linearly with the
// pass anchor at 70%: 0% → 400, 70% → 520 (pass), 100% → 600.
const EXAM_SCALE = { min: 400, max: 600, pass: 520 };
// SR competency weights from the official EAS 201 design (WELCOME
// "Score Weighting"): C1/C2/C3 = 18% each; C4 (Teacher Responsibilities &
// School–Home Relationships, merged in the current 4-competency framework) = 16%.
const SUBTEST_WEIGHTS = { C1: 18, C2: 18, C3: 18, C4: 16 };
const pctToScaled = (p) => Math.round(p <= 70 ? EXAM_SCALE.min + (p / 70) * (EXAM_SCALE.pass - EXAM_SCALE.min) : EXAM_SCALE.pass + ((p - 70) / 30) * (EXAM_SCALE.max - EXAM_SCALE.pass));
// Stable question identity across sessions (questions carry no id field):
// domain + first 60 chars of the stem.
const qKey = (q) => `${q.d}|${(q.q || '').slice(0, 60)}`;
const domainSubtest = (d) => (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
// Exam-weighted percent from calcScores() subtest counts.
const weightedPct = (subtests) => {
  let num = 0, den = 0;
  Object.entries(subtests || {}).forEach(([k, v]) => {
    if (!v.total) return;
    const w = SUBTEST_WEIGHTS[k] || 1;
    num += (v.correct / v.total) * w; den += w;
  });
  return den ? (num / den) * 100 : null;
};
// Projection model (documented per spec): take the last 5 scored attempts
// (pretest / posttest / quick quizzes), compute a recency-weighted mean of
// each attempt's exam-weighted percent (linear weights 1..5, most recent
// heaviest), then map percent → scaled via pctToScaled above.
// Verdict margin: ±10 scaled points = 5% of the 200-point scale.
const computeProjection = (attempts) => {
  const scored = (attempts || []).filter(a => typeof a.wpct === 'number');
  if (scored.length < 2) return null;
  const last = scored.slice(-5);
  let sum = 0, w = 0;
  last.forEach((a, i) => { const wt = i + 1; sum += a.wpct * wt; w += wt; });
  const projPct = sum / w;
  const projected = pctToScaled(projPct);
  const margin = 10;
  const verdict = projected >= EXAM_SCALE.pass + margin ? 'Ready' : projected >= EXAM_SCALE.pass - margin ? 'Borderline' : 'Keep building';
  return { projected, projPct: Math.round(projPct), verdict, series: scored.slice(-12).map(a => ({ scaled: pctToScaled(a.wpct), kind: a.kind, ts: a.ts })) };
};
const ANSWER_LOG_CAP = 800;
const ATTEMPT_CAP = 40;
// Record every scored answer event into the aggregate log (heat map) and
// wrong answers into the miss bank (Review Misses).
const logAnswers = (prevLog, prevBank, questions, answers) => {
  const log = (prevLog || []).slice();
  const bank = { ...(prevBank || {}) };
  questions.forEach((q, i) => {
    if (answers[i] === undefined) return;
    const ok = answers[i] === q.c ? 1 : 0;
    log.push({ s: q.s, d: q.d, ok });
    if (!ok) {
      const key = qKey(q);
      const cur = bank[key];
      // a fresh miss resets the review streak — retirement requires two
      // consecutive correct answers in Review Misses mode
      bank[key] = { id: key, domain: q.d, subtest: q.s, missCount: (cur?.missCount || 0) + 1, correctStreak: 0, lastMissed: new Date().toISOString() };
    }
  });
  return { answerLog: log.slice(-ANSWER_LOG_CAP), missBank: bank };
};
const isRetired = (e) => (e?.correctStreak || 0) >= 2;
const reviewAnswer = (bank, key, correct) => {
  const cur = bank?.[key]; if (!cur) return bank;
  const next = correct
    ? { ...cur, correctStreak: (cur.correctStreak || 0) + 1 }
    : { ...cur, missCount: (cur.missCount || 0) + 1, correctStreak: 0, lastMissed: new Date().toISOString() };
  return { ...bank, [key]: next };
};
// Telemetry helper: per-competency percent for an answered question set.
const byDomainPct = (questions, answers) => {
  const agg = {};
  questions.forEach((q, i) => {
    if (answers[i] === undefined) return;
    (agg[q.s] = agg[q.s] || { c: 0, t: 0 }).t++;
    if (answers[i] === q.c) agg[q.s].c++;
  });
  return Object.fromEntries(Object.entries(agg).map(([k, v]) => [k, pct(v.c, v.t)]));
};
const trendOf = (arr) => {
  if (arr.length < 6) return null;
  const half = Math.floor(arr.length / 2);
  const a = arr.slice(0, half), b = arr.slice(half);
  return pct(b.filter(Boolean).length, b.length) - pct(a.filter(Boolean).length, a.length);
};
const heatColor = (p) => p == null
  ? { fg: T.muted, bg: 'var(--surface-2)', border: 'var(--border)' }
  : p >= 80 ? { fg: T.green, bg: 'var(--green-bg)', border: 'var(--green-border)' }
  : p >= 60 ? { fg: T.orange2, bg: 'var(--accent-bg)', border: 'var(--border)' }
  : { fg: T.red, bg: 'var(--red-bg)', border: 'var(--red-border)' };

// ─── FEATURE 1 · READINESS PROJECTION ──────────────────────
const AttemptSpark = ({ series }) => {
  const h = 76;
  const y = (v) => (v - EXAM_SCALE.min) / (EXAM_SCALE.max - EXAM_SCALE.min);
  const passY = y(EXAM_SCALE.pass) * h;
  return (
    <div role="img" aria-label={`Attempt trajectory: scaled scores ${series.map(s => s.scaled).join(', ')}. Passing score ${EXAM_SCALE.pass}.`}
      style={{ position: 'relative', height: h + 18, marginTop: 16 }}>
      <div style={{ position: 'absolute', inset: `0 0 18px 0`, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        {series.map((s, i) => (
          <div key={i} title={`${s.kind} · ${s.scaled}`}
            style={{ flex: 1, maxWidth: 36, height: Math.max(5, y(s.scaled) * h), borderRadius: 5, background: s.scaled >= EXAM_SCALE.pass ? T.green : T.orange, opacity: .45 + .55 * ((i + 1) / series.length), transition: 'height .4s ease' }} />
        ))}
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: passY + 18, borderTop: `2px dashed ${T.red}` }} />
      <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: passY + 21, fontFamily: T.sans, fontSize: 10, fontWeight: 700, color: T.red, background: 'var(--surface-solid)', padding: '0 4px', borderRadius: 4 }}>{EXAM_SCALE.pass} pass</span>
      <span style={{ position: 'absolute', left: 0, bottom: 0, fontFamily: T.sans, fontSize: 10, color: T.muted }}>oldest</span>
      <span style={{ position: 'absolute', right: 0, bottom: 0, fontFamily: T.sans, fontSize: 10, color: T.muted }}>latest</span>
    </div>
  );
};
const ReadinessProjection = ({ attempts }) => {
  const proj = computeProjection(attempts);
  // telemetry contract: fire once when My Progress renders a projection
  useEffect(() => { if (proj) track('readiness', { projected: proj.projected, bar: EXAM_SCALE.pass, verdict: proj.verdict }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!proj) return (
    <Card style={{ marginBottom: 18, textAlign: 'center', padding: '26px 24px' }}>
      <Cap color={T.orange2} mb={8}>Readiness Projection</Cap>
      <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.muted, margin: 0, lineHeight: 1.55 }}>Complete more scored practice to unlock your readiness projection — the pretest, quick quizzes, and the post-test all count (at least 2 scored attempts needed).</p>
    </Card>
  );
  const vc = proj.verdict === 'Ready' ? { fg: T.green, bg: 'var(--green-bg)' } : proj.verdict === 'Borderline' ? { fg: T.orange2, bg: 'var(--accent-bg)' } : { fg: T.red, bg: 'var(--red-bg)' };
  return (
    <Card style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <Cap color={T.orange2}>Readiness Projection</Cap>
        <Pill color={vc.fg} bg={vc.bg}>{proj.verdict}</Pill>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: T.sans, fontSize: 46, fontWeight: 800, letterSpacing: '-.02em', color: vc.fg, lineHeight: 1, fontFeatureSettings: "'tnum' 1" }}>{proj.projected}</span>
        <span style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, fontWeight: 600 }}>projected scaled score · pass = {EXAM_SCALE.pass} (scale {EXAM_SCALE.min}–{EXAM_SCALE.max}) · ≈{proj.projPct}% weighted accuracy</span>
      </div>
      <AttemptSpark series={proj.series} />
      <p style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, lineHeight: 1.55, margin: '14px 0 0' }}>
        Projection based on your practice (your last {Math.min(5, (attempts || []).length)} scored attempts, weighted toward the most recent and by each competency's share of the exam) — not a guarantee of passage.
      </p>
    </Card>
  );
};

// ─── FEATURE 2 · COMPETENCY HEAT MAP ───────────────────────
const CompetencyHeatMap = ({ answerLog, missBank, onStudy, onReviewMisses }) => {
  const log = answerLog || [];
  const bySub = {}, byDom = {};
  log.forEach(e => {
    (bySub[e.s] = bySub[e.s] || []).push(e.ok);
    (byDom[e.d] = byDom[e.d] || { c: 0, t: 0 }).t++;
    if (e.ok) byDom[e.d].c++;
  });
  const weakest = Object.entries(byDom).filter(([, v]) => v.t >= 3).map(([d, v]) => ({ d, p: pct(v.c, v.t), t: v.t })).sort((a, b) => a.p - b.p).slice(0, 3);
  const bank = Object.values(missBank || {});
  const retired = bank.filter(isRetired).length;
  const active = bank.length - retired;
  return (
    <Card style={{ marginBottom: 18 }}>
      <Cap color={T.orange2} mb={12}>Error Analysis · Accuracy by {WELCOME.subareaWord}</Cap>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 6 }}>
        {Object.keys(SUBTESTS).map(k => {
          const arr = bySub[k];
          const p = arr && arr.length ? pct(arr.filter(Boolean).length, arr.length) : null;
          const c = heatColor(p);
          const tr = arr ? trendOf(arr) : null;
          const trendGlyph = tr == null ? '–' : tr >= 5 ? '▲' : tr <= -5 ? '▼' : '–';
          const trendColor = tr == null ? T.muted : tr >= 5 ? T.green : tr <= -5 ? T.red : T.muted;
          const trendText = tr == null ? 'trend: not enough data' : tr >= 5 ? `trend: improving (+${tr} points)` : tr <= -5 ? `trend: declining (${tr} points)` : 'trend: steady';
          return (
            <div key={k} role="group" aria-label={`${WELCOME.subareaWord} ${SUBTESTS[k].roman}, ${SUBTESTS[k].label}: ${p == null ? 'no data yet' : `${p} percent accuracy across ${arr.length} answers`}. ${trendText}.`}
              style={{ padding: '12px 13px', borderRadius: 12, background: c.bg, border: `1.5px solid ${c.border}` }}>
              <div style={{ ...baseStyles.cap, fontSize: 9, color: c.fg, marginBottom: 6 }}>{WELCOME.subareaWord} {SUBTESTS[k].roman}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 800, color: c.fg, fontFeatureSettings: "'tnum' 1" }}>{p == null ? '—' : `${p}%`}</span>
                <span aria-hidden="true" style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 800, color: trendColor }}>{trendGlyph}</span>
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 11, color: T.ink, fontWeight: 600, lineHeight: 1.35, marginTop: 4, opacity: .85 }}>{SUBTESTS[k].label}</div>
              <div style={{ fontFamily: T.sans, fontSize: 10.5, color: T.muted, marginTop: 3 }}>{p == null ? 'no data yet' : `${arr.length} answers logged`}</div>
            </div>
          );
        })}
      </div>
      <p style={{ fontFamily: T.sans, fontSize: 11.5, color: T.muted, margin: '4px 0 14px' }}>Green ≥ 80% · amber 60–79% · red &lt; 60% · gray = no data. Trend compares your recent half of answers to your earlier half.</p>
      {weakest.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <Cap color={T.orange2} mb={8}>Weakest Areas — Study These First</Cap>
          {weakest.map((w, i) => (
            <div key={w.d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
              <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{i + 1}. {w.d}</span>
              <strong style={{ color: w.p >= 80 ? T.green : w.p >= 60 ? T.orange2 : T.red, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{w.p}%</strong>
              {typeof MODULES !== 'undefined' && MODULES[w.d] && (
                <button onClick={() => onStudy(w.d)} aria-label={`Open the study module for ${w.d}`}
                  style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.orange2, background: 'var(--accent-bg)', border: 'none', padding: '5px 12px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Study →</button>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: `1px solid ${T.hairline}`, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: T.sans, fontSize: 13.5, color: T.muted }}>
          {bank.length === 0 ? 'No missed questions banked yet.' : `You've cleared ${retired} of ${bank.length} misses · ${active} to review`}
        </span>
        <Btn onClick={onReviewMisses} variant={active > 0 ? 'accent' : 'ghost'} disabled={active === 0} style={{ padding: '10px 20px', fontSize: 13 }}>Review Misses{active > 0 ? ` (${active})` : ''}</Btn>
      </div>
    </Card>
  );
};

// ─── FEATURE 3 · REVIEW MISSES MODE ────────────────────────
const ReviewMisses = ({ items, missBank, onAnswer, onBack }) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const bank = Object.values(missBank || {});
  const retired = bank.filter(isRetired).length;
  const done = idx >= items.length;
  if (done || items.length === 0) return (
    <Page narrow>
      <Card style={{ textAlign: 'center', padding: '38px 26px' }}>
        <div style={{ marginBottom: 8, color: 'var(--green)' }}><Icon name="broom" size={42} stroke={1.4}/></div>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '1.6rem', color: T.ink, margin: '0 0 10px', letterSpacing: '-.02em' }}>Review session complete</h2>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, margin: '0 0 22px', lineHeight: 1.55 }}>You've cleared <strong style={{ color: T.green }}>{retired}</strong> of <strong style={{ color: T.ink }}>{bank.length}</strong> misses. A question retires after you answer it correctly twice in a row in review.</p>
        <Btn onClick={onBack} variant="primary" style={{ padding: '13px 30px' }}>← Back to My Progress</Btn>
      </Card>
    </Page>
  );
  const { key, q } = items[idx];
  const revealed = selected !== null;
  const entry = missBank?.[key];
  return (
    <Page narrow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <Pill color={T.orange2}>Review Misses · {WELCOME.subareaWord} {SUBTESTS[q.s]?.roman}</Pill>
        <span style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, fontWeight: 600 }}>Item {idx + 1} of {items.length} · cleared {retired} of {bank.length}</span>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 6 }}>{q.d}</div>
      {entry && <div style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, marginBottom: 14 }}>Missed {entry.missCount}× · {entry.correctStreak === 1 ? 'one more correct answer retires it' : 'answer correctly twice in a row to retire it'}</div>}
      <Card style={{ marginBottom: 18, padding: '22px 24px' }}>
        <p id="review-stem" style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.55, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
      </Card>
      <div role="radiogroup" aria-labelledby="review-stem" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {q.a.map((opt, i) => {
          const isSel = selected === i;
          const isCorrect = i === q.c;
          let border = T.hairline, bg = T.glass, ring = T.hairline, rbg = 'transparent', rfg = T.muted, marker = null;
          if (revealed && isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = 'var(--on-fill)'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓ Correct</span>; }
          else if (revealed && isSel) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = 'var(--on-fill)'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗ Your answer</span>; }
          return (
            <button key={i} role="radio" aria-checked={isSel} disabled={revealed}
              onClick={() => { if (revealed) return; setSelected(i); onAnswer(key, i === q.c); }}
              style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: `2px solid ${border}`, background: bg, cursor: revealed ? 'default' : 'pointer', fontFamily: T.sans, fontSize: 15.5, color: T.ink, transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 13 }}>
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${ring}`, background: rbg, color: rfg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {marker}
            </button>
          );
        })}
      </div>
      {revealed && q.r && (
        <Card style={{ marginBottom: 20, background: 'var(--accent-bg)' }}>
          <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8 }}>Annotation</div>
          <p style={{ fontFamily: T.sans, fontSize: 15, lineHeight: 1.6, color: T.ink, margin: 0 }}>{q.r}</p>
        </Card>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Btn onClick={onBack} variant="ghost" style={{ padding: '11px 22px' }}>← Exit review</Btn>
        <Btn onClick={() => { setSelected(null); setIdx(idx + 1); }} variant="primary" disabled={!revealed} style={{ padding: '11px 24px' }}>{idx < items.length - 1 ? 'Next →' : 'Finish'}</Btn>
      </div>
    </Page>
  );
};

// ─── MY PROGRESS (per-user performance report) ─────────────
// Reads the same persisted state the rest of the app writes — works entirely
// from this device's data, with or without the telemetry backend.
const scoreSummary = (s) => {
  const o = Object.values(s.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  return { overallPct: pct(o.correct, o.total), subtests: Object.fromEntries(Object.entries(s.subtests).map(([k, v]) => [k, pct(v.correct, v.total)])) };
};
const MyProgress = ({ st, onNav, onStudy, onReviewMisses }) => {
  const user = getUser();
  const domains = Object.keys(MODULES);
  const pre = st.pretestScores ? scoreSummary(st.pretestScores) : null;
  const post = st.postScores ? scoreSummary(st.postScores) : null;
  const latest = post || pre;
  const crDone = Object.keys(st.crScored || {}).length;
  const quizzes = st.quizHistory || [];
  const masteredIn = (d) => Object.values(st.conceptProgress?.[d] || {}).filter(p => p?.rating === 'got-it').length;
  const started = !!(pre || st.completedModules.length || quizzes.length || crDone);
  const readiness = latest ? Object.keys(SUBTESTS).map(k => ({ k, label: SUBTESTS[k].label, roman: SUBTESTS[k].roman, pct: latest.subtests[k] ?? 0, ready: (latest.subtests[k] ?? 0) >= 70 })) : [];
  const readyCount = readiness.filter(r => r.ready).length;
  const allReady = latest && readyCount === readiness.length && crDone >= CR_PROMPTS.length;

  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 26 }}>
        <div style={{ marginBottom: 6, color: 'var(--gold)' }}><Icon name="chart" size={42} stroke={1.4}/></div>
        <Cap color={T.orange2} mb={8}>Your Study Report</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: 0 }}>My Progress</h2>
        {user && <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 8 }}>Signed in as <strong style={{ color: T.ink }}>{user}</strong></p>}
      </header>

      {!started && (
        <Card style={{ textAlign: 'center', padding: '34px 24px' }}>
          <p style={{ fontFamily: T.sans, fontSize: 16, color: T.ink, margin: '0 0 6px', fontWeight: 700 }}>No study data yet</p>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, margin: '0 0 20px', lineHeight: 1.55 }}>Take the diagnostic pretest and this page becomes your personal report — readiness by competency, module mastery, and quiz history.</p>
          <Btn onClick={() => onNav('pretest')} variant="accent" style={{ padding: '13px 30px' }}>Begin the Pretest →</Btn>
        </Card>
      )}

      {started && <ReadinessProjection attempts={st.attempts} />}

      {started && <CompetencyHeatMap answerLog={st.answerLog} missBank={st.missBank} onStudy={onStudy} onReviewMisses={onReviewMisses} />}

      {latest && (
        <Card style={{ marginBottom: 18, background: allReady ? 'var(--green-bg)' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <Cap color={allReady ? T.green : T.orange2}>Exam Readiness {post ? '· from your post-test' : '· from your pretest'}</Cap>
            <Pill color={allReady ? T.green : T.orange2} bg={allReady ? 'var(--green-bg)' : undefined}>{allReady ? '✓ Ready' : `${readyCount} of ${readiness.length} competencies ready`}</Pill>
          </div>
          {readiness.map(r => (
            <ProgressRow key={r.k} value={r.pct} color={r.ready ? T.green : T.red}
              label={`${WELCOME.subareaWord} ${r.roman} · ${r.label}${pre && post ? ` (${pre.subtests[r.k] ?? 0}% → ${post.subtests[r.k] ?? 0}%)` : ''}`} />
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 14, flexWrap: 'wrap' }}>
            <span style={{ color: T.muted }}>Written assignments self-scored</span>
            <strong style={{ color: crDone >= CR_PROMPTS.length ? T.green : T.ink }}>{crDone} of {CR_PROMPTS.length}{crDone < CR_PROMPTS.length ? ' — keep drilling' : ' ✓'}</strong>
          </div>
          {pre && post && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 8, fontFamily: T.sans, fontSize: 14 }}>
              <span style={{ color: T.muted }}>Overall growth</span>
              <strong style={{ color: post.overallPct - pre.overallPct >= 0 ? T.green : T.red }}>{pre.overallPct}% → {post.overallPct}% ({post.overallPct - pre.overallPct > 0 ? '+' : ''}{post.overallPct - pre.overallPct}%)</strong>
            </div>
          )}
        </Card>
      )}

      {started && (
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={12}>Study Modules</Cap>
          <ProgressRow value={pct(st.completedModules.length, domains.length)} label={`${st.completedModules.length} of ${domains.length} modules completed`} color={T.orange} />
          <div style={{ marginTop: 6 }}>
            {domains.map(d => {
              const done = st.completedModules.includes(d);
              const score = st.moduleScores?.[d];
              const mastered = masteredIn(d);
              const total = MODULES[d]?.concepts?.length || 0;
              return (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
                  <span style={{ color: T.ink, fontWeight: 600, flex: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}><ModuleIcon emoji={MODULES[d]?.icon} size={16} style={{ color: 'var(--gold)' }}/>{d}</span>
                  <span style={{ color: T.muted, whiteSpace: 'nowrap' }}>{mastered}/{total} mastered</span>
                  {done
                    ? <Pill color={T.green} bg={'var(--green-bg)'}>✓ {score != null ? `${score}%` : 'done'}</Pill>
                    : <Pill color={T.muted} bg={'var(--surface-2)'}>{mastered > 0 ? 'in progress' : 'not started'}</Pill>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {quizzes.length > 0 && (
        <Card style={{ marginBottom: 18 }}>
          <Cap color={T.orange2} mb={12}>Quick-Quiz History</Cap>
          {quizzes.slice(-8).reverse().map((q, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.sans, fontSize: 13.5 }}>
              <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{q.domain}</span>
              <span style={{ color: T.muted, whiteSpace: 'nowrap' }}>{q.ts ? new Date(q.ts).toLocaleDateString() : ''} · {q.len} Q</span>
              <strong style={{ color: q.pct >= 70 ? T.green : T.red, fontVariantNumeric: 'tabular-nums' }}>{q.pct}%</strong>
            </div>
          ))}
        </Card>
      )}

      {started && (
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
          Progress is saved on this device and browser. Study milestones may also be shared with your instructor to support your preparation.
        </p>
      )}
    </Page>
  );
};

// ─── TIMED FULL-LENGTH MOCK EXAM ───────────────────────────
const fmtClock = (s) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
const MockTimer = ({ deadline, onExpire }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining = (deadline - now) / 1000;
  useEffect(() => { if (remaining <= 0) onExpire?.(); }, [remaining <= 0]); // eslint-disable-line react-hooks/exhaustive-deps
  const low = remaining <= 300; // last 5 min
  return (
    <div role="timer" aria-label={`Time remaining ${fmtClock(remaining)}`}
      style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 15, fontVariantNumeric: 'tabular-nums', color: low ? 'var(--on-fill)' : T.ink, background: low ? T.red : 'var(--surface-solid)', border: `1.5px solid ${low ? T.red : T.hairline}`, borderRadius: 99, padding: '6px 14px', whiteSpace: 'nowrap' }}>
      <Icon name="clock" size={14} style={{ marginRight: 5 }}/>{fmtClock(remaining)}
    </div>
  );
};

const MockExam = ({ st, up, finalizeMock }) => {
  const phase = st.mockPhase;

  if (!phase || phase === 'intro') return (
    <Page narrow>
      <div className="fade-up fade-up-1" style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 46, marginBottom: 10 }}>⏱</div>
        <Cap color={T.orange2} mb={10}>The Full Simulation</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: T.ink, letterSpacing: '-.025em', margin: '0 0 14px' }}>Timed Mock Exam</h2>
        <p style={{ fontFamily: T.sans, fontSize: 16, color: T.muted, lineHeight: 1.55, maxWidth: 560, margin: '0 auto 22px' }}>
          Real conditions: <strong>{MOCK_SR_COUNT} selected-response items + 3 constructed-response assignments</strong> under one <strong>2-hour-15-minute</strong> master countdown. The clock does not stop. Selected-response items are drawn fresh from the practice pool, so this form does not overlap your pretest or post-test.
        </p>
        <Card style={{ textAlign: 'left', maxWidth: 460, margin: '0 auto 24px' }}>
          <Cap color={T.orange2} mb={8}>Before you begin</Cap>
          <ul style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
            <li>Set aside the full 2h15m without interruption.</li>
            <li>You may move freely among the {MOCK_SR_COUNT} SR items before submitting them.</li>
            <li>Constructed-response exemplars stay hidden until you finish.</li>
            <li>When the timer expires, the exam submits automatically.</li>
          </ul>
        </Card>
        <Btn onClick={() => up({ mockPhase: 'sr', mockQs: buildMockSR(), mockAnswers: {}, mockIdx: 0, mockCRIdx: 0, mockScores: null, mockDeadline: Date.now() + MOCK_TIME_SECONDS * 1000 })} variant="accent" style={{ padding: '16px 44px', fontSize: 16 }}>Start the Timed Mock <span className="cta-arrow">→</span></Btn>
      </div>
    </Page>
  );

  const qs = st.mockQs || [];

  // ---- Selected-response section ----
  if (phase === 'sr') {
    const q = qs[st.mockIdx]; if (!q) return null;
    const sel = st.mockAnswers[st.mockIdx];
    const answered = Object.keys(st.mockAnswers).length;
    const subtest = SUBTESTS[q.s];
    return (
      <Page narrow>
        <div style={{ position: 'sticky', top: 64, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--bg)', padding: '8px 0', marginBottom: 8, flexWrap: 'wrap' }}>
          <Pill color={T.orange2}>Mock · Selected Response</Pill>
          <MockTimer deadline={st.mockDeadline} onExpire={() => finalizeMock(true)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12, flexWrap: 'wrap' }}>
          <span style={{ ...baseStyles.capSm }}>{WELCOME.subareaWord} {subtest?.roman} · {subtest?.label}</span>
          <span style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, fontWeight: 600 }}>Item {st.mockIdx + 1} of {qs.length} · {answered} answered</span>
        </div>
        {/* palette */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
          {qs.map((_, i) => {
            const done = st.mockAnswers[i] !== undefined; const cur = i === st.mockIdx;
            return <button key={i} onClick={() => up({ mockIdx: i })} aria-label={`Go to item ${i + 1}`}
              style={{ width: 26, height: 26, fontSize: 11, fontWeight: 700, fontFamily: T.sans, borderRadius: 6, cursor: 'pointer',
                border: `1.5px solid ${cur ? T.orange : (done ? 'var(--green-border)' : T.hairline)}`,
                background: cur ? 'var(--accent-bg)' : (done ? 'var(--green-bg)' : 'transparent'),
                color: cur ? T.orange2 : (done ? T.green : T.muted) }}>{i + 1}</button>;
          })}
        </div>
        <Card style={{ marginBottom: 16, padding: '22px 24px' }}>
          <p id="mock-stem" style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.55, color: T.ink, margin: 0, fontWeight: 500 }}>{q.q}</p>
        </Card>
        <div role="radiogroup" aria-labelledby="mock-stem" onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {q.a.map((opt, i) => {
            const isSel = sel === i;
            return (
              <button key={i} role="radio" aria-checked={isSel} onClick={() => up({ mockAnswers: { ...st.mockAnswers, [st.mockIdx]: i } })}
                tabIndex={isSel || (sel === undefined && i === 0) ? 0 : -1}
                style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: `2px solid ${isSel ? T.orange : T.hairline}`, background: isSel ? 'var(--accent-bg)' : T.glass, cursor: 'pointer', fontFamily: T.sans, fontSize: 15.5, color: T.ink, display: 'flex', alignItems: 'center', gap: 13 }}>
                <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSel ? T.orange : T.hairline}`, background: isSel ? T.orange : 'transparent', color: isSel ? 'var(--on-fill)' : T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
                <span style={{ lineHeight: 1.5 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Btn onClick={() => up({ mockIdx: Math.max(0, st.mockIdx - 1) })} variant="ghost" disabled={st.mockIdx === 0} style={{ padding: '11px 22px' }}>← Back</Btn>
          {st.mockIdx < qs.length - 1
            ? <Btn onClick={() => up({ mockIdx: st.mockIdx + 1 })} variant="primary" style={{ padding: '11px 24px' }}>Next →</Btn>
            : <Btn onClick={() => up({ mockPhase: 'cr', mockCRIdx: 0 })} variant="accent" style={{ padding: '11px 24px' }}>Go to Written Section →</Btn>}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Btn onClick={() => up({ mockPhase: 'cr', mockCRIdx: 0 })} variant="ghost" style={{ padding: '10px 20px', fontSize: 13 }}>Finish SR &amp; go to written section ({answered}/{qs.length} answered)</Btn>
        </div>
      </Page>
    );
  }

  // ---- Constructed-response section ----
  if (phase === 'cr') {
    const prompts = MOCK_CR_IDS.map(id => CR_PROMPTS.find(p => p.id === id)).filter(Boolean);
    const prompt = prompts[st.mockCRIdx] || prompts[0];
    return <MockCR st={st} up={up} prompt={prompt} prompts={prompts} deadline={st.mockDeadline} onExpire={() => finalizeMock(true)} onSubmit={() => finalizeMock(false)} />;
  }

  // ---- Report ----
  if (phase === 'done' && st.mockScores) {
    const s = st.mockScores;
    const overall = Object.values(s.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
    const oPct = pct(overall.correct, overall.total);
    const wp = weightedPct(s.subtests) ?? oPct;
    const scaled = pctToScaled(wp);
    const passed = scaled >= EXAM_SCALE.pass;
    const missed = qs.map((q, i) => ({ q, i, user: st.mockAnswers[i] })).filter(x => x.user !== x.q.c);
    const prompts = MOCK_CR_IDS.map(id => CR_PROMPTS.find(p => p.id === id)).filter(Boolean);
    return <MockReport s={s} oPct={oPct} scaled={scaled} passed={passed} missed={missed} prompts={prompts} up={up} />;
  }
  return null;
};

// CR section runner for the mock (exemplars hidden until whole exam submitted)
const MockCR = ({ st, up, prompt, prompts, deadline, onExpire, onSubmit }) => {
  const draftKey = `${STORAGE_KEY}-mockcr-${prompt.id}`;
  const [draft, setDraft] = useState('');
  useEffect(() => { try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setDraft(''); } }, [draftKey]);
  const save = (v) => { setDraft(v); try { localStorage.setItem(draftKey, v); } catch {} };
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  return (
    <Page narrow>
      <div style={{ position: 'sticky', top: 64, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--bg)', padding: '8px 0', marginBottom: 8, flexWrap: 'wrap' }}>
        <Pill color={T.orange2}>Mock · Written {st.mockCRIdx + 1} of {prompts.length}</Pill>
        <MockTimer deadline={deadline} onExpire={onExpire} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {prompts.map((p, i) => (
          <button key={p.id} onClick={() => up({ mockCRIdx: i })}
            style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, flex: 1, minWidth: 120, padding: '9px', borderRadius: 99, border: `1.5px solid ${i === st.mockCRIdx ? T.orange : T.hairline}`, background: i === st.mockCRIdx ? 'var(--accent-bg)' : 'transparent', color: i === st.mockCRIdx ? T.orange2 : T.muted, cursor: 'pointer' }}>Assignment {i + 1}</button>
        ))}
      </div>
      <Card style={{ marginBottom: 14 }}>
        <Cap color={T.orange2} mb={8}>Scenario</Cap>
        <p style={{ fontFamily: T.serif, fontSize: 15.5, lineHeight: 1.6, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.scenario}</p>
      </Card>
      <Card style={{ marginBottom: 14, background: 'var(--accent-bg)' }}>
        <Cap color={T.orange2} mb={8}>Your Task</Cap>
        <p style={{ fontFamily: T.serif, fontSize: 15.5, lineHeight: 1.6, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.task}</p>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <Cap color={T.orange2}>Your Response</Cap>
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{words} words</span>
      </div>
      <textarea value={draft} onChange={(e) => save(e.target.value)} placeholder="Write your constructed response here. Address each numbered part of the task."
        aria-label="Mock constructed response"
        style={{ width: '100%', minHeight: 280, padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${T.hairline}`, background: 'var(--surface-solid)', color: T.ink, fontSize: 16, lineHeight: 1.65, fontFamily: T.serif, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <Btn onClick={() => up({ mockCRIdx: Math.max(0, st.mockCRIdx - 1) })} variant="ghost" disabled={st.mockCRIdx === 0} style={{ padding: '11px 22px' }}>← Previous</Btn>
        {st.mockCRIdx < prompts.length - 1
          ? <Btn onClick={() => up({ mockCRIdx: st.mockCRIdx + 1 })} variant="primary" style={{ padding: '11px 22px' }}>Next Assignment →</Btn>
          : <Btn onClick={onSubmit} variant="accent" style={{ padding: '11px 24px' }}>Submit Mock Exam</Btn>}
      </div>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Btn onClick={() => up({ mockPhase: 'sr' })} variant="ghost" style={{ padding: '9px 18px', fontSize: 13 }}>← Back to selected-response items</Btn>
      </div>
    </Page>
  );
};

const MockReport = ({ s, oPct, scaled, passed, missed, prompts, up }) => {
  const [reviewing, setReviewing] = useState(false);
  const [showEx, setShowEx] = useState({});
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ marginBottom: 6, color: passed ? 'var(--green)' : 'var(--gold)' }}><Icon name={passed ? 'trophy' : 'chart'} size={44} stroke={1.4}/></div>
        <Cap color={T.orange2} mb={8}>Timed Mock · Results</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: '2rem', color: T.ink, letterSpacing: '-.02em', margin: '0 0 8px' }}>Mock Exam Report</h2>
      </header>
      <Card style={{ marginBottom: 18, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: T.sans, fontSize: 52, fontWeight: 800, color: passed ? T.green : T.orange2, lineHeight: 1 }}>{scaled}</span>
          <span style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, fontWeight: 600 }}>projected scaled score · pass = {EXAM_SCALE.pass}</span>
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted, marginTop: 10 }}>Selected-response raw score: <strong style={{ color: T.ink }}>{oPct}%</strong>. Constructed responses are self-scored below against each rubric. Projection reflects SR performance only.</p>
      </Card>
      <Card style={{ marginBottom: 18 }}>
        <Cap color={T.orange2} mb={14}>By {WELCOME.subareaWord}</Cap>
        {Object.entries(s.subtests).map(([k, v]) => (
          <ProgressRow key={k} value={pct(v.correct, v.total)} label={`${WELCOME.subareaWord} ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
        ))}
      </Card>
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 18 }}>Review the {missed.length} Missed SR Item{missed.length > 1 ? 's' : ''}</Btn>
      )}
      <Card style={{ marginBottom: 18 }}>
        <Cap color={T.orange2} mb={10}>Constructed-Response Exemplars</Cap>
        <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.muted, lineHeight: 1.55, marginBottom: 12 }}>Now that the exam is submitted, compare each of your written responses to a strong exemplar and score yourself against the rubric on the Constructed Response page.</p>
        {prompts.map((p, i) => (
          <div key={p.id} style={{ borderTop: i ? `1px solid ${T.hairline}` : 'none', paddingTop: i ? 12 : 0, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.ink }}>Assignment {i + 1}: {p.title}</span>
              <Btn onClick={() => setShowEx(x => ({ ...x, [p.id]: !x[p.id] }))} variant="ghost" style={{ padding: '7px 14px', fontSize: 12 }}>{showEx[p.id] ? 'Hide' : 'Show Exemplar'}</Btn>
            </div>
            {showEx[p.id] && (
              <div style={{ marginTop: 10, background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ fontFamily: T.serif, fontSize: 14.5, lineHeight: 1.65, color: T.ink, margin: 0, whiteSpace: 'pre-wrap' }}>{p.exemplar}</p>
              </div>
            )}
          </div>
        ))}
      </Card>
      <Btn onClick={() => up({ mockPhase: 'intro', mockQs: null, mockAnswers: {}, mockScores: null, mockIdx: 0, mockCRIdx: 0 })} variant="accent" style={{ width: '100%', padding: '15px' }}>Take Another Mock →</Btn>
    </Page>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────
const STORAGE_KEY = 'eas-201-state-v2';
const OLD_STORAGE_KEYS = [];
// fields that survive page reload (skip transient quiz session + reset confirmation)
const PERSIST_FIELDS = ['phase', 'qIndex', 'answers', 'pretestScores', 'pretestAnswers', 'posttestAnswers', 'postScores', 'posttestStarted', 'completedModules', 'conceptProgress', 'moduleScores', 'quizHistory', 'crScored', 'crPromptId', 'crSubmitted', 'theme', 'attempts', 'answerLog', 'missBank', 'errorBankSeeded'];
// transient phases can't resume after a reload (their session state isn't
// persisted) — send the user to the nearest hub instead of a crash/blank page
const PHASE_FALLBACK = { module: 'modules', quizRun: 'quizPicker', quizDone: 'quizPicker', reviewMisses: 'progress', mock: 'welcome' };

export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  // qKey → full question object, for resolving banked misses back to content
  const POOL_LOOKUP = useMemo(() => {
    const m = {};
    Object.values(QUIZ_POOL).forEach(list => list.forEach(q => { m[qKey(q)] = q; }));
    return m;
  }, [QUIZ_POOL]);
  const [st, setSt] = useState(() => {
    const base = { ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} };
    try { OLD_STORAGE_KEYS.forEach(k => localStorage.removeItem(k)); } catch {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // only restore the persisted fields; ignore stale transient state
        const restored = {};
        for (const k of PERSIST_FIELDS) if (k in saved) restored[k] = saved[k];
        if (PHASE_FALLBACK[restored.phase]) restored.phase = PHASE_FALLBACK[restored.phase];
        if (['results', 'modules', 'posttest'].includes(restored.phase) && !restored.pretestScores) restored.phase = 'welcome';
        if (restored.phase === 'comparison' && !restored.postScores) restored.phase = restored.pretestScores ? 'results' : 'welcome';
        // one-time backfill: seed the error-analysis layer from recoverable
        // past attempts (stored pretest/posttest answers + scores). If nothing
        // is recoverable the bank simply starts empty — never fabricated.
        if (!restored.errorBankSeeded) {
          let seeded = { answerLog: restored.answerLog || [], missBank: restored.missBank || {} };
          const attempts = (restored.attempts || []).slice();
          if (restored.pretestScores && restored.pretestAnswers && Object.keys(restored.pretestAnswers).length) {
            seeded = logAnswers(seeded.answerLog, seeded.missBank, PRETEST, restored.pretestAnswers);
            attempts.push({ kind: 'pretest', pct: scoreSummary(restored.pretestScores).overallPct, wpct: weightedPct(restored.pretestScores.subtests) ?? scoreSummary(restored.pretestScores).overallPct, ts: null });
          }
          (restored.quizHistory || []).forEach(qh => { if (typeof qh.pct === 'number') attempts.push({ kind: 'quiz', pct: qh.pct, wpct: qh.pct, ts: qh.ts || null }); });
          if (restored.postScores && restored.posttestAnswers && Object.keys(restored.posttestAnswers).length) {
            seeded = logAnswers(seeded.answerLog, seeded.missBank, POSTTEST, restored.posttestAnswers);
            attempts.push({ kind: 'posttest', pct: scoreSummary(restored.postScores).overallPct, wpct: weightedPct(restored.postScores.subtests) ?? scoreSummary(restored.postScores).overallPct, ts: null });
          }
          restored.answerLog = seeded.answerLog;
          restored.missBank = seeded.missBank;
          restored.attempts = attempts.slice(-ATTEMPT_CAP);
          restored.errorBankSeeded = true;
        }
        return { ...base, ...restored };
      }
    } catch {}
    return base;
  });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  // persist milestone state on every change
  useEffect(() => {
    try {
      const persist = {};
      for (const k of PERSIST_FIELDS) if (k in st) persist[k] = st[k];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {}
  }, [st]);
  // reflect light/dark theme onto <html data-theme> so the CSS variables flip
  useEffect(() => { document.documentElement.dataset.theme = st.theme || 'light'; }, [st.theme]);
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) : [];
  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase: 'welcome',    confirmReset: false }),
      flashcards: () => up({ phase: 'flashcards', confirmReset: false }),
      quiz:       () => up({ phase: 'quizPicker', confirmReset: false, quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} }),
      mock:       () => up({ phase: 'mock', confirmReset: false, mockPhase: st.mockPhase === 'done' ? 'done' : (st.mockPhase === 'sr' || st.mockPhase === 'cr' ? st.mockPhase : 'intro') }),
      // restore the saved pretest/posttest answers so re-entering doesn't show the OTHER exam's selections
      pretest:    () => up({ phase: 'pretest',    confirmReset: false, answers: { ...(st.pretestAnswers || {}) }, qIndex: 0 }),
      cresponse:  () => up({ phase: 'cresponse',  confirmReset: false }),
      progress:   () => up({ phase: 'progress',   confirmReset: false }),
      results:    () => st.pretestScores && up({ phase: 'results',    confirmReset: false }),
      modules:    () => st.pretestScores && up({ phase: 'modules',    confirmReset: false }),
      posttest:   () => st.pretestScores && up({ phase: 'posttest',   confirmReset: false, answers: { ...(st.posttestAnswers || {}) }, qIndex: 0, posttestStarted: !!st.posttestStarted || !!st.postScores }),
      comparison: () => st.postScores    && up({ phase: 'comparison', confirmReset: false }),
    };
    m[id]?.();
  };
  const nav = <NavBar st={st} onNav={handleNav}
    onReset={() => up({ confirmReset: true })}
    onConfirmReset={() => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
    }}
    onCancelReset={() => up({ confirmReset: false })}
    onToggleTheme={() => up({ theme: st.theme === 'dark' ? 'light' : 'dark' })} />;

  if (st.phase === 'welcome')    return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
  if (st.phase === 'flashcards') return <Shell nav={nav}><Flashcards st={st} up={up} /></Shell>;
  if (st.phase === 'cresponse')  return <Shell nav={nav}><ConstructedResponse st={st} up={up} /></Shell>;
  if (st.phase === 'mock')       return <Shell nav={nav}><MockExam st={st} up={up} finalizeMock={(expired) => {
    const qs = st.mockQs || [];
    const s = calcScores(qs, st.mockAnswers);
    const sum = scoreSummary(s);
    const logs = logAnswers(st.answerLog, st.missBank, qs, st.mockAnswers);
    up({ mockPhase: 'done', mockScores: s, attempts: [...(st.attempts || []), { kind: 'mock', pct: sum.overallPct, wpct: weightedPct(s.subtests) ?? sum.overallPct, ts: new Date().toISOString() }].slice(-ATTEMPT_CAP), ...logs });
    track('mock_completed', { ...sum, byDomain: byDomainPct(qs, st.mockAnswers), expired: !!expired, answered: Object.keys(st.mockAnswers).length, total: qs.length });
  }} /></Shell>;
  if (st.phase === 'progress')   return <Shell nav={nav}><MyProgress st={st} onNav={handleNav}
    onStudy={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {}, confirmReset: false })}
    onReviewMisses={() => {
      const items = Object.values(st.missBank || {}).filter(e => !isRetired(e)).map(e => POOL_LOOKUP[e.id] ? { key: e.id, q: POOL_LOOKUP[e.id] } : null).filter(Boolean);
      if (items.length) up({ phase: 'reviewMisses', reviewQs: shuffle(items), confirmReset: false });
    }} /></Shell>;
  if (st.phase === 'reviewMisses' && st.reviewQs) return <Shell nav={nav}><ReviewMisses items={st.reviewQs} missBank={st.missBank}
    onAnswer={(key, correct) => up({ missBank: reviewAnswer(st.missBank, key, correct) })}
    onBack={() => up({ phase: 'progress', reviewQs: null })} /></Shell>;
  if (st.phase === 'quizPicker') return <Shell nav={nav}><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'quizRun' && st.quizQs) return <Shell nav={nav}><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => { const correct = st.quizQs.filter((q, i) => st.quizAnswers[i] === q.c).length; const p = pct(correct, st.quizQs.length); track('quiz_completed', { domain: st.quizDomain, len: st.quizQs.length, pct: p, byDomain: byDomainPct(st.quizQs, st.quizAnswers), missedCount: st.quizQs.length - correct }); const logs = logAnswers(st.answerLog, st.missBank, st.quizQs, st.quizAnswers); up({ phase: 'quizDone', quizHistory: [...(st.quizHistory || []), { domain: st.quizDomain, len: st.quizQs.length, pct: p, ts: new Date().toISOString() }].slice(-30), attempts: [...(st.attempts || []), { kind: 'quiz', pct: p, wpct: p, ts: new Date().toISOString() }].slice(-ATTEMPT_CAP), ...logs }); }} phase={`${st.quizDomain} Quiz`} /></Shell>;
  if (st.phase === 'quizDone' && st.quizQs) return <Shell nav={nav}><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'pretest')    return <Shell nav={nav}><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, pretestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); const sum = scoreSummary(s); const logs = logAnswers(st.answerLog, st.missBank, PRETEST, st.answers); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers }, attempts: [...(st.attempts || []), { kind: 'pretest', pct: sum.overallPct, wpct: weightedPct(s.subtests) ?? sum.overallPct, ts: new Date().toISOString() }].slice(-ATTEMPT_CAP), ...logs }); track('pretest_completed', { ...sum, byDomain: byDomainPct(PRETEST, st.answers), weak: Object.entries(s.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) }); }} phase="Pretest" /></Shell>;
  if (st.phase === 'results')    return <Shell nav={nav}><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Shell>;
  if (st.phase === 'modules')    return <Shell nav={nav}><ModuleHub domains={[...weak, ...Object.keys(MODULES).filter(d => !weak.includes(d))]} weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Shell>;
  if (st.phase === 'module')     return <Shell nav={nav}><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} conceptProgress={st.conceptProgress} onConceptView={(idx) => setSt(p => { const dom = p.activeModule; const cur = p.conceptProgress?.[dom] || {}; if (cur[idx]?.viewed) return p; return { ...p, conceptProgress: { ...p.conceptProgress, [dom]: { ...cur, [idx]: { ...(cur[idx] || {}), viewed: true } } } }; })} onConceptRate={(idx, rating) => setSt(p => { const dom = p.activeModule; const cur = p.conceptProgress?.[dom] || {}; return { ...p, conceptProgress: { ...p.conceptProgress, [dom]: { ...cur, [idx]: { ...(cur[idx] || {}), viewed: true, rating } } } }; })} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => { const dom = st.activeModule; const practice = MODULES[dom]?.practice || []; const score = practice.length ? pct(practice.filter((q, i) => st.modPAnswers[i] === q.c).length, practice.length) : 0; const prog = st.conceptProgress?.[dom] || {}; track('module_completed', { domain: dom, practicePct: score, mastered: Object.values(prog).filter(p => p?.rating === 'got-it').length, concepts: (MODULES[dom]?.concepts || []).length }); const pqs = practice.map(p2 => ({ ...p2, d: dom, s: p2.s || domainSubtest(dom) })); const logs = logAnswers(st.answerLog, st.missBank, pqs, st.modPAnswers); up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, dom])], moduleScores: { ...st.moduleScores, [dom]: score }, ...logs }); }} /></Shell>;
  if (st.phase === 'posttest')   return <Shell nav={nav}>{!st.posttestStarted ? (
    <Page narrow>
      <div className="fade-up fade-up-1" style={{ textAlign: 'center', padding: '56px 0' }}>
        <div style={{ marginBottom: 10, color: 'var(--gold)' }}><Icon name="flag" size={44} stroke={1.4}/></div>
        <Cap color={T.orange2} mb={10}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: T.ink, letterSpacing: '-.025em', margin: '0 0 16px' }}>The Post-Test</h2>
        <p style={{ fontFamily: T.sans, fontSize: 17, color: T.muted, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 32px' }}>{POSTTEST.length} {WELCOME.posttestIntro}</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, posttestAnswers: {}, qIndex: 0 })} variant="accent" style={{ padding: '16px 44px', fontSize: 16 }}>Begin the Post-Test <span className="cta-arrow">→</span></Btn>
      </div>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, posttestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); const sum = scoreSummary(s); const logs = logAnswers(st.answerLog, st.missBank, POSTTEST, st.answers); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers }, attempts: [...(st.attempts || []), { kind: 'posttest', pct: sum.overallPct, wpct: weightedPct(s.subtests) ?? sum.overallPct, ts: new Date().toISOString() }].slice(-ATTEMPT_CAP), ...logs }); const pre = st.pretestScores ? scoreSummary(st.pretestScores).overallPct : null; track('posttest_completed', { ...sum, byDomain: byDomainPct(POSTTEST, st.answers), prePct: pre, growth: pre == null ? null : sum.overallPct - pre }); }} phase="Post-Test" />
  )}</Shell>;
  if (st.phase === 'comparison') return <Shell nav={nav}><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  }} /></Shell>;
  // unknown phase (e.g. stale persisted value) — land on home, never a blank page
  return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
}
