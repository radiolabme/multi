import * as RadixPopover from '@radix-ui/react-popover';
import React from 'react';

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  modal?: boolean;
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface PopoverContentProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
  portal?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: CustomEvent) => void;
}

/**
 * Popover root component - provides context for trigger and content
 */
export const Popover: React.FC<PopoverProps> = ({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
  modal = false,
}) => {
  return (
    <RadixPopover.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      modal={modal}
    >
      {children}
    </RadixPopover.Root>
  );
};

/**
 * Popover trigger - element that toggles the popover
 */
export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild = false }) => {
  return <RadixPopover.Trigger asChild={asChild}>{children}</RadixPopover.Trigger>;
};

/**
 * Popover content - the actual popover that appears
 */
export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  className = '',
  portal = true,
  onEscapeKeyDown,
  onPointerDownOutside,
}) => {
  const content = (
    <RadixPopover.Content
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={className}
      onEscapeKeyDown={onEscapeKeyDown}
      onPointerDownOutside={onPointerDownOutside}
    >
      {children}
    </RadixPopover.Content>
  );

  if (portal) {
    return <RadixPopover.Portal>{content}</RadixPopover.Portal>;
  }

  return content;
};

/**
 * Popover close button - optional close trigger
 */
export const PopoverClose: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({
  children,
  asChild = false,
}) => {
  return <RadixPopover.Close asChild={asChild}>{children}</RadixPopover.Close>;
};

/**
 * Popover arrow - optional arrow pointing to trigger
 */
export const PopoverArrow: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 10,
  height = 5,
}) => {
  return <RadixPopover.Arrow className={className} width={width} height={height} />;
};
