import { CanvasPage } from '../../templates/CanvasPage'

type Props = { isDark: boolean; onToggleTheme: () => void }

export default function CanvasPagePrototype({ isDark, onToggleTheme }: Props) {
  return <CanvasPage isDark={isDark} onToggleTheme={onToggleTheme} />
}
