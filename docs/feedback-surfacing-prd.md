# PRD — Making Student Feedback Actionable

**Status:** Draft
**Owner:** Michelle Trame
**Target:** Prototypes in `instui-sandbox-mtrame` for the three ideas below

---

## Problem

Teachers invest substantial time in giving feedback — assignment comments, rubric ratings/comments, and DocViewer annotations — but students often engage only with their grade and skip the feedback. Instructor observations are supported by student research. Canvas today reinforces the pattern: on every surface, the grade is visually dominant and feedback lives behind additional clicks. Teachers also have no way to see whether students have engaged with feedback (beyond a single timestamp on DocViewer annotations).

## Current State

Public sources: Canvas Community guides, `github.com/instructure/canvas-lms`, Instructure product blog.

### Three feedback types and their origin

| Type | Origin | Student-side destination |
|---|---|---|
| Submission / assignment comments | SpeedGrader comment panel | Grades page icon → Submission Details sidebar |
| Rubric ratings + criterion comments | SpeedGrader rubric assessment | Rubric assessment view (collapsed by default in Grades page) |
| DocViewer annotations | SpeedGrader inline annotation | "View Feedback" click → DocViewer |

### Student-side surfaces (clicks-from-login and grade prominence)

- **Grades page** (1 click): grade dominates the row; comment icon is a small secondary affordance; blue dot indicates unread.
- **Submission Details** (2 clicks): comment sidebar; annotations require an additional "View Feedback" click into DocViewer.
- **Assignment Enhancements page** (GA June 2024): feedback sidebar opens by default when feedback exists — better, but still grade-first.
- **Mobile apps** (iOS/Android): comments/rubric visible from submission detail; annotations open in DocViewer.
- **Notification emails**: "Submission Comment" notification includes comment text; "Grading" notification announces grade posting (grade value optional). Rubric ratings and annotations have no dedicated notification templates.

### Teacher-side engagement signals today

- **DocViewer annotations only:** SpeedGrader shows a timestamp of when the student opened the annotated file.
- **No view tracking** for submission comments or rubric comments — long-standing community request (Idea 413695).
- Course-level access logs exist but are not feedback-specific.

### Recent Instructure work in-flight

- **Assignment Enhancements** (GA June 2024) — student-side redesign, feedback sidebar by default.
- **Enhanced Rubrics** (opt-in Jan 2025) — future phases include student self-assessment.
- **IgniteAI** (Dec 2025) — AI Rubric Generator, LLM-Enabled Assignment (conversational feedback loop).

---

## Goals

- Increase the % of students who view all feedback teachers leave, per assignment.
- Increase the % of *feedback items* viewed (individual comments, criteria, annotations) — not just "opened the page."
- Give teachers signal about which students have and haven't engaged.
- Do the above without adding mandatory workflow burden for teachers who don't opt in.

## Non-Goals

- Building AI-generated feedback (adjacent to IgniteAI; out of scope for these prototypes).
- Redesigning SpeedGrader (input surface, not output).
- Changing notification channel behavior (email/push delivery).

---

## Idea 1 — Surface feedback more prominently

**Goal:** Reduce friction from "grade appears, feedback is hidden" to "feedback appears alongside the grade."

**Scope**
- **Grades page:** expand rubric assessment inline by default when feedback exists; add comment preview snippet to the row (not just an icon).
- **Submission Details / Assignment Enhancements page:** feedback content above the fold; grade in the sidebar; annotations get an inline preview strip.
- **Notification emails:** preview rubric feedback and annotation count; don't just say "your grade for X has been posted."

**Behavior settings**
- Always-on for all students. No teacher toggle. This is a default UX improvement.

**Prototype targets in this sandbox**
- Student Grades page (row treatment with inline feedback preview)
- Student Assignment Details (feedback-first layout)
- Notification email variant (mocked)

