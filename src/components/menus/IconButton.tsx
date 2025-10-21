/**
 * IconButton Component
 *
 * A specialized button component for menu buttons with icons.
 * Wraps MenuButton with Heroicon support.
 */

import React from 'react';
import { Icon, type EditorIconName, type IconComponent } from '../icons';
import { MenuButton, type MenuButtonProps } from './MenuButton';

export interface IconButtonProps extends Omit<MenuButtonProps, 'children'> {
  /**
   * Icon name from EditorIcons
   */
  icon?: EditorIconName;
  /**
   * Custom icon component
   */
  iconComponent?: IconComponent;
  /**
   * Optional label text to show after icon
   */
  label?: string;
  /**
   * Icon size
   * @default 18
   */
  iconSize?: number;
  /**
   * Optional children (overrides icon + label)
   */
  children?: React.ReactNode;
}

/**
 * IconButton - A menu button with Heroicon support
 *
 * Usage:
 * ```tsx
 * <IconButton icon="bold" title="Bold" onClick={handleBold} />
 * <IconButton icon="link" label="Link" onClick={handleLink} />
 * <IconButton iconComponent={CustomIcon} label="Custom" />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      iconComponent,
      label,
      iconSize = 18,
      children,
      className = '',
      ...menuButtonProps
    },
    ref
  ) => {
    // If children are provided, use them directly
    if (children) {
      return (
        <MenuButton ref={ref} className={className} {...menuButtonProps}>
          {children}
        </MenuButton>
      );
    }

    // Otherwise, render icon + optional label
    return (
      <MenuButton ref={ref} className={className} {...menuButtonProps}>
        {(icon || iconComponent) && (
          <Icon name={icon} icon={iconComponent} size={iconSize} aria-hidden={!!label} />
        )}
        {label && <span className="button-label">{label}</span>}
      </MenuButton>
    );
  }
);

IconButton.displayName = 'IconButton';
