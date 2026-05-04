import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet } from '../../templates/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { desktopAgentClosed, desktopAgentClosedCode, desktopAgentClosedCopy } from './frames/desktop-agent-closed'
import { desktopAgentOpen, desktopAgentOpenCode } from './frames/desktop-agent-open'
import { desktopChatHistory } from './frames/desktop-chat-history'
import { desktopChatResponse } from './frames/desktop-chat-response'
import { mobileAgentClosed } from './frames/mobile-agent-closed'
import { mobileAgentOpen } from './frames/mobile-agent-open'
import { mobileChatHistory } from './frames/mobile-chat-history'
import { mobileChatResponse } from './frames/mobile-chat-response'
export default function AgentScreens(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx = { sharedTokens }

  return (
    <SpecSheet
      title="Agent Screens"
      description="Customer journey: opening the IgniteAI agent, browsing chat history, and sending a message."
      sections={[
        {
          title: 'Desktop',
          description: 'Full browser at 1280×800',
          boards: [
            {
              width: 1440, height: 800, caption: 'Agent Closed',
              notes: 'User visits the course page. The IgniteAI button is visible in the page header.',
              content: desktopAgentClosed(ctx),
              code: desktopAgentClosedCode,
              copy: desktopAgentClosedCopy,
            },
            {
              width: 1440, height: 800, caption: 'Agent Open',
              notes: 'User opens the agent. Welcome screen greets them by name with suggested actions.',
              content: desktopAgentOpen(ctx),
              code: desktopAgentOpenCode,
            },
            {
              width: 1440, height: 800, caption: 'Chat History',
              notes: 'User taps the history icon to browse previous conversations.',
              content: desktopChatHistory(ctx),
            },
            {
              width: 1440, height: 800, caption: 'Chat Response',
              notes: 'Agent responds to the prompt with a structured answer and follow-up suggestions.',
              content: desktopChatResponse(ctx),
            },
          ],
        },
        {
          title: 'Mobile',
          description: 'Mobile viewport at 390×844',
          boards: [
            {
              width: 390, height: 835, caption: 'Agent Closed',
              notes: 'User is on the mobile dashboard. The IgniteAI button appears in the top bar.',
              content: mobileAgentClosed(ctx),
            },
            {
              width: 390, height: 835, caption: 'Agent Open',
              notes: 'Tapping the button opens the agent as a full-screen overlay.',
              content: mobileAgentOpen(ctx),
            },
            {
              width: 390, height: 835, caption: 'Chat History',
              notes: 'User navigates to their conversation history from within the agent.',
              content: mobileChatHistory(ctx),
            },
            {
              width: 390, height: 835, caption: 'Chat Response',
              notes: 'Agent responds inline. Follow-up prompts appear below the answer.',
              content: mobileChatResponse(ctx),
            },
          ],
        },
      ]}
    />
  )
}
