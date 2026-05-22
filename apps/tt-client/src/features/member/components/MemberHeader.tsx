import { Plus } from 'lucide-react';

import Button from '@/components/ui/button/Button';

export default function MemberHeader() {
  return (
    <div
      className="
      flex
      flex-col
      gap-5
      md:flex-row
      md:items-center
      md:justify-between
      "
    >
      <div>
        <h1 className="text-3xl font-bold">
          Members
        </h1>

        <p className="text-white/60">
          Manage players,
          referees and members.
        </p>
      </div>

      <Button size="lg">
        <Plus size={18} />
        Add Member
      </Button>
    </div>
  );
}