import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button/Button';

export default function DashboardHero() {
  const navigate = useNavigate();

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
        absolute
        right-[-80px]
        top-[-80px]
        h-[220px]
        w-[220px]
        rounded-full
        bg-fuchsia-500/20
        blur-[80px]
      "
      />

      <div className="relative z-10">
        <span
          className="
          inline-flex
          rounded-full
          bg-white/10
          px-4
          py-2
          text-sm
          text-white/70
        "
        >
          Tournament Control Center
        </span>

        <h1
          className="
          mt-5
          max-w-[700px]
          text-4xl
          font-bold
          leading-tight
        "
        >
          Manage tournaments,
          players and matches
          from one place.
        </h1>

        <p
          className="
          mt-4
          max-w-[520px]
          text-white/60
        "
        >
          Organize tournaments,
          track matches, manage
          players and monitor
          everything in real time.
        </p>

        <div className="mt-8 flex gap-4">
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
        </div>
      </div>
    </section>
  );
}