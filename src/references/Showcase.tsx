import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useComputedTheme } from '@instructure/emotion'
// Import v2 (rebrand) components via /latest entry point
import { View } from '@instructure/ui-view/latest'
import { Text } from '@instructure/ui-text/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Link } from '@instructure/ui-link/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { FileDrop } from '@instructure/ui-file-drop/latest'
import { ToggleDetails } from '@instructure/ui-toggle-details/latest'
import { RadioInput, RadioInputGroup } from '@instructure/ui-radio-input/latest'
import { NumberInput } from '@instructure/ui-number-input/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { RangeInput } from '@instructure/ui-range-input/latest'
import { Pagination } from '@instructure/ui-pagination/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { Badge } from '@instructure/ui-badge/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import {
  ChevronRightInstUIIcon,
  Share2InstUIIcon,
  UploadInstUIIcon,
  CircleUserInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  ClockInstUIIcon,
  PlusInstUIIcon,
  CircleHelpInstUIIcon,
  SettingsInstUIIcon,
} from '@instructure/ui-icons'

type ShowcaseProps = {
  themeName: string
  themeNames: string[]
  onThemeChange: (name: string) => void
}

export function Showcase({ themeName, themeNames, onThemeChange }: ShowcaseProps) {
  const [numberVal, setNumberVal] = useState(0)
  const { sharedTokens } = useComputedTheme()
  const strokeMuted = sharedTokens.stroke.mutedColor
  const cardRadius = sharedTokens.borderRadius.card.md

  return (
    <View
      as="div"
      padding="large"
      minHeight="100vh"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
    >

      {/* Header */}
      <Flex justifyItems="space-between" alignItems="start" margin="0 0 large 0">
        <Flex.Item shouldShrink>
          <Link as={RouterLink} to="/" margin="0 0 small 0" display="block">← Back</Link>
          <Heading level="h1" margin="0 0 small 0">Theme showcase</Heading>
          <Text color="secondary" size="large">
            Here, you can view all the available themes in one place.
          </Text>
        </Flex.Item>
        <SimpleSelect
            renderLabel=""
            value={themeName}
            onChange={(_e, { value }) => onThemeChange(value as string)}
            width="15rem"
          >
            {themeNames.map((name) => (
              <SimpleSelect.Option key={name} id={name} value={name}>
                {name}
              </SimpleSelect.Option>
            ))}
          </SimpleSelect>
      </Flex>

      {/* 3 Column Layout */}
      <Flex gap="large" alignItems="start">

        {/* Side Navbar */}
        <Flex.Item shouldShrink={false}>
          <SideNavBar label="Navigation" toggleLabel={{ expandedLabel: "Minimize Navigation", minimizedLabel: "Expand Navigation" }}>
            <SideNavBar.Item icon={<CircleUserInstUIIcon />} label="Account" href="#" />
            <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" selected />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<ClockInstUIIcon />} label="History" href="#" />
            <SideNavBar.Item icon={<PlusInstUIIcon />} label="Custom" href="#" />
            <SideNavBar.Item icon={<PlusInstUIIcon />} label="Custom" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
          </SideNavBar>
        </Flex.Item>

        {/* Column 1 */}
        <Flex.Item shouldGrow shouldShrink>
          <Flex direction="column" gap="large">

            {/* Card: Create Account */}
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

            {/* Card: Settings */}
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

            {/* Card: File Upload */}
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

            {/* Card: Login */}
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

            {/* Card: Panda Card */}
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

            {/* Card: FAQ */}
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
                <Pagination
                  variant="compact"
                  labelNext="Next"
                  labelPrev="Previous"
                >
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

            {/* Card: Switch Themes (Radio) */}
            <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="medium">
              <Flex direction="column" gap="small">
                <Heading level="h3">Switch themes</Heading>
                <Text color="secondary" size="small">
                  You can switch themes in the prototype here!
                </Text>
                <RadioInputGroup name="theme" defaultValue={themeNames[0]} value={themeName} onChange={(_e, value) => onThemeChange(value)} description="">
                  {themeNames.map((name) => (
                    <RadioInput key={name} label={name} value={name} />
                  ))}
                </RadioInputGroup>
              </Flex>
            </View>

            {/* Card: Switch Themes (Inputs) */}
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

            {/* Card: Users */}
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

            {/* Card: Spinner */}
            <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} shadow="resting" borderRadius={cardRadius} padding="large" textAlign="center">
              <Spinner renderTitle="Loading" size="large" />
            </View>
          </Flex>
        </Flex.Item>
      </Flex>

      {/* Footer */}
      <View as="div" textAlign="center" padding="large" margin="large 0 0 0" borderWidth="small 0 0 0">
        <Text size="small">Made with ❤️ by <Text weight="bold">InstUI.</Text></Text>
      </View>
    </View>
  )
}
