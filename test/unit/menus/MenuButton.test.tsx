/**
 * Tests for MenuButton component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MenuButton } from '@/components/menus';

describe('MenuButton', () => {
  it('renders button with children', () => {
    render(<MenuButton onClick={vi.fn()}>Click me</MenuButton>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<MenuButton onClick={handleClick}>Click me</MenuButton>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies active class when isActive is true', () => {
    render(
      <MenuButton onClick={vi.fn()} isActive={true}>
        Active
      </MenuButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('is-active');
  });

  it('does not apply active class when isActive is false', () => {
    render(
      <MenuButton onClick={vi.fn()} isActive={false}>
        Inactive
      </MenuButton>
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('is-active');
  });

  it('shows title attribute when provided', () => {
    render(
      <MenuButton onClick={vi.fn()} title="Tooltip text">
        Button
      </MenuButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Tooltip text');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <MenuButton onClick={vi.fn()} disabled={true}>
        Disabled
      </MenuButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <MenuButton onClick={handleClick} disabled={true}>
        Disabled
      </MenuButton>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
