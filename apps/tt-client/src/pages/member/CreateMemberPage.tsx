import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MemberForm from '@/features/member/components/MemberForm';
import Button from '@/components/ui/button/Button';

export default function CreateMemberPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/members')}
          className="size-9 p-0"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create User
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            Register players, referees, members, or administrators.
          </p>
        </div>
      </div>

      <MemberForm />
    </div>
  );
}