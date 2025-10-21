/**
 * Table Bubble Menu Component
 *
 * @requires @tiptap/react ^3.7.0
 * @requires react ^19.0.0
 */
import type { Editor } from '@tiptap/react';
import React from 'react';
import { Icon } from '../icons';
import { BubbleMenuWrapper, MenuButton, MenuDivider, whenInTable } from '../menus';

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
  cellAttributes = [],
}) => {
  const hasHeaderRow = editor.isActive('table', { headerRow: true });

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
        <Icon name="arrowUpOnSquareStack" size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
        title="Add row below"
      >
        <Icon name="arrowUpOnSquareStack" rotate={180} size={16} />
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
        title="Add column left"
      >
        <Icon name="arrowUpOnSquareStack" rotate={270} size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
        title="Add column right"
      >
        <Icon name="arrowUpOnSquareStack" rotate={90} size={16} />
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
        title="Merge selected cells"
      >
        <Icon name="merge" size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor.can().splitCell()}
        title="Split cell"
      >
        <Icon name="split" size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
        disabled={!editor.can().mergeOrSplit()}
        title="Merge or split cells"
      >
        <Icon name="merge" size={14} />
        /
        <Icon name="split" size={14} />
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        disabled={!editor.can().toggleHeaderColumn()}
        title="Toggle header column"
      >
        <Icon name="header" size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        disabled={!editor.can().toggleHeaderRow()}
        title="Toggle header row"
        isActive={hasHeaderRow}
      >
        <Icon name={hasHeaderRow ? 'headerRowEnabled' : 'headerRowDisabled'} size={16} />
      </MenuButton>

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
        <Icon name="remove" size={16} />
        <span className="button-label">Col</span>
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
        title="Delete row"
      >
        <Icon name="remove" size={16} />
        <span className="button-label">Row</span>
      </MenuButton>
      <MenuDivider />
      <MenuButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
        title="Delete table"
      >
        <Icon name="tableDelete" size={16} />
        <span className="button-label">Table</span>
      </MenuButton>
    </BubbleMenuWrapper>
  );
};
