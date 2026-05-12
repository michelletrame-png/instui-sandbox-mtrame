---
name: instui-get-icons
description: >
  Finds the right InstUI icon for a use case. Invoke when the user asks for an icon
  by purpose or name — "what icon should I use for settings", "is there a download icon",
  "find me a calendar icon", "what's the icon for AI". Searches the installed icon
  package and returns matching component names ready to import and use.
---

# Get Icon

## The icon system

All icons use the `*InstUIIcon` naming convention. There are two sets:

| Set | Naming | Source | When to use |
|---|---|---|---|
| **Lucide** | `{Name}InstUIIcon` | `types/generated/lucide/index.d.ts` | General UI icons — actions, navigation, content |
| **Custom** | `{Name}InstUIIcon` | `types/generated/custom/index.d.ts` | Canvas/Instructure product icons, education-specific icons |

Import from `@instructure/ui-icons`:

```tsx
import { CalendarDaysInstUIIcon, IgniteaiLogoInstUIIcon } from '@instructure/ui-icons'
```

---

## How to find an icon

### Step 1 — Search the Lucide set

```
node_modules/@instructure/ui-icons/types/generated/lucide/index.d.ts
```

Use Grep with a keyword. Examples:

```
pattern: "CalendarInstUIIcon"   → finds CalendarInstUIIcon, CalendarDaysInstUIIcon, CalendarCheckInstUIIcon, etc.
pattern: "SettingsInstUIIcon"   → finds SettingsInstUIIcon, Settings2InstUIIcon
pattern: "DownloadInstUIIcon"   → finds DownloadInstUIIcon, DownloadCloudInstUIIcon
```

Tip: search the base noun without suffixes — `"Calendar"`, `"Upload"`, `"User"` — then pick the best match.

### Step 2 — Search the custom set if Lucide doesn't have it

```
node_modules/@instructure/ui-icons/types/generated/custom/index.d.ts
```

This file is small enough to read in full. Custom icons include:
- Canvas product logos: `CanvasLogoInstUIIcon`, `MasteryLogoInstUIIcon`, `ElevateLogoInstUIIcon`, `StudioInstUIIcon`
- AI/product: `IgniteaiLogoInstUIIcon`, `SearchAiInstUIIcon`, `AiInfoInstUIIcon`
- Canvas-specific: `SpeedGraderInstUIIcon`, `CommonsInstUIIcon`, `PostSisInstUIIcon`, `SquaresBlueprintInstUIIcon`
- Education tools: `ProtractorInstUIIcon`, `CalculatorDesmosInstUIIcon`, `LineReaderInstUIIcon`
- Instructure branding: `InstructureLogoInstUIIcon`, `InstructureInstUIIcon`

---

## Props

All `*InstUIIcon` components accept `InstUIIconProps`:

| Prop | Type | Notes |
|---|---|---|
| `size` | `'x-small' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | Default: `medium` |
| `color` | `'primary' \| 'secondary' \| 'brand' \| 'success' \| 'warning' \| 'error' \| 'alert' \| 'onColor' \| 'inverseColor'` | Default: inherits from parent |
| `title` | `string` | Adds accessible SVG title |
| `desc` | `string` | Adds accessible SVG description |
| `focusable` | `boolean` | Default: `false` |

**Color notes:**
- Omit `color` by default — icons inherit from the parent container's text color
- Use `color="onColor"` when the icon sits on a colored/gradient background (e.g. AI gradient header)
- Use `color="inverseColor"` when the icon sits on a brand or selected-state surface

---

## Lucide preview links

For icons from the Lucide set, generate a lucide.dev preview link so the user can see what the icon looks like.

Convert the component name to a kebab-case slug:
1. Strip the `InstUIIcon` suffix
2. Convert PascalCase to kebab-case

Examples:
- `CalendarDaysInstUIIcon` → `calendar-days` → https://lucide.dev/icons/calendar-days
- `BookOpenInstUIIcon` → `book-open` → https://lucide.dev/icons/book-open
- `GraduationCapInstUIIcon` → `graduation-cap` → https://lucide.dev/icons/graduation-cap

Custom icons don't have Lucide equivalents — omit the link for those.

---

## Output format

Return results as a table, then a usage example. Lucide icons get a preview link; custom icons don't.

### Lucide results

| Icon | Preview | Best for |
|---|---|---|
| `CalendarInstUIIcon` | [calendar](https://lucide.dev/icons/calendar) | Generic date context |
| `CalendarDaysInstUIIcon` | [calendar-days](https://lucide.dev/icons/calendar-days) | Date pickers, schedules ← recommended |
| `CalendarCheckInstUIIcon` | [calendar-check](https://lucide.dev/icons/calendar-check) | Confirmed/completed dates |
| `CalendarClockInstUIIcon` | [calendar-clock](https://lucide.dev/icons/calendar-clock) | Timed events, deadlines |

### Custom results (Canvas-specific)

| Icon | Best for |
|---|---|
| `SpeedGraderInstUIIcon` | SpeedGrader entry point |

### Usage

```tsx
import { CalendarDaysInstUIIcon } from '@instructure/ui-icons'

<CalendarDaysInstUIIcon size="small" />
<IconButton renderIcon={<CalendarDaysInstUIIcon />} screenReaderLabel="Open calendar" />
```

If the user's keyword finds nothing, try alternate terms (e.g. "download" → try "arrow down", "save", "export").
