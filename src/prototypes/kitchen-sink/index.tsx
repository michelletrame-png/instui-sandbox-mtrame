import { useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { canvas, canvasHighContrast, dark, light } from '@instructure/ui-themes'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CondensedButton, IconButton } from '@instructure/ui-buttons/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { RadioInput, RadioInputGroup } from '@instructure/ui-radio-input/latest'
import { NumberInput } from '@instructure/ui-number-input/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { Badge } from '@instructure/ui-badge/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import { Link } from '@instructure/ui-link/latest'
import { FileDrop } from '@instructure/ui-file-drop/latest'
import { ToggleDetails } from '@instructure/ui-toggle-details/latest'
import { RangeInput } from '@instructure/ui-range-input/latest'
import { Pagination } from '@instructure/ui-pagination/latest'
import {
  CuboidInstUIIcon,
  PlusInstUIIcon,
  DownloadInstUIIcon,
  Trash2InstUIIcon,
  CheckInstUIIcon,
  SparklesInstUIIcon,
  Wand2InstUIIcon,
  SearchInstUIIcon,
  PencilInstUIIcon,
  EyeInstUIIcon,
  LockInstUIIcon,
  BellInstUIIcon,
  StarInstUIIcon,
  CopyInstUIIcon,
  SendInstUIIcon,
  LayoutDashboardInstUIIcon,
  ChevronRightInstUIIcon,
  Share2InstUIIcon,
  UploadInstUIIcon,
} from '@instructure/ui-icons'
import { Sidebar } from './Sidebar'
import type { NavItem } from './Sidebar'

type Props = { isDark: boolean; onToggleTheme: () => void }
type CategoryId = 'showcase' | 'buttons' | 'inputs' | 'selection' | 'feedback'

const THEMES = {
  light: { label: 'Light', theme: light },
  canvas: { label: 'Canvas', theme: canvas },
  dark: { label: 'Dark', theme: dark },
  canvasHighContrast: { label: 'High Contrast', theme: canvasHighContrast },
} as const
type ThemeKey = keyof typeof THEMES

type Section = {
  title: string
  description: string
  content: React.ReactNode
}

function Card({ title, description, content }: Section) {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.lg}
      shadow="resting"
      padding="medium"
      display="block"
    >
      <Flex direction="column" gap="small">
        <Heading level="h2" variant="titleCardLarge" margin="0">{title}</Heading>
        <Text color="secondary" size="content">{description}</Text>
        <View as="div" display="block" margin="x-small 0 0 0">
          {content}
        </View>
      </Flex>
    </View>
  )
}

const CATEGORIES: { id: CategoryId; label: string; icon: React.ReactNode }[] = [
  { id: 'showcase',  label: 'Showcase',  icon: <LayoutDashboardInstUIIcon /> },
  { id: 'buttons',   label: 'Buttons',   icon: <CuboidInstUIIcon /> },
  { id: 'inputs',    label: 'Inputs',    icon: <CuboidInstUIIcon /> },
  { id: 'selection', label: 'Selection', icon: <CuboidInstUIIcon /> },
  { id: 'feedback',  label: 'Feedback',  icon: <CuboidInstUIIcon /> },
]

