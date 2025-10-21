/**
 * BlockGroup Component
 *
 * Toolbar group for block-level elements: blockquote, code block, and table insertion.
 */
import { Editor } from '@tiptap/react';
import React from 'react';
import { Icon } from '../icons';

interface BlockGroupProps {
  editor: Editor;
  setUpdateTrigger?: React.Dispatch<React.SetStateAction<number>>;
}

export const BlockGroup: React.FC<BlockGroupProps> = ({ editor, setUpdateTrigger }) => {
  const isInTable = editor.isActive('table');

  return (
    <>
      {/* Block Elements */}
      <button
        onClick={() => {
          editor.chain().focus().toggleBlockquote().run();
          setUpdateTrigger?.((prev) => prev + 1);
        }}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        title="Quote"
      >
        <Icon name="quote" size={20} />
      </button>
      <button
        onClick={() => {
          editor.chain().focus().toggleCodeBlock().run();
          setUpdateTrigger?.((prev) => prev + 1);
        }}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
        title="Code Block"
      >
        <span className="icon-with-black-bg">
          <Icon name="codeBlock" size={20} />
        </span>
      </button>
      <button
        onClick={() => {
          const latex = prompt('Enter LaTeX formula (e.g., \\sum_{i=1}^{n} x_i):');
          if (latex) {
            (editor.chain().focus() as any).insertBlockMath({ latex }).run();
          }
          setUpdateTrigger?.((prev) => prev + 1);
        }}
        className={editor.isActive('blockMath') ? 'is-active' : ''}
        title="Math Block"
      >
        <span className="icon-with-black-bg">
          <Icon name="mathBlock" size={14} />
        </span>
      </button>

      <div className="toolbar-divider" />

      <button
        onClick={() => {
          (editor.chain().focus() as any)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
          setUpdateTrigger?.((prev) => prev + 1);
        }}
        disabled={isInTable}
        title="Insert Table"
      >
        <Icon name="table" size={20} />
      </button>
    </>
  );
};
