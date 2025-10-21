/**
 * @local/menus
 *
 * Generic helpers for TipTap bubble and floating menus.
 * Provides reusable components, hooks, and utilities for building
 * consistent menu experiences across editor extensions.
 *
 * ## Components
 * - BubbleMenuWrapper: Generic bubble menu container with best practices
 * - FloatingMenuWrapper: Generic floating menu container
 * - MenuButton: Reusable button with state management
 * - MenuDivider: Visual separator for button groups
 *
 * ## Hooks
 * - useIsActive: Reactive check if mark/node is active
 * - useCanExecute: Reactive check if command can run
 * - useAttributes: Get mark/node attributes reactively
 *
 * ## Predicates
 * - Common shouldShow logic for menus
 * - Composable predicates (combineAnd, combineOr, not)
 *
 * ## Usage Example
 * ```tsx
 * import { BubbleMenuWrapper, MenuButton, useIsActive, whenTextSelected } from '@/components/menus';
 *
 * export const MyBubbleMenu = ({ editor }) => {
 *   const isBold = useIsActive(editor, 'bold');
 *
 *   return (
 *     <BubbleMenuWrapper
 *       editor={editor}
 *       pluginKey="myMenu"
 *       shouldShow={whenTextSelected}
 *     >
 *       <MenuButton
 *         onClick={() => editor.chain().focus().toggleBold().run()}
 *         isActive={isBold}
 *       >
 *         Bold
 *       </MenuButton>
 *     </BubbleMenuWrapper>
 *   );
 * };
 * ```
 */

// Component exports
export { BubbleMenuWrapper } from './BubbleMenuWrapper';
export type { BubbleMenuWrapperProps } from './BubbleMenuWrapper';

export { FloatingMenuWrapper } from './FloatingMenuWrapper';
export type { FloatingMenuWrapperProps } from './FloatingMenuWrapper';

export { MenuButton } from './MenuButton';
export type { MenuButtonProps } from './MenuButton';

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { MenuDivider } from './MenuDivider';
export type { MenuDividerProps } from './MenuDivider';

// Hook exports
export { useIsActive, useCanExecute, useAttributes } from './hooks';

// Predicate exports
export {
  whenTextSelected,
  whenInLink,
  whenInTable,
  whenTextSelectedNotInTable,
  combineAnd,
  combineOr,
  not,
} from './predicates';

// Type exports
export type {
  MenuShowContext,
  MenuShowPredicate,
  BaseMenuProps,
  MenuButtonStateConfig,
} from './types';
