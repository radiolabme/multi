/**
 * Unit tests for table editor types and helpers
 */

import { describe, expect, it } from 'vitest';
import { CellAttributePresets, createAttributeConfig } from '@/components/table-editor';

describe('createAttributeConfig', () => {
  it('creates config with required properties', () => {
    const config = createAttributeConfig('Label', 'attr', 'value');

    expect(config).toEqual({
      label: 'Label',
      attribute: 'attr',
      value: 'value',
    });
  });

  it('creates config with all optional properties', () => {
    const shouldShow = () => true;
    const config = createAttributeConfig('Label', 'attr', 'value', {
      title: 'Tooltip',
      shouldShow,
    });

    expect(config).toEqual({
      label: 'Label',
      attribute: 'attr',
      value: 'value',
      title: 'Tooltip',
      shouldShow,
    });
  });

  it('handles null values', () => {
    const config = createAttributeConfig('Clear', 'bg', null);
    expect(config.value).toBeNull();
  });
});

describe('CellAttributePresets', () => {
  describe('backgroundColor', () => {
    it('has yellow preset with correct hex value', () => {
      expect(CellAttributePresets.backgroundColor.yellow).toEqual({
        label: '🟨',
        attribute: 'backgroundColor',
        value: '#FAF594',
        title: 'Yellow background',
      });
    });

    it('has blue preset', () => {
      expect(CellAttributePresets.backgroundColor.blue.value).toBe('#94C5FA');
    });

    it('has green preset', () => {
      expect(CellAttributePresets.backgroundColor.green.value).toBe('#94FA9C');
    });

    it('has red preset', () => {
      expect(CellAttributePresets.backgroundColor.red.value).toBe('#FA9494');
    });

    it('has clear preset with null value', () => {
      expect(CellAttributePresets.backgroundColor.clear.value).toBeNull();
    });

    it('all presets use backgroundColor attribute', () => {
      const presets = Object.values(CellAttributePresets.backgroundColor);
      presets.forEach((preset) => {
        expect(preset.attribute).toBe('backgroundColor');
      });
    });
  });

  describe('textAlign', () => {
    it('has left alignment', () => {
      expect(CellAttributePresets.textAlign.left).toEqual({
        label: '⬅️',
        attribute: 'textAlign',
        value: 'left',
        title: 'Align left',
      });
    });

    it('has center alignment', () => {
      expect(CellAttributePresets.textAlign.center.value).toBe('center');
    });

    it('has right alignment', () => {
      expect(CellAttributePresets.textAlign.right.value).toBe('right');
    });

    it('all presets use textAlign attribute', () => {
      const presets = Object.values(CellAttributePresets.textAlign);
      presets.forEach((preset) => {
        expect(preset.attribute).toBe('textAlign');
      });
    });
  });
});