function ShowcaseContent({ themeKey, setThemeKey }: { themeKey: ThemeKey; setThemeKey: (k: ThemeKey) => void }) {
  const [numberVal, setNumberVal] = useState(0)
  const { sharedTokens } = useComputedTheme()
  const cardRadius = sharedTokens.borderRadius.card.md
  const strokeMuted = sharedTokens.stroke.mutedColor
  const themeNames = Object.keys(THEMES) as ThemeKey[]

  return (
    <Flex gap="large" alignItems="start">

      {/* Column 1 */}
      <Flex.Item shouldGrow shouldShrink>
        <Flex direction="column" gap="large">

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">Create an account</Heading>
              <Text color="secondary" size="small">
                Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque tellus morbi.
              </Text>
              <TextInput renderLabel="Full name" />
              <TextInput renderLabel="E-mail address" />
              <TextInput
                renderLabel="Password"
                type="password"
                messages={[{ text: 'Password must be at least 8 characters long.', type: 'hint' }]}
              />
              <TextInput renderLabel="Re-enter password" type="password" />
              <Checkbox label="Accept terms and conditions" value="terms" />
              <Checkbox label="Accept privacy policy" value="privacy" defaultChecked />
              <Button color="primary" display="block">Register</Button>
              <Button color="secondary" display="block">Back</Button>
              <Text size="small">Already have an account? <Link href="#">Login</Link></Text>
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">Settings</Heading>
              <Text color="secondary" size="small">
                Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque tellus morbi.
              </Text>
              <Checkbox label="Enable Dictation" value="dictation" variant="toggle" defaultChecked />
              <Checkbox label="Auto-Punctuation" value="autopunc" variant="toggle" defaultChecked />
              <Checkbox label="Stickers" value="stickers" variant="toggle" />
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">File upload</Heading>
              <Text color="secondary" size="small">
                Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque tellus morbi.
              </Text>
              <FileDrop
                renderLabel={
                  <View as="div" padding="x-large" textAlign="center">
                    <View as="div" margin="0 0 small 0">
                      <UploadInstUIIcon size="large" />
                    </View>
                    <Text weight="bold" as="div">Drop files here to add them to module</Text>
                    <Text color="brand" size="small">Drag and drop, or click to browse your computer</Text>
                  </View>
                }
              />
            </Flex>
          </View>
        </Flex>
      </Flex.Item>

      {/* Column 2 */}
      <Flex.Item shouldGrow shouldShrink>
        <Flex direction="column" gap="large">

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">Login</Heading>
              <Text color="secondary" size="small">
                Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque tellus morbi.
              </Text>
              <TextInput renderLabel="E-mail address" />
              <TextInput renderLabel="Password" type="password" />
              <Button color="primary" display="block">Login</Button>
              <Text size="small">Don't have an account? <Link href="#">Register now!</Link></Text>
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <div style={{ borderRadius: sharedTokens.borderRadius.card.nestedContainer.sm, overflow: 'hidden', border: `1px solid ${strokeMuted}` }}>
                <img src="/Panda.png" alt="Panda" style={{ width: '105%', height: 220, objectFit: 'cover', display: 'block', marginLeft: '-2.5%' }} />
              </div>
              <Heading level="h3" margin="x-small 0 0 0">Card title</Heading>
              <Flex gap="x-small" wrap="wrap">
                <Pill color="info">Status</Pill>
                <Pill color="info">Status</Pill>
                <Pill color="error" statusLabel="Label:">Status</Pill>
              </Flex>
              <Text color="secondary" size="small" as="div">
                Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque tellus morbi.
              </Text>
              <Flex gap="small">
                <Button color="primary">Show details</Button>
                <Button color="secondary" renderIcon={<Share2InstUIIcon />}>Share</Button>
              </Flex>
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">FAQ</Heading>
              <Text color="secondary" size="small">
                Lorem ipsum dolor sit amet posuere arcu mollis id scelerisque tellus morbi.
              </Text>
              <ToggleDetails summary="What do pandas eat?" variant="filled" />
              <ToggleDetails summary="Where do pandas reside?" variant="filled" />
              <ToggleDetails summary="How do pandas talk?" variant="filled" />
              <ToggleDetails summary="What defines panda bears?" variant="filled" />
              <Pagination variant="compact" labelNext="Next" labelPrev="Previous">
                <Pagination.Page current>1</Pagination.Page>
                <Pagination.Page>2</Pagination.Page>
              </Pagination>
            </Flex>
          </View>
        </Flex>
      </Flex.Item>

      {/* Column 3 */}
      <Flex.Item shouldGrow shouldShrink>
        <Flex direction="column" gap="large">

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">Switch themes</Heading>
              <Text color="secondary" size="small">
                You can switch themes in the prototype here!
              </Text>
              <RadioInputGroup
                name="sc-theme-radio"
                value={themeKey}
                onChange={(_e, value) => setThemeKey(value as ThemeKey)}
                description=""
              >
                {themeNames.map((name) => (
                  <RadioInput key={name} label={THEMES[name].label} value={name} />
                ))}
              </RadioInputGroup>
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">Switch themes</Heading>
              <Text color="secondary" size="small">
                You can switch themes in the prototype here!
              </Text>
              <TextInput renderLabel="Tag selector" />
              <NumberInput
                renderLabel="Number input"
                value={numberVal}
                onChange={(_e, val) => { if (typeof val === 'number') setNumberVal(val) }}
                onIncrement={() => setNumberVal(prev => Math.min(prev + 1, 99))}
                onDecrement={() => setNumberVal(prev => Math.max(prev - 1, 0))}
              />
              <RangeInput label="Range input" defaultValue={10} max={19} />
              <Button color="primary" display="block">Confirm</Button>
              <Button color="secondary" display="block">Back</Button>
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
            <Flex direction="column" gap="small">
              <Heading level="h3">Users</Heading>
              <Text color="secondary" size="small">
                You can switch themes in the prototype here!
              </Text>
              {[
                { name: 'Chuckles McFluffington', role: 'Bamboo Bouncer', badge: 12 },
                { name: 'Snickers Fuzzybottom', role: 'Cloud Chaser', badge: 0 },
                { name: 'Bamboozle Cuddlepaws', role: 'Rainforest Sneaker', badge: 0 },
                { name: 'Wobble Wigglesworth', role: 'Stream Shimmy Specialist', badge: 0 },
              ].map((user, i) => (
                <Flex key={i} gap="small" alignItems="center">
                  {user.badge > 0 ? (
                    <Badge count={user.badge} countUntil={100}>
                      <Avatar name={user.name} size="small" />
                    </Badge>
                  ) : (
                    <Avatar name={user.name} size="small" />
                  )}
                  <Flex.Item shouldGrow shouldShrink>
                    <Text weight="bold" size="small" as="div">{user.name}</Text>
                    <Text color="secondary" size="x-small" as="div">{user.role}</Text>
                  </Flex.Item>
                  <ChevronRightInstUIIcon />
                </Flex>
              ))}
              <Button color="secondary" display="block">Show all users</Button>
            </Flex>
          </View>

          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="large" textAlign="center">
            <Spinner renderTitle="Loading" size="large" />
          </View>
        </Flex>
      </Flex.Item>

    </Flex>
  )
}

