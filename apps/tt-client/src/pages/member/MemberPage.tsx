import PageContainer from '@/components/layout/PageContainer';

import MemberFilters from '@/features/member/components/MemberFilters';
import MemberGrid from '@/features/member/components/MemberGrid';
import MemberHeader from '@/features/member/components/MemberHeader';

export default function MembersPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <MemberHeader />

        <MemberFilters />

        <MemberGrid />
      </div>
    </PageContainer>
  );
}