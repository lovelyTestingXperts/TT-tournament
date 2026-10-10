import { Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button/Button';

export default function MemberHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-panel border border-primary/30 bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            User Management
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Manage players, referees, and permissions across all active tournaments.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/members/create')}
        className="gap-2"
      >
        <Plus className="size-4" />
        <span>Add User</span>
      </Button>
    </div>
  );
}
