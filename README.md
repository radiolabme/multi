# TipTap v3.x Editor

A modern, feature-rich rich-text editor built with TipTap v3.x, React, TypeScript, and Vite.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: Multiple heading levels (H1-H6)
- **Lists**: Bullet and numbered lists
- **Code**: Inline code and code blocks with syntax highlighting
- **Blockquotes**: Beautiful blockquote styling
- **Links**: Add and edit hyperlinks
- **Horizontal Rules**: Insert dividers
- **History**: Undo/Redo functionality
- **Keyboard Shortcuts**: Full keyboard support

## Tech Stack

- **TipTap v3.x**: Modern headless editor framework
- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **ESLint**: Code quality
- **Prettier**: Code formatting

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The editor will be available at `http://localhost:3000`.

### Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── TipTapEditor.tsx      # Main editor component
│   │   ├── TipTapEditor.css      # Editor styles
│   │   ├── MenuBar.tsx           # Toolbar component
│   │   └── MenuBar.css           # Toolbar styles
│   ├── App.tsx                    # App component
│   ├── App.css                    # App styles
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── README.md                      # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Keyboard Shortcuts

- **Ctrl/Cmd + B** - Bold
- **Ctrl/Cmd + I** - Italic
- **Ctrl/Cmd + U** - Underline
- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo

## Customization

### Adding Extensions

TipTap is highly extensible. To add more extensions:

1. Install the extension:

```bash
npm install @tiptap/extension-[name]
```

2. Import and add to the editor configuration in `src/components/TipTapEditor.tsx`:

```typescript
import ExtensionName from '@tiptap/extension-[name]';

const editor = useEditor({
  extensions: [
    // ... existing extensions
    ExtensionName,
  ],
});
```

### Styling

- `src/components/TipTapEditor.css` - Editor content styles
- `src/components/MenuBar.css` - Toolbar styles
- `src/App.css` - App layout styles
- `src/index.css` - Global styles

## Resources

- [TipTap Documentation](https://tiptap.dev)
- [TipTap Extensions](https://tiptap.dev/extensions)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## License

MIT License - see [LICENSE](LICENSE) file for details
