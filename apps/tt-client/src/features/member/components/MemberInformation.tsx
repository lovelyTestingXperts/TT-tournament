import moment from 'moment-timezone';

interface Props {
  member: any;
}

export default function MemberInformation({ member }: Props) {
  const items = [
    {
      label: 'First Name',
      value: member.firstName,
    },
    {
      label: 'Last Name',
      value: member.lastName,
    },
    {
      label: 'Email Address',
      value: member.email,
    },
    {
      label: 'Phone Number',
      value: member.phoneNumber || 'Not provided',
    },
    {
      label: 'Assigned Role',
      value: member.role?.toUpperCase() || 'MEMBER',
    },
    {
      label: 'Account Status',
      value: member.isActive ? 'Active' : 'Inactive',
    },
    {
      label: 'Employee ID',
      value: member.employeeId || 'None',
    },
    {
      label: 'Registered Date',
      value: member.createdAt
        ? moment(member.createdAt).format('MMMM DD, YYYY')
        : 'N/A',
    },
  ];

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-lg font-bold tracking-tight text-white">
        Profile Information & Attributes
      </h2>
      <p className="mt-0.5 text-xs text-slate-400">
        Primary contact and security attributes associated with this account.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-panel border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {item.label}
            </p>

            <p className="mt-1.5 text-sm font-medium text-slate-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {member.bio && (
        <div className="mt-6 rounded-panel border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bio / Notes
          </p>
          <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">
            {member.bio}
          </p>
        </div>
      )}
    </div>
  );
}