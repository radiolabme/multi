# table-editor

TipTap table extensions with bubble menu UI.

## Usage

```tsx
import TableEditorExtensions, { TableBubbleMenu } from './components/table-editor';

const editor = useEditor({
  extensions: [StarterKit, ...TableEditorExtensions],
});

<TableBubbleMenu editor={editor} />
```

## Features

Row/column add/delete, merge/split cells, header toggles, cell navigation, custom attributes.

## Props

- `editor` (Editor, required)
- `showNavigation` (boolean, default true) - Show prev/next cell buttons
- `cellAttributes` (CustomAttributeConfig[]) - Custom attribute buttons

### Custom Attributes

```typescript
import { CellAttributePresets, createAttributeConfig } from './components/table-editor';

<TableBubbleMenu
  editor={editor}
  cellAttributes={[
    CellAttributePresets.backgroundColor.yellow,
    createAttributeConfig('Bold', 'fontWeight', 'bold'),
  ]}
/>
```

## Styling

Style via `.bubble-menu--table`:

```css
.bubble-menu--table { }
```

## Dependencies

- @tiptap/core ^3.7.2
- @tiptap/react ^3.7.2
- @tiptap/extension-table ^3.7.2
- react >=18.0.0