function ButtonColors() {
  return (
    <Flex direction="column" gap="medium">
      <Flex gap="small" wrap="wrap" alignItems="center">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="danger">Danger</Button>
        <Button color="ai-primary">AI Primary</Button>
        <Button color="ai-secondary">AI Secondary</Button>
      </Flex>
      <View background="primary-inverse" padding="small medium" borderRadius="medium" display="block">
        <Button color="primary-inverse">Primary Inverse</Button>
      </View>
    </Flex>
  )
}

function ButtonSizes() {
  return (
    <Flex gap="small" wrap="wrap" alignItems="center">
      <Button color="primary" size="small">Small</Button>
      <Button color="primary" size="medium">Medium</Button>
      <Button color="primary" size="large">Large</Button>
    </Flex>
  )
}

function ButtonCondensed() {
  return (
    <Flex direction="column" gap="medium">
      <Flex gap="medium" wrap="wrap" alignItems="center">
        <CondensedButton color="primary">Primary</CondensedButton>
        <CondensedButton color="secondary">Secondary</CondensedButton>
        <View background="primary-inverse" padding="xx-small small" borderRadius="medium" display="inline-block">
          <CondensedButton color="primary-inverse">Primary Inverse</CondensedButton>
        </View>
      </Flex>
      <Flex gap="medium" wrap="wrap" alignItems="center">
        <CondensedButton color="primary" size="small">Small</CondensedButton>
        <CondensedButton color="primary" size="medium">Medium</CondensedButton>
        <CondensedButton color="primary" size="large">Large</CondensedButton>
        <CondensedButton color="primary" size="condensedSmall">Condensed Small</CondensedButton>
        <CondensedButton color="primary" size="condensedMedium">Condensed Medium</CondensedButton>
      </Flex>
      <Flex gap="medium" wrap="wrap" alignItems="center">
        <CondensedButton color="primary" renderIcon={<PlusInstUIIcon />}>Add Item</CondensedButton>
        <CondensedButton color="secondary" renderIcon={<DownloadInstUIIcon />}>Download</CondensedButton>
        <CondensedButton color="primary" interaction="disabled">Disabled</CondensedButton>
      </Flex>
    </Flex>
  )
}

