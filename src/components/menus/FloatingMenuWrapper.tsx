
import { FloatingMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import React from 'react';
import type { MenuShowPredicate } from './types';

export interface FloatingMenuWrapperProps {
  editor: Editor;
  pluginKey: string;
  shouldShow?: MenuShowPredicate;
  children: React.ReactNode;
  className?: string;
}

/**
 * Generic wrapper for FloatingMenu with best practices applied:
 * - Enforces unique pluginKey
 * - Provides consistent shouldShow API
 */
export const FloatingMenuWrapper: React.FC<FloatingMenuWrapperProps> = ({
  editor,
  pluginKey,
  shouldShow,
  children,
  className = 'floating-menu',
}) => {
  return (
    <FloatingMenu
      editor={editor}
      pluginKey={pluginKey}
      shouldShow={shouldShow}
    >
      <div className={className}>{children}</div>
    </FloatingMenu>
  );
};
