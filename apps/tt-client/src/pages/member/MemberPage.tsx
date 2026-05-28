import { useState } from 'react';

import MemberFilter from '@/features/member/components/MemberFilters';
import MemberHeader from '@/features/member/components/MemberHeader';
import MemberStats from '@/features/member/components/MemberStats';
import MemberTable from '@/features/member/components/MemberTable';

import { useUsers } from '@/features/member/graphql/hooks';

export default function MemberPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>();

  const {
    data,
    loading,
    error,
    refetch,
  } = useUsers({
    page,
    limit,
    search,
    role,
  });

  const members =
    data?.users?.items ?? [];

  const meta =
    data?.users?.meta;

  return (
    <div className="space-y-6">
      <MemberHeader />

      <MemberStats
        members={members}
      />

      <MemberFilter
        search={search}
        role={role}
        onSearchChange={setSearch}
        onRoleChange={setRole}
      />

      <MemberTable
        members={members}
        loading={loading}
        page={page}
        totalPages={
          meta?.totalPages ?? 1
        }
        onPageChange={setPage}
      />
    </div>
  );
}