import { Plus, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/button/Button';

export default function TournamentHeader() {
  const navigate = useNavigate();

  return (
    <div data-testid="tournament-header" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-panel border border-primary/30 bg-primary/10 text-primary">
            <Trophy className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tournaments
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Manage tournaments and competitions.
        </p>
      </div>

      <Button
        data-testid="create-tournament-btn"
        variant="primary"
        size="md"
        onClick={() => navigate('/tournaments/create')}
        className="gap-2"
      >
        <Plus className="size-4" />
        <span>Create Tournament</span>
      </Button>
    </div>
  );
}