function ButtonWithIcon() {
  return (
    <Flex direction="column" gap="small">
      <Flex gap="small" wrap="wrap" alignItems="center">
        <Button color="primary" renderIcon={<PlusInstUIIcon />}>Add Item</Button>
        <Button color="secondary" renderIcon={<DownloadInstUIIcon />}>Download</Button>
        <Button color="success" renderIcon={<SendInstUIIcon />}>Submit</Button>
        <Button color="danger" renderIcon={<Trash2InstUIIcon />}>Delete</Button>
      </Flex>
      <Button color="primary" renderIcon={<CheckInstUIIcon />} display="block">Full Width</Button>
    </Flex>
  )
}

function ButtonOutlined() {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.mutedColor }}
      borderRadius={sharedTokens.borderRadius.card.nestedContainer.md}
      padding="medium"
    >
      <Flex gap="small" wrap="wrap" alignItems="center">
        <Button color="primary" withBackground={false}>Primary</Button>
        <Button color="secondary" withBackground={false}>Secondary</Button>
        <Button color="success" withBackground={false}>Success</Button>
        <Button color="danger" withBackground={false}>Danger</Button>
      </Flex>
    </View>
  )
}

function ButtonStates() {
  return (
    <Flex gap="small" wrap="wrap" alignItems="center">
      <Button color="primary" interaction="enabled">Enabled</Button>
      <Button color="primary" interaction="disabled">Disabled</Button>
      <Button color="primary" interaction="readonly">Readonly</Button>
    </Flex>
  )
}

function IconButtonColors() {
  return (
    <Flex direction="column" gap="medium">
      <Flex gap="small" wrap="wrap" alignItems="center">
        <IconButton screenReaderLabel="Primary" color="primary" renderIcon={<StarInstUIIcon />} />
        <IconButton screenReaderLabel="Secondary" color="secondary" renderIcon={<BellInstUIIcon />} />
        <IconButton screenReaderLabel="Success" color="success" renderIcon={<CheckInstUIIcon />} />
        <IconButton screenReaderLabel="Danger" color="danger" renderIcon={<Trash2InstUIIcon />} />
        <IconButton screenReaderLabel="AI Primary" color="ai-primary" renderIcon={<SparklesInstUIIcon />} />
        <IconButton screenReaderLabel="AI Secondary" color="ai-secondary" renderIcon={<Wand2InstUIIcon />} />
      </Flex>
      <View background="primary-inverse" padding="small medium" borderRadius="medium" display="block">
        <IconButton screenReaderLabel="Primary Inverse" color="primary-inverse" renderIcon={<StarInstUIIcon />} />
      </View>
    </Flex>
  )
}

function IconButtonShapes() {
  return (
    <Flex direction="column" gap="medium">
      <Flex gap="small" alignItems="center">
        <IconButton screenReaderLabel="Rect small" color="primary" shape="rectangle" size="small" renderIcon={<SearchInstUIIcon />} />
        <IconButton screenReaderLabel="Rect medium" color="primary" shape="rectangle" size="medium" renderIcon={<SearchInstUIIcon />} />
        <IconButton screenReaderLabel="Rect large" color="primary" shape="rectangle" size="large" renderIcon={<SearchInstUIIcon />} />
        <IconButton screenReaderLabel="Rect condensed small" color="primary" shape="rectangle" size="condensedSmall" renderIcon={<SearchInstUIIcon />} />
        <IconButton screenReaderLabel="Rect condensed medium" color="primary" shape="rectangle" size="condensedMedium" renderIcon={<SearchInstUIIcon />} />
      </Flex>
      <Flex gap="small" alignItems="center">
        <IconButton screenReaderLabel="Circle small" color="secondary" shape="circle" size="small" renderIcon={<PencilInstUIIcon />} />
        <IconButton screenReaderLabel="Circle medium" color="secondary" shape="circle" size="medium" renderIcon={<PencilInstUIIcon />} />
        <IconButton screenReaderLabel="Circle large" color="secondary" shape="circle" size="large" renderIcon={<PencilInstUIIcon />} />
        <IconButton screenReaderLabel="Circle condensed small" color="secondary" shape="circle" size="condensedSmall" renderIcon={<PencilInstUIIcon />} />
        <IconButton screenReaderLabel="Circle condensed medium" color="secondary" shape="circle" size="condensedMedium" renderIcon={<PencilInstUIIcon />} />
      </Flex>
    </Flex>
  )
}

