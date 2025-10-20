import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState } from 'react';
import { mergeExtensions } from '../../lib/extensions';
import '../../styles/design-tokens.css';
import { LinkBubbleMenu, useLinkDialog } from '../link-menu';
import TableEditorExtensions, { TableBubbleMenu } from '../table-editor';
import { TextBubbleMenu } from '../text-menu';
import './SimpleEditor.css';

const SimpleEditor: React.FC = () => {
  const [, setUpdateTrigger] = useState(0);

  const editor = useEditor({
    extensions: mergeExtensions(
      [
        StarterKit.configure({
          link: false,
        }),
        Link.configure({
          openOnClick: true,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        }),
        Placeholder.configure({
          placeholder: 'Start typing...',
        }),
      ],
      TableEditorExtensions
    ),
    content: '<h1>Test</h1><p>Minimal editor</p>',
    editorProps: {
      attributes: {
        class: 'simple-editor-content',
      },
    },
    onUpdate: () => {
      setUpdateTrigger((prev) => prev + 1);
    },
  });

  // Link dialog hook for creating new links
  const { openLinkDialog, linkDialog } = useLinkDialog(editor!);

  if (!editor) {
    return <div>Loading...</div>;
  }

  const isInTable = editor.isActive('table');

  return (
    <div className="simple-editor-wrapper">
      <div className="simple-editor-toolbar">
        {/* History */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Cmd+Z)"
        >
          ⟲
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Cmd+Shift+Z)"
        >
          ⟳
        </button>

        <div className="toolbar-divider" />

        {/* Headings & Lists */}
        <select
          onChange={(e) => {
            const level = e.target.value;
            if (level === 'p') {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: parseInt(level) as 1 | 2 | 3 })
                .run();
            }
          }}
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
                ? '2'
                : editor.isActive('heading', { level: 3 })
                  ? '3'
                  : 'p'
          }
          className="heading-select"
          title="Text Style"
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1.
        </button>

        <div className="toolbar-divider" />

        {/* Text Formatting */}
        <button
          onClick={() => {
            editor.chain().focus().toggleBold().run();
            setUpdateTrigger((prev) => prev + 1);
          }}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          𝐁
        </button>
        <button
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
            setUpdateTrigger((prev) => prev + 1);
          }}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          𝐼
        </button>
        <button
          onClick={() => {
            editor.chain().focus().toggleStrike().run();
            setUpdateTrigger((prev) => prev + 1);
          }}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          S̶
        </button>
        <button
          onClick={() => {
            editor.chain().focus().toggleCode().run();
            setUpdateTrigger((prev) => prev + 1);
          }}
          className={editor.isActive('code') ? 'is-active' : ''}
          title="Code"
        >
          &lt;/&gt;
        </button>
        <button
          onClick={openLinkDialog}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Link"
        >
          🔗
        </button>
        <button
          onClick={() => {
            editor.chain().focus().unsetLink().run();
            setUpdateTrigger((prev) => prev + 1);
          }}
          disabled={!editor.isActive('link')}
          title="Remove Link"
        >
          🔗✕
        </button>

        <div className="toolbar-divider" />

        {/* Block Elements */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Quote"
        >
          ❝
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code Block"
        >
          ```
        </button>

        <div className="toolbar-divider" />

        <button
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          disabled={isInTable}
          title="Insert Table"
        >
          📊
        </button>

        <div className="toolbar-divider" />

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          ─
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()} title="Line Break">
          ↵
        </button>
      </div>
      <EditorContent editor={editor} />

      {/* Bubble menus - appear contextually based on selection/cursor position */}
      <TextBubbleMenu editor={editor} onCreateLink={openLinkDialog} />
      <LinkBubbleMenu editor={editor} />
      <TableBubbleMenu editor={editor} />

      {/* Link creation dialog */}
      {linkDialog}
    </div>
  );
};

export default SimpleEditor;
