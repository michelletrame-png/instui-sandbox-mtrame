// ── Types ──────────────────────────────────────────────────────────────────────

export type ScoreStatus = 'graded' | 'missing' | 'late' | 'ungraded' | 'excused'

export type CellData = {
  score?: number
  max: number
  status: ScoreStatus
  submittedAt?: string
}

export type StudentData = {
  id: string
  name: string
  section: string
  cells: CellData[]
  currentGrade: string
}

export type RubricCriterion = {
  id: string
  label: string
  description: string
  points: number
  levels: { label: string; description: string; pts: number }[]
}

export type Comment = {
  id: string
  author: string
  role: 'teacher' | 'student'
  text: string
  time: string
}

export type BadgeStyle = { bg: string; color: string; borderColor: string; label: string }

// ── Seed/random helpers ─────────────────────────────────────────────────────────

export function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function submittedDate(aIdx: number, sIdx: number): string {
  const day  = Math.min(28, 4 + Math.floor(aIdx * 0.9) + Math.floor(seededRand(aIdx * 17 + sIdx * 3) * 3))
  const hour = 8 + Math.floor(seededRand(aIdx * 11 + sIdx * 7) * 15)
  const min  = Math.floor(seededRand(aIdx * 13 + sIdx * 5) * 60)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12  = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `Apr ${day}, ${h12}:${String(min).padStart(2, '0')} ${ampm}`
}

// ── Rubric template (defined before generateCell so scores can derive from it) ──

export const RUBRIC_TEMPLATE: RubricCriterion[] = [
  {
    id: 'r1',
    label: 'Content & Analysis',
    description: 'Evaluate the depth of the student\'s argument, use of evidence, and accuracy of claims. Strong submissions go beyond summary to offer original insight supported by specific examples.',
    points: 30,
    levels: [
      { label: 'Exceptional',  description: 'Sophisticated, original analysis. All claims are substantiated with precise, well-chosen evidence. Demonstrates mastery of the subject.', pts: 30 },
      { label: 'Excellent',    description: 'Thorough analysis with strong supporting evidence. Minor gaps in depth or precision but the argument is convincing overall.',              pts: 26 },
      { label: 'Proficient',   description: 'Solid analysis with adequate evidence. Ideas are developed but lack the depth or specificity needed for a higher score.',                pts: 20 },
      { label: 'Developing',   description: 'Some analysis present but relies heavily on summary. Evidence is limited or not clearly connected to the argument.',                      pts: 13 },
      { label: 'Beginning',    description: 'Minimal analysis. Claims are unsupported or inaccurate. Little evidence that the student engaged critically with the material.',          pts: 6  },
    ],
  },
  {
    id: 'r2',
    label: 'Organization',
    description: 'Assess how well the submission is structured from introduction to conclusion. Look for a clear thesis, logical flow between paragraphs, and effective transitions.',
    points: 20,
    levels: [
      { label: 'Excellent',    description: 'Seamless structure with a compelling introduction, well-developed body, and satisfying conclusion. Transitions guide the reader effortlessly.', pts: 20 },
      { label: 'Proficient',   description: 'Clearly organized with a recognizable thesis and logical progression. Some transitions are weak or paragraphs slightly out of order.',         pts: 15 },
      { label: 'Developing',   description: 'Basic structure is present but organization is inconsistent. Transitions are missing or abrupt in several places.',                            pts: 9  },
      { label: 'Beginning',    description: 'No clear structure. Ideas jump without connection. The reader must work hard to follow the argument.',                                         pts: 3  },
    ],
  },
  {
    id: 'r3',
    label: 'Writing Quality & Craft',
    description: 'Review sentence-level clarity, grammar, spelling, and word choice. Consider whether the tone is appropriate for an academic audience and whether language choices strengthen the argument.',
    points: 15,
    levels: [
      { label: 'Excellent',    description: 'Virtually error-free. Language is precise, varied, and purposeful. Tone is consistently academic and enhances the reader\'s understanding.', pts: 15 },
      { label: 'Proficient',   description: 'Minor errors that do not distract. Word choice is generally strong with occasional imprecision. Academic tone is mostly maintained.',         pts: 11 },
      { label: 'Developing',   description: 'Noticeable errors in grammar or mechanics. Word choice is sometimes vague or informal. Writing occasionally obscures meaning.',               pts: 7  },
      { label: 'Beginning',    description: 'Frequent errors throughout. Unclear sentences or inappropriate tone make the writing difficult to follow.',                                   pts: 3  },
      { label: 'Not evident',  description: 'Writing quality severely impedes comprehension. Requires substantial revision before the content can be properly evaluated.',                pts: 0  },
    ],
  },
  {
    id: 'r4',
    label: 'Use of Sources',
    description: 'Examine whether the student cites credible, relevant sources and integrates them appropriately. Quotations and paraphrases should be used to support, not replace, the student\'s own ideas.',
    points: 10,
    levels: [
      { label: 'Excellent',    description: 'Three or more credible sources cited correctly. Quotations and paraphrases are smoothly integrated and clearly support the argument.',      pts: 10 },
      { label: 'Proficient',   description: 'Required sources are present and mostly cited correctly. Integration is adequate but could be more seamless.',                              pts: 8  },
      { label: 'Developing',   description: 'Sources are present but citation format has errors or sources are not sufficiently credible. Integration feels forced or disconnected.',    pts: 5  },
      { label: 'Beginning',    description: 'Fewer sources than required or major citation errors. Sources do not clearly support the argument.',                                        pts: 2  },
      { label: 'Not evident',  description: 'No sources cited, or sources are entirely missing.',                                                                                       pts: 0  },
    ],
  },
]

