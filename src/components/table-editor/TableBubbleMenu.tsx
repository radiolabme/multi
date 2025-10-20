/**
 * Table Bubble Menu Component
 *
 * @requires @tiptap/react ^3.7.0
 * @requires react ^19.0.0
 */
import type { Editor } from '@tiptap/react';
import React from 'react';
import {
  BubbleMenuWrapper,
  MenuButton,
  MenuDivider,
  whenInTable,
} from '../menus';

export interface TableBubbleMenuProps {
  editor: Editor;
  /**
   * Enable navigation buttons (Next/Previous cell)
   * @default true
   */
  showNavigation?: boolean;
  /**
   * Custom cell attribute configurations
   * Each entry provides a label, attribute name, and value to set
   */
  cellAttributes?: Array<{
    label: string;
    attribute: string;
    value: any;
    title?: string;
  }>;
}

export const TableBubbleMenu: React.FC<TableBubbleMenuProps> = ({
  editor,
  showNavigation = true,
  cellAttributes = [],
}) => {
  return (
    <BubbleMenuWrapper
      editor={editor}
      pluginKey="tableMenu"
      shouldShow={whenInTable}
      className="bubble-menu bubble-menu--table"
    >
      <MenuButton
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
        title="Add row above"
      >
        ⬆
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
        title="Add row below"
      >
        ⬇
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
        title="Add column left"
      >
        ⬅
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
        title="Add column right"
      >
        ➡
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
        title="Merge selected cells"
      >
        ⤧
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor.can().splitCell()}
        title="Split cell"
      >
        ⤨
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
        disabled={!editor.can().mergeOrSplit()}
        title="Merge or split cells"
      >
        ⤧/⤨
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        disabled={!editor.can().toggleHeaderColumn()}
        title="Toggle header column"
      >
        ⬍ H
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        disabled={!editor.can().toggleHeaderRow()}
        title="Toggle header row"
      >
        ⬍ H
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!editor.can().toggleHeaderCell()}
        title="Toggle header cell"
      >
        H
      </MenuButton>

      {/* Navigation commands */}
      {showNavigation && (
        <>
          <MenuDivider />
          <MenuButton
            onClick={() => editor.chain().focus().goToPreviousCell().run()}
            disabled={!editor.can().goToPreviousCell()}
            title="Go to previous cell"
          >
            ⇤
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().goToNextCell().run()}
            disabled={!editor.can().goToNextCell()}
            title="Go to next cell"
          >
            ⇥
          </MenuButton>
        </>
      )}

      {/* Custom cell attributes */}
      {cellAttributes.length > 0 && (
        <>
          <MenuDivider />
          {cellAttributes.map((attr, index) => (
            <MenuButton
              key={index}
              onClick={() =>
                editor.chain().focus().setCellAttribute(attr.attribute, attr.value).run()
              }
              disabled={!editor.can().setCellAttribute(attr.attribute, attr.value)}
              title={attr.title || `Set ${attr.attribute}`}
            >
              {attr.label}
            </MenuButton>
          ))}
        </>
      )}

      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
        title="Delete column"
      >
        🗑️ Col
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
        title="Delete row"
      >
        🗑️ Row
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
        title="Delete table"
      >
        🗑️ Table
      </MenuButton>
    </BubbleMenuWrapper>
  );
};
