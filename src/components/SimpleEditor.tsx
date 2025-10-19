import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState } from 'react';
import './SimpleEditor.css';

const SimpleEditor: React.FC = () => {
  const [, setUpdateTrigger] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content: '<h1>Test</h1><p>Minimal editor</p>',
    editorProps: {
      attributes: {
        class: 'simple-editor-content',
      },
    },
    onUpdate: () => {
      setUpdateTrigger((prev) => prev + 1);
    },
    onSelectionUpdate: () => {
      setUpdateTrigger((prev) => prev + 1);
    },
    onTransaction: () => {
      setUpdateTrigger((prev) => prev + 1);
    },
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="simple-editor-wrapper">
      <div className="simple-editor-toolbar">
        {/* History */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          ↶
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          ↷
        </button>

        <div className="toolbar-divider" />

        {/* Headings & Lists */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
        >
          H₁
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          H₂
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          title="Heading 3"
        >
          H₃
        </button>
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
    </div>
  );
};

export default SimpleEditor;
