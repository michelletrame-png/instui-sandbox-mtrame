# Responsive Patterns & DrawerLayout

---

## Responsive Component

Package: `@instructure/ui-responsive`
Import: `import { Responsive } from '@instructure/ui'`

`Responsive` lets you swap any set of props based on container or viewport width. It uses **ResizeObserver** internally — it responds to element width, not just window width, making it safe for components embedded in panels or iframes.

### API

```tsx
<Responsive
  query={{
    [breakpointName]: { minWidth?: string, maxWidth?: string }
  }}
  props={{
    [breakpointName]: { [propName]: value }
  }}
  render={(matchedProps, matches) => ReactNode}
  // OR:
  children={(matchedProps, matches) => ReactNode}
/>
```

- `matches` is an array of matching breakpoint names (multiple can match simultaneously)
- `matchedProps` is the merged result of all matching breakpoint props

### Breakpoint Naming Convention

Prefer semantic names that describe layout behavior rather than device type. Device-specific names (`mobile`, `tablet`, `desktop`) are acceptable for simple cases but can become misleading as layouts evolve.

```tsx
// ✅ Preferred — semantic names describe layout intent
query={{
  compact: { maxWidth: '600px' },
  regular: { minWidth: '601px', maxWidth: '960px' },
  wide:    { minWidth: '961px' }
}}

// ✅ Also acceptable — familiar shorthand for straightforward layouts
query={{
  mobile:  { maxWidth: '767px' },
  tablet:  { minWidth: '768px', maxWidth: '991px' },
  desktop: { minWidth: '992px' }
}}
```

### Example: Responsive Stack/Row

```tsx
<Responsive
  query={{
    compact: { maxWidth: '640px' },
    expanded: { minWidth: '641px' }
  }}
  props={{
    compact:  { direction: 'column', gap: 'small', padding: 'small' },
    expanded: { direction: 'row',    gap: 'medium', padding: 'medium' }
  }}
  render={(props) => (
    <Flex
      direction={props.direction}
      gap={props.gap}
      padding={props.padding}
    >
      <Flex.Item shouldGrow><MainContent /></Flex.Item>
      <Flex.Item size="280px"><Sidebar /></Flex.Item>
    </Flex>
  )}
/>
```

### Example: Responsive Grid Columns

```tsx
<Grid>
  <Grid.Row>
    <Responsive
      query={{
        stacked: { maxWidth: '767px' },
        side_by_side: { minWidth: '768px' }
      }}
      render={(props, matches) => (
        <>
          <Grid.Col width={matches.includes('stacked') ? 12 : 8}>
            <MainContent />
          </Grid.Col>
          {!matches.includes('stacked') && (
            <Grid.Col width={4}>
              <Aside />
            </Grid.Col>
          )}
        </>
      )}
    />
  </Grid.Row>
</Grid>
```

---

## DrawerLayout

Package: `@instructure/ui-drawer-layout`
Import: `import { DrawerLayout } from '@instructure/ui'`

`DrawerLayout` manages a side-tray + main-content layout with built-in overflow/overlay behavior. The tray can be pinned (pushes content) or overlaid.

### Basic Structure

```tsx
<DrawerLayout
  onOverlayTrayChange={(isOverlaying) => {
    // fires when tray transitions between push and overlay modes
    setSidebarIsOverlaying(isOverlaying)
  }}
>
  <DrawerLayout.Tray
    id="nav-tray"
    open={navOpen}
    placement="start"          // "start" (left in LTR) | "end" (right in LTR)
    label="Navigation Sidebar" // accessible label
    onDismiss={() => setNavOpen(false)}
  >
    <View as="nav" padding="medium" width="15rem" height="100%">
      {navContent}
    </View>
  </DrawerLayout.Tray>

  <DrawerLayout.Content
    label="Main Content"
    onClick={() => {
      // Close overlay tray when content is clicked (UX best practice)
      if (sidebarIsOverlaying) setNavOpen(false)
    }}
  >
    <View as="div" padding="large">
      {mainContent}
    </View>
  </DrawerLayout.Content>
</DrawerLayout>
```

### DrawerLayout.Tray Props

| Prop | Type | Notes |
|---|---|---|
| `open` | boolean | Controls visibility |
| `placement` | `"start" \| "end"` | Side of the layout |
| `label` | string | **Required** for accessibility |
| `onDismiss` | function | Called on overlay dismissal (clicking outside) |
| `shouldOverlayTray` | boolean | Force overlay mode regardless of width |
| `contentRef` | callback ref | |

### Full-Page Sidebar Pattern

```tsx
function AppLayout({ children }) {
  const [open, setOpen] = useState(true)
  const [isOverlaying, setIsOverlaying] = useState(false)

  return (
    <View as="div" height="100vh" display="flex" direction="column">
      {/* Top bar */}
      <View as="header" background="primary-inverse" padding="0 medium">
        <Flex height="3.5rem" alignItems="center" gap="small">
          <Flex.Item>
            <IconButton
              screenReaderLabel="Toggle navigation"
              onClick={() => setOpen(o => !o)}
            >
              <IconHamburgerSolid />
            </IconButton>
          </Flex.Item>
          <Flex.Item shouldGrow>
            <Text color="primary-inverse" weight="bold">App Name</Text>
          </Flex.Item>
        </Flex>
      </View>

      {/* DrawerLayout fills remaining height */}
      <View as="div" shouldGrow overflowY="hidden">
        <DrawerLayout onOverlayTrayChange={setIsOverlaying}>
          <DrawerLayout.Tray
            id="main-nav"
            open={open}
            placement="start"
            label="Main navigation"
            onDismiss={() => setOpen(false)}
          >
            <View as="nav" width="16rem" height="100%" padding="medium"
                  background="secondary" overflowY="auto">
              {navItems}
            </View>
          </DrawerLayout.Tray>

          <DrawerLayout.Content
            label="Page content"
            onClick={() => { if (isOverlaying) setOpen(false) }}
          >
            <View as="main" padding="large" overflowY="auto" height="100%">
              {children}
            </View>
          </DrawerLayout.Content>
        </DrawerLayout>
      </View>
    </View>
  )
}
```

---

## Responsive Design Checklist

- [ ] Does the layout use `Responsive` or `Grid.Col width={{…}}` for breakpoints?
- [ ] Are spacing tokens consistent (no raw pixel values)?
- [ ] Does the sidebar use `DrawerLayout` if it needs to collapse on small screens?
- [ ] Is text content constrained with `maxWidth` on wide screens?
- [ ] Is touch target size adequate (min 44px height for interactive elements)?
- [ ] Does `Flex` use `wrap="wrap"` where items should reflowing instead of overflow?
