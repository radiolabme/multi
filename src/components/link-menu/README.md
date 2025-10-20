# link-menu

Bubble menu for editing links in TipTap.

## Usage

```tsx
import { LinkBubbleMenu } from './components/link-menu';

<LinkBubbleMenu editor={editor} />
```

Shows when cursor is inside a link. Actions: edit URL, remove link, open in new tab.

## Styling

Style via `.bubble-menu--link`:

```css
.bubble-menu--link { }
```

## Dependencies

- @tiptap/core ^3.7.2
- @tiptap/react ^3.7.2  
- react >=18.0.0
