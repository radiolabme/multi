import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback } from 'react';
import MenuBar from './MenuBar';
import './TipTapEditor.css';

const TipTapEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
    ],
    content: `
      <h1>Welcome to TipTap v3.x!</h1>
      <p>This is a fully featured rich-text editor built with TipTap v3.x and React. Try out the formatting options in the toolbar above.</p>
      <h2>Features</h2>
      <ul>
        <li>Bold, italic, underline, and strike-through text</li>
        <li>Multiple heading levels</li>
        <li>Bullet and numbered lists</li>
        <li>Code blocks and inline code</li>
        <li>Blockquotes</li>
        <li>Links</li>
        <li>Horizontal rules</li>
        <li>Undo/Redo functionality</li>
      </ul>
      <h2>Try it out!</h2>
      <p>Start typing or use the toolbar to format your content. You can also use keyboard shortcuts:</p>
      <ul>
        <li><strong>Ctrl/Cmd + B</strong> for bold</li>
        <li><strong>Ctrl/Cmd + I</strong> for italic</li>
        <li><strong>Ctrl/Cmd + U</strong> for underline</li>
        <li><strong>Ctrl/Cmd + Z</strong> for undo</li>
        <li><strong>Ctrl/Cmd + Shift + Z</strong> for redo</li>
      </ul>
      <blockquote>
        <p>"The best editor is the one that gets out of your way and lets you focus on your content."</p>
      </blockquote>
      <p>Happy writing! 🎉</p>
    `,
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        spellcheck: 'true',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} onSetLink={setLink} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
