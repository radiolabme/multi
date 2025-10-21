/**
 * Typography Popover Component
 *
 * Provides controls for font weight, font size, and letter spacing.
 * Based on the design shown in the reference image.
 */
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { Editor } from '@tiptap/react';
import React, { useState } from 'react';
import { EDITOR_FONTS } from '../../config/fonts';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Slider } from '../ui/slider';

interface TypographyPopoverProps {
  editor: Editor;
  children: React.ReactNode;
}

// Font weight options matching the image (Thin to Ultra Black)
const fontWeightItems = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Ultra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '900', label: 'Black' },
  { value: '950', label: 'Ultra Black' },
];

export const TypographyPopover: React.FC<TypographyPopoverProps> = ({ editor, children }) => {
  const [open, setOpen] = useState(false);

  // Get current values from editor - update when popover opens
  const currentAttrs = editor.getAttributes('textStyle');
  const currentFontWeight = currentAttrs.fontWeight || '400';
  const currentFontSize = parseInt(currentAttrs.fontSize || '16');
  const currentLetterSpacing = parseFloat(currentAttrs.letterSpacing || '0');
  const currentFontFamily = currentAttrs.fontFamily || 'inherit';

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [letterSpacing, setLetterSpacing] = useState(currentLetterSpacing);
  const [fontWeight, setFontWeight] = useState(currentFontWeight);
  const [fontFamily, setFontFamily] = useState(currentFontFamily);
  const [previewText, setPreviewText] = useState('What will you ship next?');

  // Update state when popover opens or editor selection changes
  React.useEffect(() => {
    if (open) {
      const attrs = editor.getAttributes('textStyle');
      setFontSize(parseInt(attrs.fontSize || '16'));
      setLetterSpacing(parseFloat(attrs.letterSpacing || '0'));
      setFontWeight(attrs.fontWeight || '400');
      setFontFamily(attrs.fontFamily || "'Overused Grotesk', sans-serif");
    }
  }, [open, editor]);

  const handleFontFamilyChange = (value: string) => {
    if (value === 'default') {
      editor.chain().focus().unsetFontFamily().run();
      setFontFamily("'Overused Grotesk', sans-serif");
    } else {
      editor.chain().focus().setFontFamily(value).run();
      setFontFamily(value);
    }
  };

  const handleFontWeightChange = (value: string) => {
    editor.chain().focus().setFontWeight(value).run();
    setFontWeight(value);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    editor.chain().focus().setFontSize(`${newSize}px`).run();
  };

  const handleLetterSpacingChange = (value: number[]) => {
    const newSpacing = value[0];
    setLetterSpacing(newSpacing);
    editor.chain().focus().setLetterSpacing(`${newSpacing}%`).run();
  };

  const handleReset = () => {
    editor
      .chain()
      .focus()
      .unsetFontWeight()
      .unsetFontSize()
      .unsetLetterSpacing()
      .unsetFontFamily()
      .run();
    setFontSize(16);
    setLetterSpacing(0);
    setFontWeight('400');
    setFontFamily("'Overused Grotesk', sans-serif");
  };

  const fontWeightLabel =
    fontWeightItems.find((item) => item.value === fontWeight)?.label ?? 'Regular';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="typography-popover" sideOffset={8}>
        <div className="typography-popover__content">
          {/* Controls Row */}
          <div className="typography-popover__controls">
            {/* Font Family Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="toolbar-dropdown-trigger typography-popover__font-select"
                  title="Font Family"
                >
                  <span className="toolbar-dropdown-prefix">Font</span>
                  <span className="toolbar-dropdown-value" style={{ fontFamily: fontFamily }}>
                    {EDITOR_FONTS.find((f) => f.value === fontFamily)?.label ?? 'Grotesk'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="toolbar-dropdown-content typography-popover__font-menu"
              >
                <DropdownMenuLabel className="toolbar-dropdown-label">
                  Font Family
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={fontFamily} onValueChange={handleFontFamilyChange}>
                  {EDITOR_FONTS.map((font) => (
                    <DropdownMenuRadioItem
                      key={font.value}
                      value={font.value}
                      className="toolbar-dropdown-item"
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Font Weight Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="toolbar-dropdown-trigger typography-popover__weight-select"
                  title="Font Weight"
                >
                  <span className="toolbar-dropdown-prefix">Weight</span>
                  <span className="toolbar-dropdown-value">{fontWeightLabel}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="toolbar-dropdown-content typography-popover__weight-menu"
              >
                <DropdownMenuLabel className="toolbar-dropdown-label">
                  Font Weight
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={fontWeight} onValueChange={handleFontWeightChange}>
                  {fontWeightItems.map((item) => (
                    <DropdownMenuRadioItem
                      key={item.value}
                      value={item.value}
                      className="toolbar-dropdown-item"
                    >
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Font Size Slider */}
            <div className="typography-popover__slider-group">
              <label className="typography-popover__label">
                <span className="typography-popover__label-text">Size</span>
                <span className="typography-popover__value">{fontSize}</span>
              </label>
              <Slider
                min={8}
                max={200}
                step={1}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                className="typography-popover__slider"
              />
            </div>

            {/* Letter Spacing Slider */}
            <div className="typography-popover__slider-group">
              <label className="typography-popover__label">
                <span className="typography-popover__label-text">Spacing</span>
                <span className="typography-popover__value">{letterSpacing}%</span>
              </label>
              <Slider
                min={-10}
                max={10}
                step={0.5}
                value={[letterSpacing]}
                onValueChange={handleLetterSpacingChange}
                className="typography-popover__slider"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="typography-popover__reset-btn"
              title="Reset Typography"
            >
              <ArrowUturnLeftIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Editable Preview Text */}
          <div className="typography-popover__preview">
            <input
              type="text"
              className="typography-popover__preview-text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Type to preview..."
              style={{
                fontFamily: fontFamily,
                fontWeight: fontWeight,
                fontSize: `${fontSize}px`,
                letterSpacing: `${letterSpacing}%`,
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TypographyPopover;
