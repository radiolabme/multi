/**
 * Link Editing Bubble Menu
 *
 * Headless bubble menu component for link management in TipTap.
 * Appears when cursor is within a link and provides edit/remove controls.
 *
 * @requires @tiptap/react ^3.7.0
 * @requires @tiptap/extension-link ^3.7.0
 * @requires react ^19.0.0
 *
 * Styling should be provided by the consumer via CSS.
 *
 * Exports:
 * - LinkBubbleMenu: React component for link editing UI
 * - LinkBubbleMenuProps: TypeScript interface for component props
 * - useLinkDialog: Custom hook for creating links from toolbars
 */
export { LinkBubbleMenu } from './LinkBubbleMenu';
export type { LinkBubbleMenuProps } from './LinkBubbleMenu';
export { useLinkDialog } from './useLinkDialog';
export type { UseLinkDialogReturn } from './useLinkDialog';