export const RUBRIC_MAX = RUBRIC_TEMPLATE.reduce((sum, c) => sum + c.points, 0)

// Returns the seeded rubric level selections for a student (by 0-based index).
// Used both here for score generation and exported for UI initialization.
function rubricStateByIdx(sIdx: number): Record<string, number> {
  return Object.fromEntries(
    RUBRIC_TEMPLATE.map((c, i) => {
      const r = seededRand(sIdx * 113 + i * 53 + 2000)
      return [c.id, Math.floor(r * c.levels.length)]
    })
  )
}

function rubricTotalByIdx(sIdx: number): number {
  const state = rubricStateByIdx(sIdx)
  return RUBRIC_TEMPLATE.reduce((sum, c) => {
    const idx = state[c.id]
    return sum + (idx !== undefined ? c.levels[idx].pts : 0)
  }, 0)
}

// Exported for UI: student IDs are 's1'–'s26', so slice(1) gives the 1-based number.
export function seededRubricState(studentId: string): Record<string, number> {
  return rubricStateByIdx(parseInt(studentId.slice(1)) - 1)
}

// ── Cell generation ─────────────────────────────────────────────────────────────

export function generateCell(sIdx: number, aIdx: number, pts: number, perf: number, hasRubric = false): CellData {
  const r1 = seededRand(sIdx * 97 + aIdx * 31)
  const r2 = seededRand(sIdx * 97 + aIdx * 31 + 500)
  if (aIdx >= 22) return { max: pts, status: 'ungraded' }
  const excusedP = 0.03
  const missingP = perf < 0.60 ? 0.22 : perf < 0.75 ? 0.09 : 0.03
  const lateP    = perf < 0.70 ? 0.14 : perf < 0.85 ? 0.07 : 0.02
  const pendingP = aIdx >= 18 ? 0.40 : 0
  if (r1 < excusedP) return { max: pts, status: 'excused' }
  if (r1 < excusedP + missingP) return { max: pts, status: 'missing' }

  // For rubric assignments, derive score from the seeded rubric total so all
  // views show the same number. For non-rubric assignments, use the perf formula.
  const score = hasRubric
    ? Math.round(rubricTotalByIdx(sIdx) / RUBRIC_MAX * pts)
    : Math.round(pts * Math.min(1, Math.max(0.5, perf + (r2 - 0.5) * 0.22)))

  if (r1 < excusedP + missingP + lateP) {
    return { score, max: pts, status: 'late', submittedAt: submittedDate(aIdx, sIdx) }
  }
  if (r1 < excusedP + missingP + lateP + pendingP) {
    return { max: pts, status: 'ungraded', submittedAt: submittedDate(aIdx, sIdx) }
  }
  return { score, max: pts, status: 'graded', submittedAt: submittedDate(aIdx, sIdx) }
}