function IconButtonGhost() {
  return (
    <Flex gap="small" alignItems="center">
      <IconButton screenReaderLabel="No bg, no border" color="primary" withBackground={false} withBorder={false} renderIcon={<EyeInstUIIcon />} />
      <IconButton screenReaderLabel="No bg, with border" color="primary" withBackground={false} withBorder={true} renderIcon={<CopyInstUIIcon />} />
      <IconButton screenReaderLabel="Danger ghost" color="danger" withBackground={false} withBorder={false} renderIcon={<Trash2InstUIIcon />} />
      <IconButton screenReaderLabel="Success ghost bordered" color="success" withBackground={false} withBorder={true} renderIcon={<CheckInstUIIcon />} />
    </Flex>
  )
}

function IconButtonStates() {
  return (
    <Flex gap="small" alignItems="center">
      <IconButton screenReaderLabel="Enabled" color="primary" interaction="enabled" renderIcon={<LockInstUIIcon />} />
      <IconButton screenReaderLabel="Disabled" color="primary" interaction="disabled" renderIcon={<LockInstUIIcon />} />
      <IconButton screenReaderLabel="Readonly" color="primary" interaction="readonly" renderIcon={<LockInstUIIcon />} />
    </Flex>
  )
}

function TextInputSection() {
  return (
    <Flex direction="column" gap="small">
      <TextInput renderLabel="Default" placeholder="Enter text…" />
      <TextInput
        renderLabel="With hint"
        messages={[{ text: 'Must be at least 8 characters.', type: 'hint' }]}
      />
      <TextInput
        renderLabel="With error"
        messages={[{ text: 'This field is required.', type: 'error' }]}
      />
    </Flex>
  )
}

function NumberInputSection() {
  const [val, setVal] = useState(0)
  return (
    <NumberInput
      renderLabel="Quantity"
      value={val}
      onChange={(_e, v) => { if (typeof v === 'number') setVal(v) }}
      onIncrement={() => setVal(n => Math.min(n + 1, 99))}
      onDecrement={() => setVal(n => Math.max(n - 1, 0))}
    />
  )
}

function CheckboxSection() {
  return (
    <Flex direction="column" gap="small">
      <Checkbox label="Default checkbox" value="a" />
      <Checkbox label="Checked by default" value="b" defaultChecked />
      <Checkbox label="Toggle variant" value="c" variant="toggle" defaultChecked />
    </Flex>
  )
}

function RadioSection() {
  return (
    <RadioInputGroup name="ks-radio" defaultValue="a" description="Choose an option">
      <RadioInput label="Option A" value="a" />
      <RadioInput label="Option B" value="b" />
      <RadioInput label="Option C" value="c" />
    </RadioInputGroup>
  )
}

function PillSection() {
  return (
    <Flex gap="x-small" wrap="wrap">
      <Pill color="info">Info</Pill>
      <Pill color="success">Success</Pill>
      <Pill color="warning">Warning</Pill>
      <Pill color="error">Error</Pill>
      <Pill color="primary">Primary</Pill>
    </Flex>
  )
}

function BadgeSection() {
  return (
    <Flex gap="medium" alignItems="center">
      <Badge count={4}>
        <Avatar name="Alice Smith" size="small" />
      </Badge>
      <Badge count={99} countUntil={100}>
        <Avatar name="Bob Jones" size="small" />
      </Badge>
      <Badge count={0}>
        <Avatar name="Carol White" size="small" />
      </Badge>
    </Flex>
  )
}

function SpinnerSection() {
  return (
    <Flex gap="large" alignItems="center">
      <Spinner renderTitle="Loading" size="small" />
      <Spinner renderTitle="Loading" size="medium" />
      <Spinner renderTitle="Loading" size="large" />
    </Flex>
  )
}

