# menus

Reusable helpers for building TipTap bubble and floating menus.

## Components

### BubbleMenuWrapper

```tsx
<BubbleMenuWrapper
  editor={editor}
  pluginKey="myMenu"
  shouldShow={whenTextSelected}
>
  {/* buttons */}
</BubbleMenuWrapper>
```

### MenuButton

```tsx
<MenuButton
  onClick={() => editor.chain().focus().toggleBold().run()}
  isActive={isBold}
  disabled={false}
  title="Bold"
>
  <strong>B</strong>
</MenuButton>
```

### MenuDivider

```tsx
<MenuDivider />
```

## Hooks

```tsx
const isBold = useIsActive(editor, 'bold');
const isH1 = useIsActive(editor, 'heading', { level: 1 });

const canUndo = useCanExecute(editor, (chain) => chain.undo());

const linkAttrs = useAttributes(editor, 'link');
const href = linkAttrs?.href;
```

## Predicates

```tsx
import {
  whenTextSelected,
  whenInLink,
  whenInTable,
  whenTextSelectedNotInTable,
  combineAnd,
  combineOr,
  not,
} from './components/menus';

<BubbleMenuWrapper shouldShow={whenTextSelected} ... />

const custom = combineAnd(whenTextSelected, not(whenInTable));
```

## Example

```tsx
import {
  BubbleMenuWrapper,
  MenuButton,
  MenuDivider,
  useIsActive,
  whenTextSelectedNotInTable,
} from './components/menus';

export const TextMenu = ({ editor }) => {
  const isBold = useIsActive(editor, 'bold');
  const isItalic = useIsActive(editor, 'italic');

  return (
    <BubbleMenuWrapper editor={editor} pluginKey="textMenu" shouldShow={whenTextSelectedNotInTable}>
      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={isBold}>
        <strong>B</strong>
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={isItalic}>
        <em>I</em>
      </MenuButton>
    </BubbleMenuWrapper>
  );
};
```

## Styling

```css
.bubble-menu { }
.bubble-menu button { }
.bubble-menu button.is-active { }
.bubble-menu__divider { }
```
