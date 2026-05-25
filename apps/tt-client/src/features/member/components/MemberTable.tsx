import { MoreVertical } from 'lucide-react';

import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

const members = [
  {
    id: '1',
    firstName: 'Lovely',
    lastName: 'Singh',
    email: 'lovely@test.com',
    phone: '+91 9876543210',
    role: 'admin',
    isActive: true,
    joinedAt: '20 May 2026',
  },
  {
    id: '2',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@test.com',
    phone: '+91 9123456789',
    role: 'player',
    isActive: true,
    joinedAt: '18 May 2026',
  },
  {
    id: '3',
    firstName: 'Aman',
    lastName: 'Verma',
    email: 'aman@test.com',
    phone: '+91 9988776655',
    role: 'referee',
    isActive: false,
    joinedAt: '15 May 2026',
  },
];

export default function MemberTable() {
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
        <div className="col-span-4">
          User
        </div>

        <div className="col-span-2">
          Role
        </div>

        <div className="col-span-3">
          Contact
        </div>

        <div className="col-span-1">
          Status
        </div>

        <div className="col-span-1">
          Joined
        </div>

        <div className="col-span-1 text-right">
          Action
        </div>
      </div>

      {/* rows */}
      <div>
        {members.map((member) => (
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
                  items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-red-500/20
                  to-red-900/20
                  text-sm font-semibold
                  text-white
                "
              >
                {member.firstName[0]}
                {member.lastName[0]}
              </div>

              <div>
                <h4 className="font-medium text-white">
                  {member.firstName}{' '}
                  {member.lastName}
                </h4>

                <p className="text-sm text-zinc-500">
                  {member.email}
                </p>
              </div>
            </div>

            {/* role */}
            <div className="col-span-2">
              <RoleBadge
                role={
                  member.role as
                    | 'admin'
                    | 'player'
                    | 'referee'
                    | 'member'
                }
              />
            </div>

            {/* contact */}
            <div className="col-span-3">
              <p className="text-sm text-zinc-300">
                {member.phone}
              </p>
            </div>

            {/* status */}
            <div className="col-span-1">
              <StatusBadge
                active={
                  member.isActive
                }
              />
            </div>

            {/* joined */}
            <div className="col-span-1">
              <p className="text-sm text-zinc-400">
                {member.joinedAt}
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
        ))}
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
          Showing 1–10 of 248 users
        </p>

        <div className="flex gap-2">
          <button
            className="
              rounded-xl border
              border-white/10
              px-4 py-2
              text-sm text-zinc-300
              transition-colors
              hover:bg-white/10
            "
          >
            Previous
          </button>

          <button
            className="
              rounded-xl
              bg-red-600 px-4 py-2
              text-sm text-white
            "
          >
            1
          </button>

          <button
            className="
              rounded-xl border
              border-white/10
              px-4 py-2
              text-sm text-zinc-300
              transition-colors
              hover:bg-white/10
            "
          >
            2
          </button>

          <button
            className="
              rounded-xl border
              border-white/10
              px-4 py-2
              text-sm text-zinc-300
              transition-colors
              hover:bg-white/10
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}