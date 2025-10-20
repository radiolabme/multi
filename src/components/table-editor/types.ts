/**
 * Shared types for table editor extensions
 */

/**
 * Configuration for custom node/cell attributes
 * Can be used for tables, or extended for other node types
 */
export interface CustomAttributeConfig {
  /**
   * Display label for the UI button
   */
  label: string;

  /**
   * The attribute name to set on the node
   */
  attribute: string;

  /**
   * The value to set for this attribute
   */
  value: any;

  /**
   * Optional tooltip text
   */
  title?: string;

  /**
   * Optional condition to determine if this attribute should be shown
   */
  shouldShow?: (editor: any) => boolean;
}

/**
 * Helper to create attribute configurations
 */
export function createAttributeConfig(
  label: string,
  attribute: string,
  value: any,
  options?: { title?: string; shouldShow?: (editor: any) => boolean }
): CustomAttributeConfig {
  return {
    label,
    attribute,
    value,
    title: options?.title,
    shouldShow: options?.shouldShow,
  };
}

/**
 * Common cell attribute presets
 */
export const CellAttributePresets = {
  /**
   * Background color presets
   */
  backgroundColor: {
    yellow: createAttributeConfig('🟨', 'backgroundColor', '#FAF594', {
      title: 'Yellow background',
    }),
    blue: createAttributeConfig('🟦', 'backgroundColor', '#94C5FA', {
      title: 'Blue background',
    }),
    green: createAttributeConfig('🟩', 'backgroundColor', '#94FA9C', {
      title: 'Green background',
    }),
    red: createAttributeConfig('🟥', 'backgroundColor', '#FA9494', {
      title: 'Red background',
    }),
    clear: createAttributeConfig('⬜', 'backgroundColor', null, {
      title: 'Clear background',
    }),
  },

  /**
   * Text alignment presets
   */
  textAlign: {
    left: createAttributeConfig('⬅️', 'textAlign', 'left', {
      title: 'Align left',
    }),
    center: createAttributeConfig('↕️', 'textAlign', 'center', {
      title: 'Align center',
    }),
    right: createAttributeConfig('➡️', 'textAlign', 'right', {
      title: 'Align right',
    }),
  },
};
