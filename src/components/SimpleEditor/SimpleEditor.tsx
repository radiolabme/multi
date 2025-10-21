import FontFamily from '@tiptap/extension-font-family';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import Link from '@tiptap/extension-link';
import { Mathematics } from '@tiptap/extension-mathematics';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import 'katex/dist/katex.min.css';
import React, { useState } from 'react';
import { mergeExtensions } from '../../lib/extensions';
import { FontSize, FontWeight, LetterSpacing } from '../../lib/tiptap-extensions';
import '../../styles/design-tokens.css';
import '../../styles/menubar.css';
import '../../styles/menus.css';
import '../../styles/SimpleEditor.css';
import { LinkBubbleMenu, useLinkDialog } from '../link-menu';
import TableEditorExtensions, { TableBubbleMenu } from '../table-editor';
import { TextBubbleMenu } from '../text-menu';
import '../typography-popover/TypographyPopover.css';
import MenuBar from './MenuBar';

const SimpleEditor: React.FC = () => {
  const [, setUpdateTrigger] = useState(0);

  const editor = useEditor({
    extensions: mergeExtensions(
      [
        StarterKit.configure({
          link: false,
          gapcursor: false,
          underline: false,
          bulletList: {
            HTMLAttributes: { class: 'tiptap-bullet-list' },
          },
          orderedList: {
            HTMLAttributes: { class: 'tiptap-ordered-list' },
          },
          listItem: {
            HTMLAttributes: { class: 'tiptap-list-item' },
          },
        }),
        Link.configure({
          autolink: true,
          linkOnPaste: true,
          openOnClick: true,
          protocols: ['http', 'https', 'mailto', 'tel'],
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return 'Heading...';
            }
            if (node.type.name === 'codeBlock') {
              return '// Code here...';
            }
            return 'Start typing...';
          },
          showOnlyCurrent: true,
        }),
        Gapcursor,
        TextStyle,
        Underline,
        FontFamily.configure({
          types: ['textStyle'],
        }),
        FontSize.configure({
          types: ['textStyle'],
        }),
        FontWeight.configure({
          types: ['textStyle'],
        }),
        LetterSpacing.configure({
          types: ['textStyle'],
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Mathematics.configure({
          katexOptions: {
            throwOnError: false,
          },
          inlineOptions: {
            onClick: (node, pos) => {
              const latex = prompt('Enter LaTeX formula:', node.attrs.latex);
              if (latex) {
                editor?.chain().setNodeSelection(pos).updateInlineMath({ latex }).focus().run();
              }
            },
          },
          blockOptions: {
            onClick: (node, pos) => {
              const latex = prompt('Enter LaTeX formula:', node.attrs.latex);
              if (latex) {
                editor?.chain().setNodeSelection(pos).updateBlockMath({ latex }).focus().run();
              }
            },
          },
        }),
      ],
      TableEditorExtensions
    ),
    content: '<h1>Test</h1><p>Minimal editor</p>',
    editorProps: {
      attributes: {
        class: 'simple-editor-content',
      },
      transformPastedText(text) {
        // Reduce excessive line breaks from external sources
        return text.replace(/\n{3,}/g, '\n\n');
      },
      transformPastedHTML(html) {
        // Clean up common paste issues from Word, browsers, etc.
        const cleanedHtml = html
          .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
          .replace(/<span style="[^"]*">/g, '<span>'); // Remove inline styles from spans

        // Protect against deeply nested HTML that can freeze the editor
        const div = document.createElement('div');
        div.innerHTML = cleanedHtml;

        const maxDepth = 10;
        const removeDeepNesting = (el: Element, depth = 0): void => {
          if (depth > maxDepth) {
            // Flatten deeply nested content to text
            el.innerHTML = el.textContent || '';
            return;
          }
          Array.from(el.children).forEach((child) => removeDeepNesting(child, depth + 1));
        };

        removeDeepNesting(div);
        return div.innerHTML;
      },
      handleDOMEvents: {
        // Improve focus restoration after bubble menu interactions
        blur: (_view, event) => {
          const relatedTarget = event.relatedTarget as HTMLElement | null;
          // Don't blur if focusing a bubble menu, toolbar, or modal
          if (
            relatedTarget &&
            (relatedTarget.closest('.bubble-menu') ||
              relatedTarget.closest('.simple-editor-toolbar') ||
              relatedTarget.closest('.modal-dialog'))
          ) {
            return true; // Prevent default blur behavior
          }
          return false;
        },
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

  return (
    <div className="simple-editor-wrapper">
      <MenuBar
        editor={editor}
        openLinkDialog={openLinkDialog}
        setUpdateTrigger={setUpdateTrigger}
      />
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
