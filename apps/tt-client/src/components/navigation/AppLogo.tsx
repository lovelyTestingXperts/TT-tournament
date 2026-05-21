import { Trophy } from 'lucide-react';

export default function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
      "
      >
        <Trophy size={22} />
      </div>

      <div>
        <h1 className="font-bold">
          TT Arena
        </h1>

        <p className="text-xs text-white/50">
          Tournament Manager
        </p>
      </div>
    </div>
  );
}