**Acceptance criteria**
- Grade is not the largest visual element on the page when feedback exists.
- All three feedback types are visible or previewed within 1 click of the Grades page.
- Screen reader users can access feedback via the same one-click path.

---

## Idea 2 — Gate the grade behind feedback engagement (opt-in)

**Goal:** For students who need a stronger nudge, require them to view feedback before the numeric grade is revealed.

**Scope**
- Grade appears **obscured** on the Grades page and Assignment Details until the student has viewed each feedback item at least once (e.g., "•• / 100" or "See feedback to reveal").
- "Viewed" is tracked *per feedback item*, not per page: student must scroll through comments, open annotations, expand each rubric criterion.
- After engagement threshold met, grade auto-reveals; state persists per-student per-assignment.

**Settings surfaces**
- **Course level:** teacher toggle in Gradebook Settings → Student View (extends the toggle already added).
- **Assignment level:** override per assignment (default = follow course setting).
- **Off by default.** Teachers opt in per class or per assignment.
- Compatible with Idea 1 (works with the improved surfacing).

**Prototype targets in this sandbox**
- Student Grades page in "gated" state (grade blurred)
- Student Assignment Details walkthrough: scroll through comment thread → expand rubric → open annotation → grade reveals
- Teacher settings toggle in Gradebook Settings / Assignment

**Acceptance criteria**
- Student cannot bypass to grade via direct URL or notification.
- Teacher can preview the gated student experience from the assignment.
- Reveal animation is subtle and celebratory, not punitive.
- Screen reader path announces "hidden until feedback reviewed" — must not silently block screen reader users from accessing their grade if they explicitly request it.

**Open concerns**
- Adverse behavior: skimming to unlock (still net-positive vs today, but flag for research).
- Accessibility: obscuring content has WCAG implications; verify with accessibility partner.

---

## Idea 3 — Feedback view signals + teacher nudges *(proposed)*

**Goal:** Give teachers the visibility they don't have today — who has engaged with feedback, who hasn't — and give them a lightweight action to close the loop without hard-gating the grade.

**Why this rather than other candidates**
- Directly addresses a documented, unmet teacher need (community Idea 413695: "Check if students have viewed feedback").
- Complements Idea 1 (surfacing) and Idea 2 (gating): if surfacing alone isn't enough and the class isn't gated, teachers still have a lever.
- Doesn't require gating to work — lighter-touch alternative when gating isn't appropriate (e.g., graduate courses, accommodations).
- Purely additive to student experience; no new blocker for students.

**Scope**

*Teacher side*
- **Feedback engagement column** in Gradebook (per-assignment): shows viewed / partially-viewed / unviewed per student, per feedback type.
- **Cell drill-down**: click a cell to see exactly which feedback items the student has and hasn't seen (comment 1: viewed 3:12 pm; rubric criterion 2: not viewed; annotation 4: not viewed).
- **Nudge action**: teacher can send a targeted "you have feedback to review" reminder to specific students or a batch (via Canvas Inbox or a lightweight in-app notification).
- **Auto-nudge policy** (optional): after N days without engagement, send a nudge automatically.
- SpeedGrader's existing annotation view-timestamp extends naturally into this dashboard.

*Student side*
- No new UI in the base case; feedback surfaces stay as-is (or as improved by Idea 1).
- If nudged, student receives a notification with a deep-link straight to the unviewed feedback item — not just the assignment page.

**Settings surfaces**
- **Course level:** on/off toggle for view tracking (in Gradebook Settings → Student View).
- **Off by default** (privacy; opt-in disclosure to students that engagement is tracked).
- **Auto-nudge** is opt-in per course, off by default.

**Prototype targets in this sandbox**
- Gradebook column: engagement badge/tag per cell.
- Cell drill-down modal: per-item view state.
- Nudge action UI: select students → compose reminder → send.
- Student-side deep-link recipient: notification → land on the exact feedback item, scrolled and highlighted.

