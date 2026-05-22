import SearchInput from '@/components/ui/input/SearchInput';
import Select from '@/components/ui/input/Select';

export default function MemberFilters() {
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
        <SearchInput placeholder="Search members..." />
      </div>

      <div className="xl:w-[220px]">
        <Select
          placeholder="Role"
          options={[
            {
              label: 'All',
              value: 'all',
            },
            {
              label: 'Player',
              value: 'player',
            },
            {
              label: 'Member',
              value: 'member',
            },
            {
              label: 'Referee',
              value: 'referee',
            },
          ]}
        />
      </div>
    </div>
  );
}