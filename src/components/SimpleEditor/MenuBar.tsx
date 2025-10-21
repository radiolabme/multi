import { Editor } from '@tiptap/react';
import React from 'react';
import { AlignGroup } from '../editor-toolbar/AlignGroup';
import { BlockGroup } from '../editor-toolbar/BlockGroup';
import { HeadingPicker } from '../editor-toolbar/HeadingPicker';
import { Icon } from '../icons';
import { TypographyPopover } from '../typography-popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface MenuBarProps {
  editor: Editor;
  openLinkDialog: () => void;
  setUpdateTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor, openLinkDialog, setUpdateTrigger }) => {
  return (
    <div className="simple-editor-toolbar">
      {/* History */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Cmd+Z)"
      >
        <Icon name="undo" size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Cmd+Shift+Z)"
      >
        <Icon name="redo" size={20} />
      </button>

      <div className="toolbar-divider" />

      {/* Headings Dropdown */}
      <HeadingPicker editor={editor} onUpdate={() => setUpdateTrigger((prev) => prev + 1)} />

      {/* Typography Settings */}
      <TypographyPopover editor={editor}>
        <button title="Typography Settings" className="typography-button">
          <span className="typography-button__icon">Aa</span>
        </button>
      </TypographyPopover>

      <AlignGroup editor={editor} setUpdateTrigger={setUpdateTrigger} />

      <div className="toolbar-divider" />

      {/* Text Formatting */}
      <ToggleGroup
        type="multiple"
        value={[
          editor.isActive('bold') ? 'bold' : '',
          editor.isActive('italic') ? 'italic' : '',
          editor.isActive('underline') ? 'underline' : '',
          editor.isActive('strike') ? 'strike' : '',
        ].filter(Boolean)}
        onValueChange={(values: string[]) => {
          const currentBold = editor.isActive('bold');
          const currentItalic = editor.isActive('italic');
          const currentUnderline = editor.isActive('underline');
          const currentStrike = editor.isActive('strike');

          if (currentBold !== values.includes('bold')) {
            editor.chain().focus().toggleBold().run();
          }
          if (currentItalic !== values.includes('italic')) {
            editor.chain().focus().toggleItalic().run();
          }
          if (currentUnderline !== values.includes('underline')) {
            editor.chain().focus().toggleUnderline().run();
          }
          if (currentStrike !== values.includes('strike')) {
            editor.chain().focus().toggleStrike().run();
          }
          setUpdateTrigger((prev) => prev + 1);
        }}
      >
        <ToggleGroupItem value="bold" title="Bold (Cmd+B)">
          <span className="toolbar-text-icon toolbar-text-icon--bold">B</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" title="Italic (Cmd+I)">
          <span className="toolbar-text-icon toolbar-text-icon--italic">I</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" title="Underline (Cmd+U)">
          <span className="toolbar-text-icon toolbar-text-icon--underline">U</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="strike" title="Strikethrough">
          <span className="toolbar-text-icon toolbar-text-icon--strikethrough">S</span>
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="toolbar-divider" />

      {/* Code, Inline Math, and Link buttons */}
      <button
        onClick={() => {
          editor.chain().focus().toggleCode().run();
          setUpdateTrigger((prev) => prev + 1);
        }}
        className={editor.isActive('code') ? 'is-active' : ''}
        title="Code"
      >
        <Icon name="code" size={20} />
      </button>
      <button
        onClick={() => {
          const latex = prompt('Enter LaTeX formula (e.g., x^2 + y^2 = z^2):');
          if (latex) {
            (editor.chain().focus() as any).insertInlineMath({ latex }).run();
          }
          setUpdateTrigger((prev) => prev + 1);
        }}
        className={editor.isActive('inlineMath') ? 'is-active' : ''}
        title="Inline Math"
      >
        <Icon name="mathInline" size={20} />
      </button>
      <button
        onClick={() => {
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
          } else {
            openLinkDialog();
          }
          setUpdateTrigger((prev) => prev + 1);
        }}
        className={editor.isActive('link') ? 'is-active' : ''}
        title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
      >
        <Icon name={editor.isActive('link') ? 'linkRemove' : 'link'} size={20} />
      </button>

      <div className="toolbar-divider" />

      {/* Lists Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="toolbar-dropdown-trigger" title="Lists">
            <Icon
              name={
                editor.isActive('taskList')
                  ? 'taskList'
                  : editor.isActive('orderedList')
                    ? 'orderedList'
                    : 'bulletList'
              }
              size={20}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="toolbar-dropdown-content">
          <DropdownMenuLabel className="toolbar-dropdown-label">Lists</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={
              editor.isActive('bulletList')
                ? 'bullet'
                : editor.isActive('orderedList')
                  ? 'ordered'
                  : editor.isActive('taskList')
                    ? 'task'
                    : 'none'
            }
            onValueChange={(value: string) => {
              if (value === 'bullet') {
                editor.chain().focus().toggleBulletList().run();
              } else if (value === 'ordered') {
                editor.chain().focus().toggleOrderedList().run();
              } else if (value === 'task') {
                editor.chain().focus().toggleTaskList().run();
              }
              setUpdateTrigger((prev) => prev + 1);
            }}
          >
            <DropdownMenuRadioItem value="bullet" className="toolbar-dropdown-item">
              <Icon name="bulletList" size={16} />
              Bullet List
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ordered" className="toolbar-dropdown-item">
              <Icon name="orderedList" size={16} />
              Numbered List
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="task" className="toolbar-dropdown-item">
              <Icon name="taskList" size={16} />
              Task List
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Block Elements */}
      <BlockGroup editor={editor} setUpdateTrigger={setUpdateTrigger} />

      <div className="toolbar-divider" />

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Line"
      >
        <Icon name="horizontalRule" size={20} />
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()} title="Line Break">
        <Icon name="hardBreak" size={20} />
      </button>
    </div>
  );
};

export default MenuBar;
