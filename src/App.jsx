import { useState, useEffect, useMemo } from "react";
import { QuickCheck, CategorizeGame, AnimatedVisual, MasteryMap } from "./Engagement.jsx";
import { TTSButton } from "./TTS.jsx";
import { MODULE_ENHANCEMENTS } from "./data/moduleEnhancements.js";
import { track, getUser } from "./tracking.js";

// ─── DESIGN SYSTEM (BCBA "Sunrise" card system · OneLove warm palette) ──
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
  serif:`Georgia,'Times New Roman',serif`,
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
    "label": "Teacher Responsibilities",
    "roman": "IV"
  },
  "C5": {
    "label": "School–Home Relationships",
    "roman": "V"
  }
};

const WELCOME = {
  "imprint": "New York State · NYSTCE Educating All Students (EAS · Field 201)",
  "title": {
    "pre": "Educating All",
    "italic": "Students",
    "post": ""
  },
  "subtitle": "A complete preparation course for the NYSTCE Educating All Students (EAS, field 201) test — five competencies, forty selected-response items, and three constructed-response assignments.",
  "alignment": [
    "NYSTCE EAS 201 Framework",
    "Diverse Learners · ELLs · SWD",
    "5 Competencies"
  ],
  "steps": [
    [
      "Take the Pretest",
      "Thirty questions across the five competencies establish your baseline."
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
      "Thirty fresh questions measure your growth — then drill the three written assignments."
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
            "School–Home Relationships",
            "8% SR"
          ]
        ]
      }
    ],
    "note": "Constructed-response assignments are distributed across the first three competencies (one each). Figures reflect the official EAS (201) test design."
  }
};

const PRETEST = [
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Ms. Okafor notices that several of her Black and Latino students rarely volunteer answers during whole-class discussion, yet they actively engage and demonstrate mastery in small-group work. Which action best reflects culturally responsive teaching?",
    "a": [
      "Incorporate varied participation structures — partner talk, small groups, written responses — to honor diverse cultural communication norms.",
      "Continue whole-class discussion as the primary structure because it prepares students for standardized expectations.",
      "Contact families to explain that verbal participation in class is required for success.",
      "Refer students to the school counselor to investigate whether anxiety is limiting participation."
    ],
    "c": 0,
    "r": "Option A is correct because culturally responsive pedagogy recognizes that participation norms vary across cultures; students may learn well through collectivist or collaborative structures rather than competitive public recitation. Option B is the strongest distractor but is wrong: it ignores documented cultural variability in discourse styles and frames one narrow participation mode as the only legitimate one. Option D medicalizes a cultural difference without evidence of a disability or disorder."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "Mr. Rivera assigns a weekend project requiring students to visit a local museum and submit a reflection. Three students inform him they cannot afford admission. What is the most appropriate response?",
    "a": [
      "Provide a reduced-cost option by contacting the museum for a school discount.",
      "Excuse those students from the assignment and give them an alternate grade.",
      "Redesign the task so all students can access equivalent learning through free digital resources or virtual tours, ensuring no student is disadvantaged by socioeconomic status.",
      "Ask the school social worker to apply for emergency funds to cover admission for those three students."
    ],
    "c": 2,
    "r": "Option C is correct because equity requires that instructional tasks do not create barriers based on socioeconomic status; redesigning for universal access upholds this principle and maintains the same learning objective for all students. Option A is the strongest distractor but is wrong: it partially helps yet still may not resolve the barrier and does not address the principle of equitable design from the outset."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "A Mandarin-speaking student who arrived eight months ago converses fluently with peers at lunch and on the playground but struggles to interpret primary-source documents in social studies. The teacher should understand this pattern as:",
    "a": [
      "Evidence that the student has a reading disability that should trigger a CSE referral.",
      "Typical development: the student has acquired Basic Interpersonal Communication Skills (BICS) but has not yet developed the Cognitive Academic Language Proficiency (CALP) needed for content-area literacy.",
      "A sign that the student is not motivated to apply language skills to academic tasks.",
      "Proof that the student's ENL placement is too high and should be reduced."
    ],
    "c": 1,
    "r": "Option B is correct because Cummins's BICS/CALP framework explains that conversational fluency (BICS) typically emerges within 1–2 years, while academic language proficiency (CALP) takes 5–7 years. Option A is the strongest distractor but is wrong: this pattern is expected for recent arrivals and does not constitute grounds for a disability referral without additional evidence of a processing disorder; under IDEA, a difficulty that is primarily due to limited English proficiency may not be the basis for special education identification."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "A teacher in a high-poverty urban school notices that few families attend parent-teacher conferences. Which interpretation and action is most aligned with research on family engagement?",
    "a": [
      "Low attendance indicates lack of parental investment; send home a letter emphasizing the importance of involvement.",
      "Students whose parents do not attend conferences should receive additional homework to compensate for less home support.",
      "Report persistent non-attendance to the principal as a potential neglect concern.",
      "Families may face structural barriers such as work schedules, transportation, or distrust of institutions; offer flexible meeting times, home visits, or community-based locations."
    ],
    "c": 3,
    "r": "Option D is correct because research consistently shows that non-attendance correlates with structural barriers, not lack of care; offering flexible, community-accessible options removes barriers and builds trust. Option A is the strongest distractor but is wrong: it misattributes absence to deficit parenting, which is both inaccurate and harmful to the teacher–family relationship."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "Ms. Delgado has a student who finishes every assignment in half the allotted time, asks complex extension questions, and still earns high marks. The student recently expressed that class is \"boring.\" Which response best addresses this student's needs?",
    "a": [
      "Recommend the student for the school's gifted and talented program and simultaneously provide curriculum compacting and tiered tasks in the current classroom.",
      "Allow the student to assist other students as a peer tutor during free time.",
      "Praise the student's achievement and remind them that patience is a virtue.",
      "Assign additional practice problems from the same grade-level material to keep the student occupied."
    ],
    "c": 0,
    "r": "Option A is correct because gifted learners require curriculum compacting (removing already-mastered content) and tiered or accelerated tasks to maintain engagement and growth, while a gifted program referral addresses long-term placement. Option B is the strongest distractor but is wrong: using the student as a peer tutor manages classroom logistics without providing intellectual challenge and does not address the identified need."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "During Ramadan, a Muslim student arrives to school visibly fatigued and asks to be excused from a demanding physical education unit. What should the teacher do first?",
    "a": [
      "Require full participation because NYS physical education requirements apply equally to all students.",
      "Excuse the student from PE for the entire month without offering instructional alternatives.",
      "Consult with the student and family to understand their needs, and work with the PE teacher to identify reasonable accommodations that maintain learning goals while respecting religious observance.",
      "Document the student's request and refer the matter to the principal to decide."
    ],
    "c": 2,
    "r": "Option C is correct because students' free exercise of religion is protected under the First Amendment and Title VI, and NYSED guidance directs schools to make reasonable accommodations for religious observance; consulting the family and identifying accommodations respects both the student's rights and instructional objectives. Option A is the strongest distractor but is wrong: it disregards the obligation to accommodate sincerely held religious practice. Option B removes the student from instruction without exploring alternatives."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Before a standardized math test, a teacher says to the class, \"I know some groups historically score lower on these tests, so I want you to know I believe in all of you.\" Research on stereotype threat suggests this statement will most likely:",
    "a": [
      "Reduce anxiety for all students by communicating high expectations.",
      "Activate stereotype threat for students who belong to negatively stereotyped groups, potentially lowering their performance.",
      "Have no effect because students are already aware of achievement gaps.",
      "Improve scores for students from underrepresented groups by countering the stereotype."
    ],
    "c": 1,
    "r": "Option B is correct because Steele and Aronson's stereotype threat research demonstrates that merely invoking group-based stereotypes — even to refute them — can activate the threat and suppress performance for targeted students. Option A is the strongest distractor but is wrong: it incorrectly assumes that positive framing neutralizes the effect of raising the stereotype in the first place."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 4th-grade student from the Dominican Republic arrived in the U.S. two years ago and scored at the Transitioning level on the most recent NYSESLAT. She converses fluently with peers at lunch and on the playground but struggles significantly with written science reports. Her ENL teacher shares this observation at a team meeting. Which explanation BEST accounts for this pattern?",
    "a": [
      "The student has developed Basic Interpersonal Communicative Skills (BICS) but has not yet attained the Cognitive Academic Language Proficiency (CALP) required for academic tasks.",
      "The student likely has an undiagnosed learning disability affecting written expression, and the team should request a special education evaluation right away.",
      "The student's home language is interfering with her writing and is the primary cause of her difficulties.",
      "The student is unmotivated because academic tasks are less interesting to her than social conversation."
    ],
    "c": 0,
    "r": "Conversational fluency (BICS) typically emerges in roughly 1 to 3 years, while the decontextualized academic language proficiency (CALP) needed for science writing takes about 5 to 7 years (Cummins). Fluent peer interaction alongside academic-writing struggles is the textbook BICS/CALP gap, especially for a student who is still only at the Transitioning level. The learning-disability option is the strongest distractor but is premature: under IDEA's eligibility rules (34 CFR 300.306(b)), limited English proficiency may not be the determinant factor in a disability decision, so the team must first ensure the student has received appropriate language support and gathered language-proficiency data. Home-language interference does not explain robust oral fluency, and attributing the pattern to motivation ignores the predictable second-language-acquisition trajectory."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "A school district in New York is designing services for a growing population of recently arrived ELLs across multiple grade levels. District leadership wants students to maintain and develop proficiency in both their home language and English, and to enroll English-proficient peers alongside them. Which instructional model BEST aligns with this goal?",
    "a": [
      "Pull-out (Stand-Alone) ENL, where students receive English language development from a certified ENL teacher in a separate setting.",
      "Dual Language bilingual education, where instruction is delivered in both English and the partner language with the goal of biliteracy for ELLs and English-proficient peers together.",
      "Transitional Bilingual Education, which uses the home language as a temporary bridge that is phased out as English develops.",
      "Structured submersion, which places ELLs in general education classrooms with no additional language services."
    ],
    "c": 1,
    "r": "Dual Language is the only listed model designed to develop and sustain proficiency in two languages (an additive model) and to enroll both ELLs and English-proficient students together, matching the district's biliteracy and home-language-maintenance goal. Transitional Bilingual Education is the strongest distractor, but it is a subtractive model: the home language is used instrumentally and phased out rather than maintained. Stand-Alone ENL develops English without sustaining the home language. Structured submersion provides no services and is not a legally permissible stand-alone approach, because Commissioner's Regulations Part 154 require documented ENL or bilingual services for every identified ELL."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A newly enrolled kindergartner's Home Language Questionnaire indicates that a language other than English is spoken at home. Which is the teacher's MOST IMMEDIATE required next step under New York State regulations?",
    "a": [
      "Refer the student to the Committee on Special Education (CSE) for a bilingual evaluation.",
      "Notify the student's parents that the child will automatically be placed in a bilingual classroom.",
      "Ensure the student is screened with the NYSITELL within the mandated timeframe to determine ELL identification and the appropriate level of service.",
      "Begin Stand-Alone ENL pull-out services immediately, before any screening is completed."
    ],
    "c": 2,
    "r": "Under Commissioner's Regulations Part 154, when the Home Language Questionnaire indicates a language other than English, the district must administer the NYSITELL (New York State Identification Test for English Language Learners) within 10 school days of initial enrollment to determine ELL identification and the appropriate program and level of service. A CSE referral is premature here: limited English proficiency may not be the determinant factor in a disability decision under IDEA (34 CFR 300.306(b)), so language identification and support precede any disability evaluation. Beginning services before identification reverses the required sequence, and bilingual placement is a parent-choice program, not an automatic assignment, since families may decline bilingual education while still receiving required ENL services."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 7th-grade science teacher has several ELL students whose home cultures emphasize collaborative, communal learning rather than individual competition. When introducing a new unit on ecosystems, which approach BEST supports these students' cultural and linguistic needs?",
    "a": [
      "Assign individual research papers so students can develop independent academic writing skills before any group work.",
      "Postpone complex ecosystem concepts until the ELL students reach a higher English proficiency level.",
      "Pair each ELL with a high-achieving English-proficient student and ask that student to explain the content to them.",
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
      "Provide the student with an approved bilingual glossary of science terms and extended time.",
      "Have a bilingual teacher orally translate every test question into the home language during the assessment.",
      "Excuse the student from the state assessment until she scores Commanding on the NYSESLAT.",
      "Have the student complete the science assessment entirely in her home language."
    ],
    "c": 0,
    "r": "NYSED permits ELLs to use approved testing accommodations on content-area assessments such as bilingual glossaries and dictionaries, extended time, a separate location, and oral translation of directions; a glossary clarifies vocabulary without altering the science construct being measured. Full oral translation of all questions is the strongest distractor but is not a permitted accommodation, because translating items changes the standardized task. Excusing the student is wrong: ELLs participate in state content assessments with appropriate supports, and exemption is not permitted under federal assessment requirements. Completing the science test entirely in the home language is not an approved NYS accommodation for the general state assessment and would change the conditions under which the construct is measured."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A 3rd-grade teacher notices that the parents of her ELL students rarely attend family events or respond to school communications. She suspects language barriers may be a contributing factor. Which action is MOST consistent with federal and state requirements and best practice?",
    "a": [
      "Send communications home only in English to encourage parents to develop their own English proficiency.",
      "Partner with the school's parent liaison to provide translated notices and trained interpreter services for school events and conferences.",
      "Ask each student to translate all school communications for their parents.",
      "Reduce the frequency of home communications until a district interpreter becomes available."
    ],
    "c": 1,
    "r": "Title VI of the Civil Rights Act requires schools to communicate meaningfully with limited-English-proficient parents in a language they can understand, and Part 154 likewise requires notification of identification, placement, and progress in an accessible language. Providing translated materials and trained, qualified interpreters fulfills this obligation and supports authentic engagement. Using the student as interpreter is a common but inappropriate practice that places developmentally inappropriate responsibility on a child, risks inaccurate communication of sensitive information, and is discouraged by professional and legal guidance. Sending English-only notices actively disadvantages these families and fails the meaningful-communication standard, and reducing communication withholds information families are entitled to receive."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "An ENL teacher is concerned about a newcomer student who arrived 6 months ago and is making slow progress in English despite consistent attendance. A classroom teacher suggests referring the student for a special education evaluation. What should the ENL teacher advise?",
    "a": [
      "Agree with the referral immediately, since 6 months is enough time for a newcomer to show meaningful English growth.",
      "Advise that ELL students are exempt from special education eligibility and cannot be referred to the CSE.",
      "Explain that the student may be referred, but that under IDEA limited English proficiency may not be the determinant factor in an eligibility decision, so the team must first provide appropriate ENL instruction with progress monitoring and gather data showing difficulties across languages and contexts.",
      "Recommend waiting at least 5 more years before any evaluation, because academic language acquisition always takes that long."
    ],
    "c": 2,
    "r": "Under IDEA, a student may not be identified as having a disability if the determinant factor is limited English proficiency (34 CFR 300.306(b)), and evaluations must be nondiscriminatory (34 CFR 300.304). The team should ensure appropriate, evidence-based ENL instruction has been delivered with progress monitored, and gather data indicating difficulties exist across languages and settings, before concluding a disability is present; this guards against misidentification while still allowing referral. Agreeing immediately is the strongest distractor but ignores that 6 months is far too little time and that LEP cannot drive an eligibility decision. The exemption option is false, since ELLs are fully eligible for special education when a disability is properly identified, and a fixed multi-year wait improperly delays evaluation for a student who may have a genuine disability."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A 9th-grade student with a specific learning disability has an IEP that includes extended time on assessments. The student's general education English teacher tells the special education teacher, 'I give everyone the same time because equal treatment is fair.' Which response BEST reflects the teacher's legal and ethical obligations under IDEA?",
    "a": [
      "The student's IEP accommodations are legally binding and must be implemented in the general education setting.",
      "The general education teacher is correct; consistent classroom policies supersede IEP accommodations.",
      "Extended time should be provided only when the student requests it, to promote self-advocacy.",
      "The accommodation can be waived if the class uses open-note assessments instead."
    ],
    "c": 0,
    "r": "Under IDEA (20 U.S.C. § 1400 et seq.), IEP accommodations are legally mandated and enforceable in all educational settings, including general education classrooms; a teacher's personal equity philosophy cannot override them, and a material failure to implement a documented accommodation can constitute a denial of FAPE. The 'equal treatment' option is the strongest distractor because it misapplies equality, conflating identical treatment with the equitable, individualized supports the law requires. Conditioning the accommodation on a student request or waiving it for open-note tests both unilaterally narrow what the IEP guarantees, which a teacher may not do."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A 2nd-grade teacher notices that four students are consistently below grade level in reading fluency. The school uses a multi-tiered system of supports. What is the MOST appropriate first step?",
    "a": [
      "Move the students to a lower reading group and use below-grade-level materials indefinitely.",
      "Provide differentiated, research-based Tier 1 instruction and monitor progress with frequent data collection.",
      "Refer all four students immediately to the Committee on Special Education (CSE) for evaluation.",
      "Contact parents to inform them that their children likely have learning disabilities."
    ],
    "c": 1,
    "r": "In a multi-tiered RtI framework, universal Tier 1 high-quality instruction with frequent progress monitoring is the first response to students performing below benchmark; targeted Tier 2 support follows for non-responders, and a CSE referral is appropriate once intervention data are documented. The immediate-CSE-referral option is the strongest distractor because it bypasses the data-driven intervention process; in New York, eligibility cannot be found when the determinant factor is lack of appropriate reading instruction. Telling parents the children 'likely have learning disabilities' makes an unsupported diagnostic claim, and permanently lowering materials denies grade-level access."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 7th-grade student with ADHD does not qualify for special education services under IDEA but continues to struggle academically due to difficulty sustaining attention. Which plan MOST appropriately addresses this student's needs?",
    "a": [
      "An informal verbal agreement between the teacher and the student's parents.",
      "An Individualized Education Program (IEP) developed by the CSE.",
      "A Section 504 accommodation plan developed by the school's 504 team.",
      "A behavioral intervention plan created solely by the classroom teacher."
    ],
    "c": 2,
    "r": "Section 504 of the Rehabilitation Act (29 U.S.C. § 794) protects students whose impairment substantially limits a major life activity (such as concentrating) but who do not require specially designed instruction; a 504 plan provides the formal, documented accommodations and is managed by the school's 504 team, not the CSE. The IEP option is the strongest distractor because IDEA eligibility requires both a qualifying disability classification and a need for special education, criteria this student does not meet. An informal verbal agreement provides no enforceable protection, and a teacher-only behavior plan is neither a formal plan nor matched to the attention-based need."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A high school science teacher wants to proactively reduce barriers for all learners, including students with disabilities, before any accommodations are needed. Which instructional design approach BEST aligns with this goal?",
    "a": [
      "Providing retroactive accommodations only after a student demonstrates failure.",
      "Grouping students with disabilities separately to deliver modified content.",
      "Relying on paraprofessionals to adapt materials on an as-needed basis during instruction.",
      "Designing lessons using multiple means of representation, action and expression, and engagement from the outset."
    ],
    "c": 3,
    "r": "Universal Design for Learning (UDL) is a proactive, research-based framework that reduces barriers by embedding flexibility, the three principles of multiple means of representation, action and expression, and engagement, into instruction from the design stage. The paraprofessional option is the strongest distractor because reactive, as-needed adaptation is a legitimate support but is not proactive universal design and shifts responsibility away from the teacher of record. Retroactive accommodations are reactive by definition, and separate grouping with modified content lowers expectations rather than designing access for all."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A parent disagrees with the CSE's decision to place her child with autism in a self-contained setting and requests a more inclusive placement. Under IDEA, what is the parent's FIRST available formal recourse?",
    "a": [
      "Request mediation or file for an impartial due process hearing.",
      "File a complaint directly with the U.S. Department of Education Office for Civil Rights.",
      "Withdraw the child from public school and enroll in a private placement at district expense immediately.",
      "Petition the school board to overturn the CSE decision at the next public meeting."
    ],
    "c": 0,
    "r": "IDEA's procedural safeguards give parents mediation and an impartial due process hearing as the formal mechanisms to resolve disagreements over identification, evaluation, or placement. The OCR option is the strongest distractor because OCR enforces Section 504/ADA and Title VI/IX complaints; IDEA placement disputes go through the state's due process system, not OCR. Unilateral private placement may later yield reimbursement only through that same due process route and carries financial risk, and a school-board petition is not an IDEA dispute-resolution mechanism."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 5th-grade student with an emotional/behavioral disorder frequently disrupts class. The school uses PBIS. Rather than repeatedly removing the student from class, which approach is MOST consistent with PBIS at the Tier 2 level?",
    "a": [
      "Increasing the frequency of punitive consequences until the behavior extinguishes.",
      "Implementing a Check-In/Check-Out system tied to a daily behavior report card and home-school communication.",
      "Referring the student immediately to a more restrictive alternative placement.",
      "Ignoring the behavior to avoid reinforcing it with attention."
    ],
    "c": 1,
    "r": "Tier 2 PBIS interventions are targeted, evidence-based group supports for students who do not respond sufficiently to universal Tier 1 practices; Check-In/Check-Out (CICO) is a validated Tier 2 strategy that provides structured feedback and positive adult contact. The immediate-alternative-placement option is the strongest distractor because a restrictive, last-resort placement is inconsistent with PBIS's tiered, least-restrictive, data-driven logic. Escalating punishment ignores function and the positive-supports mandate, and blanket ignoring is inappropriate for behavior that disrupts the learning environment and may be maintained by something other than attention."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A CSE is determining an appropriate placement for a 3rd-grade student with an intellectual disability. The team must base its placement decision PRIMARILY on which IDEA principle?",
    "a": [
      "The placement that is easiest for the school to staff and fund.",
      "The most restrictive setting available, to ensure the student receives maximum support.",
      "The least restrictive environment in which the student can receive an appropriate education with supplementary aids and services.",
      "A self-contained classroom, because it is the default placement for students with intellectual disabilities."
    ],
    "c": 2,
    "r": "IDEA's LRE mandate (34 C.F.R. § 300.114) requires that students with disabilities be educated alongside nondisabled peers to the maximum extent appropriate, with removal occurring only when the nature or severity of the disability prevents satisfactory education even with supplementary aids and services. The default self-contained option is the strongest distractor because IDEA prohibits categorical placement by disability label; each decision must be individualized to the student's needs. Choosing the most restrictive setting inverts the mandate, and administrative convenience or cost may never drive a placement decision."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A first-year teacher notices that her third-grade students consistently struggle with multi-step word problems. She reviews her lesson plans and realizes she has primarily used direct instruction with limited opportunities for student practice. What is the MOST appropriate next step to improve her instructional effectiveness?",
    "a": [
      "Request a meeting with the principal to explain why the math curriculum is inadequate for this grade level.",
      "Analyze student assessment data and consult with her grade-level team to identify research-based instructional strategies that increase student engagement and practice.",
      "Move on to the next unit, since spending more time on word problems will delay coverage of required content.",
      "Send home additional worksheets and ask parents to practice word problems with their children each night."
    ],
    "c": 1,
    "r": "Effective professional practice requires teachers to use data to reflect on their own instruction and to collaborate with colleagues to identify evidence-based improvements, a core teacher responsibility under the EAS framework (Competency IV). Attributing the problem solely to the curriculum and escalating to the principal avoids professional self-reflection and shifts responsibility away from the teacher's own instructional decision-making, which is why the request-a-meeting option is the strongest distractor. Sending home more worksheets outsources instruction to parents without changing classroom practice."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A middle school teacher is approached by a local newspaper reporter who is writing a story about a student who won a science competition. The reporter asks the teacher to confirm the student's GPA and provide a copy of the student's science project grades. What is the teacher's MOST appropriate response?",
    "a": [
      "Decline to share any records and direct the reporter to the school's main office, explaining that student education records are protected.",
      "Share the GPA and grades, since the student's achievement is a matter of public interest and the student has already won a public award.",
      "Provide only the science project grades, since those are directly relevant to the competition and not sensitive information.",
      "Ask the student's parents to contact the reporter directly so the teacher avoids being involved in the situation."
    ],
    "c": 0,
    "r": "Under FERPA (20 U.S.C. Section 1232g), education records, including grades and GPA, are confidential and may not be disclosed to third parties without prior written consent from a parent or eligible student; the teacher should decline and route the request through the appropriate office. Sharing the records because the achievement is publicly known is the strongest distractor, but public recognition of an award does not waive FERPA protection over a student's academic records. Releasing only the project grades is wrong because individual course or project grades are protected records, not directory information."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A high school special education teacher disagrees with a general education colleague's approach to adjusting assignments for a student with a learning disability. The general education teacher is substantially reducing the amount of content (a modification) rather than changing the format or response mode the IEP specifies (an accommodation). What is the MOST professionally appropriate action for the special education teacher to take?",
    "a": [
      "Report the general education teacher to the principal immediately for failing to follow the IEP.",
      "Modify the assignments herself and deliver them directly to the student without telling the general education teacher.",
      "Schedule a collaborative meeting with the general education teacher to review the IEP together, clarify the distinction between accommodations and modifications, and agree on implementation that honors the IEP as written.",
      "Document the discrepancy in her own records and wait until the annual IEP review to address it formally."
    ],
    "c": 2,
    "r": "IDEA (2004) requires that IEPs be implemented as written, and collaborative problem-solving between co-teachers is the professionally appropriate first response to a disagreement about implementation. Escalating directly to administration before attempting professional dialogue is the strongest distractor because it feels decisive, but it bypasses the collaborative process and may unnecessarily damage collegial relationships. Quietly modifying the work herself fragments instruction, and waiting until the annual review leaves the IEP unimplemented in the meantime."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "During a hallway transition, a teacher observes a student being called derogatory names related to his perceived sexual orientation by two peers. The targeted student looks visibly distressed. Under New York's Dignity for All Students Act (DASA), what is the teacher's MOST appropriate immediate response?",
    "a": [
      "Wait to see if the behavior recurs before intervening, since a single incident may not constitute harassment under DASA.",
      "Privately tell the targeted student to ignore the comments and focus on getting to class.",
      "Speak separately with the two students who were name-calling and ask them not to repeat the behavior.",
      "Intervene immediately to stop the behavior, ensure the targeted student's safety, and report the incident to the building's Dignity Act Coordinator."
    ],
    "c": 3,
    "r": "DASA (NY Education Law Article 2, Sections 10-18) requires school personnel to intervene when they observe harassment or discrimination based on actual or perceived characteristics, including sexual orientation, and to report such incidents to the designated Dignity Act Coordinator. Waiting to see whether the behavior recurs is the strongest distractor, but DASA does not require a pattern; a single observed act of harassment triggers the obligation to act. Telling the student to ignore it or quietly warning the aggressors fails to stop the conduct and bypasses the protected, documented reporting process the law requires."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A fourth-grade teacher is designing a unit on ecosystems and wants to ensure her assessments measure student understanding of the learning objectives, not just recall. Which approach BEST reflects sound principles of aligned assessment design?",
    "a": [
      "Administer the same multiple-choice test at the beginning and end of the unit to measure how much content students retained.",
      "Use a variety of formative checkpoints, such as exit tickets, small-group discussions, and science journal entries, aligned to specific learning objectives, and adjust instruction based on the results.",
      "Grade students on effort and participation throughout the unit, since effort is the best predictor of long-term learning.",
      "Assign a single culminating project at the end of the unit and allow students to choose any topic within the ecosystem theme."
    ],
    "c": 1,
    "r": "Sound assessment design uses multiple formative measures aligned to specific learning objectives so the teacher can monitor progress and adjust instruction during the unit, a core teacher responsibility. Relying solely on an identical pre/post multiple-choice test is the strongest distractor because it appears to measure growth, but it captures only recall at two points and provides none of the ongoing data needed to adjust instruction. Grading on effort alone does not measure understanding of the objectives, and an end-of-unit project with unconstrained topic choice can drift away from the targeted objectives."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A third-grade teacher sends home a weekly newsletter about classroom activities and curriculum. She notices that several families who speak Spanish as their first language rarely respond to notes or attend school events, though students report their parents are very interested in their school progress. What is the MOST appropriate first step for the teacher to take?",
    "a": [
      "Continue the current newsletter but add a reminder that attendance at school events is important.",
      "Have the principal send a formal letter to the non-responding families explaining attendance expectations.",
      "Arrange for the newsletter and communications to be translated into Spanish and explore whether a bilingual liaison is available.",
      "Ask the students to verbally relay important information to their parents at home."
    ],
    "c": 2,
    "r": "Providing translated materials and leveraging a bilingual liaison directly removes the language barrier that is likely preventing family engagement, a key EAS C5 indicator for communicating with diverse families. Asking students to relay information (option D) is inappropriate because it places an adult communication burden on children and compromises accuracy and confidentiality."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A 10-year-old student with a learning disability is due for an annual IEP review. Under IDEA, which of the following BEST describes the parent's role in the Committee on Special Education (CSE) meeting?",
    "a": [
      "Parents are required members of the CSE whose meaningful participation must be ensured, and whose informed written consent is required before an initial evaluation and the initial provision of special education services.",
      "Parents may attend but have no right to participate in decisions; final authority rests entirely with the CSE professionals.",
      "Parents may observe the CSE meeting but are not considered members of the team unless they hold an educational credential.",
      "Parents must give written consent before every change to the IEP, including each annual revision, or the IEP is void."
    ],
    "c": 0,
    "r": "Under IDEA (34 C.F.R. §§ 300.321, 300.322), parents are required members of the CSE and the school must take steps to ensure their meaningful participation; informed written consent is required before an initial evaluation and before the initial provision of special education services (34 C.F.R. § 300.300). Option D overstates the law: after initial placement, IDEA requires prior written notice for changes (not fresh consent for every IEP revision), and a new IEP at an annual review does not require renewed consent. Option B is wrong because parents are not merely advisory; their participation is a legally protected, substantive right."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "Mr. Torres is a new fifth-grade teacher at a school where many families have recently immigrated from West Africa. He wants to schedule parent-teacher conferences but finds that very few families sign up for the traditional evening slots. A colleague suggests the low turnout may reflect cultural norms around deference to teachers and discomfort with formal school settings, not lack of interest. What strategy BEST aligns with culturally responsive family engagement?",
    "a": [
      "Send a second sign-up sheet with a note that conferences are mandatory under state law.",
      "Reschedule conferences to Saturday mornings, which statistically show higher attendance for immigrant families.",
      "Ask the guidance counselor to follow up only with families whose children are failing.",
      "Offer flexible conference formats including home visits, phone calls, and community-site meetings, and enlist a cultural liaison to help bridge communication."
    ],
    "c": 3,
    "r": "Offering multiple modalities and engaging a cultural liaison reflects culturally responsive practice as emphasized in EAS C5, removing structural and cultural barriers to partnership rather than imposing deficit-oriented mandates. Rescheduling to Saturday (option B) addresses one logistical variable but ignores the relational and cultural dimensions the colleague identified, making it far less comprehensive. Mandating attendance (option A) and targeting only failing students (option C) are deficit-oriented and damage trust."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A parent calls a teacher to ask about a classmate's behavioral issues, stating the classmate has been bullying their child. The teacher possesses behavioral intervention records for the student in question. Which response BEST upholds legal and ethical obligations?",
    "a": [
      "Share the classmate's disciplinary records so the parent can understand the full situation.",
      "Acknowledge the concern, document the bullying complaint, explain that another student's records are confidential under FERPA, and describe the steps the school will take to address the bullying.",
      "Refer the parent directly to the other student's parents to resolve the issue between families.",
      "Tell the parent that school bullying is handled exclusively by the principal and end the call."
    ],
    "c": 1,
    "r": "FERPA (20 U.S.C. § 1232g) prohibits disclosure of another student's education records without that family's consent, so the teacher cannot share the classmate's behavioral records. The correct response acknowledges the complaint, documents it, protects confidentiality, and commits to school-based follow-up, all consistent with EAS C5 and New York's Dignity for All Students Act (DASA), which requires staff to report and address bullying. Referring families to each other (option C) abdicates the school's DASA obligation."
  }
];

