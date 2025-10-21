import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export interface SelectMenuItem {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface SelectMenuProps {
  items: SelectMenuItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  title?: string;
}

const SelectMenu = React.forwardRef<HTMLButtonElement, SelectMenuProps>(
  ({ items, value, onValueChange, placeholder, className, title }, ref) => {
    const selectedItem = items.find((item) => item.value === value);

    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger ref={ref} className={className} title={title}>
          <SelectValue>
            {selectedItem ? (
              selectedItem.icon ? (
                <div
                  style={{ width: '20px', height: '22px', display: 'flex', alignItems: 'center' }}
                >
                  <selectedItem.icon className="w-full h-full" style={{ strokeWidth: 1.8 }} />
                </div>
              ) : (
                <span>{selectedItem.label}</span>
              )
            ) : (
              <span>{placeholder || 'Select...'}</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.icon ? (
                <div
                  style={{
                    width: '20px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <item.icon className="w-full h-full" style={{ strokeWidth: 1.8 }} />
                </div>
              ) : (
                <span>{item.label}</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectMenu.displayName = 'SelectMenu';

export { SelectMenu };
