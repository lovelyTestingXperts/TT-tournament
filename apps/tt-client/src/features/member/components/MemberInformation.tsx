export default function MemberInformation() {
  const member = {
    firstName: 'Lovely',
    lastName: 'Singh',
    email: 'lovely@test.com',
    phone: '+91 9876543210',
    role: 'Admin',
    status: 'Active',
    joinedAt: '20 May 2026',
  };

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
      label: 'Email',
      value: member.email,
    },
    {
      label: 'Phone',
      value: member.phone,
    },
    {
      label: 'Role',
      value: member.role,
    },
    {
      label: 'Status',
      value: member.status,
    },
    {
      label: 'Joined At',
      value: member.joinedAt,
    },
  ];

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
      <h2 className="text-xl font-semibold text-white">
        Basic Information
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-zinc-500">
              {item.label}
            </p>

            <p className="mt-1 text-base text-zinc-200">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}