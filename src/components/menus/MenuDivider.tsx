
import React from 'react';

export interface MenuDividerProps {
  className?: string;
}

/**
 * Visual divider for separating menu button groups
 */
export const MenuDivider: React.FC<MenuDividerProps> = ({
  className = 'bubble-menu__divider',
}) => {
  return <div className={className} />;
};