const POSTTEST = [
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Mr. Thompson is planning a unit on American history. Most of his students are from Caribbean and West African immigrant families. To make the curriculum more culturally sustaining, he should:",
    "a": [
      "Invite students to share personal family stories only during a designated \"culture day\" at the end of the unit.",
      "Reduce the complexity of readings to ensure ELL students can access the content.",
      "Focus exclusively on the contributions of immigrant groups to avoid teaching content that may be culturally uncomfortable.",
      "Supplement the standard textbook with primary sources, literature, and historical narratives that center Caribbean and African diasporic perspectives alongside mainstream accounts."
    ],
    "c": 3,
    "r": "Option D is correct because culturally sustaining pedagogy (Paris, 2012) requires integrating diverse cultural and community knowledge as a persistent, substantive part of the curriculum, not a one-time add-on. Option A is the strongest distractor but is wrong: confining culture to a single \"culture day\" tokenizes it, does not constitute genuine integration, and may reinforce othering."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "A third-grade teacher notices that students who receive free or reduced-price lunch are disproportionately represented in the low reading group. Which action most directly addresses the intersection of poverty and reading achievement?",
    "a": [
      "Audit the grouping process for bias, provide supplemental reading resources students can take home, and ensure the low group receives rigorous — not watered-down — instruction from a qualified teacher.",
      "Maintain current ability grouping because it ensures students receive instruction at their level.",
      "Eliminate all reading groups so no student is labeled.",
      "Refer all students in the low group for special education evaluations."
    ],
    "c": 0,
    "r": "Option A is correct because research shows rigid, low-track groups often reflect socioeconomic bias and receive less rigorous instruction, compounding disadvantage; auditing grouping practices and ensuring high-quality instruction with home support addresses root equity issues. Option D is the strongest distractor but is wrong: low reading achievement alone, without evidence of a disability, does not warrant a CSE referral."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "An ENL student has been in the U.S. for three years and is reclassified as \"transitional\" by the school's language proficiency assessment. Her teacher notices she still struggles with written argumentation in English Language Arts. The teacher should:",
    "a": [
      "Re-refer the student to the ENL specialist because reclassification was premature.",
      "Continue to provide scaffolded writing supports — sentence frames, graphic organizers, and modeling of academic discourse — recognizing that CALP continues to develop for 5–7 years.",
      "Accept that the student has reached her English proficiency ceiling.",
      "Reduce writing expectations to match the student's current output level."
    ],
    "c": 1,
    "r": "Option B is correct because CALP — the academic language proficiency needed for complex writing and analysis — takes 5–7 years to develop even after conversational fluency is achieved, so scaffolded writing instruction is the evidence-based response. Option A is the strongest distractor but is wrong: it misinterprets reclassification as a failure rather than recognizing the normal trajectory of academic language development."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "Ms. Williams wants to build stronger relationships with her predominantly immigrant students' families, many of whom speak languages other than English at home. The most effective first step is:",
    "a": [
      "Send all communications home in English only, since families should practice English.",
      "Schedule a single community night with a professional interpreter and consider it sufficient.",
      "Establish ongoing, multilingual communication channels — translated newsletters, phone calls through an interpreter, and a bilingual family liaison — while learning key phrases in families' home languages to signal respect.",
      "Ask students to serve as interpreters for all parent communications to save resources."
    ],
    "c": 2,
    "r": "Option C is correct because sustained, multilingual outreach with a designated liaison signals genuine partnership and removes language barriers to engagement; under Title VI and the EEOA, schools must communicate essential information with limited-English-proficient parents in a language they can understand. Option D is the strongest distractor but is wrong: it places an inappropriate and ethically problematic translation burden on children, who may filter or alter communications and should not be placed in an adult intermediary role."
  },
  {
    "s": "C1",
    "d": "Inclusive, Evidence-Based Instruction & UDL",
    "q": "A fifth-grade student has a documented learning disability in written expression (IEP) but demonstrates exceptional verbal reasoning and creative problem-solving. The general education teacher should:",
    "a": [
      "Focus exclusively on remediating the writing disability so the student can access grade-level work.",
      "Place the student in the special education resource room for all core subjects to address the disability.",
      "Notify the gifted coordinator that the student's IEP disqualifies them from gifted services.",
      "Recognize the student as twice-exceptional and use UDL principles — offering oral responses, dictation tools, and visual formats — to allow the student's strengths to shine while also supporting writing development."
    ],
    "c": 3,
    "r": "Option D is correct because twice-exceptional students have both a disability and exceptional abilities; UDL's multiple means of action and expression let strengths be assessed and developed while accommodations support the area of disability. Option A is the strongest distractor but is wrong: it ignores the student's giftedness and the student's strengths. Option C is also wrong because an IEP does not legally preclude gifted services."
  },
  {
    "s": "C1",
    "d": "Diversity as an Asset & School-Community Collaboration",
    "q": "A Jewish student asks to be excused from school on Yom Kippur, which falls on a test day. The teacher's most appropriate response is:",
    "a": [
      "Grant the excused absence and provide an equivalent make-up opportunity, consistent with New York Education Law §3210 and NYSED guidance protecting students' right to observe religious holidays without academic penalty.",
      "Allow the absence but assign a zero for the test since the student chose to be absent.",
      "Require the student to take the test before the holiday or forfeit the grade.",
      "Ask the student to bring documentation from a rabbi before granting the absence."
    ],
    "c": 0,
    "r": "Option A is correct because New York Education Law §3210(1)(b) and Commissioner's Regulations, reinforced by NYSED guidance, provide that students may be absent for religious observance and may not be academically penalized for it, so a no-penalty make-up opportunity is the required response. Option B is the strongest distractor but is wrong: assigning a zero explicitly penalizes religious observance, which violates state law and anti-discrimination principles."
  },
  {
    "s": "C1",
    "d": "Knowing Learners & Building Classroom Community",
    "q": "A teacher reviews her discipline referral data and notices she has sent Black male students to the principal's office at three times the rate of other students for subjective infractions such as \"disrespect\" and \"defiance.\" What is the most professionally responsible next step?",
    "a": [
      "Conclude that the behavioral pattern is student-driven and increase consequences to establish consistency.",
      "Engage in reflective practice to examine whether implicit racial bias may be influencing perception of behavior, consult with a PBIS coach, and adopt explicit, objective behavioral criteria applied consistently to all students.",
      "Remove the referral records from the student files to avoid labeling.",
      "Discuss the data with the students' parents and ask them to address their children's behavior at home."
    ],
    "c": 1,
    "r": "Option B is correct because research documents that Black male students are disproportionately disciplined for subjective infractions, often reflecting implicit bias rather than objective behavioral differences; reflective practice and PBIS-aligned, objective criteria directly address the equity issue. Option A is the strongest distractor but is wrong: it reinforces the disparity by attributing it solely to student behavior without examining the teacher's own decision-making."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 6th-grade social studies teacher notices that her ELL student, who has been in U.S. schools for three years, can discuss current events verbally during class but produces very thin written arguments on essays. The teacher wonders whether the student should be retained. Which response is MOST appropriate?",
    "a": [
      "Retention is appropriate, because three years is enough time to develop full academic proficiency in English.",
      "The student needs more time in Stand-Alone ENL before being allowed to participate in mainstream content instruction at all.",
      "The student should be referred to the CSE, because the gap between verbal and written performance signals a processing disorder.",
      "The profile is consistent with a student who has BICS but is still developing CALP, so the teacher should provide academic-writing scaffolds rather than pursue retention."
    ],
    "c": 3,
    "r": "Three years is still within the typical 5 to 7 year window for CALP to approach grade-level norms (Cummins), so the verbal-written discrepancy is expected, and the appropriate response is targeted academic-writing scaffolding such as sentence frames, structured note-taking, and models. The disability-referral option is the strongest distractor: a referral is premature because the team has not yet shown the difficulty is not primarily due to limited English proficiency, which IDEA's eligibility rules (34 CFR 300.306(b)) require before classification. Retention is not supported by research for ELLs and does not address the underlying language-development need, and pulling the student entirely out of grade-level content removes the meaningful access ELLs are owed."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "A high school principal tells an ENL teacher that, because the school is small, ELL students who score at the Transitioning level will simply be placed in general education classes with no additional ENL support. How should the ENL teacher respond?",
    "a": [
      "Agree, because Transitioning students are nearly proficient and general education placement alone is appropriate.",
      "Recommend that the students be reclassified as Former ELLs immediately to resolve the compliance concern.",
      "Explain that under Part 154 every identified ELL is entitled to ENL instruction from a certified ENL teacher, with required Units of Study tied to proficiency level, so removing services based on school size is not compliant.",
      "Suggest the principal create a separate self-contained classroom for those students taught by a paraprofessional."
    ],
    "c": 2,
    "r": "Commissioner's Regulations Part 154 require ENL instruction delivered by a certified ENL teacher for every identified ELL regardless of school size, with Integrated ENL as the baseline and the required Units of Study tied to the student's NYSESLAT level; even Transitioning students require a set amount of ENL service. Agreeing is the strongest distractor because it reflects a common misconception that near-proficient students no longer need services. Immediate reclassification is a misuse of the exit process, which requires scoring Commanding on the NYSESLAT rather than administrative convenience. A paraprofessional-staffed class is also noncompliant, since Part 154 requires a certified ENL teacher."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A 9th-grade biology teacher is planning a unit on cell division for a class that includes four ELL students at the Entering and Emerging levels. Which instructional strategy is MOST aligned with sheltered instruction and the needs of these students?",
    "a": [
      "Ask the ELL students to observe silently and take notes during the lesson, then meet with the ENL teacher afterward.",
      "Pre-teach key vocabulary (mitosis, cytokinesis, chromosome) using visual diagrams, word walls, and home-language cognates before introducing the full lesson.",
      "Assign the ELL students a simplified worksheet while the rest of the class engages with the grade-level lesson.",
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
      "Explain that the parent may decline bilingual education but not the required ENL services, which the district must continue to provide until the student scores Commanding on the NYSESLAT, and offer to adjust how services are delivered to reduce the stigma.",
      "Honor the request immediately, since parental consent governs all school service decisions.",
      "Remove the student from ENL services but note the parent's concern in the student's cumulative file.",
      "Refer the decision to the principal and take no further action."
    ],
    "c": 0,
    "r": "Under Part 154, parents may decline bilingual education but may not waive required ENL services; the district retains the obligation to provide ENL instruction until the student meets the exit criterion of scoring Commanding on the NYSESLAT. The immediate-removal option is the strongest distractor: although parental rights are significant, the right to meaningful access for ELLs rests on Title VI and the EEOA (Lau v. Nichols; Castaneda v. Pickard) as implemented through Part 154, so ENL service is not a fully waivable program. The teacher should explain this clearly and respectfully and can address the embarrassment by shifting more support into an Integrated ENL (co-teaching) setting rather than removing services entirely. Quietly removing services or simply deferring to the principal abdicates the legal obligation."
  },
  {
    "s": "C2",
    "d": "Literacy & Language Development for ELLs",
    "q": "During a whole-class discussion of a novel, an 8th-grade ELL student at the Emerging level remains silent even when called on directly. The teacher wants to assess the student's comprehension without creating anxiety. Which strategy is MOST appropriate?",
    "a": [
      "Mark the student as non-participatory and send a note home asking the parents to encourage more speaking practice.",
      "Administer the standard end-of-unit test to obtain an accurate baseline measure of comprehension.",
      "Excuse the student from all oral participation until she reaches a higher proficiency level.",
      "Use structured low-stakes response techniques such as visual response cards, written quick-writes, or partner talk with sentence starters to elicit evidence of comprehension."
    ],
    "c": 3,
    "r": "Structured low-stakes formats (response cards, quick-writes, partner talk with sentence starters) align with UDL's principle of multiple means of action and expression and yield authentic formative data without triggering the affective filter that suppresses output in anxious learners (Krashen). Excusing the student from participation is the strongest distractor, but withholding participation denies access to learning and conflicts with Part 154's expectation that ELLs are fully integrated into content instruction with appropriate support. Marking the student non-participatory misreads a predictable Emerging-level pattern as a behavior problem, and a high-stakes end-of-unit test is the wrong instrument when a low-stakes formative measure is what the situation calls for."
  },
  {
    "s": "C2",
    "d": "ELL Assessment, Program Models & Collaboration",
    "q": "A recently arrived 10th-grade newcomer from a conflict zone is placed in an ENL newcomer program. The student is withdrawn, startles easily, and has difficulty concentrating. The ENL teacher suspects the student may have experienced significant trauma. Which is the MOST appropriate immediate step?",
    "a": [
      "Refer the student directly to the CSE for a special education evaluation because of the concentration difficulties.",
      "Contact the family to ask what traumatic events occurred so the teacher can address them directly during instruction.",
      "Alert the school counselor and the building's mental health supports, document observations, and adjust classroom routines to provide predictability and psychological safety while coordinating with specialists.",
      "Administer the NYSESLAT immediately to establish a language baseline before providing any other support."
    ],
    "c": 2,
    "r": "Trauma-informed practice calls for immediate collaboration with mental health professionals rather than independent teacher diagnosis, and for building a predictable, low-stress environment that supports the preconditions for learning while specialists assess needs. The immediate CSE-referral option is the strongest distractor: concentration difficulties that may be trauma responses or part of a newcomer adjustment cannot be the basis for a disability referral without first considering situational and language factors, consistent with IDEA's rule that limited English proficiency may not be the determinant factor in an eligibility decision (34 CFR 300.306(b)). Probing the family for traumatic details could re-traumatize the student and is outside the teacher's role, and the NYSESLAT is given on its annual schedule, not as an emergency response to a mental-health concern."
  },
  {
    "s": "C2",
    "d": "Language Acquisition Foundations",
    "q": "A 2nd-grade teacher has several Spanish-English bilingual students. During a math lesson she notices students quietly using Spanish with each other to work through a word problem and is unsure whether to allow it. What does current research and best practice recommend?",
    "a": [
      "Redirect students to speak only in English, since allowing Spanish during math will impede their English academic-language development.",
      "Allow and strategically leverage translanguaging, treating students' full linguistic repertoire including the home language as a cognitive resource that deepens content understanding and supports English development.",
      "Refer the students to a bilingual specialist, since using Spanish during instruction shows they are not ready for mainstream math.",
      "Separate the Spanish-speaking students from the rest of the class to prevent off-task conversation."
    ],
    "c": 1,
    "r": "Translanguaging theory (Garcia & Wei) and a substantial body of research show that strategic use of the home language supports conceptual understanding and ultimately English academic-language development rather than impeding it; allowing and building on home-language use affirms students' identities and deepens sense-making. The English-only redirection is the strongest distractor: it rests on a deficit assumption and contradicts current NYSED ENL guidance, which endorses leveraging students' full linguistic repertoire and recognizes the home language as a resource (Cummins' Common Underlying Proficiency). Referring the students to a specialist pathologizes normal bilingual behavior, and separating them treats an asset as a discipline problem."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "During a 10th-grade history class, a student with a traumatic brain injury has an IEP goal targeting organizational skills and a related service of occupational therapy twice per week. The school schedules OT sessions during lunch because the therapist's schedule is limited. The parent objects. Which statement BEST reflects the school's obligation?",
    "a": [
      "Scheduling OT at lunch is acceptable because the student does not miss academic instruction.",
      "The school may delay OT services until a mutually convenient time is found, even if this extends several weeks.",
      "Parents cannot dictate the schedule of related services once the IEP is signed.",
      "Related services must be delivered as specified in the IEP, and the school must resolve scheduling conflicts without depriving the student of a nonacademic benefit like lunch that is available to nondisabled peers."
    ],
    "c": 3,
    "r": "IDEA requires that related services be provided as written in the IEP; routinely scheduling them during lunch can deprive the student of a nonacademic benefit available to peers and may constitute a denial of FAPE in the least restrictive environment. The 'no academic instruction missed' option is the strongest distractor because it equates absence from academic class with full program access, ignoring the nonacademic benefits of lunch that LRE protects. Indefinitely delaying a required service withholds FAPE, and the claim that parents have no voice ignores their role as IEP team members."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A 4th-grade student has been receiving Tier 2 reading intervention for 12 weeks with documented insufficient progress. The intervention teacher has collected bi-weekly progress-monitoring data showing a flat trend line. What is the MOST appropriate next step?",
    "a": [
      "Continue the current Tier 2 intervention for an additional 12 weeks before drawing conclusions.",
      "Switch to a different Tier 2 program and restart the 12-week cycle.",
      "Intensify supports to Tier 3 and refer to the CSE for a comprehensive evaluation.",
      "Immediately discontinue all interventions and wait for the student to mature."
    ],
    "c": 2,
    "r": "When valid Tier 2 data show insufficient response over an adequate period, the RtI framework calls for intensifying to individualized Tier 3 support and initiating a CSE referral; the flat trend line is the data-based documentation that justifies a comprehensive evaluation, and a referral may be made at any time without delay. Extending an ineffective intervention is the strongest distractor because it misuses progress-monitoring data and postpones needed services. Restarting a fresh 12-week cycle similarly delays evaluation, and discontinuing all support to 'wait for maturation' abandons the student and violates child-find."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A parent volunteers in the classroom and notices a folder labeled with a classmate's name that contains IEP documents. She asks the teacher what the child's disability is. What is the teacher's MOST appropriate response?",
    "a": [
      "Share the diagnosis briefly because the parent is a trusted volunteer who may interact with the child.",
      "Decline to share any information and remind the parent that student education records are confidential under FERPA.",
      "Provide a general description of the disability category without naming the specific diagnosis.",
      "Direct the parent to the building principal, who may share the information at their discretion."
    ],
    "c": 1,
    "r": "FERPA (20 U.S.C. § 1232g) protects the privacy of student education records, including disability status and IEP contents; a teacher may not disclose this information to another parent, who has no legitimate educational interest, regardless of that parent's volunteer role. The 'general category without naming it' option is the strongest distractor because even categorical or indirect disclosure of a student's disability to an unauthorized party violates FERPA. Sharing the diagnosis outright is a clear violation, and the principal could not lawfully release it to this parent either, so deferring on those terms is wrong."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A middle school teacher is designing a unit on the American Revolution. To apply UDL principles and support students with learning disabilities alongside all other learners, which strategy is MOST appropriate at the planning stage?",
    "a": [
      "Offer students multiple ways to access content (text, video, audio) and varied options for demonstrating mastery (essay, podcast, visual timeline).",
      "Create one standard lesson and attach a modified worksheet for students with IEPs afterward.",
      "Assign a paraprofessional to restate all directions individually to students with disabilities during each lesson.",
      "Allow only students with IEPs to choose their assessment format, keeping expectations consistent for the rest of the class."
    ],
    "c": 0,
    "r": "UDL calls for flexible, proactively designed instruction offering multiple means of representation and of action and expression for all learners, which minimizes the need for after-the-fact changes. Retrofitting a single standard lesson with a modified worksheet is the strongest distractor because it is reactive accommodation rather than universal design and creates a two-tiered system. Relying on a paraprofessional to restate directions shifts the design responsibility off the teacher, and offering choice only to students with IEPs both stigmatizes and abandons the 'for all learners' core of UDL."
  },
  {
    "s": "C3",
    "d": "Disability Law, RtI/PBIS & the CSE Process",
    "q": "A 6th-grade student with a physical disability reports to her teacher that classmates regularly mock her assistive device and call her names. Under New York's Dignity for All Students Act (DASA), which action is the teacher MOST obligated to take?",
    "a": [
      "Mediate a peer discussion during lunch and ask the class to be more respectful.",
      "Advise the student to ignore the comments and focus on her academics.",
      "Handle the situation informally to avoid escalating the conflict.",
      "Document the incident and report it to the school's Dignity Act Coordinator (DAC) following the school's reporting protocol."
    ],
    "c": 3,
    "r": "DASA (N.Y. Education Law Article 2, §§ 10-18) requires school employees who witness or receive a report of harassment, bullying, or discrimination, including bias based on disability, to report it to the building's Dignity Act Coordinator under the school's protocol. Teacher-led peer mediation is the strongest distractor because, while well-intentioned, it bypasses the required formal reporting structure and does not ensure district-level documentation. Telling the student to ignore harassment and handling it informally both fail the mandatory-reporting obligation and leave the conduct unaddressed."
  },
  {
    "s": "C3",
    "d": "Collaboration, Assistive Technology & Service Delivery",
    "q": "A 15-year-old student with a mild intellectual disability has an upcoming annual IEP review. The team wants to ensure compliance with transition requirements. Which element is MOST critical to include?",
    "a": [
      "A behavior intervention plan focused solely on classroom conduct.",
      "A graduation plan that eliminates electives to maximize core academic time.",
      "Age-appropriate transition assessments and measurable postsecondary goals in education/training, employment, and, where appropriate, independent living skills.",
      "A note that transition planning will begin at age 18, when the student is closer to graduation."
    ],
    "c": 2,
    "r": "IDEA requires measurable postsecondary goals based on age-appropriate transition assessments, plus transition services and a course of study aligned to those goals across post-school domains. In New York these must appear beginning with the IEP in effect when the student turns 15 (earlier than IDEA's federal age-16 floor), so a 15-year-old's review must include them now. The 'begin at 18' option is the strongest distractor because it contradicts New York's age-15 trigger and would leave the student without legally required transition supports during critical planning years. A conduct-only behavior plan and an electives-elimination graduation plan are neither transition assessments nor postsecondary goals."
  },
  {
    "s": "C3",
    "d": "Disability Characteristics & Individualized Instruction",
    "q": "A 9th-grade student with an emotional disability and an IEP is suspended for 12 consecutive school days after a physical altercation. Under IDEA, what procedural requirement is TRIGGERED at this point?",
    "a": [
      "The school must conduct a manifestation determination review within 10 school days to determine whether the behavior was caused by, or had a direct and substantial relationship to, the student's disability.",
      "The school may extend the suspension indefinitely because the behavior was dangerous.",
      "The student's IEP services are automatically suspended for the duration of the disciplinary removal.",
      "Parents must waive due process rights before the student may return to school."
    ],
    "c": 0,
    "r": "Under IDEA (34 C.F.R. § 300.530(e)), a removal exceeding 10 consecutive school days is a change of placement that requires the district, parent, and relevant IEP team members to hold a manifestation determination review within 10 school days; if the behavior is a manifestation, the student may not be expelled and the IEP/behavior plan must be addressed. The 'indefinite suspension' option is the strongest distractor because IDEA's disciplinary protections bar removal without the MDR and require continued FAPE, even for dangerous behavior (with narrow 45-day interim placements for weapons, drugs, or serious bodily injury). Services continue during a removal, and no parental waiver of due process is required for return."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A seventh-grade science teacher reviews standardized test data and finds that her students performed significantly below the district average on inquiry-based lab questions, though their scores on content-recall items were near average. What is the MOST professionally responsive course of action?",
    "a": [
      "Assume the standardized test is a poor measure of her students' abilities and disregard the data when planning future units.",
      "Increase the number of textbook readings assigned as homework to strengthen students' foundational content knowledge before attempting inquiry tasks.",
      "Examine her instructional practice to determine whether lab activities provide sufficient scaffolding for scientific reasoning, then consult research and colleagues to identify targeted adjustments.",
      "Notify parents that their children need additional tutoring support in lab skills before the next assessment cycle."
    ],
    "c": 2,
    "r": "Professional reflection requires teachers to interrogate their own instructional decisions when data reveals a performance gap and to use evidence-based strategies to address it. Dismissing valid assessment data is the strongest distractor because the test results were imperfect like all measures, but discarding a clear, content-specific signal impedes professional growth and prevents the teacher from meeting an identified learning need. Adding readings targets recall (already adequate) rather than the reasoning gap, and shifting the work to outside tutoring sidesteps the teacher's own instructional responsibility."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A teacher volunteers as a coach for the school's robotics club. An adult community member, who is not a parent of any student at the school, emails the teacher asking whether a specific student on the team has an IEP, because she wants to partner that student with her own child for a community competition. What is the teacher's MOST appropriate response?",
    "a": [
      "Confirm or deny the IEP status, since club activities are extracurricular and not governed by academic privacy rules.",
      "Decline to disclose whether the student has an IEP, since disability status is part of the student's education record protected under FERPA and IDEA.",
      "Forward the email to the student's case manager and let the special education department handle the response.",
      "Ask the student directly whether she is comfortable sharing her IEP status with the community member before responding."
    ],
    "c": 1,
    "r": "A student's IEP status, and disability status more broadly, is part of the education record protected under both FERPA (20 U.S.C. Section 1232g) and IDEA, regardless of the extracurricular context in which the inquiry arises; it is never directory information. Forwarding the email to the case manager is the strongest distractor because it shows awareness of the issue, but it does not by itself fulfill the teacher's immediate duty to refuse disclosure and could read as uncertainty about the obligation. Asking the student (a minor) to authorize disclosure improperly shifts the confidentiality decision onto the child."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A tenth-grade English teacher is asked to participate in a school-based professional learning community (PLC) focused on improving writing across content areas. She teaches only English and feels the PLC is primarily relevant to her content-area colleagues. What BEST reflects the professional responsibility of all teachers in this context?",
    "a": [
      "Attend PLC meetings when her schedule allows but prioritize her own department planning time, since writing instruction is already central to English class.",
      "Propose that the PLC form a separate sub-group for English teachers so they can focus on more advanced writing goals.",
      "Defer to the literacy coach to lead all PLC discussions, since that is the coach's primary job responsibility.",
      "Participate actively, share her content expertise in writing instruction, and contribute to developing cross-curricular strategies that benefit students school-wide."
    ],
    "c": 3,
    "r": "Teacher professional responsibility includes contributing to a collaborative school community and using one's expertise to improve student outcomes school-wide, not only within one's own classroom. Attending only when convenient is the strongest distractor because it sounds cooperative, but it treats professional collaboration as optional rather than as an integral part of teacher responsibility. Splintering off a separate English sub-group undercuts the cross-curricular purpose, and deferring entirely to the literacy coach withholds the content expertise the PLC needs."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A kindergarten teacher notices that one of her students has unexplained bruising on her arms on multiple occasions over a three-week period. The student has become increasingly withdrawn in class. The teacher is not certain whether abuse is occurring. Under New York State law, what is the teacher's MOST appropriate action?",
    "a": [
      "Report her reasonable suspicion immediately to the New York Statewide Central Register (SCR), since mandated reporters in NYS are not required to be certain abuse has occurred, only to have reasonable cause to suspect.",
      "Consult with the school social worker to gather more evidence before making any formal report, to avoid making a false allegation.",
      "Document the observations in her grade book and wait until the end of the quarter to see if a clearer pattern emerges.",
      "Speak with the student's parents at the next conference to ask about the bruising and give them the opportunity to explain."
    ],
    "c": 0,
    "r": "Under NY Social Services Law Section 413, mandated reporters, including teachers, must report reasonable suspicion of child abuse or maltreatment immediately to the Statewide Central Register; certainty is not required, and the duty belongs to the individual reporter. Consulting the social worker to gather more evidence first is the strongest distractor because it feels prudent, but delaying to confirm a suspicion can itself constitute a failure to report under the statute. Documenting and waiting similarly delays a mandatory report, and questioning the parents risks tipping off a suspected perpetrator and is not the teacher's role."
  },
  {
    "s": "C4",
    "d": "Teacher Responsibilities: Legal & Ethical Judgment",
    "q": "A high school history teacher is designing a unit on the Civil Rights Movement for a heterogeneous class that includes students with IEPs, English Language Learners, and advanced learners. Which planning approach BEST reflects Universal Design for Learning (UDL) principles?",
    "a": [
      "Create separate lesson plans for each student subgroup, one for students with IEPs, one for ELLs, and one for advanced learners, to address each group's specific needs.",
      "Design the unit around the grade-level content and add accommodations as supplementary documents for students who are flagged by their IEPs or 504 plans.",
      "Build the unit from the start with multiple means of representation, action and expression, and engagement so all learners can access the curriculum without requiring separate plans or retrofitted supports.",
      "Focus planning on the majority of students and provide pull-out support for students with IEPs and ELLs through the special education and ENL teachers."
    ],
    "c": 2,
    "r": "UDL (CAST framework) calls for proactive, flexible design that anticipates learner variability and embeds multiple means of representation, action/expression, and engagement into the original lesson rather than retrofitting accommodations after the fact. Creating separate plans for each subgroup is the strongest distractor because it attends to individual needs, but it is not UDL; UDL designs one flexible curriculum accessible to all and reduces the need for individualized workarounds. Bolting on accommodations or relying on pull-out support likewise treats access as an afterthought rather than a design feature."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "During an IEP meeting, a parent disagrees with the CSE's proposed placement for her daughter with autism and requests that the student remain in a general education classroom with supplementary aids. The team cannot reach consensus. What is the parent's MOST appropriate next recourse under IDEA?",
    "a": [
      "Accept the CSE placement since the majority of the team voted for it.",
      "File a complaint with the State Education Department immediately, bypassing all other options.",
      "Request mediation, file for an impartial due process hearing, or file a state complaint, all procedural safeguards available under IDEA.",
      "Withdraw the student from public school because the parent has lost all rights once the team votes."
    ],
    "c": 2,
    "r": "IDEA's procedural safeguards (34 C.F.R. §§ 300.506-300.511, 300.151-300.153) explicitly provide parents with the right to request mediation, initiate an impartial due process hearing, or file a state complaint when disputes with the CSE cannot be resolved; parents retain these rights regardless of team outcomes. Option A is incorrect because IDEA does not operate on majority-vote logic; parental rights and procedural safeguards are independent of how other team members lean."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A high school teacher notices that a student's academic performance has declined sharply over two marking periods. The student's family has not responded to two written notices sent home. What is the MOST effective and equitable strategy for the teacher to pursue?",
    "a": [
      "Wait until the next scheduled report card conference to raise the concern in person.",
      "Refer the student immediately to special education evaluation since lack of family response may signal a disability.",
      "Send a third written notice indicating that failure to respond may result in a mandatory parent conference or a truancy referral.",
      "Document the attempted contacts, then try a direct phone call at multiple times of day; if there is no response, enlist the school's family outreach coordinator or social worker to make contact."
    ],
    "c": 3,
    "r": "Escalating outreach through varied modalities (phone, varied times) and involving school family-engagement staff is the evidence-based, equitable response to non-response; it recognizes that families may face access barriers such as work schedules, literacy, or language rather than indifference. Referring immediately to special education (option B) is inappropriate and legally unsound: academic decline plus an unreached family does not by itself trigger IDEA evaluation; a proper referral requires documented evidence of a suspected disability and consideration of general education interventions."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A second-grade teacher has a student who is classified as an English Language Learner (ELL). The parents speak Haitian Creole and have limited English proficiency. The teacher wants to share data from the student's most recent ENL progress monitoring report at an upcoming conference. What must the school provide to ensure the parents can meaningfully participate?",
    "a": [
      "A qualified interpreter and translated written materials in Haitian Creole, at no cost to the family.",
      "An English copy of the report so parents can study it before the meeting.",
      "A summary of results in plain English delivered by the student.",
      "The bilingual education teacher's contact information so parents can schedule a separate meeting."
    ],
    "c": 0,
    "r": "Title VI of the Civil Rights Act of 1964 and New York State guidance require schools to provide meaningful access to programs and activities for parents with limited English proficiency, which includes qualified interpreters and translated documents at no cost. Having the student interpret (option C) violates professional and ethical standards because it burdens the child, compromises accuracy, and undermines parents' ability to make informed decisions about their child's education."
  },
  {
    "s": "C5",
    "d": "School-Home Relationships & Family Engagement",
    "q": "A middle school uses a school-wide PBIS framework. A parent contacts the assistant principal to express frustration that she was not informed about the behavioral expectations tier her son has been placed on, nor was she involved in developing his individualized behavior support plan. Which statement BEST reflects appropriate school practice under PBIS and family partnership principles?",
    "a": [
      "PBIS is a general education intervention, so schools are not required to involve parents at any tier.",
      "At Tier 2 and especially Tier 3, schools should proactively communicate tier placement to families, share progress data, and involve parents in developing and monitoring individualized behavior support plans.",
      "Family involvement is encouraged but optional at Tiers 2 and 3; schools may simply inform parents at report card time.",
      "Because the student has no IEP, the school retains full discretion over behavioral programming without any parental input."
    ],
    "c": 1,
    "r": "Effective PBIS implementation at Tiers 2 and 3 requires family partnership: parents should be informed of tier placement, provided with data on their child's progress, and included as collaborators in individualized support-plan development to ensure consistency across school and home, a core EAS C5 competency. Options A, C, and D understate this obligation; although Tier 2/3 supports are not IEPs, best-practice standards and New York's Multi-Tiered System of Supports (MTSS) guidance treat meaningful family engagement as essential, not discretionary, at higher tiers."
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
        "body": "Family engagement is both a legal obligation and a high-leverage practice. Title I (Section 1116 of ESSA) requires meaningful parent and family engagement, and IDEA mandates parent participation in IEP development, prior written notice, and procedural safeguards. Effective teachers move beyond compliance to build two-way partnerships using asset-based communication, learning what families know, value, and hope for their children rather than defaulting to deficit framing. Strategies include home visits, family literacy nights, and accessible communication formats in home languages. For English-learner families, schools must provide meaningful language access (translation and interpretation of essential information) under Title VI of the Civil Rights Act and the Equal Educational Opportunities Act of 1974, as established in Lau v. Nichols; Title VI also requires communicating with limited-English-proficient parents in a language they can understand. Teachers should also recognize how acculturation stress, immigration-related fear, and a history of discriminatory schooling can dampen family participation. A funds-of-knowledge approach (Moll et al.) treats household and community practices as legitimate starting points for learning, bridging home and school."
      },
      {
        "title": "Recognizing Gifts, Talents, and Individual Needs Across Diverse Populations",
        "body": "Teachers must recognize the full range of learner variability. IDEA defines disability categories (13 in the federal regulations) that, when a student also needs specially designed instruction, qualify a student for special education; Section 504 of the Rehabilitation Act protects a broader group whose impairment substantially limits a major life activity but who may not need specially designed instruction. Response to Intervention (RtI), a multi-tiered system of high-quality instruction, universal screening, and progress monitoring, provides support before a disability determination and can flag students who need enrichment; in New York, an RtI process is required before identifying a student with a learning disability and may never be used to delay or deny a parent-requested referral. A central equity concern is misidentification: teachers must guard against attributing a CLD student's struggle to disability when limited English proficiency, lack of appropriate instruction, or cultural mismatch is the better explanation, while also addressing the historic underidentification of gifted CLD students. Universal Design for Learning (CAST) proactively reduces barriers through multiple means of representation, action and expression, and engagement, so that disability, giftedness, and language development are all served in the same environment."
      }
    ],
    "practice": [
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 4th-grade teacher has several newly enrolled students who are recent immigrants with limited English proficiency. Before designing her first unit, she wants to gather information that will help her build on each student's strengths. Which of the following actions would BEST help her accomplish this goal?",
        "a": [
          "Administer a grade-level standardized reading assessment in English and use the results to assign flexible reading groups.",
          "Review the Home Language Questionnaire, ensure each student is screened with the NYSITELL, and conduct interest inventories in the students' home languages.",
          "Ask the school counselor to observe each new student for two weeks before sharing any information with the teacher.",
          "Assign a classroom buddy to each new student and rely on peer reports to understand the students' backgrounds and needs."
        ],
        "c": 1,
        "r": "Option B is correct because it pairs the required English-learner identification process (the Home Language Questionnaire and the NYSITELL screener establish proficiency level and services) with an asset-based informal tool (interest inventories in the home language) that surfaces students' interests and strengths and helps the teacher anticipate the gap between conversational fluency (BICS) and academic language (CALP). Option A is the strongest distractor but is wrong: a grade-level English reading assessment mainly reflects current English proficiency, not academic potential or cultural assets, and using it to group these students risks misidentifying limited English proficiency as low ability."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "After reviewing video recordings of his own instruction, a middle school teacher notices that he consistently calls on the same six students and rarely waits more than two seconds for a response before redirecting. According to the EAS framework, this teacher is engaging in which professional practice?",
        "a": [
          "Formative assessment, using observational data to monitor student understanding.",
          "Differentiated instruction, adjusting pacing to meet individual student needs.",
          "Self-reflection, analyzing his own teaching behaviors to identify equity gaps and improve practice.",
          "Culturally responsive teaching, documenting cultural participation patterns to inform curriculum."
        ],
        "c": 2,
        "r": "Option C is correct because the teacher is using video evidence to examine his own instructional behavior, specifically inequitable patterns in who he calls on and how long he waits. The EAS framework and the New York State Code of Ethics for Educators frame this kind of self-examination, aimed at enhancing interactions with all students, as self-reflection. Option A is the strongest distractor but is wrong: formative assessment analyzes data about student learning, whereas here the object of analysis is the teacher's own practice, not the students' understanding."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A high school teacher is redesigning her classroom library and discussion norms to better serve a class with students from seven different countries and three students with IEPs. She wants the environment to affirm all students' identities while meeting her legal obligations under the Dignity for All Students Act (DASA). Which combination of actions BEST reflects this goal?",
        "a": [
          "Display student work samples on a bulletin board and let students choose their own seating arrangement each day.",
          "Stock the classroom library exclusively with texts by authors from the students' home countries and conduct all class discussions in the students' home languages.",
          "Send a letter asking families to donate books from their home cultures and postpone establishing community norms until all of the materials have arrived.",
          "Curate a multilingual, culturally diverse classroom library, establish explicit anti-harassment norms aligned with DASA's protected categories, and apply UDL principles so texts and discussions are accessible to the students with IEPs."
        ],
        "c": 3,
        "r": "Option D is correct because it integrates three sound practices at once: culturally responsive curation (a diverse, multilingual library), legal compliance with DASA's mandate for an environment free of harassment based on its protected categories, and UDL's proactive accessibility, which addresses disability and linguistic variability in the same instructional design. Option A is the strongest distractor but is insufficient: displaying work and flexible seating can support community, yet they do not affirm cultural identity, satisfy the specific DASA obligation, or ensure the texts and discussions are accessible to the students with IEPs."
      },
      {
        "s": "C1",
        "d": "Knowing Learners & Building Classroom Community",
        "q": "A 2nd-grade teacher notices that a Latina student who recently exited English-language services rarely participates in group work and whose academic performance has declined. When the teacher contacts the family, the grandmother explains that the family recently received threatening correspondence related to their immigration status and is very anxious. What is the MOST appropriate next step for the teacher?",
        "a": [
          "Acknowledge the family's stress, connect them with the school social worker and available community resources, and use low-stakes community-building structures (such as cooperative learning and restorative circles) to re-engage the student socially and academically.",
          "Refer the student immediately to the CSE for an evaluation to determine whether a learning disability is causing the academic decline.",
          "Tell the family that immigration matters are outside the school's scope and keep the conversation focused entirely on academic skill remediation.",
          "Place the student back into English-language services because her recent performance resembles that of an English learner."
        ],
        "c": 0,
        "r": "Option A is correct because it demonstrates an asset-based family partnership, responsiveness to acculturation stress and family fear as factors affecting participation, and use of community-building structures (cooperative learning and restorative practices, consistent with PBIS and SEL) to address the social and academic regression. Option B is the strongest distractor but is wrong: IDEA's eligibility rules require ruling out that the determinant factor is limited English proficiency or a lack of appropriate instruction (34 CFR 300.306(b)) before identifying a disability, so referring for evaluation while an obvious environmental cause is unaddressed is premature and risks the disproportionate identification of culturally and linguistically diverse students."
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
        "body": "Both IDEA 2004 and ESSA call for instruction grounded in research, but the terms differ in rigor. Research-based practice refers to any approach supported by some form of scholarly investigation. Evidence-based practice (EBP) sets a higher bar: a body of high-quality experimental or quasi-experimental research demonstrating effectiveness for a defined population and outcome. IDEA requires that special education and related services be based on peer-reviewed research 'to the extent practicable' (34 CFR 300.320(a)(4)). ESSA defines four evidence tiers, strong, moderate, promising, and 'demonstrates a rationale'; the top three meet the 'evidence-based' standard for funded interventions. For the EAS, know that choosing an approach because it is popular or traditional does not satisfy these standards. Teachers should distinguish practices validated through systematic, peer-reviewed study (e.g., explicit instruction, peer-assisted learning strategies) from those lacking that base. RtI and PBIS, the academic and behavioral arms of a Multi-Tiered System of Supports, operationalize EBP by requiring evidence-based core instruction at Tier 1 before intensifying support, making EBP central to general and special education alike."
      },
      {
        "title": "Students with Interrupted/Inconsistent Formal Education (SIFE)",
        "body": "Under NYSED, SIFE are English language learners who, upon enrollment, have attended U.S. schools for fewer than 12 months and are two or more years below grade level in home-language literacy and/or in mathematics because of inconsistent or interrupted schooling before arrival. 'Low-literacy SIFE' have home-language literacy at or below the third-grade level. NYSED requires that SIFE receive ENL (or bilingual) services plus additional support addressing foundational literacy and numeracy gaps. SIFE needs differ from those of typical ELLs: instruction must simultaneously build academic language and the foundational content peers acquired in earlier grades, without conflating limited schooling with cognitive disability. Cummins' BICS/CALP framework is essential: BICS (conversational fluency) develops within about 1-2 years, while CALP, the decontextualized academic language school demands, takes roughly 5-7 years. Misidentifying a SIFE student as having a learning disability when the real factor is interrupted education or limited English proficiency violates IDEA's exclusionary-factor rule (34 CFR 300.306(b)), which bars a disability determination when the determinant factor is limited English proficiency or lack of appropriate instruction in reading or math."
      },
      {
        "title": "Students Experiencing Homelessness, Foster Care, and Poverty",
        "body": "The McKinney-Vento Homeless Assistance Act requires that students experiencing homelessness receive immediate enrollment (even without records or proof of residency), transportation to the school of origin when it is in the student's best interest, and a district homeless liaison to coordinate services. McKinney-Vento's definition of homelessness includes doubled-up housing, motels, and shelters. Students in foster care hold parallel protections under ESSA (2015): educational stability, a best-interest determination about school of origin, immediate enrollment, and coordination between child-welfare and education agencies. Poverty broadly shapes academic risk; students may face food insecurity, housing instability, limited technology access, and high mobility, all of which intersect with learning. Trauma-informed practice, consistent routines, and culturally responsive approaches reduce barriers across adverse circumstances. Teachers should also recognize diverse family structures (single-parent, multigenerational, same-sex-parent, grandparent-headed) and design school-home communication that does not presume a two-parent nuclear household. EAS items here often ask you to identify the teacher action that upholds both legal protections and an equitable climate: not charity-framing, but rights-affirming, asset-based practice."
      },
      {
        "title": "Gifted Students and Curriculum Modification",
        "body": "New York defines gifted pupils (Education Law Article 90; CR Part 142) as those who show evidence of high performance capability and exceptional potential, such as general intellectual ability, special academic aptitude, or outstanding ability in the visual or performing arts, and who need programs beyond the regular school program to realize their potential. Unlike students with disabilities, gifted students have no federal IDEA entitlement, and New York does not mandate gifted identification or programming, though districts must screen new entrants for possible giftedness (CR Part 117). Appropriate modifications include acceleration (faster pacing or grade skipping), curriculum compacting (pre-assessing and replacing mastered content with enrichment), tiered assignments (varied complexity from one essential question), and independent study or project-based extensions. Key EAS distinction: simply assigning more of the same work (more problems, longer essays) is not enrichment; it is busywork that can undermine motivation. UDL's principle of appropriate challenge applies to gifted learners as much as to students who need additional support. Teachers should use pre-assessment data to gauge readiness and match cognitive demand to each learner's instructional level."
      },
      {
        "title": "Fair, Equitable Assessment to Inform Instruction",
        "body": "Equitable classroom assessment means the tools, processes, and interpretations teachers use do not systematically advantage or disadvantage students by race, language, disability status, or socioeconomic background. Key principles: (1) Validity, the task must measure the intended learning, not an irrelevant factor like English proficiency when the target is science content; (2) Multiple measures, no single score should drive instructional decisions; (3) Formative vs. summative, formative assessment (exit tickets, observations, think-alouds) guides daily instruction while summative assessment evaluates cumulative learning; (4) Accommodations vs. modifications, students with IEPs or 504 plans may receive accommodations (extended time, read-aloud) that do not alter the construct measured, while modifications change the standard or expectation itself. Under FERPA, personally identifiable assessment data is protected; disclosing it without consent (absent an exception such as a school official with legitimate educational interest) violates federal law. Under IDEA's Child Find duty, results suggesting an unmet disability-related need should prompt a referral to the CSE, after ruling out limited English proficiency or inadequate instruction as the determinant factor. Reviewing assessments for cultural, linguistic, or experiential bias is a professional responsibility for all NYS teachers."
      }
    ],
    "practice": [
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A fifth-grade teacher is planning a unit on the American Revolution. She wants to ensure that all students, including two students with IEPs, three English language learners, and one student identified as gifted, can access the content and demonstrate understanding. Which of the following instructional planning approaches BEST reflects Universal Design for Learning?",
        "a": [
          "Design the unit from the start with layered text-complexity options, visual timelines, choice boards for demonstrating mastery, and discussion supports, so all learners access the same essential content flexibly.",
          "Develop the unit using grade-level text, then create separate modified packets for students with IEPs and simplified vocabulary sheets for ELLs after planning is complete.",
          "Assign the gifted student independent research and group the remaining students by reading level for differentiated small-group instruction throughout the unit.",
          "Follow the core textbook lesson sequence and provide one-on-one re-teaching only to students who struggle after each assessment."
        ],
        "c": 0,
        "r": "Option A is correct because UDL requires proactive, flexible design built in from the start, offering multiple means of representation, action and expression, and engagement for all learners at once. Option B is the strongest distractor: it represents retrofitting (adding accommodations after the design is finished), which is the opposite of UDL's proactive approach and routes students with IEPs and ELLs into a separate, parallel track."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A middle school recently enrolled a 13-year-old student who arrived from Central America. Records indicate she attended school only sporadically between ages 6 and 11 due to displacement, and her literacy in Spanish is approximately at a second-grade level. She is cheerful, socially adept, and converses in both Spanish and emerging English. Her teacher notices she struggles significantly with written academic tasks. Which of the following responses is MOST appropriate?",
        "a": [
          "Refer her immediately to the CSE for a learning-disability evaluation, since her academic performance is significantly below grade level.",
          "Provide only oral instruction and eliminate writing tasks, since written language appears to be her primary deficit.",
          "Recognize that her profile is consistent with SIFE, ensure she receives ENL (or bilingual) services and foundational literacy support, and avoid conflating her interrupted schooling with a learning disability.",
          "Place her in a bilingual class and wait six months before making any instructional adjustments, since CALP takes years to develop."
        ],
        "c": 2,
        "r": "Option C is correct because IDEA's exclusionary-factor rule (34 CFR 300.306(b)) prohibits identifying a disability when the determinant factor is limited English proficiency or lack of appropriate prior instruction. Her strong conversational fluency (BICS) alongside weak academic literacy is the hallmark SIFE profile, calling for targeted ENL and foundational literacy support. Option A is the strongest distractor because it takes action, but referring her to the CSE before providing appropriate SIFE instruction violates that rule, since inadequate schooling is the likely cause."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A third-grade teacher is designing the culminating assessment for a science unit. Two students are English language learners at the Entering/Emerging level, and one student has an IEP that includes extended time and an oral-response accommodation. The teacher wants the assessment to fairly measure science content knowledge for all students. Which assessment design decision BEST supports equitable measurement?",
        "a": [
          "Design the assessment using visual supports and allow students with IEPs and ELLs to respond orally or through drawings, so the tool measures science understanding rather than English writing proficiency.",
          "Create a separate, simplified assessment with fewer questions for ELLs and students with IEPs to reduce frustration.",
          "Administer the same written assessment to all students and average the scores; any differences reflect real differences in content mastery.",
          "Exempt the ELLs from the summative assessment this unit, since their developing English makes scoring invalid."
        ],
        "c": 0,
        "r": "Option A is correct because assessment validity requires the instrument to measure the intended construct, science knowledge, not a confounding factor like English writing proficiency. Visual supports and oral or drawn responses are accommodations that preserve construct validity for the ELLs and match the student's IEP oral-response accommodation. Option B is the strongest distractor, but it is a modification (changing the standard and task), not an accommodation, and it yields data that cannot be compared or used to inform grade-level instruction."
      },
      {
        "s": "C1",
        "d": "Inclusive, Evidence-Based Instruction & UDL",
        "q": "A school counselor informs a fourth-grade teacher that one of her students is currently living in a shelter and is classified as experiencing homelessness under McKinney-Vento. The student has been absent three times in two weeks and arrives without supplies. Which combination of teacher actions BEST reflects the legal and instructional obligations associated with this student's situation?",
        "a": [
          "Refer the student for a special education evaluation, since repeated absences and a lack of materials suggest a possible learning disability.",
          "Excuse all assignments and assessments for the rest of the semester to relieve stress and support the student's well-being.",
          "Contact the family to communicate that consistent attendance is required and that missing supplies will incur grade penalties consistent with class policy.",
          "Coordinate with the district's McKinney-Vento liaison, ensure materials are available without penalty, apply trauma-informed and asset-based practices, and maintain high academic expectations with flexible supports."
        ],
        "c": 3,
        "r": "Option D is correct because McKinney-Vento charges the district liaison with coordinating services and immediate support, and best practice maintains high academic expectations while removing the logistical barriers (supplies, attendance penalties) that flow from housing instability, rather than lowering standards. Option C is the strongest distractor because it appears to set reasonable expectations, but applying standard attendance and supply penalties to a student living in a shelter violates the requirements and intent of McKinney-Vento, which mandates flexibility and removal of barriers to enrollment and participation."
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
        "body": "Effective teachers recognize that learning extends beyond classroom walls and tap into a network of school-based and community-based resources. School-based resources include intervention specialists, ENL (English as a New Language) teachers, bilingual educators, school counselors, psychologists, and the Committee on Special Education (CSE) referral process for students who may need IDEA-protected supports. Under Section 504 of the Rehabilitation Act, students with a disability who do not qualify for special education may still receive accommodations coordinated through a building-level 504 team. Community-based resources include cultural organizations, faith communities, public libraries, community health centers, and local businesses that can provide mentors, guest speakers, and real-world project contexts. Parent coordinators and community liaisons bridge school and home, particularly for families whose primary language is not English or who have limited prior experience with U.S. school systems. Multi-Tiered Systems of Support (MTSS), including Response to Intervention (RtI), connect classroom teachers to tiered school-based supports; in New York, RtI is required for identifying a specific learning disability in reading in grades K-4. Mapping these resources and knowing referral pathways is a core teacher competency the EAS assesses directly."
      },
      {
        "title": "Creating a Safe, Supportive Classroom That Fully Integrates Students with Disabilities",
        "body": "Full integration of students with disabilities begins with IDEA (Individuals with Disabilities Education Act), which mandates a free appropriate public education in the least restrictive environment (LRE). Most students with disabilities receive services in general education classrooms, meaning all teachers, not only special educators, are responsible for implementing IEP accommodations and modifications. Co-teaching models (one teach/one assist, parallel, station, alternative, and team teaching) operationalize this shared responsibility. Psychologically safe classrooms are built through consistent routines, explicit social-emotional learning, Positive Behavioral Interventions and Supports (PBIS), and restorative practices rather than reliance on exclusionary discipline. DASA requires all staff to address harassment and bias proactively. UDL's three principles (multiple means of engagement, representation, and action and expression) provide a classroom architecture that benefits students with disabilities, emergent bilinguals, and all learners simultaneously. Teachers must protect the confidentiality of a student's disability status (FERPA and IDEA confidentiality provisions apply) and never disclose it to peers, while still fostering a community norm of mutual respect and support. Classroom climate surveys and student feedback loops help teachers assess whether students genuinely feel included."
      },
      {
        "title": "Supporting Emergent Bilinguals Through Language-Responsive Instruction",
        "body": "English Language Learners (emergent bilinguals) hold civil-rights protections under Title VI of the Civil Rights Act of 1964 and the Equal Educational Opportunities Act of 1974, established by Lau v. Nichols (1974) and operationalized by the Castaneda v. Pickard three-prong standard; Title III of ESSA provides supplemental funding, and New York's Commissioner's Regulations Part 154 govern services. Teachers must distinguish BICS (Basic Interpersonal Communicative Skills, conversational fluency typically acquired in 1-2 years) from CALP (Cognitive Academic Language Proficiency, academic language typically requiring 5-7 years; Cummins). A student who appears orally fluent may still need significant scaffolding for academic reading and writing; misreading BICS as full proficiency is a common instructional error. New York offers Transitional Bilingual Education, Dual Language, and Stand-Alone ENL programs, each appropriate to different student counts and community contexts. Co-planning between content teachers and ENL teachers makes academic content linguistically accessible without lowering cognitive demand. Scaffolds such as sentence frames, graphic organizers, bilingual glossaries, and think-alouds support CALP development. Because Title VI treats language-based discrimination as a form of national-origin discrimination, language difference must never trigger exclusion or ridicule."
      },
      {
        "title": "Family and Community Engagement as a Collaborative Partnership",
        "body": "Research consistently links meaningful family engagement to improved student outcomes, and IDEA legally requires parental participation in IEP development and placement decisions. However, engagement must extend to genuine partnership, not one-way communication. Culturally responsive family engagement acknowledges that families communicate, participate, and define \"support\" differently across cultural contexts, and that logistical barriers (work schedules, transportation, language, prior negative school experiences) are structural, not indications of disinterest. Effective strategies include home visits or community-site meetings, multilingual communication (required by Title VI for families with limited English proficiency), flexible scheduling, and positioning families as experts on their children. Under FERPA, parents have the right to inspect, review, and request amendment of their child's education records. Community liaisons and parent coordinators, common in many large New York districts, formalize this bridge role. The EAS expects teachers to recognize that equitable engagement requires proactive, culturally humble outreach rather than waiting for families to navigate the school's structures on their own."
      }
    ],
    "practice": [
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A 7th-grade ELA teacher notices that her students, many of whom are recent immigrants, seem disengaged when reading the assigned anthology texts. She wants to increase authentic engagement with literature. Which approach best reflects the EAS principle of using classroom and community diversity to enhance learning?",
        "a": [
          "Supplement the anthology with short stories and poetry by authors from the students' home cultures and invite students to share family narratives as mentor texts for their own writing.",
          "Allow students to choose any book from the school library so they can self-select based on personal interest regardless of cultural content.",
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
          "Withhold the accommodations during the assessment to obtain a true baseline measure of the student's independent performance.",
          "Defer entirely to the building principal, since assessment decisions exceed a classroom teacher's authority.",
          "Provide all IEP-specified accommodations during the assessment, because the IEP must be implemented in both instructional and assessment contexts as documented.",
          "Provide only the extended time, since a graphic organizer might give the student an unfair advantage over peers without IEPs."
        ],
        "c": 2,
        "r": "An IEP must be implemented as written across instructional and assessment settings; failing to provide documented accommodations is a failure to implement the IEP and a violation of the student's right to a free appropriate public education under IDEA. Withholding accommodations does not produce a valid baseline; it measures performance without legally required supports and misrepresents what the student knows. Deferring wholesale to the principal abdicates the teacher's own legal responsibility, and selectively providing only one accommodation likewise fails to implement the IEP as written."
      },
      {
        "s": "C1",
        "d": "Diversity as an Asset & School-Community Collaboration",
        "q": "A high school biology teacher wants to build connections between her curriculum and the local community. Her school is in a neighborhood with a large Puerto Rican community and sits near a protected urban wetland. Which instructional approach best exemplifies identifying and incorporating community-based resources to enhance learning?",
        "a": [
          "Assign a research paper on global biodiversity using peer-reviewed journal articles to prepare students for college-level scientific writing.",
          "Partner with a local environmental nonprofit staffed by community members to conduct water-quality testing of the wetland, framing the data analysis within the community's historical relationship to the land.",
          "Show a documentary about rainforest ecosystems so students can compare local and global environmental challenges.",
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
          "Ms. Torres is correct; playground fluency indicates Amara is ready for grade-level literacy instruction without additional language scaffolds.",
          "Ms. Torres should ask Amara's family to speak only English at home so Amara builds proficiency more quickly.",
          "Ms. Torres should refer Amara to the CSE immediately, since the reading gap most likely reflects a learning disability under IDEA.",
          "Ms. Torres is confusing BICS with CALP; she should provide academic-language scaffolds with the ENL teacher and ensure Amara's English proficiency is formally assessed before considering any disability referral."
        ],
        "c": 3,
        "r": "Ms. Torres is conflating BICS (conversational fluency, often reached in 1-2 years) with CALP (academic language, typically 5-7 years; Cummins), a well-documented error. Amara should receive academic-language scaffolds and have her English proficiency formally assessed, consistent with New York's ENL identification process under Commissioner's Regulations Part 154. An immediate CSE referral is premature: under IDEA (34 CFR 300.306(b)), limited English proficiency may not be the determinant factor in an eligibility decision, so language acquisition must be addressed and adequate language data gathered first. Telling the family to abandon the home language is harmful and undercuts the L1's role in building academic English."
      }
    ]
  },
  "Language Acquisition Foundations": {
    "icon": "🗣️",
    "concepts": [
      {
        "title": "Stages of Second-Language Acquisition",
        "body": "Krashen and Terrell's Natural Approach identifies five sequential stages ELLs move through: (1) Pre-production (Silent Period) the learner builds receptive vocabulary, responds nonverbally, and may say little for weeks to months; (2) Early Production one- to two-word responses, high-frequency phrases, approximately 1,000 receptive words; (3) Speech Emergence simple sentences, formulaic language, grammatical errors still prominent; (4) Intermediate Fluency complex sentences, ability to express opinion, content gaps remain; (5) Advanced Fluency near-native command of social and academic language, though academic vocabulary gaps may persist years longer. EAS items frequently test whether teachers calibrate task demands and linguistic scaffolds to stage. A student in pre-production should not be penalized for silence; a student in intermediate fluency still needs explicit academic vocabulary instruction. Stage is not fixed: anxiety, topic familiarity, and L1 proximity to English speed or slow movement. Recognizing stage informs ENL service-delivery decisions and helps teachers distinguish a normal stage of language development from a disability rather than misidentifying difference as disability."
      },
      {
        "title": "BICS vs. CALP",
        "body": "Jim Cummins distinguishes Basic Interpersonal Communicative Skills (BICS) from Cognitive Academic Language Proficiency (CALP). BICS is context-embedded, face-to-face social language that typically develops within one to three years; it relies on paralinguistic cues (gesture, intonation, shared context) and is comparatively undemanding cognitively. CALP is context-reduced, cognitively demanding academic language, the discourse of textbooks, standardized tests, and disciplinary writing. CALP takes roughly five to seven years (longer for students with interrupted schooling) to approach grade-level native-speaker proficiency. The BICS-CALP gap is the central EAS assessment trap: a student who converses fluently on the playground may still lack the academic language to comprehend a persuasive essay prompt or a mathematics word problem. Overestimating proficiency on the basis of BICS leads to premature exit from ENL services and academic underperformance. CALP is largely transferable across languages, so strong L1 academic literacy accelerates English CALP development, supporting the asset-based rationale for bilingual programs and for sustained academic-language scaffolding even after conversational fluency emerges."
      },
      {
        "title": "Factors Affecting Second-Language Acquisition",
        "body": "Multiple variables moderate how quickly and fully ELLs acquire English. L1 literacy is among the strongest predictors: students who read and write proficiently in their home language transfer phonological awareness, decoding strategies, and academic-discourse schemas to English (Cummins's Common Underlying Proficiency model). Students with Interrupted or Inconsistent Formal Education (SIFE) lack both L1 literacy and content knowledge and require specialized models beyond standard ENL services. Krashen's Affective Filter Hypothesis holds that anxiety, low motivation, and low self-confidence raise a metaphorical filter that blocks comprehensible input; low-anxiety classrooms that supply rich comprehensible input lower the filter. Teacher expectations operate alongside this mechanism: deficit framing, low-rigor tasks, and exclusion from grade-level content suppress achievement, while high expectations with strong scaffolding support it. Age of arrival matters: younger arrivals typically achieve stronger phonological outcomes, while older arrivals leverage stronger L1 academic foundations. Socioeconomic status, family stability, and prior trauma also shape acquisition trajectories. None of these factors, alone or combined, makes language difference a disability."
      },
      {
        "title": "Types and Benefits of Bilingualism",
        "body": "Bilingualism is not a uniform condition. Additive bilingualism occurs when a second language is acquired without displacing the first, and is associated with metalinguistic awareness and strong academic outcomes. Subtractive bilingualism occurs when English acquisition erodes L1 proficiency, typically in English-only environments, and is associated with loss of family communication, cultural-identity fracture, and weaker long-term English academic outcomes. Simultaneous bilingualism describes children acquiring two languages from birth; sequential bilingualism describes acquiring L2 after L1 is established (typically after about age three). Research generally documents cognitive and metalinguistic benefits of bilingualism, though the size of executive-function effects is debated. NYS recognizes multiple program models under CR Part 154: Transitional Bilingual Education (TBE) uses L1 as a bridge to English with planned reduction of L1 instruction; Dual Language / Two-Way Immersion programs develop full proficiency in both languages and enroll both ELLs and English-proficient peers. The EAS framework treats bilingualism as an asset for the whole classroom community, not merely a deficit to remediate."
      },
      {
        "title": "Primary Language as Right and Asset",
        "body": "Federal and state law protect ELLs' right to a meaningful education they can access. Lau v. Nichols (1974) held that identical instruction does not constitute equal education when students cannot understand English; districts must take affirmative steps. The Equal Educational Opportunities Act (EEOA, 1974) requires states and districts to overcome language barriers through appropriate action. In NYS, CR Part 154 requires identification of ELLs within 10 school days of initial enrollment (Home Language Questionnaire, individual interview, and NYSITELL), placement in ENL or bilingual services, annual proficiency assessment via NYSESLAT, and parental notification in the home language. Title III of ESSA funds supplemental language-instruction programs. The home language is simultaneously a legal right and a pedagogical asset: previewing content in L1 (preview-review), cognate instruction, and translanguaging, the strategic use of a student's full linguistic repertoire, accelerate academic concept development and signal that home language has value in school. Asset-based framing is testable, since EAS scenarios often ask teachers to identify strategies that leverage, rather than suppress, the home language."
      },
      {
        "title": "Legal Rights of ELLs in New York State",
        "body": "ELLs are protected by interlocking federal and state law. Title VI of the Civil Rights Act bars discrimination based on national origin; Lau v. Nichols applied Title VI to language access. Title III of ESSA funds language-instruction programs and requires annual reporting of ELL progress. CR Part 154 (revised 2015) sets NYS-specific identification, placement, service-unit, and exit requirements. IDEA and Section 504 apply to ELLs with disabilities, and language difference may not be the basis for a special-education referral or eligibility; evaluations must be conducted in the student's native language or mode of communication unless clearly not feasible. FERPA protects the confidentiality of student records, including Home Language Questionnaire data. The Dignity for All Students Act (DASA) requires a safe, inclusive environment and names national origin and ethnic group among protected characteristics; each school designates at least one Dignity Act Coordinator to address harassment and bias. Parents of ELLs receive required notices in the home language and may decline bilingual-program placement, though mandated ENL services continue. After reclassification on NYSESLAT, former ELLs are monitored for two years."
      }
    ],
    "practice": [
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A seventh-grade ELL arrived from the Dominican Republic eight months ago. She participates enthusiastically in class discussions, volunteers answers, and chats easily with peers. Her English teacher notes that her written responses on content-area assessments are one to two sentences long and lack supporting evidence. Which interpretation BEST explains this pattern?",
        "a": [
          "Her BICS has developed appropriately, but her CALP in English is still emerging and requires continued ENL support.",
          "She may have a learning disability affecting written expression that should trigger a CSE referral.",
          "She should be exited from ENL services because her conversational fluency demonstrates English proficiency.",
          "Her short written responses indicate low motivation and should be addressed through a behavior intervention plan."
        ],
        "c": 0,
        "r": "BICS (social, conversational fluency) typically develops within one to three years and is context-embedded, explaining her confident oral participation. CALP (academic written language) requires roughly five to seven years and is context-reduced, explaining the thin written responses. The learning-disability/CSE-referral option is the strongest distractor because short written responses can resemble a writing disability, but IDEA and CR Part 154 require ruling out language difference as the cause before any special-education referral, and a disability inference at eight months of English instruction would be premature and inappropriate."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A third-grade teacher notices that her newly arrived ELL, who speaks no English, becomes visibly anxious during whole-class read-alouds and refuses to attempt any spoken responses. To lower the student's affective filter and support language acquisition, which instructional adjustment is MOST appropriate?",
        "a": [
          "Seat the student apart from peers during literacy activities to reduce distraction and embarrassment.",
          "Refer the student for a speech-language evaluation, as refusal to speak may indicate a communication disorder.",
          "Provide nonverbal response options (gestures, picture cards, thumbs up or down) and allow a silent period while building comprehensible input.",
          "Require the student to attempt spoken responses daily, since structured practice is the fastest path to fluency."
        ],
        "c": 2,
        "r": "Krashen's Affective Filter Hypothesis holds that anxiety blocks the intake of comprehensible input; lowering the filter through low-stakes, nonverbal response options and honoring the silent period is appropriate for a pre-production learner. The forced-daily-oral-production option is the strongest distractor because it seems to maximize practice, but compelling speech before the student is ready raises the affective filter and suppresses acquisition rather than accelerating it. Referral for a speech-language evaluation misreads a normal silent period as a disorder."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "A high school social studies teacher is planning a unit on the U.S. Constitution for a class that includes several intermediate-fluency ELLs. Which strategy BEST reflects an asset-based approach to the students' bilingualism while developing CALP?",
        "a": [
          "Provide all instruction in English only to maximize ELLs' immersion time and accelerate reclassification.",
          "Allow ELLs to preview key constitutional concepts in their home language and construct a bilingual concept map before English discussion.",
          "Group ELLs separately for the unit and use simplified texts at a lower reading level to ensure comprehension.",
          "Postpone abstract content for ELLs until they achieve Advanced Fluency on the NYSESLAT."
        ],
        "c": 1,
        "r": "Previewing content in L1 and using translanguaging (a bilingual concept map) leverages Cummins's Common Underlying Proficiency, since academic concept knowledge built in L1 transfers to L2, accelerating CALP while treating the home language as an asset. The English-only immersion option is the strongest distractor because immersion-only settings are common in practice, but research and CR Part 154 support strategic L1 use; immersion-only approaches risk subtractive bilingualism and slower concept acquisition. Simplifying texts strips rigor (amplify, do not simplify), and postponing abstract content denies grade-level access."
      },
      {
        "s": "C2",
        "d": "Language Acquisition Foundations",
        "q": "Parents of a newly identified ELL enroll their daughter in a school where both a Transitional Bilingual Education (TBE) program and a stand-alone ENL program are available. The parents tell the teacher they do not want their daughter placed in the bilingual program; they prefer ENL-only services. Under NYS law, which response by the teacher is MOST legally appropriate?",
        "a": [
          "Inform the parents that placement decisions are made exclusively by the building principal and their preference cannot be honored.",
          "Explain that the bilingual program is required by CR Part 154 and the parents cannot opt out once the school offers it.",
          "Refer the decision to the Committee on Special Education, which oversees all language-placement decisions for ELLs.",
          "Acknowledge the parents' right to decline bilingual-program placement, document their decision, and ensure the student still receives mandated ENL services."
        ],
        "c": 3,
        "r": "CR Part 154 mandates identification and the delivery of language-instruction services, but it preserves parents' right to decline bilingual-program participation; a district cannot force bilingual enrollment over parental objection, and the refusal must be documented while mandated ENL services continue. The 'cannot opt out' option is the strongest distractor because Part 154 does require services, but it does not strip parental choice over the bilingual model. The Committee on Special Education has no jurisdiction over ENL or bilingual placement, which is governed by Part 154, not special-education law."
      }
    ]
  },
  "Literacy & Language Development for ELLs": {
    "icon": "📖",
    "concepts": [
      {
        "title": "BICS vs. CALP: Two Dimensions of English Proficiency",
        "body": "Jim Cummins distinguished Basic Interpersonal Communicative Skills (BICS) from Cognitive Academic Language Proficiency (CALP). BICS, the conversational fluency supported by contextual cues, gestures, and a shared physical setting, typically develops within 1 to 3 years of immersion. CALP, the decontextualized, discipline-specific academic language needed to read a textbook, write an argument, or analyze a primary source, takes roughly 5 to 7 years to approach native-peer norms. This gap is pedagogically critical: a student who chats fluently with classmates at lunch may still lack the academic vocabulary and discourse structures to succeed on a content-area assessment. New York ENL services target CALP development explicitly, and NYSED's five NYSESLAT performance levels (Entering, Emerging, Transitioning, Expanding, Commanding) track growth across both dimensions. EAS candidates must recognize that reclassifying or exiting an ELL on the basis of conversational fluency alone is inappropriate. Under Commissioner's Regulations Part 154, exit from ELL status is determined by the annual NYSESLAT, not by observed social fluency, because BICS does not signal the academic-language readiness a student needs to learn grade-level content in English."
      },
      {
        "title": "L1 Transfer: How First-Language Literacy Supports English Acquisition",
        "body": "Cummins' Linguistic Interdependence Hypothesis holds that conceptual knowledge and literacy strategies developed in a student's first language (L1) transfer to English once sufficient L2 input is available, the Common Underlying Proficiency model. A student who can infer meaning from context in Spanish, summarize a passage in Mandarin, or decode syllabically in Arabic brings those metalinguistic tools to English reading. Cognate recognition (e.g., Spanish comunicacion and English communication) is a high-yield transfer strategy for Romance-language speakers. Teachers support positive transfer by activating prior L1 knowledge before reading, using bilingual glossaries, and allowing students to draft or brainstorm in L1 before composing in English. Interference, or negative transfer, arises when L1 structures differ markedly from English, for example subject-object-verb word order, the absence of definite articles, or a different phonemic inventory that yields predictable pronunciation and spelling patterns. Instruction that names the contrast explicitly through contrastive analysis reduces interference more effectively than simply repeating correct English models, because it makes the cross-linguistic difference visible rather than leaving the student to infer it."
      },
      {
        "title": "ENL and Bilingual Program Models in New York",
        "body": "Part 154 of the Commissioner's Regulations requires services for every identified ELL and authorizes two program types: English as a New Language (ENL) and Bilingual Education. ENL is delivered through two modes, Stand-alone ENL (direct English-language development taught by a certified ENL teacher) and Integrated ENL (an ENL teacher and a content teacher co-teach so language and content develop together); ENL is mandatory and cannot be declined. Bilingual Education uses both the home language and English and comes in two state models: Transitional Bilingual Education, which moves students toward English over time, and Dual Language, which develops biliteracy in both languages and enrolls both ELLs and English-proficient peers. Home Language Arts is a component of bilingual programs, not a separate ENL service. The Units of Study table in Part 154 ties the required minutes of ENL or Bilingual instruction to a student's NYSESLAT level, so Entering and Emerging students receive the most instructional time. Parents must receive annual notification of their child's ELL identification and program options in a language they understand, and they may decline Bilingual Education, though not ENL."
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
        "body": "NYSED defines five NYSESLAT performance levels: Entering, Emerging, Transitioning, Expanding, and Commanding. Effective teachers differentiate literacy instruction across these levels rather than withholding academic content until full proficiency. At the Entering and Emerging levels, instruction emphasizes high-frequency vocabulary, heavy visual support, choral and partner reading, and tasks that lower output pressure while building receptive language. At the Transitioning and Expanding levels, scaffolds remain but grow more cognitively demanding: students produce extended written responses, take part in structured academic discussion, and read longer authentic texts with strategic support. At the Commanding level, students approach native-peer performance yet may still need help with low-frequency academic vocabulary and culturally unfamiliar topics. Across all levels, formative assessment drives differentiation; teachers use writing samples, reading records, and observational data to adjust scaffold intensity. Misjudging a student's level, for example treating an Expanding student as Entering, leads to under-challenging instruction that stalls growth, and persistently mismatching services to a student's NYSESLAT level is inconsistent with the Units of Study requirements of Part 154."
      }
    ],
    "practice": [
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 4th-grade ELL at the Transitioning level reads a science passage about the water cycle independently but scores low on the end-of-unit written assessment. The ENL teacher notes that the student converses fluently with peers. Which explanation best accounts for this pattern, and what should the teacher prioritize?",
        "a": [
          "The student likely has an unidentified learning disability and should be referred to the CSE for an evaluation under IDEA before any further language instruction is attempted.",
          "The student has strong BICS but underdeveloped CALP; instruction should target academic vocabulary and the written discourse structures of science.",
          "The student's first language is interfering with English decoding, so the student needs intensive Entering-level phonics intervention.",
          "The student's conversational fluency shows readiness to exit ENL services, so the written assessment result can be attributed to test anxiety."
        ],
        "c": 1,
        "r": "The gap between strong conversational fluency (BICS) and weak written academic performance is the defining BICS/CALP pattern (Cummins); the correct response targets CALP through academic vocabulary and disciplinary writing, the actual gap. Option A is the strongest distractor: a special-education referral for what is a normal second-language-acquisition pattern is a known over-identification error, and IDEA's own eligibility rules (34 CFR 300.306(b)) require a team to rule out that difficulties are primarily due to limited English proficiency before classifying a student. Exit from ENL is determined by the NYSESLAT, not by social fluency, so Option D is wrong as well."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A 7th-grade Spanish-speaking ELL at the Emerging level is beginning a unit on persuasive writing. The teacher wants to leverage positive L1 transfer. Which strategy is MOST directly aligned with the Linguistic Interdependence Hypothesis?",
        "a": [
          "Providing a Spanish-language mentor text for persuasive writing so the student can apply familiar genre knowledge while drafting in English.",
          "Asking the student to write the first draft entirely in English to maximize exposure to academic English structures.",
          "Assigning a simplified English text at the student's independent reading level to build fluency before introducing persuasion.",
          "Grouping the student exclusively with English-proficient peers to provide a rich English-language model during the writing process."
        ],
        "c": 0,
        "r": "Cummins' Interdependence Hypothesis holds that genre knowledge built in L1, here how a persuasive argument is structured, transfers to L2 when the concept is already established. A Spanish mentor text activates that existing schema and supports positive transfer. Option B is the strongest distractor but is incorrect: requiring English-only output at the Emerging level suppresses the L1 resource and raises cognitive load without providing the conceptual bridge the hypothesis describes. A simplified English text builds fluency but does not tap L1 genre knowledge, and an all-English peer group, while useful for input, is not what the hypothesis specifically predicts."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "A high school biology teacher co-teaches with an ENL teacher in an Integrated ENL setting. Before a complex reading on cellular respiration, the ENL teacher distributes a graphic organizer with labeled diagrams and sentence frames such as 'The process of ___ releases energy because ___.' A student at the Expanding level asks why they need the frames since they 'already know English.' What is the BEST rationale the ENL teacher could offer?",
        "a": [
          "The frames are required by the student's IEP and cannot be removed without a CSE meeting.",
          "The frames are a BICS support intended to help the student communicate socially with lab partners during the activity.",
          "The frames are provided equally to all students under UDL guidelines and are not specifically an ELL support.",
          "The frames reduce the load of Tier 3 vocabulary so the student can focus on constructing disciplinary arguments, which is the academic-language goal at the Expanding level."
        ],
        "c": 3,
        "r": "At the Expanding level, students can produce extended language but still need support managing heavy Tier 3 vocabulary while simultaneously constructing disciplinary reasoning, exactly what sentence frames facilitate at the CALP level. This is a SIOP-aligned language scaffold tied to the student's proficiency level. Option C is the strongest distractor because UDL does support universal access, but the rationale here should center on the specific CALP demand of the task rather than a universal-design framing that would obscure the targeted pedagogical reasoning. Option A is wrong because nothing indicates this ELL has an IEP, and Option B miscategorizes an academic-language scaffold as social BICS support."
      },
      {
        "s": "C2",
        "d": "Literacy & Language Development for ELLs",
        "q": "An Entering-level ELL in a 3rd-grade class arrives mid-year speaking Haitian Creole. The classroom teacher asks the ENL specialist which immediate literacy practice is MOST appropriate given the student's proficiency level and the goal of building content-area literacy at the same time.",
        "a": [
          "Administer the 3rd-grade ELA benchmark assessment immediately to establish a baseline before providing any scaffolds.",
          "Place the student in a separate pull-out room for all literacy instruction until conversational English is established, typically 1 to 3 years.",
          "Use visual supports, bilingual glossaries, and realia tied to current content units so the student can access meaning while developing English vocabulary.",
          "Provide only oral instruction for the first semester because written English tasks are inappropriate until the student reaches the Emerging level."
        ],
        "c": 2,
        "r": "At the Entering level, visual supports, realia, and bilingual glossaries are the highest-leverage tools: they reduce the language barrier to content access without withholding grade-level curriculum, consistent with the meaningful-access requirements that govern ELL programs (Title VI and the EEOA, as applied in Lau v. Nichols and Castaneda v. Pickard). Option B is the strongest distractor but is wrong: blanket pull-out segregation delays content learning, risks placing the student in a dead-end track that civil-rights law disfavors, and misapplies the BICS timeline, since conversational-English development does not require isolation from grade-level content. Withholding all written tasks (Option D) and front-loading a benchmark test with no scaffolds (Option A) are likewise inappropriate at the Entering level."
      }
    ]
  },
  "ELL Assessment, Program Models & Collaboration": {
    "icon": "🌐",
    "concepts": [
      {
        "title": "NYS Proficiency Levels: WIDA Standards vs. NYSESLAT Levels",
        "body": "New York adopted the WIDA English Language Development Standards to guide ELL instruction, but the levels NY actually reports for identification and exit are its own five-level scale: Entering, Emerging, Transitioning, Expanding, and Commanding. Do not confuse this with WIDA's six instructional levels (Entering, Emerging, Developing, Expanding, Bridging, Reaching). Students are identified at enrollment by the NYSITELL (NYS Identification Test for English Language Learners) and reassessed each spring by the NYSESLAT, which measures listening, speaking, reading, and writing. An ELL exits services only by scoring Commanding on the NYSESLAT, not on a teacher's judgment. Teachers must distinguish BICS (Basic Interpersonal Communication Skills), which emerge in roughly one to two years and support social conversation, from CALP (Cognitive Academic Language Proficiency), which takes five to seven years and underlies academic work (Cummins). Treating conversational fluency as full academic proficiency causes premature exit or under-scaffolded instruction. Identification, annual proficiency assessment, and progress reporting are required under Title III of ESSA."
      },
      {
        "title": "ENL Program Models: Integrated and Stand-Alone",
        "body": "Under NYS Commissioner's Regulations Part 154, English as a New Language (ENL) is delivered through two complementary settings, not a simple either/or by level. In Integrated ENL (co-teaching), a certified ENL teacher and a content-area teacher share a general-education classroom and are jointly responsible for both grade-level content and language development. In Stand-Alone ENL, students receive English language development in a separate setting taught by a certified ENL teacher. The Part 154 Units of Study tables require a baseline of Integrated ENL for every ELL at all proficiency levels, with additional Stand-Alone units layered on for students at the lower levels (Entering, Emerging, Transitioning); required minutes decrease as proficiency rises. A Stand-Alone-only program may also be provided to ELLs not enrolled in a bilingual program. Integrated is therefore the universal baseline that preserves access to grade-level content, while Stand-Alone provides the intensive support lower-level students also need. Both settings must be taught by a certified ENL teacher, never a paraprofessional, and placement is individualized using NYSESLAT data."
      },
      {
        "title": "Bilingual Program Models: Transitional and Dual Language",
        "body": "NYS recognizes two bilingual models under Commissioner's Regulations Part 154. Transitional Bilingual Education (TBE) uses the student's home language as a temporary bridge to English; instruction begins largely in the home language and shifts toward English over time, with home-language support phased out as English develops. Because the home language is used instrumentally rather than maintained, TBE is described as a subtractive model. Dual Language (also called Two-Way Bilingual) develops bilingualism, biliteracy, and cross-cultural competence for both ELLs and English-proficient peers; instruction is delivered in two languages on a sustained ratio (commonly 50/50 or 90/10) across subjects and grades, making it an additive model in which both languages are valued. Research on well-implemented Dual Language programs shows ELLs reaching English academic outcomes equal to or above English-only peers by the upper elementary grades. When advising families, teachers should accurately describe each model's goals and timeline and explain that families may decline bilingual instruction under Part 154 while still receiving required ENL services in either setting."
      },
      {
        "title": "Evaluating, Selecting, and Adjusting Materials and Assessments",
        "body": "Selecting materials for ELLs means weighing linguistic demand alongside content rigor. Examine texts for sentence complexity, vocabulary load, syntactic structures, and cultural assumptions that create barriers unrelated to content knowledge. Graphic organizers, visuals, bilingual glossaries, home-language anchor texts, and multimedia are evidence-based scaffolds that lower language load while preserving cognitive demand. Assessment selection must separate two constructs: content knowledge versus English proficiency. Using assessments normed on English-proficient students without supports can systematically underestimate an ELL's content knowledge, an inequitable practice. NYSED permits ELL testing accommodations on content-area tests such as extended time, bilingual dictionaries and glossaries, a separate location, and oral translation of directions (these do not apply to the NYSESLAT or to the ELA exam's reading passages). Consistent with UDL, assessments should offer multiple means of action and expression so ELLs can demonstrate learning through varied modalities, and formative tools such as oral responses, observational checklists, and portfolios should be adjusted to capture progress. When adjusting tasks, scaffold up by adding support rather than simplifying down, preserving access to grade-level standards and avoiding a watered-down curriculum that widens opportunity gaps."
      },
      {
        "title": "Collaborating with ENL and Bilingual Educators",
        "body": "Collaboration between general-education teachers and ENL or bilingual educators is a pedagogical and regulatory expectation, not optional enrichment. In Integrated ENL co-teaching under Part 154, both teachers share planning, instruction, and assessment. In Stand-Alone contexts, collaboration means co-planning units so ENL instruction aligns with content objectives, sharing language-development data, and coordinating scaffolds. General-education teachers should share upcoming topics, key vocabulary, and text selections in advance so language objectives can be embedded. Best practice includes co-constructing language objectives alongside content objectives using language functions (define, compare, argue), analyzing NYSESLAT and classroom data together, and jointly communicating with families. Disagreements about a student's readiness to exit services are resolved by the objective Part 154 criterion (scoring Commanding on the NYSESLAT), which collaboration informs but cannot override. General-education teachers should not refer an ELL for special-education evaluation based solely on language-related academic struggles before adequate language support has been provided and progress monitored; doing so risks misidentification and conflicts with IDEA's nondiscriminatory evaluation requirements (34 CFR 300.304), which bar attributing difficulty to limited English proficiency itself."
      },
      {
        "title": "Collaborating with Families of ELLs",
        "body": "Under Title III of ESSA and NYS regulations, districts must notify families of a student's ELL identification, program placement, and annual proficiency results in a language the family can understand; this is a federal mandate, not a courtesy. Families have the legal right to decline bilingual instruction (while still receiving required ENL services) and must be told of this right in accessible language. Genuine family collaboration goes beyond translating documents to building partnerships that treat families' cultural and linguistic backgrounds as assets. Teachers should use trained, qualified interpreters for conferences rather than asking students to interpret, which is inappropriate and ethically problematic. Asset-based engagement includes community liaisons, multilingual communication, and inviting families' knowledge of their children's prior schooling and home literacy. FERPA (20 U.S.C. 1232g) protects all student education records, including NYSESLAT scores and ENL placement decisions, from disclosure to unauthorized parties. When families appear disengaged, teachers should examine structural barriers such as meeting times, transportation, childcare, and fear of immigration consequences rather than assuming a lack of interest in education."
      }
    ],
    "practice": [
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 4th-grade teacher has a student from the Dominican Republic who arrived in the U.S. two years ago and scored at the Transitioning level on the most recent NYSESLAT. The student converses fluently with classmates and participates actively in discussions but consistently struggles with written science reports and math word problems. The teacher concludes the student no longer has a language barrier and refers her to the CSE for a possible learning disability evaluation. Which statement best describes the teacher's reasoning?",
        "a": [
          "The teacher is correct; after two years a student should be fully proficient, so academic struggles must indicate a disability.",
          "The teacher should redesignate the student as English proficient before making any CSE referral.",
          "The teacher is confusing BICS with CALP; conversational fluency does not indicate academic language proficiency, and the referral is premature without adequate language support.",
          "The student's Transitioning level automatically qualifies her for special education services under IDEA."
        ],
        "c": 2,
        "r": "A student who appears conversationally fluent but struggles with academic tasks is showing the classic BICS/CALP gap (Cummins): BICS emerge in about one to two years while CALP takes five to seven, so the teacher is misreading social fluency as full academic language proficiency. Before any IDEA referral, the student must receive adequate, appropriate language support with progress monitored; referring solely on academic struggles risks misidentification and conflicts with IDEA's nondiscriminatory evaluation requirements (34 CFR 300.304), which prohibit attributing difficulty to limited English proficiency. The 'two years means fully proficient' option contradicts CALP research; redesignation is governed by a Commanding NYSESLAT score, not a teacher's say-so; and a proficiency level never auto-qualifies a student for special education."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 2nd-grade ENL teacher in an Integrated ENL (co-teaching) classroom is planning a science unit on animal adaptations with the general-education teacher and wants to write formal lesson objectives. Which pair of objectives best reflects best practice for Integrated ENL co-teaching?",
        "a": [
          "Content: Students will identify and compare three animal adaptations. Language: Students will use compare/contrast sentence frames (e.g., 'Unlike ___, ___ has ___ in order to ___') in written and oral responses.",
          "Content: Students will identify three animal adaptations. Language: Students will improve their reading skills.",
          "Content: Students will complete a worksheet on animal adaptations. Language: Students will copy vocabulary words from the board three times each.",
          "Content: Students will listen to the teacher read about adaptations. Language: Students will answer yes/no questions about the text."
        ],
        "c": 0,
        "r": "Effective co-teaching for ELLs requires distinct, measurable content AND language objectives that are explicitly connected. The correct option specifies both the content skill (identify and compare adaptations) and a language function (compare/contrast) paired with a concrete linguistic scaffold (sentence frames), consistent with a language-function approach and Part 154 co-teaching expectations. An objective such as 'improve reading skills' is unmeasurable and not tied to the content task; copying words and answering yes/no questions are low-demand activities, not language-development objectives, and do not support intentional academic language growth during content instruction."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "The parents of a Mandarin-speaking 1st-grader have received a district notice explaining that their child has been identified as an ELL and that a Transitional Bilingual Education (TBE) seat is available. The family asks the child's teacher to explain how TBE differs from the Dual Language program also offered at the school so they can decide which to choose. Which explanation is most accurate?",
        "a": [
          "TBE is required by law, and families cannot choose Dual Language unless the district recommends it.",
          "TBE and Dual Language are essentially identical; the only real difference is class size.",
          "Dual Language is only for students who already speak English fluently, while TBE serves students who speak no English at all.",
          "TBE uses Mandarin as a temporary bridge to support English acquisition with a planned shift toward English-only instruction over time, while Dual Language aims to develop full bilingualism and biliteracy in both Mandarin and English for all enrolled students."
        ],
        "c": 3,
        "r": "The key distinction is program goal and language trajectory. TBE is a subtractive model: the home language is used instrumentally to accelerate English acquisition and is then phased out. Dual Language is an additive model targeting bilingualism and biliteracy for both ELLs and English-proficient students, with a sustained commitment to both languages. Families must be accurately informed of these differences to exercise their right under Part 154 to choose or decline a program. TBE is not legally mandated over Dual Language, the two models are not interchangeable, and Dual Language is specifically designed to serve mixed ELL and English-proficient groups together rather than English-fluent students only."
      },
      {
        "s": "C2",
        "d": "ELL Assessment, Program Models & Collaboration",
        "q": "A 6th-grade science teacher is preparing for parent-teacher conferences. Several families of ELL students speak little to no English. To communicate effectively and comply with legal requirements, the teacher should:",
        "a": [
          "Ask the students to interpret for their parents during the conference to save district resources.",
          "Send home a note in English about the conference outcomes and trust that families will find someone to translate it.",
          "Arrange for a qualified, trained interpreter and prepare translated summary notes in the families' home languages, ensuring families receive information about their children's progress and any ELL program decisions in a language they understand.",
          "Conduct the conference in English using gestures and visuals, because FERPA prohibits sharing records through a third-party interpreter."
        ],
        "c": 2,
        "r": "Title III of ESSA and NYS regulations require parents of ELLs to receive meaningful communication in a language they can understand, including program placement and student progress. Using a qualified interpreter, not the student, is the legally and ethically correct approach; having a student interpret creates confidentiality concerns, role reversal, and risk of inaccurate communication. FERPA does not bar a trained interpreter, so the gestures-only option misapplies it. Sending an English-only note does not meet the meaningful-communication standard, and relying on the student to interpret is specifically discouraged by professional and legal guidance because it compromises the accuracy and completeness of sensitive information."
      }
    ]
  },
  "Disability Characteristics & Individualized Instruction": {
    "icon": "♿",
    "concepts": [
      {
        "title": "IDEA Disability Categories & Teaching Implications",
        "body": "IDEA (2004) defines 13 disability categories, each carrying distinct instructional implications. Specific Learning Disability (SLD), the most prevalent, often involves deficits in phonological processing or working memory, calling for structured literacy and chunked multi-step directions. Autism Spectrum Disorder may call for visual schedules, predictable routines, and social-narrative supports. Emotional Disturbance calls for embedded PBIS-aligned behavioral supports and consistent, predictable environments. Intellectual Disability calls for concrete, functional-context tasks with systematic instruction and distributed practice. Other Health Impairment, which includes ADHD, frequently calls for preferential seating, movement breaks, and extended time. Teachers must distinguish the category's typical learning profile from the individual student's profile documented in the IEP: the IEP, not the label, drives daily instructional decisions. Section 504 of the Rehabilitation Act covers students whose disabilities substantially limit a major life activity but who do not require special education, providing accommodations (generally not modifications) through a 504 plan. Because 504 falls outside IDEA, it is managed by the school's 504 team rather than the Committee on Special Education, so it does not require a CSE meeting."
      },
      {
        "title": "Individualized Education Program (IEP): Structure & Instructional Integration",
        "body": "Under IDEA, the Committee on Special Education (CSE) in New York develops the IEP for eligible students. The document must include present levels of academic achievement and functional performance (PLAAFP), annual measurable goals, special education services and supports, the extent of participation in general education, testing accommodations, and, in New York, transition planning beginning with the IEP in effect when the student turns 15. At least one general education teacher of the student is a required CSE member when the student is, or may be, in general education. Daily integration means embedding IEP goals into core instruction: a student whose IEP goal targets reading fluency practices timed oral reading during the regular ELA block, not only in pullout. Related-service recommendations (speech-language, OT, counseling) should coordinate with classroom routines, so an SLP's articulation targets can be reinforced during morning meeting. Progress toward annual goals must be reported to families at least as often as report cards are issued for general education students. Failing to implement an IEP's services or accommodations is a procedural violation of IDEA and may trigger a due-process complaint."
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
        "body": "New York uses RtI within a Multi-Tiered System of Supports (MTSS) as both a prevention framework and, in New York, the required process for identifying SLD in the area of reading (K-4). Tier 1 is high-quality, evidence-based core instruction for all students. Tier 2 adds targeted, small-group supplemental intervention for the roughly 15% of students showing insufficient Tier 1 response. Tier 3 provides intensive, individualized intervention for the approximately 5% who need it most, and data at this tier can inform a referral to the CSE. A student may not be found eligible for special education if the determinant factor is lack of appropriate instruction in reading or math or limited English proficiency, so RtI data must document that quality instruction was delivered before concluding SLD. Progress monitoring with curriculum-based measures drives decisions about movement between tiers. Importantly, RtI is not a waiting game: a referral for evaluation may be made at any time, and unnecessarily delaying an evaluation to run more tiers can violate IDEA's child-find obligation."
      },
      {
        "title": "Least Restrictive Environment (LRE) & Continuum of Services",
        "body": "IDEA's LRE mandate requires that students with disabilities be educated with nondisabled peers to the maximum extent appropriate. New York's continuum of services, ordered from least to most restrictive, includes: general education with related services and supplementary aids; consultant teacher services (direct and/or indirect support in the general education class); resource room (supplemental small-group instruction for part of the day); integrated co-teaching (ICT, a general education class co-taught by a general and special education teacher); special class (a self-contained setting such as 12:1:1 or 15:1); separate (specialized) school; and home or hospital instruction. The CSE team, not an individual teacher, determines placement, which must be the least restrictive setting where the student's goals can be met with appropriate supports. Removal from general education must be justified in the IEP by documenting why supplementary aids and services are not adequate there. Placement is reviewed at least annually and is distinct from the eligibility determination. New York's Dignity for All Students Act (DASA) adds an obligation to maintain an environment free from harassment and discrimination. LRE applies across academic, nonacademic, and extracurricular activities."
      }
    ],
    "practice": [
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A fifth-grade student with an IEP goal targeting reading fluency receives resource room support for 45 minutes per day. The general education teacher notices the student struggles with oral reading during whole-class lessons but has not implemented any IEP-related strategies in the classroom. Which action most directly fulfills the general education teacher's IDEA obligations?",
        "a": [
          "Wait for the resource room teacher to address all fluency needs, since that teacher holds primary responsibility for IEP goals.",
          "Embed the student's IEP fluency goal into whole-class ELA activities by providing timed oral reading practice with the specified scaffolds.",
          "Refer the student back to the CSE for a more restrictive placement because the current services are insufficient.",
          "Contact the student's parents to request that they hire a private reading tutor to supplement school services."
        ],
        "c": 1,
        "r": "IDEA requires general education teachers who serve students with IEPs to implement the IEP's services, accommodations, and supports within their classroom; IEP goals must be reinforced across daily routines, not siloed in pullout. Option A is the strongest distractor because it reflects a common misconception that IEP responsibility belongs exclusively to special educators; in fact, the general education setting is a primary implementation site, especially for LRE-consistent placements. A more restrictive placement (C) is not warranted when in-class supports have not yet been tried, and shifting responsibility to a private tutor (D) does not satisfy the district's obligation."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A seventh-grade student with ADHD (Other Health Impairment) has a 504 plan that includes extended time on tests and preferential seating. The student's social studies teacher reduces the number of essay questions on the unit exam from four to two, arguing this will help the student manage time. Which statement best describes the teacher's action?",
        "a": [
          "The teacher correctly implemented a 504 plan accommodation by reducing the task demand.",
          "The teacher provided an appropriate IEP modification that aligns with the student's disability category.",
          "The teacher applied a modification that changes what is assessed, which is not authorized by the student's 504 plan.",
          "The teacher used a UDL strategy that benefits all students and therefore requires no plan authorization."
        ],
        "c": 2,
        "r": "Cutting the number of essay questions omits learning objectives and changes what the student is accountable for, which is a modification, not an accommodation. A 504 plan authorizes accommodations (changes in how a student accesses or demonstrates learning), not modifications to content or standards. Option A is the strongest distractor because extended time is a legitimate 504 accommodation, making it tempting to assume the teacher acted within plan boundaries; the error is conflating a reduction in task demand (modification) with a change in conditions (accommodation). Option B is wrong because the student has a 504 plan, not an IEP, and modifications are tied to IEPs."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A third-grade teacher is designing a science lesson on ecosystems for a class that includes a student with Autism Spectrum Disorder who uses an AAC device. The student's IEP specifies that the AAC device must be available during all instructional activities. Which instructional approach best reflects both IDEA's AT obligation and UDL principles?",
        "a": [
          "Allow the student to use the AAC device only during small-group work to minimize disruption during whole-class lessons.",
          "Assign a paraprofessional to operate the AAC device on the student's behalf during whole-class instruction to maintain lesson pacing.",
          "Delay AAC use until the student demonstrates readiness through traditional verbal responses.",
          "Incorporate the AAC device into whole-class participation routines, such as using it to answer questions during teacher-facilitated discussion, while providing visual supports and graphic organizers for all students."
        ],
        "c": 3,
        "r": "IDEA requires that an AT device specified in the IEP be available across instructional settings, not restricted to small-group contexts, so the device must be available and actively used during whole-class instruction. Pairing this with visual supports and graphic organizers for all students applies UDL's principle of multiple means of action and expression and benefits the whole class. Option B is the strongest distractor because paraprofessional support is a legitimate IEP service; however, having the paraprofessional operate the device instead of the student undermines the student's communicative independence, which is the functional purpose of the AT. Restricting (A) or delaying (C) the device violates the IEP and confuses AAC with a reward for verbal output."
      },
      {
        "s": "C3",
        "d": "Disability Characteristics & Individualized Instruction",
        "q": "A school-based team has provided Tier 2 RtI reading intervention to a second-grade student for 14 weeks. Progress-monitoring data show minimal growth despite consistent implementation of the evidence-based intervention. The classroom teacher argues the team should continue Tier 2 for another semester before referring to the CSE to allow more time for growth. Which response best reflects IDEA's child-find requirements?",
        "a": [
          "A parent or any team member may request a CSE evaluation at any time; documented insufficient response to quality instruction is a sufficient basis, and unnecessarily delaying a referral may violate IDEA's child-find obligation.",
          "The teacher is correct: IDEA requires a minimum of one full school year of Tier 2 data before a CSE referral is permissible.",
          "The team should move the student to Tier 3 and collect another full cycle of data before any CSE referral is considered.",
          "The team should consult the ENL coordinator first to rule out limited English proficiency before initiating any CSE referral."
        ],
        "c": 0,
        "r": "IDEA's child-find mandate requires that children suspected of having a disability be identified and evaluated without undue delay; any parent or school team member may initiate a referral, and 14 weeks of documented non-response to a quality Tier 2 intervention can constitute reasonable suspicion of a disability. Withholding a referral to accumulate more intervention cycles can itself be a procedural violation, so options B and C are wrong because IDEA sets no fixed minimum number of tiers or weeks before a referral may be made. Option D is the strongest distractor because IDEA does prohibit identifying a student as SLD when the determinant factor is limited English proficiency; however, there is no indication this student is an English language learner, so the ENL framing here functions to manufacture further delay rather than as a genuine diagnostic step."
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
        "body": "Section 504 is a civil rights statute prohibiting disability discrimination in programs receiving federal funds, including all public schools. Unlike IDEA, it uses a broad functional definition of disability: any physical or mental impairment that substantially limits one or more major life activities (e.g., learning, reading, concentrating, walking, or major bodily functions). Students who do not qualify under IDEA's 13 classifications, or who do not need specially designed instruction, may still qualify for a 504 Plan. A 504 Plan provides accommodations (e.g., extended time, preferential seating, read-aloud) but does not, by itself, provide specially designed instruction or IDEA's related services. Section 504 is unfunded by the federal government, but it does carry its own procedural protections: evaluation before placement, notice to parents, periodic reevaluation, an impartial due process hearing, and grievance procedures, distinct from IDEA's. General education teachers are typically the primary implementers of 504 Plans and carry a legal obligation to deliver documented accommodations. Key EAS distinction: 504 secures equal access and accommodations; IDEA adds specially designed instruction and related services for students who need them."
      },
      {
        "title": "Confidentiality: FERPA and IDEA",
        "body": "The Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records in schools receiving federal funds. Parents, and students once they turn 18 or enroll in a postsecondary institution (eligible students), may inspect and review records, request amendments, and generally must consent before personally identifiable information is disclosed to outside parties. Under IDEA, parallel confidentiality provisions specifically protect evaluation data, IEPs, and placement records. School staff may access disability information only when they have a legitimate educational interest, that is, when they are responsible for the student's education or provide services. Disclosing a student's IEP or disability classification at a faculty meeting to colleagues who do not serve the student, even with good intentions, lacks a legitimate educational interest and violates FERPA. IDEA also requires districts to inform parents when personally identifiable information is no longer needed so it can be destroyed. New York's Dignity for All Students Act (DASA) intersects by prohibiting harassment based on disability, but DASA does not loosen FERPA's disclosure limits. On the EAS, expect scenarios testing whether a disclosure to an uninvolved colleague or community member is permissible; it is not."
      },
      {
        "title": "Response to Intervention (RtI) and PBIS",
        "body": "Response to Intervention (RtI) is a multi-tiered framework, situated within Multi-Tiered Systems of Support (MTSS), that delivers high-quality, evidence-based instruction matched to need with frequent progress monitoring. Tiers move from universal core instruction (Tier 1) to targeted small-group intervention (Tier 2) to intensive individualized intervention (Tier 3). IDEA 2004 permits districts to use RtI data instead of an IQ-achievement discrepancy when identifying a specific learning disability (SLD); in New York, districts are prohibited from using the severe-discrepancy model and must use an RtI process to identify an SLD in reading in grades K-4. Positive behavioral interventions and supports (PBIS) apply the same tiered logic to behavior: school-wide expectations at Tier 1, targeted group supports at Tier 2, and individualized function-based plans at Tier 3. IDEA requires that when a student's behavior impedes their learning or that of others, the IEP team consider the use of positive behavioral interventions and supports and other strategies to address it. Critically, an RtI process may not be used to delay or deny a special education evaluation; child find and a parent's right to request an evaluation operate independently of how many tiers have been tried."
      },
      {
        "title": "The CSE Process: Referral, Evaluation & IEP Development",
        "body": "Under New York's Education Law Article 89 and Part 200, the Committee on Special Education (CSE) is the multidisciplinary team that determines eligibility and develops the IEP. Required members include the parent(s); a general education teacher if the student is or may be in general education; a special education teacher or provider; a school psychologist; a district representative qualified to commit resources (the LEA representative); an individual who can interpret the evaluation results (a role another member may fill); and the student when appropriate. The process begins with a referral from a parent, teacher, or other professional. The district must obtain parental consent, complete the individual evaluation within 60 calendar days of consent, and then arrange for the recommended special education programs and services within 60 school days of receipt of consent. The IEP must include present levels of academic achievement and functional performance (PLAAFP), measurable annual goals, special education services, accommodations and modifications, participation in state assessments, and, beginning with the IEP in effect when the student turns 15, measurable postsecondary goals and transition services. The CSE reviews the IEP at least annually, reevaluates at least triennially, and provides parents a copy."
      },
      {
        "title": "Teacher Responsibilities in Implementation & Referral",
        "body": "General education teachers act at every stage of the special education process. Within RtI and PBIS, the classroom teacher delivers Tier 1 instruction with fidelity, collects and graphs progress-monitoring data, and collaborates on Tier 2 and Tier 3 supports. When a referral is made, the teacher contributes observational and academic-performance data to the evaluation. Once an IEP is in place, the teacher must be informed of, have access to, and implement the specific accommodations, modifications, and supports for which they are responsible, and they should know the student's annual goals. A material failure to implement the IEP, even unintentionally, can constitute a denial of FAPE; a minor, isolated deviation generally does not. Teachers must also honor confidentiality, sharing IEP or disability information only with staff who have a legitimate educational interest. Teachers participate in the annual review by reporting progress toward goals, and a parent's request for an evaluation must be honored regardless of how interventions are progressing. In New York, building-level support or pupil-personnel teams provide additional school-based problem-solving before and alongside the formal CSE process, but they do not replace a parent's right to request a CSE referral."
      }
    ],
    "practice": [
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A third-grade teacher notices a student struggling significantly with decoding and reading fluency. For the past month the teacher has provided only whole-class differentiated instruction, with no individualized data collected. The reading specialist suggests next steps. Which response reflects the most professionally and instructionally appropriate action by the teacher at this point?",
        "a": [
          "Request that the school psychologist immediately administer an IQ test to determine whether an IQ-achievement discrepancy exists.",
          "Begin a targeted, evidence-based Tier 2 reading intervention with systematic progress monitoring, while documenting the student's response and informing the family of their right to request an evaluation at any time.",
          "Notify the parents that the child will be placed on a 504 Plan for reading accommodations without conducting any further evaluation.",
          "Take no action for the remainder of the year, since lack of appropriate instruction must first be ruled out before anything else can occur."
        ],
        "c": 1,
        "r": "After only one month of whole-class differentiation with no individualized data, the sound next step is to implement a tiered, evidence-based intervention with progress monitoring so the teacher gathers data on the student's response; New York requires an RtI process for identifying a reading SLD in grades K-4. Crucially, RtI cannot be used to delay or deny an evaluation, so the teacher must also recognize the family's right to request a CSE referral at any time. An immediate IQ test is misguided because NY prohibits the severe-discrepancy model for K-4 reading SLD; a 504 Plan cannot be assigned without evaluation; and doing nothing all year improperly treats RtI as a barrier to, rather than a precursor of, identification."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "Ms. Torres teaches seventh grade. One of her students has an IEP that includes extended time on tests and preferential seating. During a department meeting, a colleague who does not teach or serve the student asks Ms. Torres about the student's disability so the colleague can 'understand the kid better.' Ms. Torres should:",
        "a": [
          "Share the student's IEP and disability classification, because colleagues have a general professional interest in student welfare.",
          "Direct the colleague to the student's cumulative record, which she believes is available to all certified staff in the building.",
          "Explain only that the student receives certain accommodations but decline to share the specific disability or IEP details, since this colleague does not have a legitimate educational interest in the student.",
          "Provide the full IEP to the colleague and ask the colleague to keep it confidential."
        ],
        "c": 2,
        "r": "FERPA and IDEA confidentiality provisions limit disclosure of disability and IEP information to staff with a legitimate educational interest, meaning those who are responsible for or provide services to the student. A colleague who does not serve the student has no need to know, so sharing the IEP or disability classification would violate federal confidentiality requirements. Asking the colleague to keep an improperly disclosed IEP confidential does not cure the violation, and pointing the colleague to records they may access for an unauthorized purpose is equally impermissible; the correct response shares only what is necessary (that accommodations exist) and withholds protected details."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "A high school student was recently diagnosed with Type 1 diabetes. The condition requires scheduled blood-sugar monitoring and occasional rest, but her academic performance is strong and she does not need specially designed instruction. The building team is determining the most appropriate support structure. Which option best reflects the legally correct approach?",
        "a": [
          "Take no formal action, because the student's grades are satisfactory and no federal law applies when academic performance is not affected.",
          "Refer the student to the CSE to develop an IEP, because diabetes is a recognized condition under IDEA's Other Health Impairment category.",
          "Place the student in a resource room for part of the day so special education staff can monitor her health needs.",
          "Develop a Section 504 Plan providing accommodations such as scheduled monitoring breaks and access to snacks, because her condition substantially limits a major life activity even though her grades are strong."
        ],
        "c": 3,
        "r": "Section 504 applies when a physical or mental impairment substantially limits a major life activity, including major bodily functions such as endocrine function, even when academic performance is intact. A 504 Plan providing monitoring breaks and snack access is the appropriate vehicle. An IEP is not warranted here because the student does not need specially designed instruction (diabetes could fall under IDEA's Other Health Impairment only if it adversely affected performance enough to require special education). Taking no action ignores the school's standing civil rights obligation under Section 504, and placing the student in a resource room is unnecessarily restrictive and unrelated to her instructional needs."
      },
      {
        "s": "C3",
        "d": "Disability Law, RtI/PBIS & the CSE Process",
        "q": "During an IEP meeting, the parents of a 10-year-old student with autism state that they disagree with the district's most recent psychological evaluation and want the district to fund an independent educational evaluation (IEE). Under IDEA, which statement most accurately describes the district's obligation?",
        "a": [
          "The district must either fund the IEE at public expense or, without unnecessary delay, file for a due process hearing to show its own evaluation was appropriate; it cannot simply refuse the request.",
          "The district must immediately fund the IEE without question, because parents have an unconditional right to one at public expense whenever they ask.",
          "The district may deny the request outright because the evaluation was conducted by a licensed school psychologist following IDEA procedures.",
          "The district should table the IEP meeting until the disagreement is resolved through informal mediation, which IDEA requires before any IEE request can be considered."
        ],
        "c": 0,
        "r": "When parents disagree with the district's evaluation and request an IEE at public expense, IDEA gives the district only two lawful options: fund the IEE, or file for a due process hearing, without unnecessary delay, to defend the appropriateness of its own evaluation. It may not simply deny the request. The right is not unconditional, because the district may contest it through due process rather than automatically paying; a qualified evaluator and proper procedures do not strip parents of this safeguard; and mediation, while available, is voluntary and is not a prerequisite to an IEE request."
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
        "body": "New York's Part 200 regulations (8 NYCRR 200.6) define a continuum of placements the CSE may recommend, ordered from least to most restrictive. Four core models recur on the EAS: (1) Consultant Teacher (200.6[d]): a special educator provides indirect services (advising the general educator) and/or direct services (working with identified students inside the general education class), for a minimum of two hours per week, with a caseload not exceeding 20 students. (2) Integrated Co-Teaching, or ICT (200.6[g]): a certified general educator and a certified special educator jointly plan and deliver instruction to a blended class of students with and without disabilities. (3) Resource Room (200.6[f]): supplementary specialized instruction in a small group (no more than five students per teacher) for a portion of the day; a student may spend no more than 50 percent of the school day there. (4) Special Class (200.6[h]): instruction primarily with other students with disabilities in a self-contained setting, recommended only when the LRE analysis supports it. Placement must be individualized, data-driven, and documented in the IEP, moving toward a more restrictive setting only as the student's needs require."
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
        "body": "The Committee on Special Education (CSE) evaluates students suspected of having a disability, determines eligibility under one of the disability classifications recognized in New York, and develops the Individualized Education Program (IEP). A general education teacher of the student is a required CSE member whenever the student is, or may be, participating in the general education environment. That teacher reports present levels of academic achievement and functional performance, implements IEP goals, accommodations, and modifications, and documents progress toward annual goals. FERPA protects the education records generated through the CSE process; teachers may share personally identifiable information only with school officials who have a legitimate educational interest. Section 504 of the Rehabilitation Act covers students whose disability substantially limits a major life activity but who do not qualify under IDEA; a Section 504 plan is developed by a building-level team, not the CSE, and is not subject to the full IDEA procedural safeguards. Teachers must know whether a student is served under an IEP (IDEA) or a 504 plan, because implementation responsibilities differ. Failing to implement an IEP as written is a denial of FAPE and a compliance violation."
      }
    ],
    "practice": [
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A fourth-grade student with a learning disability in written expression struggles to organize and produce written work in Ms. Rivera's general education class. The student's IEP includes a goal for written expression and states that the IEP team must consider assistive technology. Which next step is MOST consistent with IDEA requirements and best collaborative practice?",
        "a": [
          "Ms. Rivera requests a formal AT evaluation through the CSE, documenting the student's present levels and involving the special educator and an AT specialist.",
          "Ms. Rivera independently selects a text-to-speech app and begins using it with the student the following week.",
          "Ms. Rivera refers the student to the school counselor for support with frustration related to writing tasks.",
          "Ms. Rivera shortens the student's writing assignments so that assistive technology is no longer needed."
        ],
        "c": 0,
        "r": "IDEA requires the IEP team, not the classroom teacher alone, to consider and document AT needs; requesting a formal AT evaluation involving the special educator and an AT specialist satisfies that requirement and ensures the IEP reflects any devices or services to be provided. Unilateral selection by the general educator bypasses the team and risks an unevaluated, undocumented accommodation that may not match the student's documented need. Referring only to the counselor treats a symptom (frustration) rather than the documented written-expression need, and simply shortening assignments lowers expectations and sidesteps the AT consideration the IEP mandates."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "Mr. Chen is the general education teacher in an Integrated Co-Teaching (ICT) class. During whole-group instruction his co-teacher, a certified special educator, spends most of the period circulating and passing out materials rather than delivering instruction or working directly with students. Which statement BEST describes the problem with this arrangement?",
        "a": [
          "The arrangement is acceptable because the general educator is the lead teacher and the special educator's role is supplementary by definition.",
          "Under 8 NYCRR 200.6(g), both certified teachers in an ICT class are expected to share instructional responsibilities; using the special educator primarily as an aide misrepresents the model and undermines the placement.",
          "ICT regulations require the special educator to lead whole-group instruction at least 50 percent of the time, so the arrangement is noncompliant on that basis.",
          "The special educator should work only with students who have IEPs, so circulating is appropriate as long as those students receive support."
        ],
        "c": 1,
        "r": "NYS ICT regulations (8 NYCRR 200.6[g]) require an ICT class to include both a certified general and a certified special education teacher who share planning, delivery, and assessment; reducing the special educator to materials distribution turns a co-instructor into an aide and shortchanges the collaborative model. There is no rule requiring the special educator to lead whole-group instruction 50 percent of the time, so that distractor invents a false threshold. ICT is designed to serve the whole blended class through joint instruction, not to assign the special educator exclusively to students with IEPs, and the model does not make the special educator's role merely supplementary."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "A high school student with an emotional disability receives resource room services under her IEP. Her resource room teacher tells the general education social studies teacher that, because progress-monitoring data show significant gains, the student will transition to a consultant teacher model. The social studies teacher is unsure what to expect. Which description BEST explains the consultant teacher model?",
        "a": [
          "The student will move to a self-contained special class for social studies in place of the general education class.",
          "The student will no longer receive any special education services because she has met her IEP goals.",
          "The special educator will provide indirect support to the general education teacher (advising on strategies and accommodations) and/or direct in-class support to the student, without changing the general education class structure.",
          "The special educator will co-teach every social studies lesson alongside the general education teacher for the rest of the year."
        ],
        "c": 2,
        "r": "Under 8 NYCRR 200.6(d), consultant teacher services consist of indirect services (consultative support to the general educator) and/or direct services to the student within the general education setting, for a minimum of two hours per week, preserving the least restrictive environment. The option describing co-teaching every lesson is ICT (200.6[g]), a separate, more intensive model with joint instruction and a 12-student cap on students with disabilities, not consultant teacher services. A self-contained special class is a more restrictive placement, and a transition driven by progress does not mean services end, since the student remains IDEA-eligible with a continuing IEP."
      },
      {
        "s": "C3",
        "d": "Collaboration, Assistive Technology & Service Delivery",
        "q": "During a CSE meeting for a second-grade student with autism, the team discusses placement. The student currently receives instruction in a special class for most of the day. New data show she communicates reliably with an AAC device and has met several social and academic goals. A parent advocate argues that the LRE analysis requires the team to consider a less restrictive setting. Which response from the committee chair is MOST legally appropriate under IDEA?",
        "a": [
          "The special class is appropriate because students with autism typically require intensive support regardless of the data.",
          "Because the student has not met every IEP goal, the team may not change the placement until the annual review.",
          "The advocate's request can be noted, but placement decisions are made solely by the district and the CSE chair.",
          "The team must review current data, consider whether supplementary aids and services could support the student in a less restrictive setting, and document the rationale for any placement decision in the IEP."
        ],
        "c": 3,
        "r": "IDEA's LRE mandate requires the CSE to educate students with disabilities with nondisabled peers to the maximum extent appropriate and to consider supplementary aids and services before a more restrictive placement; the team must weigh current data and document its reasoning. Disability category alone cannot justify placement, so the autism presumption violates the individualization requirement. There is no rule barring a placement change until all goals are met or until the annual review, and parents are required members of the CSE, so placement is a team decision, not a district-and-chair-only decision."
      }
    ]
  },
  "Teacher Responsibilities: Legal & Ethical Judgment": {
    "icon": "🏛️",
    "concepts": [
      {
        "title": "Students' Rights: Accommodations, Due Process, and Discipline",
        "body": "Federal law guarantees students procedural safeguards that teachers must uphold daily. IDEA (2004) mandates that students with disabilities receive a free appropriate public education (FAPE) in the least restrictive environment (LRE) and that parents receive prior written notice before any proposed change in identification, evaluation, placement, or services. Section 504 of the Rehabilitation Act prohibits disability-based discrimination and requires reasonable accommodations, including testing accommodations such as extended time, separate setting, or read-aloud, documented in a 504 Plan. Disciplinary removals that exceed 10 consecutive school days (or that form a pattern of removals constituting a change in placement) trigger a manifestation determination review (MDR) for a student with a disability. Title IX (Education Amendments of 1972) prohibits sex-based discrimination in any federally funded education program, covering sexual harassment, athletic equity, and related retaliation. A teacher must never independently deny an accommodation documented in an IEP or 504 Plan; doing so violates federal law regardless of the teacher's instructional rationale. When uncertain about a student's rights, the appropriate first step is consulting the CSE chairperson or building administrator, not unilaterally deciding."
      },
      {
        "title": "FERPA: Confidentiality and Student Records",
        "body": "The Family Educational Rights and Privacy Act (FERPA, 1974) governs access to and disclosure of student education records in schools receiving federal funds. Parents/guardians of students under 18, and eligible students 18 or older, have the right to inspect records, to request amendment of records they believe are inaccurate or misleading (with a hearing if the request is denied), and to consent before disclosure to third parties. Teachers may not share a student's grades, IEP status, disciplinary history, or other education records with unauthorized individuals, including other parents, non-custodial parties without legal standing, or community members. Key FERPA exceptions permit disclosure without consent to school officials with a legitimate educational interest, to comply with a lawful subpoena or judicial order, and in a health or safety emergency. Directory information (for example, name, grade level, enrollment status) may be released unless a parent opts out. In a classroom context, posting grades in ways that identify individual students, or discussing one student's performance in front of another parent, violates FERPA. Teachers should treat all student records, whether paper, electronic, or verbal, as confidential and discuss them only in appropriate professional contexts."
      },
      {
        "title": "NY DASA: Anti-Bullying, Harassment, and Discrimination",
        "body": "New York's Dignity for All Students Act (DASA, effective July 1, 2012) requires public schools to provide a safe, supportive learning environment free from harassment, bullying, and discrimination based on actual or perceived characteristics including race, color, weight, national origin, ethnic group, religion, religious practice, disability, sexual orientation, gender identity or expression, and sex. Every school must designate at least one Dignity Act Coordinator. Anyone seeking a New York teaching certificate after December 31, 2013 must complete six clock hours of approved DASA training in harassment, bullying, and discrimination prevention as a condition of certification; this is a one-time certification requirement, not an ongoing obligation imposed on every employee. When a teacher witnesses or receives a report of harassment or bullying, the teacher must promptly report it (orally to the principal, superintendent, or DASA Coordinator no later than one school day, then in writing within two school days); teachers may not resolve these situations informally in lieu of reporting. Failure to act, or retaliating against a student who reports, exposes the teacher and district to liability. DASA also covers cyberbullying. Its protections are additive to, not a replacement for, Title IX obligations when conduct is sex-based."
      },
      {
        "title": "Mandated Reporting of Suspected Child Abuse and Maltreatment",
        "body": "In New York, teachers are mandated reporters under Social Services Law Section 413, required by law to report reasonable cause to suspect child abuse or maltreatment to the NYS Statewide Central Register (SCR) at 1-800-635-1522 (the dedicated mandated-reporter line). The legal threshold is reasonable suspicion, not certainty, meaning a teacher must report upon observing physical indicators (unexplained bruises, burns, or injuries), behavioral signs (sudden withdrawal, fear responses, age-inappropriate sexual behavior), or a child's direct disclosure. The oral report must be made immediately by phone and is followed by a written report (form LDSS-2221A) to the local child protective services within 48 hours. Mandated reporters who report in good faith have immunity from civil and criminal liability, while a knowing failure to report is a Class A misdemeanor and can create civil liability. Teachers must not investigate or confront the suspected abuser, and must not delay a report to obtain administrative approval; the law places the duty on the individual who has the suspicion. Confidentiality still applies: the reporter should not discuss the report with anyone not legally involved. This duty supersedes any school policy that routes all communication through the principal first."
      },
      {
        "title": "Advocating for Students and Analyzing Professional Conduct",
        "body": "The EAS framework expects teachers to act as professional advocates serving the best educational and developmental interests of their students. Advocacy includes identifying unmet needs and bringing them to appropriate personnel (for example, referring a student to the Committee on Special Education for evaluation under IDEA's Child Find obligation when a disability is suspected), communicating student progress accurately to families, and challenging policies or practices, through appropriate channels, that impede student access or equity. Ethical judgment also requires recognizing when a colleague's conduct may harm a student. If a teacher observes another staff member violating a student's rights (for example, denying a legally required accommodation, using demeaning language, or imposing discriminatory discipline), the professional response is to report the concern to an administrator, not to ignore it or handle it informally. The EAS distinguishes appropriate advocacy (using due process, documentation, and the chain of command) from inappropriate action (unilateral defiance of policy, public disclosure of confidential information, or confrontation without administrative support). Teachers balance collegial loyalty against their primary obligation to student welfare and legal compliance."
      },
      {
        "title": "Parents/Guardians: Rights, Responsibilities, and School-Home Communication",
        "body": "Federal and state law grant parents/guardians significant rights in their children's education. Under IDEA, parents are members of the IEP team (the CSE in New York), must give informed consent before an initial evaluation and before initial placement, and retain the right to request meetings, an independent educational evaluation (IEE), mediation, and an impartial due process hearing when disputes arise. Under Section 504, parents have the right to notice of any action affecting identification, evaluation, or placement, and to an impartial hearing. FERPA grants parents access to, and amendment rights over, education records. Teachers must communicate with parents in a language they can understand, an obligation reinforced by Title VI of the Civil Rights Act for families with limited English proficiency, which may require qualified interpreter or translation services. Parents also carry responsibilities: they are expected to participate in IEP and 504 meetings when notified, to share relevant health and developmental history, and to reinforce school supports at home. Teachers should document parent contacts (date, format, content, outcome) to maintain a record of good-faith communication. Reaching out proactively, before problems escalate, is both a legal best practice and a professional obligation."
      }
    ],
    "practice": [
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A 10th-grade student with a learning disability has an IEP specifying extended time (time and a half) on all tests. During a state practice exam, the general education teacher tells the student, 'You don't need the extra time. This is just practice, and it will be better preparation for the real test.' Which of the following best describes the teacher's action?",
        "a": [
          "The teacher exercised appropriate professional judgment because the accommodation applies only to formal state assessments.",
          "The teacher acted appropriately because IEP accommodations are suggestions, not mandates, in general education settings.",
          "The teacher violated the student's federally protected rights by unilaterally withholding a documented IEP accommodation.",
          "The teacher should have first secured the parents' consent before allowing extended time on a practice assessment."
        ],
        "c": 2,
        "r": "IEP accommodations under IDEA are legally binding across academic settings, including classroom practice assessments. A teacher has no authority to suspend them based on personal instructional judgment. Option A is the strongest distractor because test type seems relevant, but accommodations must be implemented consistently across comparable academic activities to be meaningful; selective application is a denial of the student's rights under the IEP. Options B and D are wrong because accommodations are mandatory (not optional) and require no separate parental consent at the point of delivery, since they are already authorized in the IEP."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A parent of a student in a 3rd-grade class approaches a teacher at pickup and asks, 'Can you tell me how Marcus is doing? He's best friends with my daughter, and I want to make sure he isn't holding her back.' The teacher knows that Marcus receives special education services. Which response is most consistent with FERPA?",
        "a": [
          "Decline to discuss Marcus's academic performance or special education status, because FERPA prohibits disclosing a student's education records to unauthorized third parties.",
          "Provide a brief, general summary of Marcus's progress, since the parent's concern relates to her own child's education.",
          "Confirm only that Marcus receives support services, because service status is considered directory information under FERPA.",
          "Tell the parent to raise any concerns about Marcus directly with Marcus's parents."
        ],
        "c": 0,
        "r": "FERPA bars disclosing any student's education records, including academic performance, service status, and disability classification, to anyone who is not that student's own parent or an authorized school official. Option B is the strongest distractor because the parent frames the request as concern for her own child, but that framing creates no lawful basis to disclose another child's records. Option C is incorrect because special education or service status is never directory information. Option D, while it avoids disclosure, deflects rather than fulfilling the teacher's affirmative duty to protect the record and is not the most accurate statement of the FERPA obligation."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "Two high school students engage in a pattern of social-media posts mocking a classmate's weight and appearance. The targeted student's friends report it to the classroom teacher during class, and the targeted student has been visibly distressed and reluctant to participate for two weeks. What should the teacher do first?",
        "a": [
          "Contact the parents of all three students to arrange a restorative conversation between the families.",
          "Refer the matter to the school counselor and let the counselor decide whether the conduct rises to bullying under DASA.",
          "Address the behavior directly with the two students and require them to apologize to the targeted student in front of the class.",
          "Document the report and the observable impact on the student, then report the incident to the school's Dignity Act Coordinator."
        ],
        "c": 3,
        "r": "Under DASA, harassment and bullying, including cyberbullying that affects the school environment, must be reported through the school's formal process to the Dignity Act Coordinator (and, per DASA timelines, orally within one school day and in writing within two). The teacher's role is to document and report, not to adjudicate or informally resolve. Option C is the strongest distractor because direct confrontation feels responsive, but a forced public apology can further harm the targeted student and bypasses the protected, documented process the law requires. Options A and B improperly delegate or detour the teacher's own mandatory reporting duty."
      },
      {
        "s": "C4",
        "d": "Teacher Responsibilities: Legal & Ethical Judgment",
        "q": "A middle school teacher notices that a student frequently wears long sleeves in warm weather and flinches when adults approach quickly. When the teacher privately asks whether everything is okay at home, the student says, 'Please don't tell anyone.' The teacher has no other concrete proof of abuse but has a persistent sense that something is wrong. What is the teacher's most appropriate next step?",
        "a": [
          "Honor the student's request for confidentiality and keep observing the student before taking any formal action.",
          "Discuss the concern with the building principal first to determine whether a formal report is warranted.",
          "Report the suspicion immediately to the NYS Statewide Central Register, because reasonable suspicion, not certainty, triggers the mandatory reporting duty.",
          "Refer the student to the school counselor and let the counselor decide whether a report to child protective services is needed."
        ],
        "c": 2,
        "r": "Under NY Social Services Law Section 413, a mandated reporter must report upon reasonable cause to suspect abuse or maltreatment; the combination of physical indicators (long sleeves concealing the arms in warm weather) and behavioral signs (flinching, a guarded disclosure) meets that threshold. Option B is the strongest distractor because consulting the principal seems responsible, but the legal duty belongs to the individual reporter and cannot be delegated, and delaying to obtain administrative approval may itself be a failure to report. Options A and D similarly substitute observation or referral for the immediate, personal reporting obligation the law imposes."
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
        "body": "Multiple factors can impede meaningful family engagement. Structural barriers include work schedules that conflict with school hours, lack of transportation, and limited access to technology or internet. Linguistic barriers arise when families have limited English proficiency; schools are obligated under Title VI of the Civil Rights Act, as clarified by federal Office for Civil Rights guidance, to provide meaningful access to school programs, which includes translated or interpreted communications and qualified interpreters, not reliance on the student or other children as interpreters. Cultural barriers involve differing conceptions of parental involvement, authority relationships with educators, and historical mistrust of institutions, particularly among Black, Indigenous, and immigrant communities. Cross-cultural competence requires teachers to recognize that deference to educators, limited physical presence at school, or indirect communication styles are not indicators of disengagement; they may reflect cultural norms. New York's Dignity for All Students Act (DASA) reinforces the broader obligation to create inclusive, respectful school environments, an ethic that should extend to family interactions. Teachers who conflate cultural difference with deficiency undermine partnership. Effective communicators adapt style and channel (text, app, paper, phone) to what works for each family."
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
      }
    ],
    "practice": [
      {
        "s": "C5",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A 4th-grade teacher notices that one of her students, whose family recently immigrated from Guatemala, has not responded to any of the three English-language notes she sent home over the past month. During a hallway conversation, the student mentions that his parents speak primarily Kaqchikel and some Spanish. What is the teacher's MOST appropriate next step?",
        "a": [
          "Contact the school's family liaison or district language services office to arrange a qualified interpreter and translated communications in the family's home language.",
          "Ask the student to verbally translate the key points of the notes to his parents each evening.",
          "Send the same English notes home again with a highlighted note asking the family to contact a bilingual neighbor for assistance.",
          "Wait until the scheduled parent-teacher conference to address the communication gap in person."
        ],
        "c": 0,
        "r": "Option A is correct because Title VI of the Civil Rights Act and OCR guidance require schools to provide meaningful access for families with limited English proficiency, including qualified interpreters and translated materials in the family's actual home language, not simply English or a dominant regional language the family may use only partially. The student's parents speak primarily Kaqchikel, so even Spanish materials may not ensure access. Asking the student to interpret (the strongest distractor) is professionally and legally problematic: it places the child in an inappropriate role, risks distortion of content, and denies the family confidential adult-to-adult communication."
      },
      {
        "s": "C5",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A high school special education teacher is preparing for a CSE meeting to review a student's IEP. The student's mother, who works two jobs, says she cannot attend during the school day and is hesitant to participate because she 'doesn't know enough about special education.' Which teacher action BEST reflects legally required and equity-responsive family engagement?",
        "a": [
          "Proceed with the CSE meeting as scheduled, document the parent's absence, and mail her a copy of the revised IEP afterward for signature.",
          "Ask the school psychologist to make all IEP decisions on the parent's behalf given her stated uncertainty about special education.",
          "Reschedule or offer an alternative format (such as a video conference at a mutually agreeable time), connect her with a parent member or advocate, and assure her that her knowledge of her child is essential and valued.",
          "Inform the parent that IEP meetings have a fixed schedule mandated by IDEA and her attendance is required or the meeting cannot proceed."
        ],
        "c": 2,
        "r": "Option C is correct because IDEA requires schools to take reasonable steps to ensure parent participation in IEP/CSE meetings, including scheduling at a mutually agreed time and place and offering alternative means of participation such as video or telephone conferencing. Connecting the family to a parent member or advocate further supports informed participation. Option A is the strongest distractor: while a CSE may, under specific documented conditions, convene without a parent, making no accommodation attempt fails IDEA's requirement to facilitate meaningful parent participation."
      },
      {
        "s": "C5",
        "d": "School-Home Relationships & Family Engagement",
        "q": "A 2nd-grade teacher is developing a plan to reinforce reading fluency at home. Many students in her class have caregivers with varying literacy levels in English, and several families lack reliable internet access. Which approach BEST demonstrates equitable and effective home-school learning reinforcement?",
        "a": [
          "Post video tutorial links on the class website and email them to all families each week.",
          "Send home the same grade-level chapter book each week and ask families to read it aloud with their child nightly.",
          "Provide differentiated, printed take-home guides in families' home languages with simple oral and picture-based reading strategies that do not require internet access or adult literacy in English.",
          "Assign reading log homework and inform families that consistent completion is required for students to pass the marking period."
        ],
        "c": 2,
        "r": "Option C is correct because equitable home-school reinforcement requires designing activities accessible to families across varying literacy levels, languages, and resource contexts, consistent with the spirit of UDL's multiple means of engagement. Oral and picture-based strategies let caregivers who are not literate in English meaningfully support their child's reading. Option A is the strongest distractor because digital resources appear comprehensive but exclude families without reliable internet, reproducing systemic disadvantage rather than addressing it."
      },
      {
        "s": "C5",
        "d": "School-Home Relationships & Family Engagement",
        "q": "During a parent-teacher conference, the family of a 7th-grader expresses frustration that they were not informed about the student's declining grades until the conference. The teacher responds that she contacts families only when grades drop below 65, per department policy. Which reflection BEST indicates that this teacher needs to revise her communication practice?",
        "a": [
          "The teacher should have waited for the formal report card cycle so that all families received information at the same time.",
          "Department policies take precedence over individual teacher communication decisions, so the teacher acted within her professional authority.",
          "The teacher should begin sending weekly mass emails to all families so that no family can ever claim it was uninformed about grades.",
          "Effective teacher-family communication is proactive and ongoing, not reactive to crisis; families should receive positive updates and early alerts that allow time for intervention, not only notifications after a serious decline."
        ],
        "c": 3,
        "r": "Option D is correct because best practice in family engagement requires proactive, continuous communication that includes positive updates and early intervention signals, not contact limited to disciplinary or failing-grade thresholds. Early, two-way communication builds trust and lets families and teachers course-correct before problems become entrenched. Option B is the strongest distractor because it appeals to legitimate authority structures, but a departmental policy sets a floor, not a ceiling; professional responsibility requires communicating in ways that genuinely serve students, which a minimum-threshold policy alone does not guarantee."
      }
    ]
  }
};

