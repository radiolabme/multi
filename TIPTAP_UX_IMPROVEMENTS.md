# TipTap Editor UX Improvements

Based on research of common TipTap issues and community solutions, here are identified UX quirks and recommended fixes for the editor.

## Current Status

Your editor currently has:

- ✅ StarterKit (includes most core functionality)
- ✅ Link extension with bubble menu + **autolink** + **linkOnPaste**
- ✅ Placeholder extension (node-specific placeholders)
- ✅ FontFamily extension
- ✅ Table extensions with bubble menu
- ✅ TextStyle extension
- ✅ **Gapcursor** (cursor after block elements)
- ✅ **Nested HTML protection** (prevents freezing on complex paste)
- ✅ **Enhanced focus restoration** (handleDOMEvents blur prevention)

## Common UX Issues & Solutions

### 1. **Gapcursor Extension (RECOMMENDED - HIGH PRIORITY)**

**Issue:** Users cannot place cursor after tables, images, or other block elements at the end of document. This creates frustration when trying to add content after these elements.

**Solution:** Add the Gapcursor extension (already available in your project).

```typescript
import { Gapcursor } from '@tiptap/extension-gapcursor';

// In extensions array:
Gapcursor,
```

**Why:** This is one of the most common complaints. Without gapcursor, users get stuck and can't continue typing after certain block elements.

**GitHub Issues:** #6251, #5994, #6168

---

### 2. **Whitespace Handling on Paste (MEDIUM PRIORITY)**

**Issue:** When pasting text from external sources (Word, browsers), leading/trailing whitespace is sometimes removed or extra line breaks are added.

**Solutions:**

#### A. Configure ClipboardTextSerializer

```typescript
import { ClipboardTextSerializer } from '@tiptap/extension-clipboard-text-serializer';

ClipboardTextSerializer.configure({
  // Preserve whitespace
});
```

#### B. Add custom paste handler in editorProps

```typescript
editorProps: {
  transformPastedText(text) {
    // Trim excessive whitespace but preserve intentional spacing
    return text.replace(/\n{3,}/g, '\n\n');
  },
  transformPastedHTML(html) {
    // Clean up pasted HTML
    return html.replace(/&nbsp;/g, ' ');
  },
}
```

**GitHub Issues:** #6254, #6117, #6165, #6216

---

### 3. **Redundant Line Breaks in Lists (LOW-MEDIUM PRIORITY)**

**Issue:** Copying/pasting bullet lists adds extra line breaks between items.

**Solution:** Configure list items to handle spacing better:

```typescript
StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: 'tiptap-bullet-list',
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: 'tiptap-ordered-list',
    },
  },
  listItem: {
    HTMLAttributes: {
      class: 'tiptap-list-item',
    },
  },
});
```

Then in CSS:

```css
.tiptap-bullet-list,
.tiptap-ordered-list {
  margin: 0.5em 0;
}

.tiptap-list-item > p {
  margin: 0;
}
```

**GitHub Issue:** #6188

---

### 4. **Link Detection Without Whitespace (MEDIUM PRIORITY)**

**Issue:** Link autodetect plugin doesn't recognize URLs unless followed by whitespace.

**Current Status:** You're using custom link bubble menu, so this may not apply. But if you add autolink detection:

```typescript
import { Link } from '@tiptap/extension-link';

Link.configure({
  autolink: true,
  linkOnPaste: true,
  openOnClick: true,
  // Add this to improve detection:
  protocols: ['http', 'https', 'mailto'],
});
```

**GitHub Issue:** #6251, #6293

---

### 5. **Placeholder Improvements (ALREADY IMPLEMENTED)**

**Current Status:** ✅ You have placeholder configured.

**Potential Enhancement:** Different placeholders for different node types:

```typescript
Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return 'Heading...';
    }
    if (node.type.name === 'codeBlock') {
      return '// Code here...';
    }
    return 'Start typing...';
  },
  showOnlyCurrent: true,
  includeChildren: false,
});
```

---

### 6. **Performance: Link Extension Optimization (LOW PRIORITY)**

**Issue:** Link extension can cause performance issues with large documents.

**Solution:** Already addressed in your config with `openOnClick: true`. No action needed.

**GitHub Issue:** #5957

---

### 7. **Inline Code Shortcut Behavior (LOW PRIORITY)**

**Issue:** Inline code mark can be applied without typing backticks in some scenarios.

**Status:** StarterKit handles this. Monitor if users report issues.

**GitHub Issue:** #6380

---

### 8. **Deeply Nested HTML Paste Hangs (LOW PRIORITY)**

**Issue:** Pasting deeply nested HTML with inline styles can freeze editor.

**Solution:** Add paste size/complexity limits:

```typescript
editorProps: {
  transformPastedHTML(html) {
    // Limit nesting depth
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove deeply nested structures
    const maxDepth = 10;
    const removeDeepNesting = (el: Element, depth = 0) => {
      if (depth > maxDepth) {
        el.innerHTML = el.textContent || '';
        return;
      }
      Array.from(el.children).forEach(child =>
        removeDeepNesting(child, depth + 1)
      );
    };

    removeDeepNesting(div);
    return div.innerHTML;
  },
}
```

