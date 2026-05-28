import { Search } from 'lucide-react';

import Input from '@/components/ui/input/Input';
import Button from '@/components/ui/button/Button';

type MemberFilterProps = {
  search: string;
  role?: string;
  status?: string;
  sort?: string;

  onSearchChange: (
    value: string
  ) => void;

  onRoleChange: (
    value?: string
  ) => void;

  onStatusChange: (
    value?: string
  ) => void;

  onSortChange: (
    value?: string
  ) => void;

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
    <div
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* search */}
        <div className="relative flex-1">
          <Search
            className="
              absolute left-3 top-1/2
              size-4
              -translate-y-1/2
              text-zinc-500
            "
          />

          <Input
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
            placeholder="Search by name, email or phone..."
            className="pl-10"
          />
        </div>

        {/* role */}
        <select
          value={role ?? ''}
          onChange={(e) =>
            onRoleChange(
              e.target.value || undefined
            )
          }
          className="
            h-11 rounded-xl
            border border-white/10
            bg-black/40 px-4
            text-sm text-zinc-200
            outline-none
          "
        >
          <option value="">
            All Roles
          </option>

          <option value="ADMIN">
            Admin
          </option>

          <option value="REFEREE">
            Referee
          </option>

          <option value="PLAYER">
            Player
          </option>

          <option value="MEMBER">
            Member
          </option>
        </select>

        {/* status */}
        <select
          value={status ?? ''}
          onChange={(e) =>
            onStatusChange(
              e.target.value || undefined
            )
          }
          className="
            h-11 rounded-xl
            border border-white/10
            bg-black/40 px-4
            text-sm text-zinc-200
            outline-none
          "
        >
          <option value="">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

        {/* sort */}
        <select
          value={sort ?? ''}
          onChange={(e) =>
            onSortChange(
              e.target.value || undefined
            )
          }
          className="
            h-11 rounded-xl
            border border-white/10
            bg-black/40 px-4
            text-sm text-zinc-200
            outline-none
          "
        >
          <option value="NEWEST">
            Newest First
          </option>

          <option value="OLDEST">
            Oldest First
          </option>

          <option value="NAME_ASC">
            Name A-Z
          </option>

          <option value="NAME_DESC">
            Name Z-A
          </option>
        </select>

        <Button onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}