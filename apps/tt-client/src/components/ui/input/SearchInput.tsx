import { Search } from 'lucide-react';

import Input from './Input';

export default function SearchInput() {
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
      />
    </div>
  );
}