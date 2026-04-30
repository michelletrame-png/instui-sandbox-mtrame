# Responsive Layout Patterns

## Grid Breakpoints

`Grid` has a built-in 12-column responsive system. `startAt` controls the minimum breakpoint at which columns lay out side-by-side — below that breakpoint, all columns stack to full width.

| `startAt` value | Approx. min-width | Use when… |
|---|---|---|
| `'small'` | ~480px (30em) | Stack only on very small screens |
| `'medium'` | ~768px (48em) | Tablet breakpoint (most common) |
| `'large'` | ~992px (62em) | Desktop breakpoint |
| `'x-large'` | ~1200px (75em) | Wide screens only |
| `null` | Never stacks | Always show columns regardless of viewport |

---

## Responsive Column Widths

`Grid.Col` `width` and `offset` accept a responsive object instead of a single number:

```tsx
<Grid.Col width={{ small: 12, medium: 6, large: 4, xLarge: 3 }}>
```

- `small`, `medium`, `large`, `xLarge` keys match the breakpoint tokens
- Values are column counts (1–12) or `'auto'`
- Unspecified breakpoints inherit from smaller sizes

### Common column patterns

| Layout | `width` value |
|---|---|
| Full-width (all sizes) | `12` |
| Half-width from medium | `{ small: 12, medium: 6 }` |
| Third-width from medium | `{ small: 12, medium: 4 }` |
| Quarter-width from large | `{ small: 12, medium: 6, large: 3 }` |
| Two-thirds / one-third sidebar | `{ small: 12, medium: 8 }` + `{ small: 12, medium: 4 }` |

---

## Full Responsive Examples

### 3-column card grid → 1 column on mobile

```tsx
<Grid startAt="medium" colSpacing="medium" rowSpacing="medium">
  <Grid.Row>
    {cards.map((card, i) => (
      <Grid.Col key={i} width={{ small: 12, medium: 4 }}>
        <Card {...card} />
      </Grid.Col>
    ))}
  </Grid.Row>
</Grid>
```

### Sidebar layout → stacked on mobile

```tsx
<Grid startAt="large" colSpacing="large">
  <Grid.Row>
    <Grid.Col width={{ small: 12, large: 3 }}>
      <Sidebar />
    </Grid.Col>
    <Grid.Col width={{ small: 12, large: 9 }}>
      <MainContent />
    </Grid.Col>
  </Grid.Row>
</Grid>
```

### Two-column form → full width on small screens

```tsx
<Grid startAt="medium" colSpacing="medium">
  <Grid.Row>
    <Grid.Col width={{ small: 12, medium: 6 }}>
      <FormField label="First Name" />
    </Grid.Col>
    <Grid.Col width={{ small: 12, medium: 6 }}>
      <FormField label="Last Name" />
    </Grid.Col>
  </Grid.Row>
  <Grid.Row isLastRow>
    <Grid.Col width={12}>
      <FormField label="Email" />
    </Grid.Col>
  </Grid.Row>
</Grid>
```

---

## Flex Responsive Patterns

`Flex` does not have built-in breakpoint props — use CSS media queries via `style` or conditional rendering for responsive `Flex` layouts.

For most "stacks on mobile" needs, `Grid` with `startAt` is simpler than `Flex` + media queries.

### Conditional direction (React state + resize observer)

```tsx
const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

<Flex
  direction={isMobile ? 'column' : 'row'}
  gap="medium"
  alignItems={isMobile ? 'stretch' : 'center'}
>
  <Flex.Item size={isMobile ? undefined : '300px'}>
    <Sidebar />
  </Flex.Item>
  <Flex.Item shouldGrow shouldShrink>
    <Content />
  </Flex.Item>
</Flex>
```

### Wrapping flex grid (equal-width tiles that wrap)

```tsx
<Flex wrap="wrap" gap="medium">
  {items.map(item => (
    <Flex.Item key={item.id} size="280px" shouldShrink>
      <Tile {...item} />
    </Flex.Item>
  ))}
</Flex>
```

---

## When to Use Grid vs Flex for Responsive Layouts

| Scenario | Use |
|---|---|
| Explicit 12-column grid with breakpoint stacking | `Grid` with `startAt` |
| Simple two-pane layout (sidebar + content) | `Flex` if always side-by-side, `Grid` if it should stack |
| Equal-width tile grid | `Flex wrap="wrap"` with fixed `size` on items |
| Asymmetric column ratios that change at breakpoints | `Grid` with responsive `width` objects |
| Single-axis alignment (centering, space-between) | `Flex` |
