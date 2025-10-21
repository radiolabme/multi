/**
 * Icon Component
 *
 * A simple wrapper for Heroicons that provides consistent sizing and styling
 * across the editor.
 */

import React from 'react';
import { EditorIcons, type EditorIconName, type IconComponent } from './EditorIcons';

export interface IconProps {
  /**
   * The name of the icon from EditorIcons, or a custom Heroicon component
   */
  name?: EditorIconName;
  /**
   * Custom icon component (if not using a named icon)
   */
  icon?: IconComponent;
  /**
   * Size of the icon (width & height)
   * @default 20
   */
  size?: number;
  /**
   * Rotation angle in degrees (90, 180, 270, etc.)
   */
  rotate?: number;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Aria label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Icon component for displaying Heroicons
 *
 * Usage:
 * ```tsx
 * <Icon name="bold" />
 * <Icon name="undo" size={24} />
 * <Icon name="barsArrowUp" rotate={180} />
 * <Icon icon={CustomHeroicon} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  icon,
  size = 20,
  rotate,
  className = '',
  'aria-label': ariaLabel,
}) => {
  // Determine which icon to use
  const IconComponent = icon || (name && EditorIcons[name]);

  if (!IconComponent) {
    console.warn(`Icon not found: ${name}`);
    return null;
  }

  const style: React.CSSProperties = rotate
    ? { transform: `rotate(${rotate}deg)`, display: 'inline-block' }
    : {};

  return (
    <IconComponent
      className={className}
      width={size}
      height={size}
      style={style}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
};
