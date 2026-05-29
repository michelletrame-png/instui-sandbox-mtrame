import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet, type FrameCtx } from '../../components/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { detailsEmpty } from './frames/details-empty'
import { detailsFilled } from './frames/details-filled'

const frameSources = import.meta.glob('./frames/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export default function CreateAssignmentSpec(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx: FrameCtx = { sharedTokens }

  return (
    <SpecSheet
      title="Create Assignment — Spec"
      description="Spec sheet for the five-step Create coursework flow. Each tab is documented as a section with key state variants. Click 'InstUI Source' on any board for the production-clean frame code; 'UX Copy' extracts the strings for writer review."
      basePath="src/designs/create-assignment-spec"
      frameSources={frameSources}
      sections={[
        {
          title: 'Details',
          description: 'Step 1 of 5 — the teacher names the coursework, picks a type, and writes the instructions. This is the entry point of the flow.',
          boards: [
            {
              width: 1440,
              height: 900,
              caption: 'Empty state',
              notes: 'First view a teacher sees on entering the flow. Title defaults to "Untitled coursework". Coursework type defaults to Assignment (the only V1 option). Instructions placeholder visible. Top bar shows a "Draft saved" badge from the auto-save mechanism.',
              content: detailsEmpty(ctx),
              frame: 'details-empty',
            },
            {
              width: 1440,
              height: 900,
              caption: 'Filled in',
              notes: 'After the teacher has named the coursework and drafted instructions. Title input shows the entered value; the RCE body shows formatted content. Used to verify spacing, type scale, and content overflow at realistic content density.',
              content: detailsFilled(ctx),
              frame: 'details-filled',
            },
          ],
        },
        {
          title: 'Grading',
          description: 'Step 2 of 5 — points, grading rules, rubric activation toggle, and grade visibility settings. (Frames pending.)',
          boards: [
            {
              width: 1440,
              height: 900,
              caption: 'Default — rubric off',
              notes: 'Default state with rubric not yet activated. Manual points entry visible. Coming next.',
            },
            {
              width: 1440,
              height: 900,
              caption: 'Rubric on',
              notes: 'After the teacher activates a rubric in the Rubric tab — manual points entry is replaced by a derived total. Coming next.',
            },
          ],
        },
        {
          title: 'Rubric',
          description: 'Step 3 of 5 — landing page with three setup paths (create new, use existing, skip), plus the rubric builder itself. (Frames pending.)',
          boards: [
            {
              width: 1440,
              height: 900,
              caption: 'Landing — choose path',
              notes: 'Three options: build a new rubric, attach an existing rubric, or skip rubric for this assignment. Coming next.',
            },
            {
              width: 1440,
              height: 900,
              caption: 'Rubric builder with criteria',
              notes: 'Active rubric editor with two or more criteria added. Shows the rubric preview alongside the editor. Coming next.',
            },
          ],
        },
        {
          title: 'Assign',
          description: 'Step 4 of 5 — who gets the assignment, when it\'s due, and the available-from / available-until window. Supports differentiated assignments for sections, groups, or individual students. (Frames pending.)',
          boards: [
            {
              width: 1440,
              height: 900,
              caption: 'Single assignee — Everyone',
              notes: 'Default state: one assignment row, "Everyone" selected, due date and availability window empty. Coming next.',
            },
            {
              width: 1440,
              height: 900,
              caption: 'Multiple assignment groups',
              notes: 'Differentiated dates: a second row added for a specific section with its own due and availability dates. Coming next.',
            },
          ],
        },
        {
          title: 'Publish',
          description: 'Step 5 of 5 — review summary and publish or save as draft. (Frames pending.)',
          boards: [
            {
              width: 1440,
              height: 900,
              caption: 'Ready to publish',
              notes: 'Review summary with all earlier-tab decisions reflected. Publish button active. Coming next.',
            },
            {
              width: 1440,
              height: 900,
              caption: 'Published confirmation',
              notes: 'Success state after publish — assignment now appears in the course modules list. Coming next.',
            },
          ],
        },
      ]}
    />
  )
}
