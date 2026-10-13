import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Swords, ArrowRight, RotateCcw, Award } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import StatusBadge from '@/components/ui/badge/StatusBadge';
import { useTournaments, useResetAndSeedDatabase } from '@/features/tournament/graphql/hooks';

export default function DashboardHero() {
  const navigate = useNavigate();
  const { data, refetch } = useTournaments({ limit: 5 });
  const [resetAndSeed, { loading: isSeeding }] = useResetAndSeedDatabase();

  const tournaments = data?.tournaments?.items ?? [];
  const latestTournament = tournaments[0] || null;

  const handleResetDemo = async () => {
    try {
      const res = await resetAndSeed();
      await refetch();
      const createdId = res.data?.resetAndSeedDatabase?.id;
      if (createdId) {
        navigate(`/tournaments/${createdId}`);
      }
    } catch {
      // ignore
    }
  };

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
      {/* glow effect */}
      <div
        className="
        pointer-events-none
        absolute
        right-[-80px]
        top-[-80px]
        h-[240px]
        w-[240px]
        rounded-full
        bg-fuchsia-500/20
        blur-[90px]
      "
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Welcome & Quick Actions */}
        <div className="lg:col-span-7">
          <span
            className="
            inline-flex
            rounded-full
            bg-white/10
            px-4
            py-1.5
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-primary
          "
          >
            Tournament Control Center
          </span>

          <h1
            className="
            mt-4
            max-w-[650px]
            text-3xl
            md:text-4xl
            font-bold
            leading-tight
            text-white
          "
          >
            Manage tournaments, players and live knockout brackets.
          </h1>

          <p
            className="
            mt-3
            max-w-[520px]
            text-sm
            text-white/60
          "
          >
            Organize competitions, randomly draw player pairings, record match scores round-by-round, and crown official champions in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              data-testid="hero-create-tournament-btn"
              size="lg"
              onClick={() => navigate('/tournaments/create')}
            >
              Create Tournament
            </Button>

            <Button
              data-testid="hero-view-matches-btn"
              size="lg"
              variant="secondary"
              onClick={() => navigate('/matches')}
            >
              View Matches
            </Button>

            <button
              type="button"
              data-testid="reset-seed-demo-btn"
              onClick={handleResetDemo}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 rounded-button border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-white disabled:opacity-50"
            >
              <RotateCcw className={`size-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Resetting & Seeding...' : 'Reset & Seed Fresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Latest Tournament Spotlight */}
        <div className="lg:col-span-5">
          {latestTournament ? (
            <div
              data-testid="latest-tournament-spotlight"
              className="rounded-3xl border border-primary/30 bg-slate-950/75 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Trophy className="size-3.5" />
                  Latest Tournament
                </span>
                <StatusBadge status={latestTournament.status} />
              </div>

              <h2
                data-testid="latest-tournament-name"
                className="text-xl font-extrabold text-white truncate"
              >
                {latestTournament.name}
              </h2>

              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {latestTournament.description || 'Knockout championship tournament with live bracket progression.'}
              </p>

              {latestTournament.winnerName && (
                <div
                  data-testid="latest-tournament-winner"
                  className="mt-3 flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-300"
                >
                  <Award className="size-4 text-amber-400 shrink-0" />
                  <span>Champion: {latestTournament.winnerName}</span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="size-4 text-primary" />
                  <span>
                    <strong>{latestTournament.participants?.length || 0}</strong> / {latestTournament.maxPlayers || '∞'} Players
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Swords className="size-4 text-primary" />
                  <span>
                    <strong>{latestTournament.matchDetails?.length || latestTournament.matches?.length || 0}</strong> Matches
                  </span>
                </div>
              </div>

              <button
                type="button"
                data-testid="open-latest-tournament-btn"
                onClick={() => navigate(`/tournaments/${latestTournament.id}`)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-button bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-brand-vibrant"
              >
                <span>Open Latest Tournament & Bracket</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          ) : (
            <div
              data-testid="latest-tournament-empty"
              className="rounded-3xl border border-dashed border-white/15 bg-slate-950/50 p-6 text-center"
            >
              <Trophy className="mx-auto size-8 text-slate-500 mb-2" />
              <h3 className="text-base font-bold text-white">No Active Tournaments</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Create a new tournament or click Reset & Seed Fresh Data to launch a live championship bracket.
              </p>
              <button
                type="button"
                onClick={() => navigate('/tournaments/create')}
                className="inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2 text-xs font-bold text-white"
              >
                <span>Create First Tournament</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}