// ── Grade / display helpers ─────────────────────────────────────────────────────

export function gradeFromPerf(p: number): string {
  if (p >= 0.93) return 'A';  if (p >= 0.90) return 'A−'; if (p >= 0.87) return 'B+'
  if (p >= 0.83) return 'B';  if (p >= 0.80) return 'B−'; if (p >= 0.77) return 'C+'
  if (p >= 0.73) return 'C';  if (p >= 0.70) return 'C−'; if (p >= 0.67) return 'D+'
  if (p >= 0.63) return 'D';  if (p >= 0.60) return 'D−'; return 'F'
}

export function formatDue(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function pct(score: number, max: number) { return Math.round((score / max) * 100) }

/* eslint-disable instui/no-hardcoded-hex */
export function scoreBadgeStyle(cell: CellData): BadgeStyle {
  if (cell.status === 'missing')                       return { bg: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5', label: 'Missing' }
  if (cell.status === 'ungraded' && !cell.submittedAt) return { bg: '#F8FAFC', color: '#94A3B8', borderColor: '#E2E8F0', label: '—' }
  if (cell.status === 'ungraded')                      return { bg: '#F1F5F9', color: '#475569', borderColor: '#CBD5E1', label: 'Needs grading' }
  if (cell.status === 'late')                          return { bg: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D', label: `${cell.score}/${cell.max} Late` }
  const p = pct(cell.score!, cell.max)
  if (p >= 70) return { bg: '#D1FAE5', color: '#059669', borderColor: '#6EE7B7', label: `${cell.score}/${cell.max}` }
  return { bg: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5', label: `${cell.score}/${cell.max}` }
}

export const GRADE_COLORS: Record<string, string> = {
  'A': '#059669', 'A−': '#059669',
  'B+': '#0D9488', 'B': '#0D9488', 'B−': '#0D9488',
  'C+': '#CA8A04', 'C': '#CA8A04', 'C−': '#CA8A04',
  'D+': '#DC2626', 'D': '#DC2626', 'D−': '#DC2626',
  'F': '#DC2626',
}
/* eslint-enable instui/no-hardcoded-hex */

// ── Assignment definitions ─────────────────────────────────────────────────────

export const TODAY = new Date('2026-04-20')

export const ASSIGNMENT_DEFS = [
  { id: 'a1',  name: 'Research Paper Draft',   pts: 100, modality: 'essay'        as const, due: '2026-01-15', hasRubric: true  },
  { id: 'a2',  name: 'Annotated Bibliography', pts: 50,  modality: 'slides'       as const, due: '2026-01-22', hasRubric: false },
  { id: 'a3',  name: 'Midterm Essay',          pts: 80,  modality: 'essay'        as const, due: '2026-02-05', hasRubric: true  },
  { id: 'a4',  name: 'Peer Review',            pts: 25,  modality: 'illustration' as const, due: '2026-02-12', hasRubric: false },
  { id: 'a5',  name: 'Final Essay',            pts: 150, modality: 'essay'        as const, due: '2026-02-19', hasRubric: true  },
  { id: 'a6',  name: 'Lab Report 1',           pts: 60,  modality: 'essay'        as const, due: '2026-02-26', hasRubric: true  },
  { id: 'a7',  name: 'Weekly Reflection 1',    pts: 20,  modality: 'essay'        as const, due: '2026-03-05', hasRubric: false },
  { id: 'a8',  name: 'Cell Diagram Quiz',      pts: 30,  modality: 'illustration' as const, due: '2026-03-09', hasRubric: false },
  { id: 'a9',  name: 'Reading Response 1',     pts: 15,  modality: 'essay'        as const, due: '2026-03-12', hasRubric: false },
  { id: 'a10', name: 'Group Presentation',     pts: 75,  modality: 'slides'       as const, due: '2026-03-19', hasRubric: true  },
  { id: 'a11', name: 'Lab Report 2',           pts: 60,  modality: 'essay'        as const, due: '2026-03-26', hasRubric: true  },
  { id: 'a12', name: 'Weekly Reflection 2',    pts: 20,  modality: 'essay'        as const, due: '2026-04-02', hasRubric: false },
  { id: 'a13', name: 'Literature Review',      pts: 90,  modality: 'essay'        as const, due: '2026-04-05', hasRubric: true  },
  { id: 'a14', name: 'Reading Response 2',     pts: 15,  modality: 'essay'        as const, due: '2026-04-09', hasRubric: false },
  { id: 'a15', name: 'Concept Map',            pts: 40,  modality: 'illustration' as const, due: '2026-04-12', hasRubric: false },
  { id: 'a16', name: 'Lab Report 3',           pts: 60,  modality: 'essay'        as const, due: '2026-04-14', hasRubric: true  },
  { id: 'a17', name: 'Weekly Reflection 3',    pts: 20,  modality: 'essay'        as const, due: '2026-04-16', hasRubric: false },
  { id: 'a18', name: 'Case Study',             pts: 85,  modality: 'essay'        as const, due: '2026-04-17', hasRubric: true  },
  { id: 'a19', name: 'Reading Response 3',     pts: 15,  modality: 'essay'        as const, due: '2026-04-18', hasRubric: false },
  { id: 'a20', name: 'Organelle Quiz',          pts: 70,  modality: 'quiz'         as const, due: '2026-04-19', hasRubric: false },
  { id: 'a21', name: 'Lab Report 4',           pts: 60,  modality: 'essay'        as const, due: '2026-04-19', hasRubric: true  },
  { id: 'a22', name: 'Weekly Reflection 4',    pts: 20,  modality: 'essay'        as const, due: '2026-04-20', hasRubric: false },
  { id: 'a23', name: 'Research Proposal',      pts: 100, modality: 'essay'        as const, due: '2026-04-25', hasRubric: true  },
  { id: 'a24', name: 'Peer Evaluation',        pts: 25,  modality: 'illustration' as const, due: '2026-05-02', hasRubric: false },
  { id: 'a25', name: 'Final Project Report',   pts: 200, modality: 'essay'        as const, due: '2026-05-15', hasRubric: true  },
]

export const STUDENT_DEFS = [
  { id: 's1',  name: 'Amara Osei',        perf: 0.94, section: 'Section A' },
  { id: 's2',  name: 'Ben Kowalski',      perf: 0.83, section: 'Section A' },
  { id: 's3',  name: 'Cleo Martinez',     perf: 0.75, section: 'Section A' },
  { id: 's4',  name: 'Daniel Park',       perf: 0.91, section: 'Section A' },
  { id: 's5',  name: 'Elena Rossi',       perf: 0.81, section: 'Section A' },
  { id: 's6',  name: 'Marcus Williams',   perf: 0.45, section: 'Section A' },
  { id: 's7',  name: 'Fiona Chen',        perf: 0.88, section: 'Section A' },
  { id: 's8',  name: 'George Okafor',     perf: 0.80, section: 'Section A' },
  { id: 's9',  name: 'Hannah Schmidt',    perf: 0.96, section: 'Section A' },
  { id: 's10', name: 'Isaac Patel',       perf: 0.84, section: 'Section B' },
  { id: 's11', name: 'Jasmine Torres',    perf: 0.78, section: 'Section B' },
  { id: 's12', name: 'Kevin Nakamura',    perf: 0.91, section: 'Section B' },
  { id: 's13', name: 'Laura Andersen',    perf: 0.63, section: 'Section B' },
  { id: 's14', name: 'Malik Robinson',    perf: 0.87, section: 'Section B' },
  { id: 's15', name: 'Nadia Petrov',      perf: 0.87, section: 'Section B' },
  { id: 's16', name: 'Omar Hassan',       perf: 0.71, section: 'Section B' },
  { id: 's17', name: 'Priya Sharma',      perf: 0.93, section: 'Section B' },
  { id: 's18', name: 'Quinn Davis',       perf: 0.83, section: 'Section B' },
  { id: 's19', name: 'Rosa Mendez',       perf: 0.74, section: 'Section C' },
  { id: 's20', name: 'Samuel Lee',        perf: 0.90, section: 'Section C' },
  { id: 's21', name: "Tara O'Brien",      perf: 0.80, section: 'Section C' },
  { id: 's22', name: 'Umar Diallo',       perf: 0.85, section: 'Section C' },
  { id: 's23', name: 'Valentina Cruz',    perf: 0.86, section: 'Section C' },
  { id: 's24', name: 'William Foster',    perf: 0.67, section: 'Section C' },
  { id: 's25', name: 'Xiao Wei',          perf: 0.92, section: 'Section C' },
  { id: 's26', name: 'Yuki Yamamoto',     perf: 0.78, section: 'Section C' },
]

export const STUDENTS: StudentData[] = STUDENT_DEFS.map((def, sIdx) => ({
  id: def.id,
  name: def.name,
  section: def.section,
  currentGrade: gradeFromPerf(def.perf),
  cells: ASSIGNMENT_DEFS.map((a, aIdx) => generateCell(sIdx, aIdx, a.pts, def.perf, a.hasRubric)),
}))

const UNPOSTED_IDS = new Set(['a18'])

export const ASSIGNMENTS = ASSIGNMENT_DEFS.map((def, aIdx) => {
  const cells   = STUDENTS.map(s => s.cells[aIdx])
  const pastDue = new Date(def.due) <= TODAY
  const needsGradingCount = pastDue
    ? cells.filter(c => c.status === 'ungraded' && c.submittedAt).length
    : 0
  const unposted = UNPOSTED_IDS.has(def.id)
  const unpostedCount = unposted ? cells.filter(c => c.score !== undefined).length : 0
  return { ...def, pastDue, needsGradingCount, dueLabel: formatDue(def.due), unposted, unpostedCount }
})

export const MODULE_MAP: Record<string, string> = {
  a1: 'Unit 1', a2: 'Unit 1', a3: 'Unit 1', a4: 'Unit 1', a5: 'Unit 1',
  a6: 'Unit 2', a7: 'Unit 2', a8: 'Unit 2', a9: 'Unit 2', a10: 'Unit 2',
  a11: 'Unit 3', a12: 'Unit 3', a13: 'Unit 3', a14: 'Unit 3', a15: 'Unit 3',
  a16: 'Unit 4', a17: 'Unit 4', a18: 'Unit 4', a19: 'Unit 4', a20: 'Unit 4',
  a21: 'Unit 4', a22: 'Unit 4',
}

// ── Essay submission content ───────────────────────────────────────────────────

export const ESSAY_CONTENT: Record<string, string> = {
  a1: `The accurate and timely progression through the cell cycle is essential for maintaining genomic integrity. At the core of this regulatory framework are the cyclin-dependent kinases (CDKs), a family of serine/threonine protein kinases activated upon binding to their regulatory partners, the cyclins. The G1/S transition — a commitment point often called the restriction point — is governed primarily by CDK4 and CDK6 in complex with D-type cyclins. These complexes phosphorylate the retinoblastoma protein (Rb), releasing the transcription factor E2F and allowing transcription of genes required for S-phase entry. Once cells pass this checkpoint, commitment to division is essentially irreversible under normal physiological conditions.`,

  a3: `Cellular homeostasis depends on the ability of cells to regulate the passage of ions and molecules across the plasma membrane. This selective permeability is mediated by a diverse repertoire of transport proteins, including ion channels, transporters, and pumps. The sodium-potassium ATPase (Na⁺/K⁺-ATPase) exemplifies primary active transport: for every ATP hydrolyzed, three sodium ions are extruded and two potassium ions are imported against their respective concentration gradients. This electrochemical gradient underpins neuronal excitability and provides the driving force for secondary active transporters throughout the body.`,

  a5: `The discovery and engineering of the CRISPR-Cas9 system has transformed molecular biology, enabling programmable, site-specific modifications to genomic sequences in living cells. The Cas9 endonuclease, guided by a synthetic single-guide RNA (sgRNA), creates site-specific double-strand breaks adjacent to a protospacer-adjacent motif (PAM). These breaks are repaired via non-homologous end joining (NHEJ), which introduces indels, or homology-directed repair (HDR), which can incorporate a defined sequence from a provided template. Off-target editing remains a primary safety concern for therapeutic applications, driving development of high-fidelity Cas9 variants.`,

  a6: `Cellular respiration proceeds through three interconnected stages: glycolysis, the citric acid cycle, and oxidative phosphorylation. In this experiment, yeast cultures were exposed to varying glucose concentrations to measure the effect on CO₂ production as a proxy for metabolic rate. Results demonstrated a sigmoidal relationship between substrate availability and respiratory output, consistent with Michaelis-Menten kinetics at the enzymatic level. Controls using sodium azide to inhibit cytochrome c oxidase confirmed that the majority of CO₂ production was attributable to aerobic respiration rather than fermentation.`,

  a7: `This week's readings on epistemic injustice challenged me to reconsider how scientific authority is constructed and distributed. Fricker's concept of testimonial injustice resonated with several historical examples we discussed in class, particularly the systematic dismissal of indigenous ecological knowledge in 20th-century conservation science. I found myself questioning whether the peer-review system, while valuable, can inadvertently amplify existing credibility biases. Going forward, I want to explore how open-science practices and preregistration might partially address these concerns.`,

  a9: `Haraway's "Situated Knowledges" argues persuasively that the claim to a view from nowhere is itself a position — one that historically served to naturalize particular (and partial) perspectives as universal. Her critique of the god-trick resonates with our course theme of positionality in scientific reasoning. I found her distinction between relativism and situated objectivity especially useful, though I would push back on whether her framework gives sufficient guidance for adjudicating between competing situated claims in applied policy contexts.`,

  a11: `The mitosis experiment using onion root tip cells yielded clear visualization of all four mitotic stages under compound light microscopy at 400× magnification. Prophase cells constituted approximately 36% of the observed cells, consistent with its status as the longest mitotic phase. Metaphase alignment appeared complete in 18% of cells, while anaphase and telophase together accounted for the remaining dividing cells. One limitation of this protocol is that fixation and staining preclude observation of real-time dynamics; time-lapse imaging would significantly strengthen interpretations of phase transition timing.`,

  a12: `Reflecting on the module on artificial general intelligence, I was struck by the persistent conflation of intelligence and consciousness in popular discourse. The readings made clear that current large language models exhibit sophisticated statistical regularities without anything resembling understanding in the philosophical sense. I am still uncertain about where to draw the line between narrow and general intelligence, but I now appreciate that this boundary is contested even among researchers. The ethical implications of deploying systems that appear intelligent without being so feel increasingly urgent given recent product releases.`,

  a13: `This literature review examines empirical studies on the relationship between algorithmic decision-making and disparate impact in hiring contexts. Across 23 reviewed studies (2015–2024), a consistent pattern emerges: models trained on historical hiring data tend to reproduce and occasionally amplify existing demographic disparities, even when protected attributes are formally excluded from feature sets. Proxy variables — particularly residential ZIP code, university attended, and gap years — explain much of this residual bias. Proposed technical mitigations including adversarial debiasing and counterfactual fairness constraints have shown promise but have not yet been evaluated at production scale.`,

  a14: `Eubanks' Automating Inequality documents how algorithmic systems deployed in public-sector welfare administration systematically disadvantage already-marginalized communities. Her case studies — the Indiana eligibility system, the Allegheny Family Screening Tool, and the Los Angeles coordinated entry system — share a common structure: opacity, asymmetric accountability, and the transfer of burden of proof onto resource-constrained individuals. I was particularly struck by her observation that high-tech tools applied to poverty management often function as poverty management in disguise. The reading prompts me to ask which values are encoded in the choice of optimization target itself.`,

  a16: `This third lab report investigates enzyme kinetics using the peroxidase reaction in potato extract as a model system. Varying hydrogen peroxide concentrations from 0.1% to 3.0% produced a rate curve that plateaued near 1.5%, indicating enzyme saturation consistent with a Km estimate of approximately 0.8%. Adding competitive inhibitor phenylhydrazine at equimolar concentrations shifted the curve rightward without affecting Vmax, providing textbook confirmation of competitive inhibition mechanics. Experimental error was primarily attributable to inconsistent timing of absorbance readings; future iterations should use automated spectrophotometry to eliminate this source of variability.`,

  a17: `The week's focus on explainability and interpretability in machine learning systems raised questions I had not previously considered about what "explanation" means for a computational system. Lipton's taxonomy distinguishing simulatability, decomposability, and algorithmic transparency was a useful organizing framework, though I found the tension between local and global explanation methods unresolved by the readings. I remain unconvinced that post-hoc explanation techniques like LIME or SHAP provide the kind of mechanistic understanding that would be needed to satisfy regulatory requirements for high-stakes decisions.`,

  a18: `This case study examines the 2018 Amazon recruiting tool controversy, in which a machine learning system trained on ten years of résumés systematically downrated applications from women. The proximate cause was clear: historical hiring patterns encoded gender bias into the training data, which the model faithfully reproduced. However, the more interesting analytical question is why the system was deployed without adequate pre-deployment bias auditing, and what organizational incentives made such auditing unlikely. Drawing on Winner's concept of technological politics, I argue that the system's design reflected and reinforced existing power structures within the firm.`,

  a19: `O'Neil's Weapons of Math Destruction provides an accessible taxonomy of harmful algorithmic systems characterized by opacity, scale, and harmful feedback loops. Her concept of the "pernicious feedback loop" is particularly apt for recidivism prediction tools: if individuals from over-policed communities are more likely to receive high risk scores, and high risk scores lead to incarceration, and incarceration increases the likelihood of reoffending, the model becomes partially self-fulfilling. I found her treatment of standardized testing somewhat less convincing — the harms she identifies seem more attributable to how scores are used than to the tests themselves.`,

  a23: `This proposal outlines a mixed-methods study examining how higher education institutions communicate AI policy to faculty and students. The central research question is: to what extent do institutional AI policies reflect the epistemic values articulated in the institutions' stated educational missions? Phase one will involve content analysis of publicly available AI use policies from a stratified sample of 50 U.S. institutions. Phase two will conduct semi-structured interviews with academic integrity officers and faculty governance representatives at a subset of six institutions. Ethical considerations, including informed consent protocols and handling of potentially sensitive policy-drafting documents, are detailed in the appendix.`,

  a25: `This project report synthesizes findings from a semester-long investigation into the differential adoption of AI writing assistance tools across student populations at our institution. Survey data (n=412) indicated statistically significant differences in tool adoption rates by first-generation student status, major, and self-reported technological confidence, even when controlling for hardware access. Qualitative interviews with 18 students surfaced two dominant framings: AI as efficiency tool versus AI as threat to learning. These framings correlated with, but were not fully predicted by, adoption rates. Implications for pedagogical design and institutional policy are discussed, with particular attention to equitable access and the risk of compounding existing academic advantage gaps.`,
}

// ── Session-scoped grade store ─────────────────────────────────────────────────
// Module-level map persists grades across component mounts and route navigation
// within a single browser session, standing in for a real backend in this prototype.

const _gradeStore = new Map<string, number | undefined>()

function _key(studentId: string, aIdx: number) { return `${studentId}|${aIdx}` }

export function getScore(studentId: string, aIdx: number): number | undefined {
  const k = _key(studentId, aIdx)
  if (!_gradeStore.has(k)) {
    const student = STUDENTS.find(s => s.id === studentId)
    _gradeStore.set(k, student?.cells[aIdx]?.score)
  }
  return _gradeStore.get(k)
}

export function setScore(studentId: string, aIdx: number, score: number | undefined): void {
  _gradeStore.set(_key(studentId, aIdx), score)
}

const _statusStore = new Map<string, ScoreStatus>()

export function getStatus(studentId: string, aIdx: number): ScoreStatus {
  const k = _key(studentId, aIdx)
  if (!_statusStore.has(k)) {
    const student = STUDENTS.find(s => s.id === studentId)
    _statusStore.set(k, student?.cells[aIdx]?.status ?? 'ungraded')
  }
  return _statusStore.get(k)!
}

export function setStatus(studentId: string, aIdx: number, status: ScoreStatus): void {
  _statusStore.set(_key(studentId, aIdx), status)
}

// ── Comment Library ────────────────────────────────────────────────────────────

export type CommentEntry = { id: string; text: string }

export const COMMENT_LIB: Record<string, CommentEntry[]> = {
  encouragement: [
    { id: 'e1', text: 'Your thesis is exceptionally well-articulated. The argument flows naturally and convincingly throughout.' },
    { id: 'e2', text: 'Excellent use of primary sources. Your analysis demonstrates sophisticated critical thinking.' },
    { id: 'e3', text: 'Strong organization — each paragraph builds logically on the last.' },
    { id: 'e4', text: 'Your writing voice is confident and engaging. A genuine pleasure to read.' },
  ],
  improvement: [
    { id: 'i1', text: 'Consider strengthening your thesis statement to make your central argument more specific and defensible.' },
    { id: 'i2', text: 'Each claim needs supporting evidence. Aim to cite at least one source per body paragraph.' },
    { id: 'i3', text: 'Work on transitions between paragraphs to improve the overall flow and cohesion of your argument.' },
    { id: 'i4', text: 'Proofread carefully — there are several grammatical errors that distract from your otherwise strong ideas.' },
    { id: 'i5', text: 'Your conclusion should synthesize your argument rather than simply restating the introduction.' },
  ],
  writing: [
    { id: 'w1', text: 'Avoid passive voice where possible — active constructions are more direct and persuasive.' },
    { id: 'w2', text: 'Use strong topic sentences to clearly signal what each paragraph will discuss.' },
    { id: 'w3', text: 'Vary your sentence length and structure to create a more engaging, dynamic read.' },
  ],
  assignment: [
    { id: 'a1', text: 'Be sure to address all three cellular processes outlined in the prompt — the third is missing here.' },
    { id: 'a2', text: 'The assignment required comparison of at least two peer-reviewed sources. Please revise to include a second source.' },
    { id: 'a3', text: 'Remember to include the required section on evolutionary implications in your final draft.' },
  ],
  ai_suggested: [
    { id: 'ai1', text: 'Your thesis directly addresses the prompt with a clear, arguable claim. This sets a strong foundation for the rest of your essay.' },
    { id: 'ai2', text: 'The endosymbiotic theory section would benefit from at least one additional primary source to strengthen your claim.' },
    { id: 'ai3', text: 'Your evidence integration is a highlight of this paper — you consistently explain how each source supports your argument rather than simply citing it.' },
    { id: 'ai4', text: 'Consider revising your conclusion to extend your argument to broader biological implications, rather than restating your opening.' },
  ],
}

export const COMMENT_FOLDERS = [
  { id: 'all',          label: 'All Comments',        ai: false },
  { id: 'encouragement',label: 'Encouragement',        ai: false },
  { id: 'improvement',  label: 'Improvement',          ai: false },
  { id: 'writing',      label: 'Writing Style',        ai: false },
  { id: 'assignment',   label: 'Assignment-Specific',  ai: false },
  { id: 'ai_suggested', label: '✦ AI Suggested',       ai: true  },
] as const

// ── Rubric store ───────────────────────────────────────────────────────────────

const _rubricStore = new Map<string, Record<string, number>>()

export function getRubricState(studentId: string, aIdx: number): Record<string, number> | undefined {
  return _rubricStore.get(_key(studentId, aIdx))
}

export function setRubricState(studentId: string, aIdx: number, state: Record<string, number>): void {
  _rubricStore.set(_key(studentId, aIdx), state)
}