const CR_PROMPTS = [
  {
    "id": "cr-diverse",
    "title": "Diverse Student Populations · Case Study",
    "scenario": "Ms. Okafor teaches a Grade 4 inclusive general-education classroom of 24 students at Roosevelt Elementary, a Title I school in a mid-sized urban district. The class reflects a wide range of backgrounds: seven students are English Language Learners (ELLs) at varying NYSITELL proficiency levels (two Entering, three Emerging, two Transitioning), three students have IEPs for learning disabilities, and several students are from low-income households with limited access to print-rich home environments. The majority of students speak Spanish as a home language; two students recently arrived from West Africa and speak Twi as their first language.\n\nThe class is currently in a unit on informational reading and expository writing. Exhibit A shows Ms. Okafor's anecdotal journal noting that her two Entering-level ELL students, Marco and Amara, rarely participate in whole-class discussions and scored below 60% on the most recent close-reading comprehension check. Exhibit B presents a draft two-day lesson plan that relies heavily on whole-class read-aloud of an on-grade-level text followed by an independent written response with no scaffolds, modified texts, or visual supports provided. Academic vocabulary is introduced verbally but never posted or illustrated. Ms. Okafor's journal further notes that Marco and Amara frequently look to peers for cues before attempting tasks and have not yet submitted two writing assignments.",
    "task": "Using the information provided in the exhibits, write a response in which you:\n\n1. IDENTIFY one significant issue related to student diversity, evident in the exhibits, that is affecting the learning of one or more students in Ms. Okafor's classroom;\n\n2. DESCRIBE one specific, research- or evidence-based instructional strategy or modification that Ms. Okafor could implement to address the identified issue; and\n\n3. EXPLAIN why the strategy you described would be effective in addressing the identified issue and supporting the academic growth of the student(s) involved.\n\nYour response will be evaluated on the degree to which it accurately analyzes the exhibits, applies sound pedagogical principles, and supports its claims with specific evidence from the provided materials. The suggested response length is approximately 150 to 200 words.",
    "rubric": [
      {
        "criterion": "Content — addresses all parts of the assignment (identify, describe, explain)",
        "high": "The response fully and clearly addresses all three directives: it identifies a specific diversity-related issue affecting a named student or group, describes a concrete and named instructional strategy or modification, and provides a substantive explanation of why the strategy would be effective. No part of the prompt is omitted or merely implied.",
        "mid": "The response addresses all three directives but one is underdeveloped: for example, the strategy is named but not meaningfully described, or the explanation restates the strategy rather than justifying its effectiveness. The response is generally on-task but incomplete in at least one area.",
        "low": "The response addresses fewer than three directives, or one directive is missing entirely. The issue, strategy, or explanation may be absent, off-topic, or so vague as to provide no actionable instructional information."
      },
      {
        "criterion": "Analysis, Synthesis, and Application of Pedagogical Principles — accurate analysis of the exhibits and accurate application of pedagogical principles",
        "high": "The response demonstrates accurate and insightful analysis of the exhibits, correctly synthesizing evidence across more than one exhibit (for example, connecting the journal data to the lesson-plan gaps). The identified strategy is grounded in sound, recognized pedagogical principles for the relevant diversity domain (linguistic, cultural, readiness, or socioeconomic) and is appropriately applied to the Grade 4 inclusive context.",
        "mid": "The response shows adequate but surface-level analysis of the exhibits. The strategy selected is generally appropriate but may reflect a partial or generic understanding of the relevant pedagogical principles. Connections between exhibits are implicit rather than explicit, or the application to the specific classroom context is underdeveloped.",
        "low": "The response shows little or inaccurate analysis of the exhibits. The strategy selected is inappropriate, misapplied, or not grounded in recognized pedagogical principles. The response may rely on general claims without connecting them to the specific diversity issue or classroom context described in the exhibits."
      },
      {
        "criterion": "Command of Evidence — supported by specific facts, details, or examples from the exhibits",
        "high": "The response consistently cites specific, accurate details from the exhibits (naming students, referencing proficiency levels, paraphrasing exhibit data, or pointing to concrete lesson-plan features) to support every major claim. Evidence is integrated naturally and used to build the argument rather than listed incidentally.",
        "mid": "The response references the exhibits but relies on general or paraphrased information rather than specific details. At least one major claim is supported by exhibit evidence, but other claims rest on assertion alone. The connection between evidence and argument is sometimes unclear.",
        "low": "The response makes little or no reference to the exhibits, or its references are inaccurate. Claims are largely unsupported or supported only by general knowledge unconnected to the provided materials."
      }
    ],
    "exemplar": "The exhibits reveal a significant linguistic diversity issue. Exhibit A identifies Marco and Amara as Entering-level ELLs who scored below 60% on the close-reading comprehension check and have not submitted two writing assignments. Exhibit B shows that the lesson plan provides no visual supports, no scaffolded or modified texts, and introduces academic vocabulary only through verbal explanation. These conditions are particularly inaccessible for students at the Entering proficiency level.\n\nTo address this, Ms. Okafor should implement frontloading with visual vocabulary supports. Before reading, she should pre-teach the four to six key academic vocabulary terms using illustrated word walls, bilingual glossaries, and realia or photographs tied to the text's content.\n\nThis strategy is effective because Entering-level ELLs, like Marco and Amara, lack the receptive English vocabulary needed to access on-grade-level informational text through oral instruction alone. Research on sheltered instruction (Echevarria, Vogt, and Short, 2017) shows that pre-teaching vocabulary with visual anchors lowers the language barrier without reducing content rigor, directly addressing the comprehension gap documented in Exhibit A and the missing scaffold identified in Exhibit B."
  },
  {
    "id": "cr-ell",
    "title": "English Language Learners · Case Study",
    "scenario": "Ms. Carter's seventh-grade Earth Science class includes 24 students with varied academic backgrounds. The class is currently studying plate tectonics and related geological processes. Most students read at or near grade level, though several receive reading support services. One student, Marisol, is a 13-year-old who emigrated from the Dominican Republic two years ago and is classified at the Transitioning level on the NYSESLAT, an intermediate stage of English proficiency. Her language data indicate solid social conversational fluency but significant gaps in academic language, particularly in science content vocabulary and expository text comprehension. Marisol participates willingly in small-group discussions and demonstrates strong conceptual understanding when content is delivered visually or through hands-on tasks.\n\nExhibit 1: Teacher Journal (Week 3). \"Marisol struggled with today's textbook chapter on tectonic boundaries. She could label the diagram correctly but could not answer the two short-answer questions that required her to explain cause-and-effect relationships in writing. During the exit ticket she wrote: 'The plates move and then the mountain.' She consistently uses subject-verb-object sentence frames but does not yet produce the subordinate clauses or signal language ('as a result,' 'because of,' 'which causes') needed to express scientific reasoning.\"\n\nExhibit 2: Draft Lesson Plan (Day 4). Objective: Students will explain how convergent plate boundaries produce mountain ranges, using a minimum of three content-vocabulary terms (convergent, subduction, compression). Planned activities include a 15-minute textbook reading, a whole-class discussion, and a written paragraph response. No scaffolds, sentence frames, or vocabulary supports are currently included in the plan.",
    "task": "Using the exhibits provided, write a response in which you: (1) IDENTIFY a specific language or learning need of the English language learner described in the exhibits; (2) DESCRIBE one specific research- or evidence-based instructional strategy or modification that Ms. Carter could use to address that need in the Day 4 lesson; (3) EXPLAIN why that strategy would be effective for this student, drawing on information from the exhibits. Your response should be approximately 150-200 words.",
    "rubric": [
      {
        "criterion": "Completeness",
        "high": "The response fully accomplishes every part of the assignment: it identifies one specific language or learning need, describes one research-based instructional strategy or modification for the Day 4 lesson in enough detail that another teacher could implement it, and explains why that strategy would be effective for this student. No part is omitted or treated only superficially.",
        "mid": "The response addresses all three parts, but at least one part is underdeveloped, vague, or only partially addressed, for example the strategy is named but not concretely described, or the explanation of effectiveness is present but generic.",
        "low": "The response addresses only one or two parts of the assignment, or all three parts are so vague or brief that the response fails to demonstrate adequate understanding of the task."
      },
      {
        "criterion": "Accuracy",
        "high": "The response demonstrates accurate knowledge of second-language acquisition and ELL pedagogy and applies it correctly to this student: it correctly interprets the exhibits, identifies a need the data actually support (the BICS-CALP gap in producing academic cause-and-effect language), and proposes a strategy that is appropriate for the student's proficiency level and the content demand. Connections among the need, the strategy, and the pedagogical rationale are explicit and well reasoned.",
        "mid": "The response is generally accurate but shows minor errors or imprecision: the need may be framed vaguely (for example, 'she struggles with writing') without naming the academic-language gap, an exhibit may be slightly misread, or the strategy may be appropriate but loosely matched to the identified need.",
        "low": "The response contains significant inaccuracies: it misreads the exhibits, identifies a need the evidence contradicts (for example, a comprehension deficit or a suspected disability when conceptual understanding is documented), or recommends a strategy that is inappropriate, unsupported, or mismatched to the student's need."
      },
      {
        "criterion": "Depth of Support",
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

const INITIAL_STATE = {
  phase:'welcome', qIndex:0, answers:{}, pretestScores:null, theme:'light',
  completedModules:[], activeModule:null, modPhase:'content', modPQIndex:0, modPAnswers:{},
  conceptProgress:{}, moduleScores:{}, quizHistory:[], crScored:{},
  postAnswers:{}, postScores:null,
  fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[],
  quizDomain:null, quizLen:10, quizQs:null, quizIdx:0, quizAnswers:{},
  crPromptId: (typeof CR_PROMPTS !== 'undefined' && CR_PROMPTS.length > 0) ? CR_PROMPTS[0].id : null, crView:'prompt', crSelfScore:{},
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
    primary: { background: disabled ? T.muted : 'var(--text)', color: 'var(--bg)', boxShadow: disabled ? 'none' : '0 4px 18px rgba(36,26,16,.18)' },
    ghost: { background: 'transparent', color: T.ink, border: `1.5px solid ${T.hairline}` },
    accent: { background: disabled ? T.muted : 'var(--accent)', color: '#fff', boxShadow: disabled ? 'none' : '0 4px 18px rgba(194,83,31,.28)' },
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} className={disabled ? '' : 'btn-cta'} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};
const Page = ({ children, narrow = false }) => (
  <div style={{ maxWidth: narrow ? 880 : 1120, margin: '0 auto', padding: '32px clamp(16px, 5vw, 40px) 96px', position: 'relative', zIndex: 1 }}>{children}</div>
);

// Concept-type accents — BCBA's 4-type card system, recolored to the CST warm
// palette. Cycled across a module's concepts via (conceptIdx % length).
const CST_CONCEPT_TYPES = [
  { label:'Core Concept',         icon:'📖', color:'#a14a1f', bg:'#fdf8e9', border:'#e3c9a8' },
  { label:'Key Principles',       icon:'⚙️',  color:'#3d6b3d', bg:'#dde9d8', border:'#b6cdb0' },
  { label:'Critical Distinction', icon:'⚠️', color:'#8a5a1f', bg:'#f6ecd2', border:'#dcc290' },
  { label:'Exam Strategy',        icon:'💡', color:'#6f3047', bg:'#f0e0e6', border:'#d3aebb' },
];

// Tap-to-flip key-term card (ported from BCBA, recolored to the warm palette).
function KeyTermCard({ term, def, color, bg, border }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="kt-card" onClick={() => setFlipped(f => !f)}
      style={{ cursor:'pointer', minHeight:74, perspective:800, userSelect:'none' }}>
      <div style={{ position:'relative', width:'100%', minHeight:74, transformStyle:'preserve-3d',
        transition:'transform .45s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          background:bg, border:`1.5px solid ${border}`, borderRadius:10,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'8px 12px', minHeight:74 }}>
          <span style={{ ...baseStyles.cap, fontSize:8, color, letterSpacing:'.12em', marginBottom:5, opacity:.65 }}>tap to define</span>
          <span style={{ fontFamily:T.serif, fontSize:14, fontWeight:700, color, textAlign:'center', lineHeight:1.3 }}>{term}</span>
        </div>
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          transform:'rotateY(180deg)', background:'var(--surface-solid)', border:`1.5px solid ${border}`, borderRadius:10,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 12px', minHeight:74 }}>
          <span style={{ fontFamily:T.serif, fontSize:12.5, color:T.ink, textAlign:'center', lineHeight:1.5 }}>{def}</span>
        </div>
      </div>
    </div>
  );
}

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
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    :root {
      --bg-base:#f4ecd9; --bg:var(--bg-base);
      --surface:rgba(255,251,242,0.82); --surface-2:rgba(255,251,242,0.55); --surface-solid:#fffdf6;
      --text:#241a10; --muted:#6e6353; --border:#e6d8bf;
      --accent:#c2531f; --accent-2:#a14a1f; --accent-bg:#f6e2cf;
      --green:#5a7a52; --green-bg:#e6eddd; --green-border:rgba(90,122,82,.4);
      --red:#a8453a; --red-bg:#f4ddd6; --red-border:rgba(168,69,58,.4);
      --gold:#b18432; --berry:#6f3047; --sage:#5a7a52;
      --shadow:0 4px 24px rgba(36,26,16,0.08);
    }
    :root[data-theme="dark"] {
      --bg-base:#1c150e;
      --surface:rgba(255,246,232,0.06); --surface-2:rgba(255,246,232,0.04); --surface-solid:#2a2017;
      --text:#f3ece0; --muted:#c7b69a; --border:rgba(255,246,232,0.12);
      --accent:#e07a3f; --accent-2:#e0a071; --accent-bg:rgba(224,122,63,.16);
      --green:#a8c8a0; --green-bg:rgba(168,200,160,.14); --green-border:rgba(168,200,160,.4);
      --red:#e0928a; --red-bg:rgba(224,146,138,.14); --red-border:rgba(224,146,138,.4);
      --gold:#d8a754; --berry:#b07088; --sage:#a8c8a0;
      --shadow:0 6px 28px rgba(0,0,0,0.5);
    }
    html, body {
      margin:0; color:var(--text);
      font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
      background:
        radial-gradient(ellipse 80% 50% at 50% 0%, rgba(194,83,31,.12), transparent 70%),
        radial-gradient(ellipse 60% 50% at 100% 30%, rgba(177,132,50,.12), transparent 70%),
        radial-gradient(ellipse 60% 50% at 0% 100%, rgba(111,48,71,.10), transparent 70%),
        var(--bg-base);
      background-attachment:fixed;
      transition:background .3s ease, color .3s ease;
    }
    :root[data-theme="dark"] html, :root[data-theme="dark"] body {
      background:
        radial-gradient(ellipse 80% 50% at 50% 0%, rgba(224,122,63,.10), transparent 70%),
        radial-gradient(ellipse 60% 50% at 100% 30%, rgba(216,167,84,.08), transparent 70%),
        radial-gradient(ellipse 60% 50% at 0% 100%, rgba(176,112,136,.08), transparent 70%),
        var(--bg-base);
    }
    .ol-split { display: grid; grid-template-columns: 1fr 1px 1fr; }
    .ol-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    @media (max-width: 760px) {
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
    .lift:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(36,26,16,.13); }
    .btn-cta { } .btn-cta:hover { transform: translateY(-1px); filter: brightness(1.03); }
    .cta-arrow { display:inline-block; transition: transform .25s cubic-bezier(.2,.7,.2,1); }
    .btn-cta:hover .cta-arrow { transform: translateX(4px); }
    @keyframes orbDrift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(8px,-12px);} }
    .welcome-orb { position:absolute; border-radius:50%; filter:blur(60px); pointer-events:none; z-index:0; animation:orbDrift 15s ease-in-out infinite; }
    @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
    .greeting-accent { background:linear-gradient(90deg,var(--accent) 0%,var(--berry) 50%,var(--gold) 100%); background-size:200% 100%; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 8s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .fade-up,.welcome-orb,.greeting-accent,.concept-in { animation:none !important; }
      .fade-up { opacity:1 !important; transform:none !important; }
      .lift,.btn-cta,.cta-arrow { transition:none !important; }
    }
  `}</style>
);

// ─── ONE LOVE BRAND ────────────────────────────────────────
const OneLoveLogo = ({ height = 26, dark = true }) => {
  const inkColor = dark ? '#f6efe0' : 'var(--text)';
  const heartColor = dark ? '#e07a3f' : '#c2531f';
  return (
    <svg height={height} viewBox="0 0 380 80" xmlns="http://www.w3.org/2000/svg" aria-label="One Love" style={{ display: 'block' }}>
      <text x="170" y="60" textAnchor="end" fontFamily={T.serif} fontWeight="900" fontSize="54" letterSpacing="-1.2" fill={inkColor}>One</text>
      <g transform="translate(190, 35)">
        <path d="M 10 4 C 10 -2, 4 -6, 0 -2 C -4 -6, -10 -2, -10 4 C -10 11, 0 17, 0 17 C 0 17, 10 11, 10 4 Z" fill={heartColor}/>
      </g>
      <text x="208" y="60" fontFamily={T.serif} fontWeight="900" fontStyle="italic" fontSize="54" letterSpacing="-1.2" fill={inkColor}>Love</text>
    </svg>
  );
};

const OneLoveFooter = () => (
  <footer style={{ borderTop: `1px solid ${T.hairline}`, background: 'var(--surface-2)', padding: '22px 24px 30px', marginTop: 40 }}>
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
      <OneLoveLogo height={22} dark={false}/>
      <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>Behavior Analysts, PLLC</div>
      <p style={{ fontFamily: T.sans, fontSize: 11, lineHeight: 1.55, color: T.muted, margin: 0, maxWidth: 640 }}>
        OneLove Behavior Analysts, PLLC is not affiliated with, endorsed by, or sponsored by the New York State Education Department or the Evaluation Systems group of Pearson. NYSTCE® and CST® are registered marks of their respective owners. This practice tool is provided for educational purposes only and does not guarantee passage of any New York State teacher certification examination.
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
  { id: 'welcome',    label: 'Home',     always: true },
  { id: 'flashcards', label: 'Cards',    always: true },
  { id: 'quiz',       label: 'Quiz',     always: true },
  { id: 'pretest',    label: 'Pretest',  always: true },
  { id: 'cresponse',  label: 'Constructed Response', always: true },
  { id: 'progress',   label: 'My Progress', always: true },
  { id: 'results',    label: 'Results',  needs: 'pretestScores' },
  { id: 'modules',    label: 'Study',    needs: 'pretestScores' },
  { id: 'posttest',   label: 'Post-Test',needs: 'pretestScores' },
  { id: 'comparison', label: 'Report',   needs: 'postScores' },
];
const NavBar = ({ st, onNav, onReset, onConfirmReset, onCancelReset, onToggleTheme }) => {
  const active = st.phase === 'module' ? 'modules'
    : (st.phase === 'quizPicker' || st.phase === 'quizRun' || st.phase === 'quizDone') ? 'quiz'
    : st.phase;
  return (
    <div style={{ background: '#241a10', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 14px rgba(36,26,16,0.22)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '9px clamp(12px, 4vw, 40px) 7px', borderBottom: '1px solid rgba(246,239,224,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => onNav('welcome')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Home">
          <OneLoveLogo height={22} dark={true}/>
        </button>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '7px clamp(12px, 4vw, 40px) 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const avail = item.always || !!st[item.needs];
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => avail && onNav(item.id)} disabled={!avail}
                style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: isActive ? '#241a10' : (avail ? '#f0e7d6' : 'rgba(240,231,214,0.4)'), padding: '5px 11px', borderRadius: 99, background: isActive ? '#f6efe0' : 'transparent', border: 'none', cursor: avail ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'all .2s' }}>
                {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={onToggleTheme} title={st.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ padding: '4px 9px', borderRadius: 99, border: '1px solid rgba(246,239,224,0.2)', background: 'transparent', color: '#f0e7d6', cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>
            {st.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {!st.confirmReset
            ? <button onClick={onReset} style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#e0928a', background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: T.sans, fontSize: 9, color: '#c7b69a' }}>Start over?</span>
                <button onClick={onConfirmReset} style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 700, color: '#fff', background: '#a8453a', padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Yes</button>
                <button onClick={onCancelReset} style={{ fontFamily: T.sans, fontSize: 9, color: '#c7b69a', background: 'none', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(246,239,224,0.25)', cursor: 'pointer' }}>No</button>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ─── WELCOME ───────────────────────────────────────────────
const Welcome = ({ onStart }) => (
  <Page>
    <div className="welcome-orb" style={{ top: -70, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(194,83,31,.18) 0%, transparent 70%)' }} />
    <div className="welcome-orb" style={{ top: '40%', left: -110, width: 320, height: 320, background: 'radial-gradient(circle, rgba(177,132,50,.16) 0%, transparent 70%)', animationDelay: '-5s' }} />

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
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, marginBottom: 26, overflow: 'hidden' }}>
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
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSelected ? T.orange : T.hairline}`, background: isSelected ? T.orange : 'transparent', color: isSelected ? '#fff' : T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{['A', 'B', 'C', 'D'][i]}</span>
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
          if (isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = '#fff'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓ Correct</span>; }
          else if (isUser) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = '#fff'; marker = <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗ Your answer</span>; }
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
        <div style={{ fontSize: 46, marginBottom: 6 }}>{overallPct >= 70 ? '📈' : '📊'}</div>
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
            <div style={{ flex: 1 }}>
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
const ConceptStudy = ({ domain, conceptProgress, onConceptView, onConceptRate, onBack, onStartPractice }) => {
  const mod = MODULES[domain];
  const [conceptIdx, setConceptIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const domainProgress = conceptProgress?.[domain] || {};
  useEffect(() => { onConceptView?.(conceptIdx); }, [conceptIdx, domain]);

  const enh = MODULE_ENHANCEMENTS[domain]?.[conceptIdx] || {};
  const concept = { ...mod.concepts[conceptIdx], ...enh };
  const ctype = CST_CONCEPT_TYPES[conceptIdx % CST_CONCEPT_TYPES.length];
  const isLast = conceptIdx === mod.concepts.length - 1;
  const go = (d) => setConceptIdx(i => Math.max(0, Math.min(mod.concepts.length - 1, i + d)));

  return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>← Back to study plan</button>
      <Cap color={T.orange2} mb={12}>— Module · Concepts</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 38, color: T.ink, letterSpacing: '-.01em', lineHeight: 1.08, marginBottom: 20 }}>{domain}</h2>

      {/* Progress dots + Mastery Map toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {mod.concepts.map((_, i) => (
          <button key={i} onClick={() => setConceptIdx(i)} aria-label={`Go to concept ${i + 1}`}
            style={{ height: 8, borderRadius: 99, cursor: 'pointer', flexShrink: 0, border: 'none', padding: 0,
              width: i === conceptIdx ? 28 : 8,
              background: i <= conceptIdx ? ctype.color : T.hairline,
              transition: 'all .3s ease' }} />
        ))}
        <span style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginLeft: 6, flex: 1 }}>{conceptIdx + 1} / {mod.concepts.length}</span>
        <button onClick={() => setShowMap(s => !s)}
          style={{ ...baseStyles.cap, fontSize: 10, padding: '6px 12px', borderRadius: 99, border: `1px solid ${ctype.color}`,
            background: showMap ? ctype.color : 'transparent', color: showMap ? T.paper : ctype.color, cursor: 'pointer' }}>
          🗺 Map
        </button>
      </div>
      {showMap && (
        <div style={{ marginBottom: 20 }}>
          <MasteryMap domain={domain} concepts={mod.concepts} progress={domainProgress}
            onJumpTo={(i) => { setConceptIdx(i); setShowMap(false); }} color={ctype.color} />
        </div>
      )}

      {/* Concept card */}
      <div key={`${domain}-${conceptIdx}`} className="concept-in"
        style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${ctype.border}`, boxShadow: '0 4px 18px rgba(22,20,16,0.06)', marginBottom: 22 }}>
        <div style={{ background: ctype.bg, padding: '11px 20px', borderBottom: `1px solid ${ctype.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }} aria-hidden="true">{ctype.icon}</span>
            <span style={{ ...baseStyles.cap, fontSize: 10, color: ctype.color }}>{ctype.label}</span>
          </div>
          <Pill color={ctype.color}>§ {String(conceptIdx + 1).padStart(2, '0')}</Pill>
        </div>

        <div style={{ background: T.paper3, padding: '24px 26px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 24, color: T.ink, margin: 0, lineHeight: 1.25, letterSpacing: '-.005em', flex: 1 }}>{concept.title}</h3>
            <TTSButton token={`mod:${domain}:${conceptIdx}`} text={`${concept.title}. ${concept.body}${concept.example ? '. Applied example: ' + concept.example : ''}`} label="Read" size="xs" />
          </div>
          <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.7, color: T.ink, margin: 0 }}>{concept.body}</p>

          {concept.example && (
            <div style={{ marginTop: 20, background: 'var(--accent-bg)', borderLeft: `4px solid ${T.orange}`, borderRadius: '0 10px 10px 0', padding: '14px 16px' }}>
              <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}><span aria-hidden="true">📋</span> Applied Example</div>
              <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.65, color: T.ink, margin: 0, fontStyle: 'italic' }}>{concept.example}</p>
            </div>
          )}

          {concept.animatedVisual && (
            <div style={{ marginTop: 20, background: T.paper, borderRadius: 10, padding: '12px 14px', border: `1px solid ${T.hairline}` }}>
              <AnimatedVisual kind={concept.animatedVisual} color={ctype.color} />
            </div>
          )}

          {concept.keyTerms && concept.keyTerms.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><span aria-hidden="true">🔑</span> Key Terms · tap to reveal</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8 }}>
                {concept.keyTerms.map((kt, ki) => (
                  <KeyTermCard key={ki} term={kt.term} def={kt.def} color={ctype.color} bg={ctype.bg} border={ctype.border} />
                ))}
              </div>
            </div>
          )}

          {concept.quickCheck && (
            <QuickCheck quickCheck={concept.quickCheck} color={ctype.color} onRate={(rating) => onConceptRate?.(conceptIdx, rating)} />
          )}

          {concept.categorize && (
            <CategorizeGame categorize={concept.categorize} color={ctype.color} onComplete={(r) => { if (r.correct === r.total) onConceptRate?.(conceptIdx, 'got-it'); }} />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <Btn onClick={() => go(-1)} variant="ghost" disabled={conceptIdx === 0} style={{ padding: '13px 24px' }}>← Previous</Btn>
        {isLast
          ? <Btn onClick={onStartPractice} variant="accent" style={{ padding: '13px 28px' }}>Begin Practice Questions →</Btn>
          : <Btn onClick={() => go(1)} variant="primary" style={{ padding: '13px 28px' }}>Next Concept →</Btn>}
      </div>
    </Page>
  );
};

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
          if (showFeedback && isCorrect) { bg = 'var(--green-bg)'; border = 'var(--green-border)'; ring = T.green; rbg = T.green; rfg = '#fff'; }
          else if (showFeedback && isSelected && !isCorrect) { bg = 'var(--red-bg)'; border = 'var(--red-border)'; ring = T.red; rbg = T.red; rfg = '#fff'; }
          else if (isSelected) { bg = 'var(--accent-bg)'; border = T.orange; ring = T.orange; rbg = T.orange; rfg = '#fff'; }
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
  const tab = (id, label) => {
    const active = st.crView === id;
    return (
      <button onClick={() => up({ crView: id })}
        style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, flex: 1, padding: '11px', borderRadius: 99, border: `1.5px solid ${active ? T.orange : T.hairline}`, background: active ? 'var(--accent-bg)' : 'transparent', color: active ? T.orange2 : T.muted, cursor: 'pointer' }}>{label}</button>
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>{tab('prompt', 'Prompt + Draft')}{tab('rubric', 'Rubric')}{tab('exemplar', 'Exemplar')}</div>

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
              <Btn onClick={() => up({ crView: 'exemplar' })} variant="ghost" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Compare to Exemplar →</Btn>
              <Btn onClick={() => saveDraft('')} variant="ghost" style={{ padding: '14px 20px' }}>Clear</Btn>
            </div>
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

