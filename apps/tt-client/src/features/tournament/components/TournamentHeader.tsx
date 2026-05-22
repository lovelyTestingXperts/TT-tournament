import { Plus } from 'lucide-react';

import Button from '@/components/ui/button/Button';

export default function TournamentHeader() {
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
          Tournaments
        </h1>

        <p className="text-white/60">
          Manage tournaments and
          competitions.
        </p>
      </div>

      <Button size="lg">
        <Plus size={18} />

        Create Tournament
      </Button>
    </div>
  );
}