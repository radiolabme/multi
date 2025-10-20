/**
 * Tests for SimpleEditor component
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SimpleEditor from '@/components/SimpleEditor';

describe('SimpleEditor', () => {
  it('renders without crashing', () => {
    const { container } = render(<SimpleEditor />);
    expect(container).toBeTruthy();
  });

  it('renders editor content area', () => {
    const { container } = render(<SimpleEditor />);

    const editor = container.querySelector('.simple-editor-content');
    expect(editor).toBeTruthy();
  });

  it('renders with initial content', () => {
    const { container } = render(<SimpleEditor />);

    const editor = container.querySelector('.simple-editor-content');
    expect(editor?.textContent).toContain('Test');
  });

  it('has editable content area', () => {
    const { container } = render(<SimpleEditor />);

    const editor = container.querySelector('.simple-editor-content');
    expect(editor?.getAttribute('contenteditable')).toBe('true');
  });

  it('renders toolbar', () => {
    const { container } = render(<SimpleEditor />);

    const toolbar = container.querySelector('.simple-editor-toolbar');
    expect(toolbar).toBeTruthy();
  });
});