const SECTIONS: Record<Exclude<CategoryId, 'showcase'>, Section[]> = {
  buttons: [
    { title: 'Button — Colors', description: 'All color intents including AI and inverse variants.', content: <ButtonColors /> },
    { title: 'Button — Sizes', description: 'Three standard sizes: small, medium, and large.', content: <ButtonSizes /> },
    { title: 'Condensed Button', description: 'Dedicated component for inline actions — always transparent, no border. Limited to primary, primary-inverse, and secondary colors.', content: <ButtonCondensed /> },
    { title: 'Button — With Icon', description: 'Buttons with a leading icon and a full-width block example.', content: <ButtonWithIcon /> },
    { title: 'Button — Outlined', description: 'withBackground={false} renders transparent fill with a visible border. No withBorder prop exists on Button — use CondensedButton for truly borderless labeled actions.', content: <ButtonOutlined /> },
    { title: 'Button — States', description: 'Enabled, disabled, and readonly interaction states.', content: <ButtonStates /> },
    { title: 'Icon Button — Colors', description: 'All color intents for icon-only actions.', content: <IconButtonColors /> },
    { title: 'Icon Button — Shapes & Sizes', description: 'Rectangle and circle shapes across all five sizes.', content: <IconButtonShapes /> },
    { title: 'Icon Button — Ghost', description: 'Transparent and border-only variants.', content: <IconButtonGhost /> },
    { title: 'Icon Button — States', description: 'Enabled, disabled, and readonly interaction states.', content: <IconButtonStates /> },
  ],
  inputs: [
    { title: 'Text Input', description: 'Single-line text entry with optional hint and error states.', content: <TextInputSection /> },
    { title: 'Number Input', description: 'Numeric entry with increment and decrement controls.', content: <NumberInputSection /> },
  ],
  selection: [
    { title: 'Checkbox', description: 'Binary on/off selection, also available as a toggle.', content: <CheckboxSection /> },
    { title: 'Radio Input', description: 'Single selection from a set of mutually exclusive options.', content: <RadioSection /> },
  ],
  feedback: [
    { title: 'Pill', description: 'Compact status and categorisation labels across all color intents.', content: <PillSection /> },
    { title: 'Badge', description: 'Tiny numeric indicator overlaid on a target element.', content: <BadgeSection /> },
    { title: 'Spinner', description: 'Loading indicator in three sizes.', content: <SpinnerSection /> },
  ],
}

export default function KitchenSink(_props: Props) {
  const [themeKey, setThemeKey] = useState<ThemeKey>('light')
  return (
    <InstUISettingsProvider theme={THEMES[themeKey].theme}>
      <KitchenSinkInner themeKey={themeKey} setThemeKey={setThemeKey} />
    </InstUISettingsProvider>
  )
}

function KitchenSinkInner({
  themeKey,
  setThemeKey,
}: {
  themeKey: ThemeKey
  setThemeKey: (k: ThemeKey) => void
}) {
  const [selected, setSelected] = useState<CategoryId>('showcase')
  const { sharedTokens } = useComputedTheme()
  const category = CATEGORIES.find(c => c.id === selected)!
  const isShowcase = selected === 'showcase'

  const navItems: NavItem[] = CATEGORIES.map(cat => ({
    id: cat.id,
    label: cat.label,
    icon: cat.icon,
    selected: selected === cat.id,
    onClick: () => setSelected(cat.id),
  }))

  return (
    <View
      as="div"
      height="100vh"
      overflowX="hidden"
      overflowY="hidden"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
      padding="small"
    >
      <Flex height="100%" width="100%" alignItems="stretch" gap="small">

        <Sidebar title="Component Library" items={navItems} />

        <Flex.Item shouldGrow shouldShrink overflowY="auto">
          <View
            as="div"
            maxWidth={isShowcase ? undefined : '900px'}
            display="block"
            margin="0 auto"
            width="100%"
            padding={isShowcase ? 'medium' : 'medium 0'}
          >
            <Flex direction="column" gap="medium">

              <Flex justifyItems="space-between" alignItems="center">
                <Heading level="h1" variant="titlePageDesktop" margin="0">
                  {category.label}
                </Heading>
                <SimpleSelect
                  renderLabel=""
                  value={themeKey}
                  size="small"
                  width="160px"
                  onChange={(_e, { value }) => setThemeKey(value as ThemeKey)}
                >
                  {(Object.keys(THEMES) as ThemeKey[]).map(key => (
                    <SimpleSelect.Option key={key} id={key} value={key}>
                      {THEMES[key].label}
                    </SimpleSelect.Option>
                  ))}
                </SimpleSelect>
              </Flex>

              {isShowcase ? (
                <ShowcaseContent themeKey={themeKey} setThemeKey={setThemeKey} />
              ) : (
                SECTIONS[selected as Exclude<CategoryId, 'showcase'>].map(section => (
                  <Card key={section.title} {...section} />
                ))
              )}

            </Flex>
          </View>
        </Flex.Item>

      </Flex>
    </View>
  )
}
