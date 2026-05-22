import StatusBadge from '@/components/ui/badge/StatusBadge';

export default function TournamentHero() {
  return (
    <section
      className="
      glass-card
      relative
      overflow-hidden
      rounded-[36px]
      p-8
    "
    >
      {/* glow */}
      <div
        className="
        absolute
        right-[-80px]
        top-[-80px]
        h-[240px]
        w-[240px]
        rounded-full
        bg-violet-500/20
        blur-[100px]
      "
      />

      <div className="relative z-10">
        <div
          className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
        >
          <div>
            <div className="mb-4">
              <StatusBadge status="active" />
            </div>

            <h1 className="text-4xl font-bold">
              Winter Cup 2026
            </h1>

            <p className="mt-2 text-white/60">
              National Cricket Tournament
            </p>

            <div className="mt-5 flex gap-5 text-sm text-white/60">
              <span>
                120 Players
              </span>

              <span>
                Cricket
              </span>

              <span>
                24 Dec 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}