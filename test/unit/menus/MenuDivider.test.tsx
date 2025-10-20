/**
 * Tests for MenuDivider component
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MenuDivider } from '@/components/menus';

describe('MenuDivider', () => {
  it('renders a divider element', () => {
    const { container } = render(<MenuDivider />);

    const divider = container.querySelector('.bubble-menu__divider');
    expect(divider).toBeTruthy();
  });

  it('accepts custom className', () => {
    const { container } = render(<MenuDivider className="custom-divider" />);

    const divider = container.querySelector('.custom-divider');
    expect(divider).toBeTruthy();
  });
});
