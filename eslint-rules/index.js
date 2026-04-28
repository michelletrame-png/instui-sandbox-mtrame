// Local ESLint plugin for InstUI-specific rules.
//
// To add a new rule:
//   1. Create eslint-rules/rules/your-rule-name.js
//   2. Import it here and add it to the rules object
//   3. Add 'instui/your-rule-name': 'warn' in eslint.config.js

import noHardcodedHex from './rules/no-hardcoded-hex.js'
import noHardcodedBorderRadius from './rules/no-hardcoded-border-radius.js'
import noThemeNameDetection from './rules/no-theme-name-detection.js'
import noStyleColor from './rules/no-style-color.js'
import noStyleBorder from './rules/no-style-border.js'
import noPrimitivesAccess from './rules/no-primitives-access.js'
import noRawDivLayout from './rules/no-raw-div-layout.js'
import noPixelSpacing from './rules/no-pixel-spacing.js'
import flexItemShadowClip from './rules/flex-item-shadow-clip.js'
import noFlexItemWithoutBehavior from './rules/no-flex-item-without-behavior.js'
import viewBackgroundNeedsOverride from './rules/view-background-needs-override.js'
import buttonTextMaxWords from './rules/button-text-max-words.js'

export default {
  rules: {
    'no-hardcoded-hex': noHardcodedHex,
    'no-hardcoded-border-radius': noHardcodedBorderRadius,
    'no-theme-name-detection': noThemeNameDetection,
    'no-style-color': noStyleColor,
    'no-style-border': noStyleBorder,
    'no-primitives-access': noPrimitivesAccess,
    'no-raw-div-layout': noRawDivLayout,
    'no-pixel-spacing': noPixelSpacing,
    'flex-item-shadow-clip': flexItemShadowClip,
    'no-flex-item-without-behavior': noFlexItemWithoutBehavior,
    'view-background-needs-override': viewBackgroundNeedsOverride,
    'button-text-max-words': buttonTextMaxWords,
  },
}
