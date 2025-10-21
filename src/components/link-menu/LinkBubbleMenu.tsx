import { getMarkRange } from '@tiptap/core';
import type { Editor } from '@tiptap/react';
import React, { useState } from 'react';
import { Icon } from '../icons';
import '../../styles/modal.css';
import { BubbleMenuWrapper, MenuButton, useAttributes, whenInLink } from '../menus';

export interface LinkBubbleMenuProps {
  editor: Editor;
}

export const LinkBubbleMenu: React.FC<LinkBubbleMenuProps> = ({ editor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [editText, setEditText] = useState('');

  // Reactive state using hooks from menus module
  const linkAttrs = useAttributes(editor, 'link');
  const currentUrl = linkAttrs?.href || '';

  const handleOpenEdit = () => {
    const { state } = editor;
    const { $from } = state.selection;
    const linkMark = state.schema.marks.link;

    // Use TipTap's built-in getMarkRange helper to find link boundaries
    const range = getMarkRange($from, linkMark);

    if (!range) {
      // Shouldn't happen since menu only shows when in link, but handle gracefully
      setEditUrl(currentUrl);
      setEditText('');
      setIsEditing(true);
      return;
    }

    const text = state.doc.textBetween(range.from, range.to, ' ');

    setEditUrl(currentUrl);
    setEditText(text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmedUrl = editUrl.trim();
    const trimmedText = editText.trim();

    if (trimmedUrl === '') {
      // If URL is empty, remove the link (only when editing)
      if (!isCreating) {
        editor.chain().focus().unsetLink().run();
      }
    } else {
      const { state } = editor;
      const { $from } = state.selection;
      const linkMark = state.schema.marks.link;

      // Get the current link range
      const range = getMarkRange($from, linkMark);

      if (range && trimmedText) {
        // Get current text to check if it changed
        const currentText = state.doc.textBetween(range.from, range.to, ' ');

        if (trimmedText !== currentText) {
          // Text changed: delete old content and insert new with link
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContentAt(range.from, trimmedText)
            .setTextSelection({ from: range.from, to: range.from + trimmedText.length })
            .setLink({ href: trimmedUrl })
            .run();
        } else {
          // Text unchanged: just update the link URL
          editor.chain().focus().setTextSelection(range).setLink({ href: trimmedUrl }).run();
        }
      } else {
        // Just update the URL if no text change
        editor.chain().focus().setLink({ href: trimmedUrl }).run();
      }
    }

    setIsEditing(false);
    setIsCreating(false);
    setEditUrl('');
    setEditText('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditUrl('');
    setEditText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // When editing, show centered modal dialog
  if (isEditing) {
    return (
      <>
        {/* Backdrop */}
        <div className="modal-backdrop" onClick={handleCancelEdit}>
          {/* Modal Dialog */}
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <h3 className="modal-title">{isCreating ? 'Add Link' : 'Edit Link'}</h3>
              <button onClick={handleCancelEdit} className="modal-close" title="Close">
                ×
              </button>
            </div>

            {/* Form Fields */}
            <div className="modal-body">
              {/* URL Field */}
              <div className="modal-field">
                <label htmlFor="link-url" className="modal-label">
                  URL
                </label>
                <input
                  id="link-url"
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://example.com or paste any URL"
                  autoFocus
                  className="modal-input"
                  data-testid="link-url-input"
                />
              </div>

              {/* Text Field */}
              <div className="modal-field">
                <label htmlFor="link-text" className="modal-label">
                  Link Text
                </label>
                <input
                  id="link-text"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isCreating ? 'Link text (optional - uses URL if empty)' : 'Click here'
                  }
                  className="modal-input"
                  data-testid="link-text-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-footer">
              <button
                onClick={handleSaveEdit}
                disabled={!editUrl.trim()}
                className="modal-button modal-button--primary"
                data-testid="link-save-button"
              >
                {isCreating ? 'Add Link' : 'Save Link'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <BubbleMenuWrapper
      editor={editor}
      pluginKey="linkMenu"
      shouldShow={whenInLink}
      className="bubble-menu bubble-menu--link"
    >
      <MenuButton onClick={handleOpenEdit} title="Edit Link">
        <Icon name="linkEdit" size={16} />
        <span className="button-label">Edit</span>
      </MenuButton>

      <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
        <Icon name="linkRemove" size={16} />
        <span className="button-label">Remove</span>
      </MenuButton>

      <MenuButton
        onClick={() => {
          if (currentUrl) window.open(currentUrl, '_blank');
        }}
        disabled={!currentUrl}
        title="Open Link"
      >
        <Icon name="linkOpen" size={16} />
        <span className="button-label">Open</span>
      </MenuButton>
    </BubbleMenuWrapper>
  );
};
