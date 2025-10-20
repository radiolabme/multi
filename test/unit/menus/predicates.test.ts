/**
 * Tests for menu predicate functions
 */

import type { Editor } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestEditor, destroyEditor } from '../../helpers/editor';
import { whenInLink, whenTextSelected } from '@/components/menus';

let editor: Editor;

describe('Menu Predicates', () => {
  afterEach(() => {
    if (editor) {
      destroyEditor(editor);
    }
  });

  describe('whenTextSelected', () => {
    it('returns true when text is selected', () => {
      editor = createTestEditor({
        content: '<p>Some text here</p>',
      });

      // Select text from position 1 to 5
      editor.commands.setTextSelection({ from: 1, to: 5 });

      const result = whenTextSelected({ editor, state: editor.state });
      expect(result).toBe(true);
    });

    it('returns false when no text is selected', () => {
      editor = createTestEditor({
        content: '<p>Some text here</p>',
      });

      // Cursor at position 1 (no selection)
      editor.commands.setTextSelection(1);

      const result = whenTextSelected({ editor, state: editor.state });
      expect(result).toBe(false);
    });
  });

  describe('whenInLink', () => {
    it('returns true when cursor is in a link', () => {
      editor = createTestEditor({
        extensions: [Link.configure({ openOnClick: false })],
        content: '<p><a href="https://example.com">link text</a></p>',
      });

      // Move cursor into the link
      editor.commands.setTextSelection(2);

      const result = whenInLink({ editor, state: editor.state });
      expect(result).toBe(true);
    });

    it('returns false when cursor is not in a link', () => {
      editor = createTestEditor({
        extensions: [Link.configure({ openOnClick: false })],
        content: '<p>Regular text</p>',
      });

      editor.commands.setTextSelection(2);

      const result = whenInLink({ editor, state: editor.state });
      expect(result).toBe(false);
    });
  });
});
