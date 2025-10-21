/**
 * AlignGroup Component
 *
 * Toolbar group for text alignment: left, center, right, and justify.
 */
import { Editor } from '@tiptap/react';
import React from 'react';
import { Icon } from '../icons';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface AlignGroupProps {
  editor: Editor;
  setUpdateTrigger?: React.Dispatch<React.SetStateAction<number>>;
}

type TextAlignValue = 'left' | 'center' | 'right' | 'justify';

export const AlignGroup: React.FC<AlignGroupProps> = ({ editor, setUpdateTrigger }) => {
  // Determine current text alignment
  const textAlignValue: TextAlignValue | '' =
    (['left', 'center', 'right', 'justify'] as const).find((align) =>
      editor.isActive({ textAlign: align })
    ) || '';

  return (
    <ToggleGroup
      type="single"
      value={textAlignValue}
      onValueChange={(value: string) => {
        if (!value) {
          editor.chain().focus().unsetTextAlign().run();
        } else {
          editor
            .chain()
            .focus()
            .setTextAlign(value as TextAlignValue)
            .run();
        }
        setUpdateTrigger?.((prev) => prev + 1);
      }}
    >
      <ToggleGroupItem value="left" title="Align Left" aria-label="Align Left">
        <Icon name="alignLeft" size={20} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" title="Align Center" aria-label="Align Center">
        <Icon name="alignCenter" size={20} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" title="Align Right" aria-label="Align Right">
        <Icon name="alignRight" size={20} />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" title="Justify" aria-label="Justify">
        <Icon name="alignJustify" size={20} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
