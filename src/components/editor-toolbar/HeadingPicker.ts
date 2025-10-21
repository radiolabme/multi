import { Editor } from '@tiptap/react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeadingPickerProps {
  editor: Editor;
  onUpdate?: () => void;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

export const HeadingPicker: React.FC<HeadingPickerProps> = ({ editor, onUpdate }) => {
  const activeHeadingLevel = headingLevels.find((level) => editor.isActive('heading', { level }));

  const isParagraph = editor.isActive('paragraph');
  const currentValue = activeHeadingLevel || (isParagraph ? 'paragraph' : 'paragraph');

  return React.createElement(
    DropdownMenu,
    null,
    React.createElement(
      DropdownMenuTrigger,
      { asChild: true },
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'toolbar-dropdown-trigger heading-select',
          title: 'Heading',
        },
        React.createElement(
          'span',
          {
            className: `toolbar-dropdown-value ${isParagraph ? 'heading-paragraph-icon' : ''}`,
          },
          isParagraph ? 'P' : `H${activeHeadingLevel}`
        )
      )
    ),
    React.createElement(
      DropdownMenuContent,
      { align: 'start', className: 'toolbar-dropdown-content' },
      React.createElement(DropdownMenuLabel, { className: 'toolbar-dropdown-label' }, 'Style'),
      React.createElement(DropdownMenuSeparator),
      React.createElement(
        DropdownMenuRadioGroup,
        {
          value: String(currentValue),
          onValueChange: (value: string) => {
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value, 10) as HeadingLevel;
              editor.chain().focus().setHeading({ level }).run();
            }
            if (onUpdate) {
              onUpdate();
            }
          },
        },
        React.createElement(
          DropdownMenuRadioItem,
          {
            key: 'paragraph',
            value: 'paragraph',
            className: 'toolbar-dropdown-item',
          },
          React.createElement('span', { className: 'heading-icon' }, 'P'),
          React.createElement('span', { className: 'heading-label' }, 'Paragraph')
        ),
        ...headingLevels.map((level) =>
          React.createElement(
            DropdownMenuRadioItem,
            {
              key: level,
              value: String(level),
              className: 'toolbar-dropdown-item',
            },
            React.createElement('span', { className: 'heading-icon' }, `H${level}`),
            React.createElement('span', { className: 'heading-label' }, `Heading ${level}`)
          )
        )
      )
    )
  );
};

export default HeadingPicker;
