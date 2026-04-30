# InstUI Spacing Tokens

All spacing props (`margin`, `padding`, `gap`, `colSpacing`, `rowSpacing`) accept these named tokens.

## Token Values

Sourced from `@instructure/ui-themes/tokens/canvas/source.json` — `newTheme.spacing`.

| Token | Value | Notes |
|---|---|---|
| `0` / `none` | 0 | — |
| `xxx-small` | 0.125rem (2px) | — |
| `xx-small` | 0.375rem (6px) | — |
| `x-small` | 0.5rem (8px) | — |
| `small` | 0.75rem (12px) | — |
| `mediumSmall` | 1rem (16px) | Between small and medium — use it, don't skip |
| `medium` | 1.5rem (24px) | — |
| `large` | 2.25rem (36px) | — |
| `x-large` | 3rem (48px) | — |
| `xx-large` | 3.75rem (60px) | — |
| `auto` | `auto` | Margins only |

## Shorthand Syntax

`margin` and `padding` on `View` and `Flex`/`Flex.Item` accept CSS-style shorthand using token names:

```
"<all>"                       → all four sides
"<top+bottom> <left+right>"   → two-value
"<top> <left+right> <bottom>" → three-value
"<top> <right> <bottom> <left>" → four-value
```

### Examples

```tsx
padding="medium"                         // all sides 1.5rem
padding="small medium"                   // top+bottom 0.75rem, left+right 1.5rem
padding="mediumSmall medium"             // top+bottom 1rem, left+right 1.5rem
padding="0 mediumSmall small"            // top 0, sides 1rem, bottom 0.75rem
padding="small 0 small 0"               // top 0.75rem, right 0, bottom 0.75rem, left 0
margin="0 auto"                          // vertically 0, horizontally centered
margin="large auto small"                // top 2.25rem, auto sides, bottom 0.75rem
```

## Component-specific notes

- `Flex gap` takes a **single token only** — not shorthand (gap is one-dimensional).
- `Grid colSpacing` / `rowSpacing` take only `'none' | 'small' | 'medium' | 'large'` — not the full token set.
- `Grid.Col width` and `offset` take **column counts (1–12)**, not spacing tokens.
