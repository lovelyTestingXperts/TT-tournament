import { MoreVertical } from 'lucide-react';
import moment from 'moment-timezone';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string[];
  isActive: boolean;
  createdAt: string;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type MemberTableProps = {
  members: Member[];
  loading?: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
};

export default function MemberTable({
  members,
  loading,
  meta,
  onPageChange,
}: MemberTableProps) {
  if (loading) {
    return (
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/5
          p-10
          text-center
          text-zinc-400
          backdrop-blur-xl
        "
      >
        Loading members...
      </div>
    );
  }

  if (!members.length) {
    return (
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/5
          p-10
          text-center
          text-zinc-400
          backdrop-blur-xl
        "
      >
        No members found.
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
      "
    >
      {/* header */}
      <div
        className="
          grid grid-cols-12
          border-b border-white/10
          px-6 py-4
          text-sm font-medium
          text-zinc-400
        "
      >
        <div className="col-span-4">User</div>

        <div className="col-span-2">Role</div>

        <div className="col-span-3">Contact</div>

        <div className="col-span-1">Status</div>

        <div className="col-span-1">Joined</div>

        <div className="col-span-1 text-right">Action</div>
      </div>

      {/* rows */}
      <div>
        {members.map((member) => {
          const primaryRole = member.role?.[0]?.toLowerCase() ?? 'member';

          return (
            <div
              key={member.id}
              className="
                grid grid-cols-12
                items-center
                border-b border-white/5
                px-6 py-4
                transition-colors
                hover:bg-red-500/5
              "
            >
              {/* user */}
              <div className="col-span-4 flex items-center gap-4">
                <div
                  className="
                    flex size-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-red-500/20
                    to-red-900/20
                    text-sm font-semibold
                    text-white
                  "
                >
                  {member.firstName?.[0]}
                  {member.lastName?.[0]}
                </div>

                <div>
                  <h4 className="font-medium text-white">
                    {member.firstName} {member.lastName}
                  </h4>

                  <p className="text-sm text-zinc-500">{member.email}</p>
                </div>
              </div>

              {/* role */}
              <div className="col-span-2">
                <RoleBadge
                  role={
                    primaryRole as 'admin' | 'player' | 'referee' | 'member'
                  }
                />
              </div>

              {/* contact */}
              <div className="col-span-3">
                <p className="text-sm text-zinc-300">
                  {member.phoneNumber ?? 'N/A'}
                </p>
              </div>

              {/* status */}
              <div className="col-span-1">
                <StatusBadge active={member.isActive} />
              </div>

              {/* joined */}
              <div className="col-span-1">
                <p className="text-sm text-zinc-400">
                  {moment(member.createdAt).format('dd MMM yyyy')}
                </p>
              </div>

              {/* action */}
              <div className="col-span-1 flex justify-end">
                <button
                  className="
                    rounded-xl p-2
                    text-zinc-400
                    transition-colors
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div
        className="
          flex items-center
          justify-between
          border-t border-white/10
          px-6 py-4
        "
      >
        <p className="text-sm text-zinc-500">
          Showing {(meta?.page ?? 1 - 1) * (meta?.limit ?? 10) + 1}–
          {Math.min((meta?.page ?? 1) * (meta?.limit ?? 10), meta?.total ?? 0)}{' '}
          of {meta?.total ?? 0} users
        </p>

        <div className="flex gap-2">
          <button
            disabled={meta?.page === 1}
            onClick={() => onPageChange((meta?.page ?? 1) - 1)}
            className="
              rounded-xl border
              border-white/10
              px-4 py-2
              text-sm text-zinc-300
              transition-colors
              hover:bg-white/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Previous
          </button>

          <div
            className="
              flex items-center
              rounded-xl
              bg-red-600
              px-4 py-2
              text-sm text-white
            "
          >
            {meta?.page ?? 1}
          </div>

          <button
            disabled={meta?.page === meta?.totalPages}
            onClick={() => onPageChange((meta?.page ?? 1) + 1)}
            className="
              rounded-xl border
              border-white/10
              px-4 py-2
              text-sm text-zinc-300
              transition-colors
              hover:bg-white/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
