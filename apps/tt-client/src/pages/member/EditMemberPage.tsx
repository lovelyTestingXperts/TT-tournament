import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MemberEditForm from '@/features/member/components/MemberEditForm';
import Button from '@/components/ui/button/Button';
import { useUser } from '@/features/member/graphql/hooks';

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useUser(id || '');

  if (loading) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm">Loading user details...</p>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="glass-card p-8 text-center text-red-400">
        <p>User not found or an error occurred.</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/members')}
        >
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/members/${id}`)}
          className="size-9 p-0"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Edit User: {data.user.fullName}
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            Update user credentials, assigned roles, and account active state.
          </p>
        </div>
      </div>

      <MemberEditForm initialData={data.user} userId={id!} />
    </div>
  );
}