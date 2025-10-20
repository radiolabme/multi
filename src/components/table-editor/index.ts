/**
 * @tiptap/table-bubble-menu
 *
 * Table editing extension for TipTap with contextual bubble menu.
 * Provides complete table functionality following TipTap's headless pattern.
 *
 * @requires @tiptap/react ^3.7.0
 * @requires @tiptap/extension-table ^3.7.0
 * @requires react ^19.0.0
 *
 * Exports:
 * - TableEditorExtensions (default): Array of table-related TipTap extensions
 * - TableBubbleMenu: React component for table editing UI
 * - TableBubbleMenuProps: TypeScript interface for component props
 */
import { TableKit } from '@tiptap/extension-table';

// Component exports
export { TableBubbleMenu } from './TableBubbleMenu';
export type { TableBubbleMenuProps } from './TableBubbleMenu';

// Type exports and helpers
export { CellAttributePresets, createAttributeConfig } from './types';
export type { CustomAttributeConfig } from './types';

// Extension configuration using TableKit for complete table functionality
const TableEditorExtensions = [
  TableKit.configure({
    table: {
      resizable: true,
    },
  }),
];

export default TableEditorExtensions;
