import SearchInput from '@/components/ui/input/SearchInput';
import Select from '@/components/ui/input/Select';

export default function TournamentFilters() {
  return (
    <div
      className="
      flex
      flex-col
      gap-4
      xl:flex-row
      "
    >
      <div className="flex-1">
        <SearchInput placeholder="Search tournament..." />
      </div>

      <div className="xl:w-[220px]">
        <Select
          placeholder="Status"
          options={[
            {
              label: 'All',
              value: 'all',
            },
            {
              label: 'Active',
              value: 'active',
            },
            {
              label: 'Upcoming',
              value: 'upcoming',
            },
            {
              label: 'Completed',
              value: 'completed',
            },
          ]}
        />
      </div>
    </div>
  );
}