**Acceptance criteria**
- Teacher can identify unengaged students in ≤ 2 clicks from the gradebook.
- Nudges are one-tap; no long-form composition required.
- View tracking is transparent to students (disclosed at course opt-in and in privacy copy).

**Open concerns**
- **Privacy:** view tracking is opt-in per course, but student awareness matters — surface a "your engagement is being tracked" notice.
- **Signal quality:** what counts as "viewed"? Recommend explicit interaction (expand, scroll-into-view for ≥3s, click-to-open) rather than page-render.
- **Batch nudge could feel spammy** — cap frequency (max once per assignment per student).

---

## How the three ideas interact

| Combination | Result |
|---|---|
| Idea 1 only | Baseline: feedback is easier to find; passive students still skip it |
| Idea 1 + 2 | Feedback is prominent AND students must engage to see grade |
| Idea 1 + 3 | Feedback is prominent AND teachers see who still ignored it |
| Idea 1 + 2 + 3 | All-in: prominent + gated + teacher visibility |
| Idea 3 alone | Weakest — teachers see the problem but feedback is still buried |

Idea 1 is effectively a **prerequisite** for the others to feel worth building. Ideas 2 and 3 are **independent** and can be enabled together or separately at course/assignment level.

## Success metrics

- **Primary:** % of feedback items viewed per assignment (across the three types), pre/post.
- **Secondary:** time from grade posting to first feedback view; % of students with 100% feedback coverage; teacher-reported satisfaction with "did students see this."
- **Guardrail:** no drop in grade page usage; no rise in support tickets about "can't see my grade."

## Prototype build order (this sandbox)

Working backward from most-derisked to most-speculative:

1. **Idea 1** — student Grades page + Assignment Details with feedback-forward layout (2 screens)
2. **Idea 2** — gated-grade state on same screens; teacher settings toggle (2 screens + 1 settings row)
3. **Idea 3** — gradebook engagement column + drill-down + nudge composer (3 screens)

**Existing sandbox pieces to reuse:** the gradebook MVP (`/gradebook-mvp`), the workspace/SpeedGrader (`/gradebook-workspace-mvp`), the settings tray (`GradebookSettingsTray`), the comment library tray.

## Open questions

- What's the smallest meaningful "viewed" event? (scroll-into-view vs click vs dwell time)
- For Idea 2, how do we handle students with accommodations (extended time, screen readers, cognitive load considerations)?
- For Idea 3, do we surface view tracking to students proactively, or only in privacy language?
- Do rubric ratings *without* comments count as "feedback" — or only comments/annotations?
- Notifications: is deep-linking to a specific feedback item feasible with the current notification pipeline?

## Sources

- Canvas Student Guide — assignment comments: <https://community.instructure.com/t5/Student-Guide/How-do-I-view-assignment-comments-from-my-instructor/ta-p/283>
- Canvas KB — DocViewer annotations: <https://community.instructure.com/en/kb/articles/661231>
- Assignment Enhancements student guide: <https://community.instructure.com/t5/Student-Guide/How-do-I-view-assignment-feedback-from-my-instructor-using/ta-p/474046>
- Canvas Community Idea — "Check if students have viewed feedback" (Idea 413695): <https://community.instructure.com/t5/Idea-Conversations/Check-if-students-have-viewed-feedback/idi-p/413695>
- Canvas Community Idea — "Making feedback more visible to students" (Idea 359146): <https://community.instructure.com/t5/Canvas-Ideas/Making-feedback-more-visible-to-students/idi-p/359146>
- Assignment Enhancements release notes: <https://community.canvaslms.com/t5/Assignment-Enhancements-Users/ta-p/258986>
- Enhanced Rubrics product overview: <https://www.instructure.com/resources/product-overviews/enhanced-rubrics>
- IgniteAI announcement: <https://www.instructure.com/press-release/instructure-delivers-safe-simple-ai-promise-igniteai-and-major-ecosystem-updates>
