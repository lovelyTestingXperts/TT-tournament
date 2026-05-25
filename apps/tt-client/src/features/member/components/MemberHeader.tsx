import { Plus } from 'lucide-react';

import Button from '@/components/ui/button/Button';

export default function MemberHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>

        <p className="mt-1 text-sm text-zinc-400">
          Manage players, referees and members across tournaments.
        </p>
      </div>

      <Button className="gap-2 rounded-xl">
        <Plus className="size-4" />
        Add User
      </Button>
    </div>
  );
}
