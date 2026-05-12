# semantics.color Reference

Full token tables for `useComputedTheme().semantics.color`.

Reach for `semantics` when you need text colors, icon colors, or interactive-state colors that `sharedTokens` doesn't expose. The most common cases are content on brand/AI/colored surfaces — use `onColor` tokens for those.

```tsx
const { semantics } = useComputedTheme()
```

---

## `semantics.color.text`

| Path | Use for |
|---|---|
| `semantics.color.text.base` | Default body text |
| `semantics.color.text.muted` | Secondary / subdued text |
| `semantics.color.text.inverse` | Text on dark/brand surfaces — white in all themes |
| `semantics.color.text.onColor` | Text on colored surfaces — white in all themes |
| `semantics.color.text.aiColor` | AI-themed accent text |

For text on standard surfaces, use `Text`'s `color` prop directly (`"primary"`, `"secondary"`) — no token needed.

For on-color text in InstUI `Text` / `Heading` components, use `color="primary-inverse"`:

```tsx
<Text color="primary-inverse">Title on dark background</Text>
```

---

## `semantics.color.icon`

| Path | Use for |
|---|---|
| `semantics.color.icon.base` | Default icon color |
| `semantics.color.icon.muted` | Muted/subdued icon |
| `semantics.color.icon.inverse` | Icon on dark/brand surfaces — white |
| `semantics.color.icon.onColor` | Icon on colored surfaces — white in all themes |

**Critical:** `*InstUIIcon` icons do not inherit CSS color from a parent element. Pass `color` as a prop directly:

```tsx
// Correct — prop on the icon component
<IgniteaiLogoInstUIIcon color="onColor" size="sm" />

// Wrong — CSS color on a parent is ignored
<span style={{ color: semantics.color.icon.onColor }}><IgniteaiLogoInstUIIcon /></span>
```

For `IconButton` / `Button` on a colored surface, override via `themeOverride`:

```tsx
<IconButton
  color="secondary"
  withBackground={false}
  withBorder={false}
  renderIcon={<XInstUIIcon />}
  themeOverride={{
    secondaryColor: semantics.color.icon.onColor,
    secondaryHoverBackground: semantics.color.icon.onColor,
  } as object}
/>
```

---

## Structure file

For the full `semantics` shape (all groups: `dropShadow`, `size`, `spacing`, `borderRadius`, `borderWidth`, `fontFamily`, `fontWeight`, `lineHeight`, `fontSize`, `opacity`):

`node_modules/@instructure/ui-themes/types/themes/newThemeTokens/light/semantics.d.ts` (732 lines)