// ─── MY PROGRESS (per-user performance report) ─────────────
// Reads the same persisted state the rest of the app writes — works entirely
// from this device's data, with or without the telemetry backend.
const scoreSummary = (s) => {
  const o = Object.values(s.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  return { overallPct: pct(o.correct, o.total), subtests: Object.fromEntries(Object.entries(s.subtests).map(([k, v]) => [k, pct(v.correct, v.total)])) };
};
const MyProgress = ({ st, onNav }) => {
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
        <div style={{ fontSize: 44, marginBottom: 6 }}>📊</div>
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
                  <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{MODULES[d]?.icon} {d}</span>
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

// ─── APP ROOT ──────────────────────────────────────────────
const STORAGE_KEY = 'eas-201-state-v2';
const OLD_STORAGE_KEYS = [];
// fields that survive page reload (skip transient quiz session + reset confirmation)
const PERSIST_FIELDS = ['phase', 'qIndex', 'answers', 'pretestScores', 'pretestAnswers', 'posttestAnswers', 'postScores', 'posttestStarted', 'completedModules', 'conceptProgress', 'moduleScores', 'quizHistory', 'crScored', 'crPromptId', 'theme'];
// transient phases can't resume after a reload (their session state isn't
// persisted) — send the user to the nearest hub instead of a crash/blank page
const PHASE_FALLBACK = { module: 'modules', quizRun: 'quizPicker', quizDone: 'quizPicker' };

export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
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
  if (st.phase === 'progress')   return <Shell nav={nav}><MyProgress st={st} onNav={handleNav} /></Shell>;
  if (st.phase === 'quizPicker') return <Shell nav={nav}><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'quizRun' && st.quizQs) return <Shell nav={nav}><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => { const correct = st.quizQs.filter((q, i) => st.quizAnswers[i] === q.c).length; const p = pct(correct, st.quizQs.length); track('quiz_completed', { domain: st.quizDomain, len: st.quizQs.length, pct: p }); up({ phase: 'quizDone', quizHistory: [...(st.quizHistory || []), { domain: st.quizDomain, len: st.quizQs.length, pct: p, ts: new Date().toISOString() }].slice(-30) }); }} phase={`${st.quizDomain} Quiz`} /></Shell>;
  if (st.phase === 'quizDone' && st.quizQs) return <Shell nav={nav}><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'pretest')    return <Shell nav={nav}><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, pretestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers } }); track('pretest_completed', { ...scoreSummary(s), weak: Object.entries(s.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) }); }} phase="Pretest" /></Shell>;
  if (st.phase === 'results')    return <Shell nav={nav}><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Shell>;
  if (st.phase === 'modules')    return <Shell nav={nav}><ModuleHub domains={[...weak, ...Object.keys(MODULES).filter(d => !weak.includes(d))]} weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Shell>;
  if (st.phase === 'module')     return <Shell nav={nav}><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} conceptProgress={st.conceptProgress} onConceptView={(idx) => setSt(p => { const dom = p.activeModule; const cur = p.conceptProgress?.[dom] || {}; if (cur[idx]?.viewed) return p; return { ...p, conceptProgress: { ...p.conceptProgress, [dom]: { ...cur, [idx]: { ...(cur[idx] || {}), viewed: true } } } }; })} onConceptRate={(idx, rating) => setSt(p => { const dom = p.activeModule; const cur = p.conceptProgress?.[dom] || {}; return { ...p, conceptProgress: { ...p.conceptProgress, [dom]: { ...cur, [idx]: { ...(cur[idx] || {}), viewed: true, rating } } } }; })} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => { const dom = st.activeModule; const practice = MODULES[dom]?.practice || []; const score = practice.length ? pct(practice.filter((q, i) => st.modPAnswers[i] === q.c).length, practice.length) : 0; const prog = st.conceptProgress?.[dom] || {}; track('module_completed', { domain: dom, practicePct: score, mastered: Object.values(prog).filter(p => p?.rating === 'got-it').length, concepts: (MODULES[dom]?.concepts || []).length }); up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, dom])], moduleScores: { ...st.moduleScores, [dom]: score } }); }} /></Shell>;
  if (st.phase === 'posttest')   return <Shell nav={nav}>{!st.posttestStarted ? (
    <Page narrow>
      <div className="fade-up fade-up-1" style={{ textAlign: 'center', padding: '56px 0' }}>
        <div style={{ fontSize: 46, marginBottom: 10 }}>🏁</div>
        <Cap color={T.orange2} mb={10}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: T.ink, letterSpacing: '-.025em', margin: '0 0 16px' }}>The Post-Test</h2>
        <p style={{ fontFamily: T.sans, fontSize: 17, color: T.muted, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 32px' }}>{POSTTEST.length} {WELCOME.posttestIntro}</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, posttestAnswers: {}, qIndex: 0 })} variant="accent" style={{ padding: '16px 44px', fontSize: 16 }}>Begin the Post-Test <span className="cta-arrow">→</span></Btn>
      </div>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, posttestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers } }); const sum = scoreSummary(s); const pre = st.pretestScores ? scoreSummary(st.pretestScores).overallPct : null; track('posttest_completed', { ...sum, prePct: pre, growth: pre == null ? null : sum.overallPct - pre }); }} phase="Post-Test" />
  )}</Shell>;
  if (st.phase === 'comparison') return <Shell nav={nav}><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  }} /></Shell>;
  // unknown phase (e.g. stale persisted value) — land on home, never a blank page
  return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
}
