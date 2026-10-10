import { useState, useMemo } from 'react';

import MemberFilter from '@/features/member/components/MemberFilters';
import MemberHeader from '@/features/member/components/MemberHeader';
import MemberStats from '@/features/member/components/MemberStats';
import MemberTable from '@/features/member/components/MemberTable';

import { useUsers } from '@/features/member/graphql/hooks';

export default function MemberPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [sort, setSort] = useState<string>('NEWEST');

  // Convert sort string to GraphQL enum + order
  const sortParams = useMemo(() => {
    switch (sort) {
      case 'OLDEST':
        return { sortBy: 'CREATED_AT', sortOrder: 'ASC' };
      case 'NAME_ASC':
        return { sortBy: 'FULL_NAME', sortOrder: 'ASC' };
      case 'NAME_DESC':
        return { sortBy: 'FULL_NAME', sortOrder: 'DESC' };
      case 'NEWEST':
      default:
        return { sortBy: 'CREATED_AT', sortOrder: 'DESC' };
    }
  }, [sort]);

  const queryInput = useMemo(() => {
    const input: Record<string, any> = {
      page,
      limit,
      sortBy: sortParams.sortBy,
      sortOrder: sortParams.sortOrder,
    };

    if (search.trim()) {
      input.search = search.trim();
    }

    if (role) {
      input.role = role;
    }

    if (status === 'ACTIVE') {
      input.isActive = true;
    } else if (status === 'INACTIVE') {
      input.isActive = false;
    }

    return input;
  }, [page, limit, search, role, status, sortParams]);

  const { data, loading, refetch } = useUsers(queryInput);

  const members = data?.users?.items ?? [];
  const meta = data?.users?.meta;

  const handleReset = () => {
    setSearch('');
    setRole(undefined);
    setStatus(undefined);
    setSort('NEWEST');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <MemberHeader />

      <MemberStats members={members} />

      <MemberFilter
        search={search}
        role={role}
        status={status}
        sort={sort}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onRoleChange={(val) => {
          setRole(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onSortChange={(val) => {
          setSort(val || 'NEWEST');
          setPage(1);
        }}
        onReset={handleReset}
      />

      <MemberTable
        members={members}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        onRefresh={() => refetch()}
      />
    </div>
  );
}