/**
 * FontWeight Extension for TipTap
 *
 * Allows setting font weight on text using CSS font-weight property.
 * Works with TextStyle extension.
 */
import { Extension } from '@tiptap/core';

export interface FontWeightOptions {
  types: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontWeight: {
      /**
       * Set the font weight
       */
      setFontWeight: (fontWeight: string) => ReturnType;
      /**
       * Unset the font weight
       */
      unsetFontWeight: () => ReturnType;
    };
  }
}

export const FontWeight = Extension.create<FontWeightOptions>({
  name: 'fontWeight',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) => element.style.fontWeight?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) {
                return {};
              }

              return {
                style: `font-weight: ${attributes.fontWeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontWeight:
        (fontWeight: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontWeight }).run();
        },
      unsetFontWeight:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontWeight: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

export default FontWeight;
