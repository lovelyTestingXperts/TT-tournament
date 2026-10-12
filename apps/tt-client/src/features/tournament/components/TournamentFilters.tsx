import { Search } from 'lucide-react';
import Input from '@/components/ui/input/Input';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status?: string;
  onStatusChange: (status?: string) => void;
};

export default function TournamentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div data-testid="tournament-filters" className="glass-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input matching reference */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            data-testid="tournament-search-input"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="pl-10 h-10 text-sm"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="sm:w-[200px]">
          <select
            id="tournament-status-select"
            data-testid="tournament-status-select"
            aria-label="Filter by tournament status"
            value={status ?? ''}
            onChange={(e) => onStatusChange(e.target.value || undefined)}
            className="
              h-10 w-full rounded-button
              border border-white/[0.09]
              bg-surface-850/90 px-3.5 text-sm
              font-medium text-slate-200 outline-none
              transition-all hover:border-white/[0.18]
              focus:border-primary focus:ring-2 focus:ring-primary/20
            "
          >
            <option value="" className="bg-surface-900 text-slate-300">
              Status (All)
            </option>
            <option value="ACTIVE" className="bg-surface-900 text-slate-300">
              Active
            </option>
            <option value="UPCOMING" className="bg-surface-900 text-slate-300">
              Upcoming
            </option>
            <option value="DRAFT" className="bg-surface-900 text-slate-300">
              Draft
            </option>
            <option value="COMPLETED" className="bg-surface-900 text-slate-300">
              Completed
            </option>
            <option value="CANCELLED" className="bg-surface-900 text-slate-300">
              Cancelled
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}