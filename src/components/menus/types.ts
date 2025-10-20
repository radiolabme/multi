/**
 * Shared types for TipTap menu components
 */

import type { Editor } from '@tiptap/react';
import type { EditorState } from '@tiptap/pm/state';

/**
 * Context passed to shouldShow predicates
 */
export interface MenuShowContext {
  editor: Editor;
  state: EditorState;
}

/**
 * Predicate function to determine if menu should be visible
 */
export type MenuShowPredicate = (context: MenuShowContext) => boolean;

/**
 * Base props for all menu components
 */
export interface BaseMenuProps {
  editor: Editor;
}

/**
 * Configuration for menu button state
 */
export interface MenuButtonStateConfig {
  isActive?: boolean;
  isDisabled?: boolean;
}
