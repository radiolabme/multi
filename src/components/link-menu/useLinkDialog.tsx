import type { Editor } from '@tiptap/react';
import React, { useState } from 'react';
import '../../styles/modal.css';

export interface UseLinkDialogReturn {
  openLinkDialog: () => void;
  linkDialog: React.ReactNode;
}

/**
 * Custom hook that provides a link dialog for creating new links.
 * Use this in toolbars or other places where you want to create links.
 */
export const useLinkDialog = (editor: Editor): UseLinkDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [editText, setEditText] = useState('');

  const openLinkDialog = () => {
    // Get selected text for new link
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');

    setEditUrl('');
    setEditText(text);
    setIsOpen(true);
  };

  const handleSave = () => {
    const trimmedUrl = editUrl.trim();
    const trimmedText = editText.trim();

    if (trimmedUrl) {
      // Create link
      editor.chain().focus().setLink({ href: trimmedUrl }).run();

      // Update link text if provided and different from selection
      if (trimmedText) {
        const currentText = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        );
        if (trimmedText !== currentText) {
          editor.chain().focus().insertContent(trimmedText).run();
        }
      }
    }

    setIsOpen(false);
    setEditUrl('');
    setEditText('');
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEditUrl('');
    setEditText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const linkDialog = isOpen ? (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleCancel}>
        {/* Modal Dialog */}
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">Add Link</h3>
            <button onClick={handleCancel} className="modal-close" title="Close">
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
                placeholder="Link text (optional - uses URL if empty)"
                className="modal-input"
                data-testid="link-text-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-footer">
            <button
              onClick={handleSave}
              disabled={!editUrl.trim()}
              className="modal-button modal-button--primary"
              data-testid="link-save-button"
            >
              Add Link
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return { openLinkDialog, linkDialog };
};
