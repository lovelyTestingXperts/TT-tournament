import { Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header
      className="
      glass-card
      mb-6
      flex
      items-center
      justify-between
      rounded-[28px]
      px-6
      py-4
      "
    >
      <div>
        <h2 className="text-xl font-bold">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-white/60">
          Manage tournaments efficiently
        </p>
      </div>

      <button
        className="
        rounded-2xl
        bg-white/10
        p-3
        transition
        hover:bg-white/20
      "
      >
        <Bell size={20} />
      </button>
    </header>
  );
}