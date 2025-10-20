/**
 * React hooks for TipTap menu components
 */

import { useEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';

/**
 * Hook to reactively check if a mark/node is active
 * Uses TipTap's useEditorState for proper React reactivity
 *
 * @example
 * const isBold = useIsActive(editor, 'bold');
 * const isLink = useIsActive(editor, 'link');
 */
export function useIsActive(
  editor: Editor | null,
  name: string,
  attributes?: Record<string, any>
): boolean {
  return useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return false;
      return ctx.editor.isActive(name, attributes);
    },
  }) ?? false;
}

/**
 * Hook to reactively check if a command can be executed
 * Uses TipTap's useEditorState for proper React reactivity
 *
 * @example
 * const canUndo = useCanExecute(editor, (chain) => chain.undo());
 * const canAddRow = useCanExecute(editor, (chain) => chain.addRowBefore());
 */
export function useCanExecute(
  editor: Editor | null,
  command: (chain: ReturnType<Editor['chain']>) => any
): boolean {
  return useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return false;
      return ctx.editor.can().chain().focus() && command(ctx.editor.can().chain().focus());
    },
  });
}

/**
 * Hook to get attributes of current mark/node reactively
 *
 * @example
 * const linkAttrs = useAttributes(editor, 'link');
 * const href = linkAttrs?.href;
 */
export function useAttributes(
  editor: Editor | null,
  name: string
): Record<string, any> {
  return useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return ctx.editor.getAttributes(name);
    },
  }) ?? {};
}
