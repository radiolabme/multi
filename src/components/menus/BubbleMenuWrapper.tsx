
import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import React from 'react';
import type { MenuShowPredicate } from './types';

export interface BubbleMenuWrapperProps {
  editor: Editor;
  pluginKey: string;
  shouldShow: MenuShowPredicate;
  children: React.ReactNode;
  className?: string;
}

/**
 * Generic wrapper for BubbleMenu with best practices applied:
 * - Enforces unique pluginKey (prevents conflicts with multiple menus)
 * - Provides consistent shouldShow API
 */
export const BubbleMenuWrapper: React.FC<BubbleMenuWrapperProps> = ({
  editor,
  pluginKey,
  shouldShow,
  children,
  className = 'bubble-menu',
}) => {
  return (
    <BubbleMenu
      editor={editor}
      pluginKey={pluginKey}
      shouldShow={shouldShow}
    >
      <div className={className}>{children}</div>
    </BubbleMenu>
  );
};
