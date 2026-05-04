import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet } from '../../templates/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { agentWelcome, agentWelcomeCode } from './frames/welcome'
import { agentChatFlow, agentChatFlowCode } from './frames/chat-flow'
import { agentConversationHistory, agentConversationHistoryCode } from './frames/conversation-history'
import { agentApprovals, agentApprovalsCode } from './frames/approvals'
import {
  agentLoadingCourse, agentLoadingCourseCode,
  agentLoadingModules, agentLoadingModulesCode,
  agentReasonedCollapsed, agentReasonedCollapsedCode,
  agentReasonedExpanded, agentReasonedExpandedCode,
} from './frames/response-loading'

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
      ]}
    />
  )
}
