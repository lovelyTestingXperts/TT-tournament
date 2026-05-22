import MemberCard from './MemberCard';

const members = [
  {
    id: 1,
    name: 'Virat Kohli',
    email: 'virat@gmail.com',
    phone: '+91 9999999999',
    role: 'player',
  },
  {
    id: 2,
    name: 'Rohit Sharma',
    email: 'rohit@gmail.com',
    phone: '+91 8888888888',
    role: 'referee',
  },
  {
    id: 3,
    name: 'KL Rahul',
    email: 'rahul@gmail.com',
    phone: '+91 7777777777',
    role: 'member',
  },
];

export default function MemberGrid() {
  return (
    <div
      className="
      grid
      gap-6
      md:grid-cols-2
      xl:grid-cols-3
      "
    >
      {members.map(
        (member) => (
          <MemberCard
            key={member.id}
            {...member}
          />
        )
      )}
    </div>
  );
}