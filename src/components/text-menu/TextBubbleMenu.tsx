import type { Editor } from '@tiptap/react';
import React from 'react';
import { Icon } from '../icons';
import {
  BubbleMenuWrapper,
  MenuButton,
  MenuDivider,
  useIsActive,
  whenTextSelectedNotInTable,
} from '../menus';

export interface TextBubbleMenuProps {
  editor: Editor;
  onCreateLink?: () => void;
}

export const TextBubbleMenu: React.FC<TextBubbleMenuProps> = ({ editor, onCreateLink }) => {
  // Reactive state using hooks from menus module
  const isBold = useIsActive(editor, 'bold');
  const isItalic = useIsActive(editor, 'italic');
  const isStrike = useIsActive(editor, 'strike');
  const isCode = useIsActive(editor, 'code');
  const isLink = useIsActive(editor, 'link');

  return (
    <BubbleMenuWrapper
      editor={editor}
      pluginKey="textMenu"
      shouldShow={whenTextSelectedNotInTable}
      className="bubble-menu bubble-menu--text"
    >
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={isBold}
        title="Bold (Cmd+B)"
        actionName="text.toggleBold"
      >
        <Icon name="bold" size={18} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={isItalic}
        title="Italic (Cmd+I)"
        actionName="text.toggleItalic"
      >
        <Icon name="italic" size={18} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={isStrike}
        title="Strikethrough"
        actionName="text.toggleStrike"
      >
        <Icon name="strikethrough" size={18} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={isCode}
        title="Code"
        actionName="text.toggleCode"
      >
        <Icon name="code" size={18} />
      </MenuButton>

      <MenuDivider />

      <MenuButton
        onClick={() => {
          if (onCreateLink) {
            onCreateLink();
          } else {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        isActive={isLink}
        title="Add Link"
        actionName="text.addLink"
      >
        <Icon name="link" size={18} />
      </MenuButton>
    </BubbleMenuWrapper>
  );
};
