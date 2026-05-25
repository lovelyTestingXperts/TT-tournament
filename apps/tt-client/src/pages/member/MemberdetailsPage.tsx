import MemberProfileCard from
  '@/features/member/components/MemberProfileCard';

import MemberStatsSection from
  '@/features/member/components/MemberStatsSection';

import MemberInformation from
  '@/features/member/components/MemberInformation';
import MemberTournamentHistory from '@/features/member/components/MemberTournamentHistory';


export default function MemberDetailsPage() {
  return (
    <div className="space-y-6">
      <MemberProfileCard />

      <MemberStatsSection />

      <MemberInformation />

      <MemberTournamentHistory />
    </div>
  );
}