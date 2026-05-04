import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet } from '../../templates/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { agentWelcome, agentWelcomeCode } from './frames/welcome'
import { agentChatFlow, agentChatFlowCode } from './frames/chat-flow'
import { agentConversationHistory, agentConversationHistoryCode } from './frames/conversation-history'
import { agentApprovals, agentApprovalsCode } from './frames/approvals'
import { approvalStep1DraftRequest } from './frames/approval-step1-draft-request'
import { approvalStep2DraftProposed } from './frames/approval-step2-draft-proposed'
import { approvalStep3Rejected } from './frames/approval-step3-rejected'
import { approvalStep3bRevisionRequest } from './frames/approval-step3b-revision-request'
import { approvalStep4Revised } from './frames/approval-step4-revised'
import { approvalStep5Approved } from './frames/approval-step5-approved'
import { approvalStep6Confirmed } from './frames/approval-step6-confirmed'
import { agentErrorBasic, agentErrorBasicCode } from './frames/error-basic'
import { agentErrorTryAgain, agentErrorTryAgainCode } from './frames/error-try-again'
import { agentErrorNewChat, agentErrorNewChatCode } from './frames/error-new-chat'
import { agentErrorGuardrails, agentErrorGuardrailsCode } from './frames/error-guardrails'
import { agentErrorFatal, agentErrorFatalCode } from './frames/error-fatal'
import { agentLoadingCourse, agentLoadingCourseCode } from './frames/response-loading-course'
import { agentLoadingModules, agentLoadingModulesCode } from './frames/response-loading-modules'
import { agentReasonedCollapsed, agentReasonedCollapsedCode } from './frames/response-reasoned-collapsed'
import { agentReasonedExpanded, agentReasonedExpandedCode } from './frames/response-reasoned-expanded'

export default function AgentPatterns(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx = { sharedTokens }

  return (
    <SpecSheet
      title="Agent Patterns"
      description="The IgniteAI agent window across its core states and interaction patterns."
      sections={[
        {
          title: 'Agent Screens',
          description: 'Various states of the agent window — welcome, active conversation, history, and approvals.',
          boards: [
            {
              width: 420,
              height: 900,
              caption: 'Welcome',
              notes: 'First screen when the agent opens. Greets the user by name, offers Get Started shortcuts and example prompts.',
              content: agentWelcome(ctx),
              code: agentWelcomeCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Chat Flow',
              notes: 'Active conversation state. Shows the user message, agent response with thinking indicator, feedback actions, and follow-up suggestions.',
              content: agentChatFlow(ctx),
              code: agentChatFlowCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Conversation History',
              notes: 'History view, reached via the history icon in the header. Conversations grouped by date with overflow actions per entry.',
              content: agentConversationHistory(ctx),
              code: agentConversationHistoryCode,
            },
            {
              width: 420,
              height: 1100,
              caption: 'Approvals',
              notes: 'Agent has drafted a message and is requesting user approval before sending. Shows the drafted content, recipients plan, and approve/reject actions.',
              content: agentApprovals(ctx),
              code: agentApprovalsCode,
            },
          ],
        },
        {
          title: 'Agent Response Loading',
          description: 'The loading and reasoning states during an active agent response — from in-progress task indicators through to the expanded thinking panel.',
          boards: [
            {
              width: 420,
              height: 900,
              caption: 'Loading: Reviewing course',
              notes: 'Agent is actively reading course data. Shows a spinner with the current task and the resource name below.',
              content: agentLoadingCourse(ctx),
              code: agentLoadingCourseCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Loading: Reviewing modules',
              notes: 'Variant without a resource subtitle — task label only.',
              content: agentLoadingModules(ctx),
              code: agentLoadingModulesCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Reasoned: Collapsed',
              notes: 'Agent has finished reasoning. The thinking summary is collapsed — tap the chevron to expand.',
              content: agentReasonedCollapsed(ctx),
              code: agentReasonedCollapsedCode,
              playable: true,
            },
            {
              width: 420,
              height: 900,
              caption: 'Reasoned: Expanded',
              notes: 'Thinking panel expanded, showing the reasoning summary, tools called, and source links alongside the response.',
              content: agentReasonedExpanded(ctx),
              code: agentReasonedExpandedCode,
            },
          ],
        },
        {
          title: 'Error Handling',
          description: 'Agent error states — from temporary interruptions and guardrail blocks to unrecoverable failures.',
          boards: [
            {
              width: 420,
              height: 900,
              caption: 'Basic error',
              notes: 'Generic error when the request can\'t be completed. No action button — the user can rephrase or simplify in the input.',
              content: agentErrorBasic(ctx),
              code: agentErrorBasicCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Try again',
              notes: 'Temporary interruption (e.g. network issue). Conversation is intact — a Try again button lets the user retry without rephrasing.',
              content: agentErrorTryAgain(ctx),
              code: agentErrorTryAgainCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Start new chat',
              notes: 'The conversation state is unrecoverable. Send is disabled — the only path forward is starting a fresh chat.',
              content: agentErrorNewChat(ctx),
              code: agentErrorNewChatCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Guardrails triggered',
              notes: 'Request blocked by safety policy. Warning styling (not error) — the user isn\'t in trouble, just redirected.',
              content: agentErrorGuardrails(ctx),
              code: agentErrorGuardrailsCode,
            },
            {
              width: 420,
              height: 900,
              caption: 'Fatal error',
              notes: 'Standalone failure with no conversation context — agent can\'t load at all. No input area.',
              content: agentErrorFatal(ctx),
              code: agentErrorFatalCode,
            },
          ],
        },
        {
          title: 'Approval Flow',
          description: 'Step-by-step walkthrough of an agent-initiated approval — from the user\'s draft request through rejection, revision, and final approval.',
          boards: [
            {
              width: 420,
              height: 900,
              caption: 'Draft requested',
              notes: 'User asks the agent to draft a late-work reminder message.',
              content: approvalStep1DraftRequest(ctx),
            },
            {
              width: 420,
              height: 1100,
              caption: 'Draft proposed',
              notes: 'Agent responds with the drafted message, recipient plan, and Approve / Reject actions.',
              content: approvalStep2DraftProposed(ctx),
            },
            {
              width: 420,
              height: 1200,
              caption: 'Rejected + revision',
              notes: 'User rejects the plan. A warning alert replaces the action buttons. User follows up with a revision request.',
              content: approvalStep3Rejected(ctx),
            },
            {
              width: 420,
              height: 900,
              caption: 'Revision request',
              notes: 'User sends a follow-up asking to add the December 15th deadline.',
              content: approvalStep3bRevisionRequest(ctx),
            },
            {
              width: 420,
              height: 1100,
              caption: 'Revised draft',
              notes: 'Agent incorporates the December 15th deadline and re-presents the draft for approval.',
              content: approvalStep4Revised(ctx),
            },
            {
              width: 420,
              height: 1150,
              caption: 'Approved',
              notes: 'User approves. A success alert confirms the message was sent.',
              content: approvalStep5Approved(ctx),
            },
            {
              width: 420,
              height: 900,
              caption: 'Confirmed',
              notes: 'Agent confirms the message was sent and invites the next action.',
              content: approvalStep6Confirmed(ctx),
            },
          ],
        },
      ]}
    />
  )
}
