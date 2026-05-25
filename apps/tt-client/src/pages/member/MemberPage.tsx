import MemberFilter from '@/features/member/components/MemberFilters';
import MemberHeader from '@/features/member/components/MemberHeader';
import MemberStats from '@/features/member/components/MemberStats';
import MemberTable from '@/features/member/components/MemberTable';


export default function MemberPage() {
  return (
    <div className="space-y-6">
      <MemberHeader />

      <MemberStats />

      <MemberFilter />

      <MemberTable />
    </div>
  );
}