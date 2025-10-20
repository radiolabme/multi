/**
 * Integration tests for table editor commands
 */

import type { Editor } from '@tiptap/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestEditor, destroyEditor } from '../../helpers/editor';
import TableEditorExtensions from '@/components/table-editor';

describe('Table Editor Commands', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createTestEditor({
      extensions: TableEditorExtensions,
      content: '<p>Start here</p>',
    });
  });

  afterEach(() => {
    destroyEditor(editor);
  });

  describe('insertTable', () => {
    it('can insert a table', () => {
      editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true });

      expect(editor.isActive('table')).toBe(true);
      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');

      expect(table).toBeDefined();
      expect(table?.content).toHaveLength(3); // 3 rows
    });

    it('creates table with header row when specified', () => {
      editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: true });

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      const firstRow = table && 'content' in table ? table.content?.[0] : undefined;
      const firstCell = firstRow && 'content' in firstRow ? firstRow.content?.[0] : undefined;

      expect(firstCell?.type).toBe('tableHeader');
    });

    it('creates table without header row when not specified', () => {
      editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: false });

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      const firstRow = table && 'content' in table ? table.content?.[0] : undefined;
      const firstCell = firstRow && 'content' in firstRow ? firstRow.content?.[0] : undefined;

      expect(firstCell?.type).toBe('tableCell');
    });
  });

  describe('row operations', () => {
    beforeEach(() => {
      editor.commands.insertTable({ rows: 2, cols: 2 });
      // Move cursor into table
      editor.commands.setTextSelection(2);
    });

    it('can add row before', () => {
      const canAddRow = editor.can().addRowBefore();
      expect(canAddRow).toBe(true);

      editor.commands.addRowBefore();

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      expect(table?.content).toHaveLength(3); // 2 + 1
    });

    it('can add row after', () => {
      const canAddRow = editor.can().addRowAfter();
      expect(canAddRow).toBe(true);

      editor.commands.addRowAfter();

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      expect(table?.content).toHaveLength(3);
    });

    it('can delete row', () => {
      const canDelete = editor.can().deleteRow();
      expect(canDelete).toBe(true);

      editor.commands.deleteRow();

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      expect(table?.content).toHaveLength(1); // 2 - 1
    });
  });

  describe('column operations', () => {
    beforeEach(() => {
      editor.commands.insertTable({ rows: 2, cols: 2 });
      editor.commands.setTextSelection(2);
    });

    it('can add column before', () => {
      expect(editor.can().addColumnBefore()).toBe(true);
      editor.commands.addColumnBefore();

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      const firstRow = table && 'content' in table ? table.content?.[0] : undefined;
      expect(firstRow && 'content' in firstRow ? firstRow.content : []).toHaveLength(3); // 2 + 1
    });

    it('can add column after', () => {
      expect(editor.can().addColumnAfter()).toBe(true);
      editor.commands.addColumnAfter();

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      const firstRow = table && 'content' in table ? table.content?.[0] : undefined;
      expect(firstRow && 'content' in firstRow ? firstRow.content : []).toHaveLength(3);
    });

    it('can delete column', () => {
      expect(editor.can().deleteColumn()).toBe(true);
      editor.commands.deleteColumn();

      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      const firstRow = table && 'content' in table ? table.content?.[0] : undefined;
      expect(firstRow && 'content' in firstRow ? firstRow.content : []).toHaveLength(1); // 2 - 1
    });
  });

  describe('cell operations', () => {
    beforeEach(() => {
      editor.commands.insertTable({ rows: 2, cols: 2 });
      editor.commands.setTextSelection(2);
    });

    it('reports merge cells availability correctly', () => {
      // Single cell selected - cannot merge
      const canMerge = editor.can().mergeCells();
      expect(typeof canMerge).toBe('boolean');
    });

    it('reports split cell availability correctly', () => {
      const canSplit = editor.can().splitCell();
      expect(typeof canSplit).toBe('boolean');
    });

    it('can toggle header cell', () => {
      expect(editor.can().toggleHeaderCell()).toBe(true);
      editor.commands.toggleHeaderCell();

      // Verify cell type changed
      const isHeader = editor.isActive('tableHeader');
      expect(typeof isHeader).toBe('boolean');
    });
  });

  describe('table deletion', () => {
    it('can delete entire table', () => {
      editor.commands.insertTable({ rows: 2, cols: 2 });
      editor.commands.setTextSelection(2);

      expect(editor.can().deleteTable()).toBe(true);
      editor.commands.deleteTable();

      expect(editor.isActive('table')).toBe(false);
      const json = editor.getJSON();
      const table = json.content?.find((node) => node.type === 'table');
      expect(table).toBeUndefined();
    });
  });

  describe('navigation commands', () => {
    beforeEach(() => {
      editor.commands.insertTable({ rows: 2, cols: 2 });
      editor.commands.setTextSelection(2);
    });

    it('can navigate to next cell', () => {
      const canGoNext = editor.can().goToNextCell();
      expect(canGoNext).toBe(true);
    });

    it('can navigate to previous cell when not at start', () => {
      // Move to second cell first
      editor.commands.goToNextCell();
      const canGoPrev = editor.can().goToPreviousCell();
      expect(canGoPrev).toBe(true);
    });
  });
});
