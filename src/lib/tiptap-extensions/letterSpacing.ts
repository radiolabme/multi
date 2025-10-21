/**
 * LetterSpacing Extension for TipTap
 *
 * Allows setting letter spacing on text using CSS letter-spacing property.
 * Works with TextStyle extension.
 */
import { Extension } from '@tiptap/core';

export interface LetterSpacingOptions {
  types: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    letterSpacing: {
      /**
       * Set the letter spacing
       */
      setLetterSpacing: (letterSpacing: string) => ReturnType;
      /**
       * Unset the letter spacing
       */
      unsetLetterSpacing: () => ReturnType;
    };
  }
}

export const LetterSpacing = Extension.create<LetterSpacingOptions>({
  name: 'letterSpacing',

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
          letterSpacing: {
            default: null,
            parseHTML: (element) => element.style.letterSpacing?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.letterSpacing) {
                return {};
              }

              return {
                style: `letter-spacing: ${attributes.letterSpacing}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { letterSpacing }).run();
        },
      unsetLetterSpacing:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { letterSpacing: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

export default LetterSpacing;
