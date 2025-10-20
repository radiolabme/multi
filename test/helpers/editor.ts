/**
 * Test helpers for creating TipTap editor instances
 */

import type { Extensions } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { mergeExtensions } from '../../src/lib/extensions';

export interface CreateTestEditorOptions {
  content?: string;
  extensions?: Extensions;
}

/**
 * Create a headless editor instance for testing
 */
export function createTestEditor(options: CreateTestEditorOptions = {}): Editor {
  const { content = '<p>Test content</p>', extensions = [] } = options;

  return new Editor({
    extensions: mergeExtensions([StarterKit], extensions),
    content,
  });
}

/**
 * Clean up editor instance
 */
export function destroyEditor(editor: Editor): void {
  editor.destroy();
}
