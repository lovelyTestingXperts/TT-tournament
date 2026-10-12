import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MemberProfileCard from '@/features/member/components/MemberProfileCard';
import MemberInformation from '@/features/member/components/MemberInformation';
import MemberStatsSection from '@/features/member/components/MemberStatsSection';
import MemberTournamentHistory from '@/features/member/components/MemberTournamentHistory';
import Button from '@/components/ui/button/Button';
import { useUser } from '@/features/member/graphql/hooks';

export default function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useUser(id || '');

  if (loading) {
    return (
      <div data-testid="member-details-loading" className="glass-card flex flex-col items-center justify-center p-14 text-slate-400">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm">Loading user profile...</p>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div data-testid="member-not-found" className="glass-card p-10 text-center">
        <h3 className="text-base font-semibold text-white">User Not Found</h3>
        <p className="mt-1 text-sm text-slate-400">
          The requested user does not exist or may have been deleted.
        </p>
        <Button
          data-testid="return-to-members-btn"
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => navigate('/members')}
        >
          Return to Member Directory
        </Button>
      </div>
    );
  }

  const member = data.user;

  return (
    <div data-testid="member-details-page" className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          data-testid="back-to-members-btn"
          variant="secondary"
          size="sm"
          onClick={() => navigate('/members')}
          className="size-9 p-0"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Back to Member Directory
        </span>
      </div>

      <MemberProfileCard member={member} onRefresh={() => refetch()} />

      <MemberInformation member={member} />

      <MemberStatsSection />

      <MemberTournamentHistory />
    </div>
  );
}