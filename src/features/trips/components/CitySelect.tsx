import { useState, useRef, useEffect } from 'react';
import { PAKISTANI_CITIES } from '@/constants/cities';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function CitySelect({ value, onChange, disabled, placeholder = 'Select city' }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.length === 0
    ? [...PAKISTANI_CITIES]
    : PAKISTANI_CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (city: string) => {
    onChange(city);
    setQuery('');
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!open) setOpen(true);
    if (e.target.value === '') onChange('');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        disabled={disabled}
        value={open ? query : value}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !value && !open && 'text-muted-foreground'
        )}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-48 overflow-auto">
          {filtered.map((city) => (
            <li
              key={city}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(city); }}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer hover:bg-accent',
                city === value && 'bg-accent font-medium'
              )}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
