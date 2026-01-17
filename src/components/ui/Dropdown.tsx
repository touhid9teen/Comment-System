import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './dropdown.scss';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  selected: string;
  onSelect: (value: string) => void;
  label?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ items, selected, onSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(i => i.value === selected);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown__trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="dropdown__trigger-text">
          {label && <span className="dropdown__label">{label} </span>}
          {selectedItem ? selectedItem.label : 'Select'}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="dropdown__menu">
          {items.map((item) => (
            <button
              key={item.value}
              className={`dropdown__item ${item.value === selected ? 'dropdown__item--selected' : ''}`}
              onClick={() => {
                onSelect(item.value);
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
