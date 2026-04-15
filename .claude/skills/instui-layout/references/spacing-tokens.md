# InstUI Spacing Tokens

All spacing props (`margin`, `padding`, `gap`, `colSpacing`, `rowSpacing`) accept these named tokens.

## Token Values

| Token | Value |
|---|---|
| `0` | 0 |
| `none` | 0 (alias) |
| `xxx-small` | 0.125rem (2px) |
| `xx-small` | 0.25rem (4px) |
| `x-small` | 0.5rem (8px) |
| `small` | 0.75rem (12px) |
| `medium` | 1rem (16px) |
| `large` | 1.5rem (24px) |
| `x-large` | 2rem (32px) |
| `xx-large` | 2.5rem (40px) |
| `auto` | `auto` (margins only) |

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
padding="medium"                    // all sides 1rem
padding="small medium"              // top+bottom 0.75rem, left+right 1rem
padding="0 medium small"            // top 0, sides 1rem, bottom 0.75rem
padding="small 0 small 0"          // top 0.75rem, right 0, bottom 0.75rem, left 0
margin="0 auto"                     // vertically 0, horizontally centered
margin="large auto small"           // top 1.5rem, auto sides, bottom 0.75rem
```

## Component-specific notes

- `Flex gap` takes a **single token only** — not shorthand (gap is one-dimensional).
- `Grid colSpacing` / `rowSpacing` take only `'none' | 'small' | 'medium' | 'large'` — not the full token set.
- `Grid.Col width` and `offset` take **column counts (1–12)**, not spacing tokens.
