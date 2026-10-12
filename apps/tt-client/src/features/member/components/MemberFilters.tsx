import { RotateCcw, Search } from 'lucide-react';

import Input from '@/components/ui/input/Input';
import Button from '@/components/ui/button/Button';

type MemberFilterProps = {
  search: string;
  role?: string;
  status?: string;
  sort?: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value?: string) => void;
  onStatusChange: (value?: string) => void;
  onSortChange: (value?: string) => void;
  onReset: () => void;
};

export default function MemberFilter({
  search,
  role,
  status,
  sort,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
  onReset,
}: MemberFilterProps) {
  return (
    <div data-testid="member-filters" className="glass-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <Input
            data-testid="user-search-input"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="pl-10 h-10 text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <select
            id="user-role-select"
            data-testid="user-role-select"
            aria-label="Filter users by role"
            value={role ?? ''}
            onChange={(e) => onRoleChange(e.target.value || undefined)}
            className="
              h-10
              rounded-button
              border
              border-white/[0.09]
              bg-surface-850/90
              px-3.5
              text-sm
              font-medium
              text-slate-200
              outline-none
              transition-all
              hover:border-white/[0.18]
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          >
            <option value="" className="bg-surface-900 text-slate-300">All Roles</option>
            <option value="ADMIN" className="bg-surface-900 text-slate-300">Admin</option>
            <option value="REFEREE" className="bg-surface-900 text-slate-300">Referee</option>
            <option value="PLAYER" className="bg-surface-900 text-slate-300">Player</option>
            <option value="MEMBER" className="bg-surface-900 text-slate-300">Member</option>
          </select>

          {/* Status Filter */}
          <select
            id="user-status-select"
            data-testid="user-status-select"
            aria-label="Filter users by status"
            value={status ?? ''}
            onChange={(e) => onStatusChange(e.target.value || undefined)}
            className="
              h-10
              rounded-button
              border
              border-white/[0.09]
              bg-surface-850/90
              px-3.5
              text-sm
              font-medium
              text-slate-200
              outline-none
              transition-all
              hover:border-white/[0.18]
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          >
            <option value="" className="bg-surface-900 text-slate-300">All Status</option>
            <option value="ACTIVE" className="bg-surface-900 text-slate-300">Active</option>
            <option value="INACTIVE" className="bg-surface-900 text-slate-300">Inactive</option>
          </select>

          {/* Sort Filter */}
          <select
            id="user-sort-select"
            data-testid="user-sort-select"
            aria-label="Sort users"
            value={sort ?? ''}
            onChange={(e) => onSortChange(e.target.value || undefined)}
            className="
              h-10
              rounded-button
              border
              border-white/[0.09]
              bg-surface-850/90
              px-3.5
              text-sm
              font-medium
              text-slate-200
              outline-none
              transition-all
              hover:border-white/[0.18]
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          >
            <option value="NEWEST" className="bg-surface-900 text-slate-300">Newest First</option>
            <option value="OLDEST" className="bg-surface-900 text-slate-300">Oldest First</option>
            <option value="NAME_ASC" className="bg-surface-900 text-slate-300">Name A-Z</option>
            <option value="NAME_DESC" className="bg-surface-900 text-slate-300">Name Z-A</option>
          </select>

          {/* Reset button */}
          <Button
            data-testid="user-reset-filters-btn"
            variant="secondary"
            size="md"
            onClick={onReset}
            className="gap-1.5 px-3.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
}