export type CopyKind = 'visible' | 'screen-reader' | 'form'

export type CopyEntry = {
  kind: CopyKind
  label: string
  text: string
}

// Extracts UX copy from the rendered DOM under `root`. Returns visible text,
// accessibility strings (aria-label, aria-describedby, alt, screen-reader-only
// content), and form metadata (placeholders, values). Authors can override the
// auto-generated label by adding `data-copy-label="..."` on the wrapping
// element, or skip an element entirely with `data-copy-skip`.
export function extractCopyFromDOM(root: HTMLElement): CopyEntry[] {
  const entries: CopyEntry[] = []
  const seen = new Set<string>()

  function push(entry: CopyEntry) {
    const trimmed = entry.text.trim()
    if (!trimmed) return
    const key = `${entry.kind}|${entry.label}|${trimmed}`
    if (seen.has(key)) return
    seen.add(key)
    entries.push({ ...entry, text: trimmed })
  }

  function isStructurallyHidden(el: Element): boolean {
    const cs = window.getComputedStyle(el)
    return cs.display === 'none' || cs.visibility === 'hidden'
  }

  // Visually-hidden pattern (used by InstUI's ScreenReaderContent and most
  // a11y libs): absolute-positioned, ~1px box, clipped. Available to screen
  // readers but not to sighted users.
  function isVisuallyHiddenPattern(el: Element): boolean {
    const cs = window.getComputedStyle(el)
    if (cs.position !== 'absolute') return false
    const w = parseFloat(cs.width)
    const h = parseFloat(cs.height)
    if (w <= 1 && h <= 1) return true
    const clip = cs.clip
    if (clip && clip.includes('rect(0')) return true
    return false
  }

  function describe(el: Element): string {
    const dataLabel = el.getAttribute('data-copy-label')
    if (dataLabel) return dataLabel
    const tag = el.tagName.toLowerCase()
    if (/^h[1-6]$/.test(tag)) return `Heading (${tag})`
    if (tag === 'button') return 'Button'
    if (tag === 'a') return 'Link'
    if (tag === 'img') return 'Image'
    if (tag === 'input') return 'Input'
    if (tag === 'textarea') return 'Textarea'
    if (tag === 'label') return 'Label'
    if (tag === 'p') return 'Paragraph'
    if (tag === 'li') return 'List item'
    const role = el.getAttribute('role')
    if (role === 'button') return 'Button'
    if (role === 'link') return 'Link'
    if (role === 'heading') return 'Heading'
    const ancestor = el.parentElement?.closest(
      'button, a, h1, h2, h3, h4, h5, h6, label, [role="button"], [role="link"], [role="heading"]',
    )
    if (ancestor) return describe(ancestor)
    return 'Text'
  }

  function resolveIds(el: Element, attr: string): string {
    const ids = el.getAttribute(attr)
    if (!ids) return ''
    const ownerDoc = el.ownerDocument
    return ids
      .split(/\s+/)
      .map(id => ownerDoc.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ')
  }

  function walk(el: Element) {
    if (el.getAttribute('aria-hidden') === 'true') return
    if (el.hasAttribute('data-copy-skip')) return
    if (isStructurallyHidden(el)) return

    const hidden = isVisuallyHiddenPattern(el)
    const baseLabel = describe(el)

    const ariaLabel = el.getAttribute('aria-label')
    if (ariaLabel) {
      push({ kind: 'screen-reader', label: `${baseLabel}: aria-label`, text: ariaLabel })
    }
    const labelledByText = resolveIds(el, 'aria-labelledby')
    if (labelledByText && labelledByText !== ariaLabel) {
      push({ kind: 'screen-reader', label: `${baseLabel}: aria-labelledby`, text: labelledByText })
    }
    const describedByText = resolveIds(el, 'aria-describedby')
    if (describedByText) {
      push({ kind: 'screen-reader', label: `${baseLabel}: aria-describedby`, text: describedByText })
    }
    const title = el.getAttribute('title')
    if (title) {
      push({ kind: 'visible', label: `${baseLabel}: title`, text: title })
    }
    const tag = el.tagName.toLowerCase()
    if (tag === 'img') {
      const alt = el.getAttribute('alt')
      if (alt) push({ kind: 'screen-reader', label: 'Image alt', text: alt })
    }
    if (tag === 'input' || tag === 'textarea') {
      const placeholder = el.getAttribute('placeholder')
      if (placeholder) push({ kind: 'form', label: `${baseLabel} placeholder`, text: placeholder })
      const value = (el as HTMLInputElement).value
      if (value) push({ kind: 'form', label: `${baseLabel} value`, text: value })
    }

    // Direct text-node children: capture as the element's own text
    const ownTexts: string[] = []
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent?.trim()
        if (t) ownTexts.push(t)
      }
    }
    if (ownTexts.length > 0) {
      const joined = ownTexts.join(' ')
      push({
        kind: hidden ? 'screen-reader' : 'visible',
        label: hidden ? `${baseLabel}: screen reader text` : baseLabel,
        text: joined,
      })
    }

    for (const child of Array.from(el.children)) {
      walk(child)
    }
  }

  walk(root)
  return entries
}