**GitHub Issue:** #6878

---

### 9. **Table Copy/Paste Issues (LOW PRIORITY)**

**Issue:** Copying table cells includes text from other cells when pasting as plain text.

**Status:** You're using table extensions. This is a known upstream issue. Monitor for updates.

**GitHub Issue:** #6867

---

### 10. **Focus Management (MEDIUM PRIORITY)**

**Issue:** Editor loses focus when interacting with bubble menus or external elements.

**Solution:** Add focus restoration:

```typescript
// In your bubble menu handlers
const handleAction = () => {
  // Perform action
  editor.commands.someCommand();

  // Restore focus
  setTimeout(() => editor.commands.focus(), 0);
};
```

**Current Status:** Your LinkBubbleMenu uses `editor.chain().focus()` - good!

---

## Priority Implementation Plan

### Phase 1: Critical UX (✅ COMPLETED)

1. ✅ **Add Gapcursor** - Solves the "stuck after table" problem
2. ✅ **Whitespace paste handling** - Improves paste from external sources
3. ✅ **Nested HTML protection** - Prevents freezing on complex pastes

### Phase 2: Polish (✅ COMPLETED)

1. ✅ **Enhanced placeholder per node type** - Better user guidance
2. ✅ **List spacing CSS fixes** - Cleaner list appearance
3. ✅ **Link autodetection** - URLs detected without trailing space
4. ✅ **Link on paste** - Pasted URLs automatically become links
5. ✅ **Focus restoration** - Better blur handling for bubble menus

### Phase 3: Edge Cases (Monitor & Implement If Users Report)

1. ⏳ **Table paste handling** - Wait for upstream fixes in TipTap

---

## Recommended Configuration Update

Here's the updated SimpleEditor extensions configuration with priority fixes:

```typescript
import { Gapcursor } from '@tiptap/extension-gapcursor';

const editor = useEditor({
  extensions: mergeExtensions(
    [
      StarterKit.configure({
        link: false,
        // Improve list handling
        bulletList: {
          HTMLAttributes: { class: 'tiptap-bullet-list' },
        },
        orderedList: {
          HTMLAttributes: { class: 'tiptap-ordered-list' },
        },
        listItem: {
          HTMLAttributes: { class: 'tiptap-list-item' },
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Heading...';
          }
          if (node.type.name === 'codeBlock') {
            return '// Code here...';
          }
          return 'Start typing...';
        },
        showOnlyCurrent: true,
      }),
      Gapcursor, // NEW: Critical for cursor positioning
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    TableEditorExtensions
  ),
  editorProps: {
    attributes: {
      class: 'simple-editor-content',
    },
    // NEW: Improve paste behavior
    transformPastedText(text) {
      // Reduce excessive line breaks
      return text.replace(/\n{3,}/g, '\n\n');
    },
    transformPastedHTML(html) {
      // Clean up common paste issues
      return html.replace(/&nbsp;/g, ' ').replace(/<span style="[^"]*">/g, '<span>'); // Remove inline styles from spans
    },
  },
  // ... rest of config
});
```

---

## CSS Additions

Add to `SimpleEditor.css` or a new `editor-fixes.css`:

```css
/* List spacing improvements */
.tiptap-bullet-list,
.tiptap-ordered-list {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.tiptap-list-item > p {
  margin: 0;
}

.tiptap-list-item + .tiptap-list-item {
  margin-top: 0.25em;
}

/* Gapcursor styling (default is usually fine, but can customize) */
.ProseMirror-gapcursor {
  display: block;
  pointer-events: none;
  position: relative;
}

.ProseMirror-gapcursor:after {
  content: '';
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid var(--color-primary, black);
  animation: ProseMirror-gapcursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-gapcursor-blink {
  to {
    visibility: hidden;
  }
}
```

---

## Testing Checklist

After implementing fixes, test these scenarios:

- [ ] Insert table, try to place cursor after it and type
- [ ] Paste text from Word/Google Docs with whitespace
- [ ] Paste list from external source
- [ ] Copy/paste content within editor
- [ ] Use inline code and bold/italic together
- [ ] Click bubble menu items, verify focus returns to editor
- [ ] Type URL and see if it's detected (if autolink enabled)
- [ ] Paste deeply nested HTML (e.g., from complex website)

---

## Additional Resources

- [TipTap Gapcursor Docs](https://tiptap.dev/docs/editor/api/extensions/gapcursor)
- [TipTap Placeholder Docs](https://tiptap.dev/docs/editor/api/extensions/placeholder)
- [GitHub Issues Search](https://github.com/ueberdosis/tiptap/issues?q=is%3Aissue+paste)
- [TipTap Community Extensions](https://github.com/ueberdosis/tiptap/discussions/2973)

---

## Notes

- Most paste issues stem from ProseMirror's underlying architecture
- TipTap v3 (current) has improved many issues from v2
- Always test paste behavior across browsers (Chrome, Safari, Firefox)
- Mobile paste behavior may differ - test on iOS/Android if targeting mobile
