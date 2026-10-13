import { Search } from 'lucide-react';

import Input from './Input';
import { InputProps } from './input.types';

export default function SearchInput(props: InputProps) {
  return (
    <div className="relative">
      <Search
        className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-white/50
      "
        size={18}
      />

      <Input
        className="pl-12"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
}