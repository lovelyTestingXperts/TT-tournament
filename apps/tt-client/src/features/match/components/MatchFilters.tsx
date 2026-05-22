import SearchInput from '@/components/ui/input/SearchInput';
import Select from '@/components/ui/input/Select';

export default function MatchFilters() {
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
        <SearchInput placeholder="Search matches..." />
      </div>

      <div className="xl:w-[220px]">
        <Select
          placeholder="Tournament"
          options={[
            {
              label:
                'All',
              value:
                'all',
            },
            {
              label:
                'Winter Cup',
              value:
                'winter',
            },
            {
              label:
                'Summer League',
              value:
                'summer',
            },
          ]}
        />
      </div>

      <div className="xl:w-[220px]">
        <Select
          placeholder="Status"
          options={[
            {
              label:
                'All',
              value:
                'all',
            },
            {
              label:
                'Scheduled',
              value:
                'scheduled',
            },
            {
              label:
                'Live',
              value:
                'live',
            },
            {
              label:
                'Completed',
              value:
                'completed',
            },
          ]}
        />
      </div>
    </div>
  );
}