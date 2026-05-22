import { Plus } from 'lucide-react';

import Button from '@/components/ui/button/Button';

export default function MatchHeader() {
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
          Matches
        </h1>

        <p className="text-white/60">
          Schedule and manage
          tournament matches.
        </p>
      </div>

      <Button size="lg">
        <Plus size={18} />
        Create Match
      </Button>
    </div>
  );
}