import log from 'loglevel';
import React from 'react';

export interface MenuButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
  actionName?: string;
}

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    { onClick, isActive = false, disabled = false, title, children, className = '', actionName },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent) => {
      if (!onClick) return;

      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        if (actionName) {
          log.debug('Menu action:', actionName, { title, isActive });
        }
        onClick?.();
      }
    };
    const classes = [className, isActive && 'is-active'].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        title={title}
        className={classes || undefined}
        type="button"
      >
        {children}
      </button>
    );
  }
);

MenuButton.displayName = 'MenuButton';
