import { Search } from 'lucide-react';

import Input from '@/components/ui/input/Input';
import Button from '@/components/ui/button/Button';

export default function MemberFilter() {
  return (
    <div
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* search */}
        <div className="relative flex-1">
          <Search
            className="
              absolute left-3 top-1/2
              size-4
              -translate-y-1/2
              text-zinc-500
            "
          />

          <Input
            placeholder="Search by name, email or phone..."
            className="pl-10"
          />
        </div>

        {/* role */}
        <select
          className="
            h-11 rounded-xl
            border border-white/10
            bg-black/40 px-4
            text-sm text-zinc-200
            outline-none
          "
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Referee</option>
          <option>Player</option>
          <option>Member</option>
        </select>

        {/* status */}
        <select
          className="
            h-11 rounded-xl
            border border-white/10
            bg-black/40 px-4
            text-sm text-zinc-200
            outline-none
          "
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Verified</option>
          <option>Unverified</option>
        </select>

        {/* sort */}
        <select
          className="
            h-11 rounded-xl
            border border-white/10
            bg-black/40 px-4
            text-sm text-zinc-200
            outline-none
          "
        >
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Name A-Z</option>
          <option>Name Z-A</option>
        </select>

        <Button>Reset</Button>
      </div>
    </div>
  );
}
