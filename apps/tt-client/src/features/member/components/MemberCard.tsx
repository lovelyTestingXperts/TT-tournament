import { Mail, Phone } from 'lucide-react';

import RoleBadge from './RoleBadge';

type Props = {
  name: string;
  email: string;
  phone: string;
  role:
    | 'player'
    | 'member'
    | 'referee';
};

export default function MemberCard({
  name,
  email,
  phone,
  role,
}: Props) {
  return (
    <div
      className="
      glass-card
      rounded-[32px]
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-white/15
    "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-violet-500/20
            text-lg
            font-bold
          "
          >
            {name[0]}
          </div>

          <div>
            <h3 className="font-semibold">
              {name}
            </h3>

            <div className="mt-1">
              <RoleBadge
                role={role}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-white/60">
        <div className="flex items-center gap-3">
          <Mail size={16} />
          {email}
        </div>

        <div className="flex items-center gap-3">
          <Phone size={16} />
          {phone}
        </div>
      </div>
    </div>
  );
}