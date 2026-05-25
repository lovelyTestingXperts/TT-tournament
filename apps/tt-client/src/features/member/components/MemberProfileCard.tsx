import { Mail, Phone, Shield } from 'lucide-react';

import Button from '@/components/ui/button/button';

import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

export default function MemberProfileCard() {
  const member = {
    firstName: 'Lovely',
    lastName: 'Singh',
    email: 'lovely@test.com',
    phone: '+91 9876543210',
    role: 'admin' as const,
    isActive: true,
  };

  return (
    <div
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          {/* avatar */}
          <div
            className="
              flex size-24
              items-center justify-center
              rounded-[28px]
              bg-gradient-to-br
              from-red-500/20
              to-red-900/20
              text-2xl font-bold
              text-white
            "
          >
            LS
          </div>

          {/* details */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">
                {member.firstName} {member.lastName}
              </h1>

              <RoleBadge role={member.role} />
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="size-4" />

                <span>{member.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="size-4" />

                <span>{member.phone}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <StatusBadge active={member.isActive} />

              <div
                className="
                  inline-flex items-center
                  gap-2 rounded-full
                  border border-blue-500/20
                  bg-blue-500/10
                  px-3 py-1
                  text-xs font-medium
                  text-blue-400
                "
              >
                <Shield className="size-3" />
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <Button className="rounded-xl">Deactivate</Button>

          <Button className="rounded-xl">Edit User</Button>
        </div>
      </div>
    </div>
  );
}
