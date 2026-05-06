import { Portal } from '@instructure/ui-portal'
import { BoardMountNodeContext } from './BoardMountNodeContext'

// Patch 1 — Portal
// `@instructure/ui-portal`'s Portal is wrapped by textDirectionContextConsumer.
// The inner class has no contextType, so we claim it for BoardMountNodeContext.
// Any Portal inside a <BoardMountNodeContext.Provider> automatically targets the
// iframe body. Outside the provider (context === null) behavior is unchanged.
type PortalClass = {
  contextType?: unknown
  prototype: {
    findMountNode: (props: { mountNode?: unknown }) => Element
    context?: HTMLElement | null
  }
}

const Inner = (Portal as unknown as { originalType?: PortalClass }).originalType
if (Inner && Inner.contextType !== BoardMountNodeContext) {
  Inner.contextType = BoardMountNodeContext
  const originalFind = Inner.prototype.findMountNode
  Inner.prototype.findMountNode = function (this: { context: HTMLElement | null }, props) {
    if (!props.mountNode && this.context) return this.context
    return originalFind.call(this, props)
  }
}

// Patch 2 — iframe element getBoundingClientRect
// InstUI's getBoundingClientRect utility adds the iframe element's page-rect so
// element coords become page coords. But our popover content is portaled INTO the
// iframe body, so it needs iframe-local coords. We install this fix per board iframe
// by calling patchBoardIframeBCR(iframeEl) from BoardFrame after load.
//
// The trick: make the iframe element report {top: -scrollY, left: -scrollX, ...}.
// InstUI adds that to the element rect, then adds scrollY back → net effect zero,
// leaving coords in the iframe's own coordinate space regardless of canvas zoom.
export function patchBoardIframeBCR(iframe: HTMLIFrameElement): void {
  const orig = iframe.getBoundingClientRect.bind(iframe)
  iframe.getBoundingClientRect = () => {
    const r = orig()
    return {
      top: -window.scrollY,
      left: -window.scrollX,
      bottom: -window.scrollY + r.height,
      right: -window.scrollX + r.width,
      width: r.width,
      height: r.height,
      x: -window.scrollX,
      y: -window.scrollY,
      toJSON: () => ({}),
    }
  }
}
