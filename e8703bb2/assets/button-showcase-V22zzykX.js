import{G as e,T as t,U as n,t as r}from"./v2-C9oVrVvN.js";import{t as i}from"./useComputedTheme-BEikr0mC.js";import{n as a,t as o}from"./v2-mL5pBMnh.js";import{n as s}from"./v2-CtT4FRw2.js";import{SpecSheet as c}from"./SpecSheet-DYbGc_J3.js";var l=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

const SIZES = [
  { size: 'small', label: 'small' },
  { size: 'medium', label: 'medium (default)' },
  { size: 'large', label: 'large' },
] as const

export function sizesFrame({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="medium"
    >
      <Flex direction="column" gap="medium" alignItems="start">
        {SIZES.map(({ size, label }) => (
          <Flex key={size} gap="medium" alignItems="center">
            <View as="div" display="block" minWidth="140px">
              <Text size="small" color="secondary">{label}</Text>
            </View>
            <Button color="primary" size={size}>Button</Button>
            <Button color="primary" size={size} withBackground={false}>Ghost</Button>
          </Flex>
        ))}
      </Flex>
    </View>
  )
}
`,u=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

const COLORS = ['primary', 'secondary', 'success', 'danger'] as const
const VARIANTS = [
  { withBackground: true, label: 'Filled' },
  { withBackground: false, label: 'Ghost' },
] as const

export function variantsFrame({ sharedTokens }: FrameCtx): React.ReactNode {
  function row(color: (typeof COLORS)[number]) {
    return (
      <Flex gap="small" alignItems="center">
        <View as="div" display="block" minWidth="88px">
          <Text size="small" color="secondary">{color}</Text>
        </View>
        {VARIANTS.map(v => (
          <Button key={v.label} color={color} withBackground={v.withBackground}>
            {v.label}
          </Button>
        ))}
      </Flex>
    )
  }

  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="medium"
    >
      <Flex direction="column" gap="medium">
        <Flex gap="small" alignItems="center">
          <View as="div" display="block" minWidth="88px" />
          {VARIANTS.map(v => (
            <Text key={v.label} size="small" color="secondary" weight="bold">{v.label}</Text>
          ))}
        </Flex>
        {COLORS.map(c => <React.Fragment key={c}>{row(c)}</React.Fragment>)}
      </Flex>
    </View>
  )
}
`,d=e(n(),1),f=e(t(),1),p=[`primary`,`secondary`,`success`,`danger`],m=[{withBackground:!0,label:`Filled`},{withBackground:!1,label:`Ghost`}];function h({sharedTokens:e}){function t(e){return(0,f.jsxs)(o,{gap:`small`,alignItems:`center`,children:[(0,f.jsx)(r,{as:`div`,display:`block`,minWidth:`88px`,children:(0,f.jsx)(a,{size:`small`,color:`secondary`,children:e})}),m.map(t=>(0,f.jsx)(s,{color:e,withBackground:t.withBackground,children:t.label},t.label))]})}return(0,f.jsx)(r,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`medium`,children:(0,f.jsxs)(o,{direction:`column`,gap:`medium`,children:[(0,f.jsxs)(o,{gap:`small`,alignItems:`center`,children:[(0,f.jsx)(r,{as:`div`,display:`block`,minWidth:`88px`}),m.map(e=>(0,f.jsx)(a,{size:`small`,color:`secondary`,weight:`bold`,children:e.label},e.label))]}),p.map(e=>(0,f.jsx)(d.Fragment,{children:t(e)},e))]})})}var g=[{size:`small`,label:`small`},{size:`medium`,label:`medium (default)`},{size:`large`,label:`large`}];function _({sharedTokens:e}){return(0,f.jsx)(r,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`medium`,children:(0,f.jsx)(o,{direction:`column`,gap:`medium`,alignItems:`start`,children:g.map(({size:e,label:t})=>(0,f.jsxs)(o,{gap:`medium`,alignItems:`center`,children:[(0,f.jsx)(r,{as:`div`,display:`block`,minWidth:`140px`,children:(0,f.jsx)(a,{size:`small`,color:`secondary`,children:t})}),(0,f.jsx)(s,{color:`primary`,size:e,children:`Button`}),(0,f.jsx)(s,{color:`primary`,size:e,withBackground:!1,children:`Ghost`})]},e))})})}var v=Object.assign({"./frames/sizes.tsx":l,"./frames/variants.tsx":u});function y(e){let{sharedTokens:t}=i(),n={sharedTokens:t};return(0,f.jsx)(c,{title:`Button Showcase`,description:`Visual reference for InstUI Button colors, variants, and sizes.`,basePath:`src/references/button-showcase`,frameSources:v,sections:[{title:`Colors & Variants`,description:`All color + variant combinations at medium size.`,boards:[{width:600,caption:`All variants`,content:h(n),frame:`variants`}]},{title:`Sizes`,description:`Size progression with filled and ghost variants.`,boards:[{width:600,caption:`Size comparison`,content:_(n),frame:`sizes`}]}]})}export{y as default};