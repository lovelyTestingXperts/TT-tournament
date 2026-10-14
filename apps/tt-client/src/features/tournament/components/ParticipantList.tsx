import { UserCheck, Users, Sparkles } from 'lucide-react';

type ParticipantDetail = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type Props = {
  participants?: string[];
  participantDetails?: ParticipantDetail[];
  teams?: any[];
  maxPlayers?: number;
  onSeedPlayers?: () => void;
  isSeeding?: boolean;
  tournamentStatus?: string;
  hasMatches?: boolean;
};

export default function ParticipantList({
  participants = [],
  participantDetails = [],
  teams = [],
  maxPlayers,
  onSeedPlayers,
  isSeeding = false,
  tournamentStatus,
  hasMatches = false,
}: Props) {
  const detailMap = new Map<string, ParticipantDetail>();
  participantDetails.forEach((d) => detailMap.set(d.id, d));

  const isCompleted = tournamentStatus === 'COMPLETED' || tournamentStatus === 'CANCELLED';

  return (
    <div data-testid="participant-list" className="glass-card rounded-card p-6">
      {/* Registered Teams Section (For Team / Squad Tournaments) */}
      {teams && teams.length > 0 && (
        <div data-testid="registered-teams-list" className="space-y-3 mb-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Registered Teams ({teams.length})
            </h3>
            <span className="rounded-badge border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              Squads Rostered
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {teams.map((team: any, idx: number) => (
              <div
                key={team.id || idx}
                data-testid={`team-card-${team.id || idx}`}
                className="rounded-panel border border-white/10 bg-slate-800/50 p-4 transition-all hover:border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">{team.name}</span>
                  <span className="text-[11px] rounded bg-primary/20 text-primary-light px-2 py-0.5 border border-primary/30 font-medium">
                    {team.members?.length || 0} Members
                  </span>
                </div>
                {team.captainName && (
                  <p className="text-xs text-slate-400">Captain: {team.captainName}</p>
                )}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {(team.members || []).map((m: any, mIdx: number) => (
                    <span
                      key={m.userId || mIdx}
                      className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {m.fullName || m.email || m.userId}
                      {m.roleInTeam === 'CAPTAIN' ? ' (C)' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Registered Players</h2>
          <p className="text-xs text-slate-400">
            {participants.length} registered {maxPlayers ? `out of ${maxPlayers} slots` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onSeedPlayers && !isCompleted && !hasMatches && (
            <button
              type="button"
              data-testid="seed-players-btn"
              onClick={onSeedPlayers}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 rounded-button border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-50"
            >
              <Sparkles className="size-3.5" />
              <span>{isSeeding ? 'Seeding Players...' : 'Auto-Fill Players & Draw Bracket'}</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-badge border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <UserCheck className="size-3.5" />
            <span>{participants.length} Joined</span>
          </span>
        </div>
      </div>

      {participants.length === 0 && (!teams || teams.length === 0) ? (
        <div data-testid="empty-participants-state" className="flex flex-col items-center justify-center rounded-panel border border-dashed border-white/10 p-8 text-center">
          <Users className="size-8 text-slate-500 mb-2" />
          <p className="text-sm font-medium text-slate-300">No participants registered yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Register yourself or auto-fill dummy players to start the bracket draw!
          </p>
          {onSeedPlayers && !isCompleted && (
            <button
              type="button"
              data-testid="empty-seed-players-btn"
              onClick={onSeedPlayers}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-brand-vibrant disabled:opacity-50"
            >
              <Sparkles className="size-3.5" />
              <span>{isSeeding ? 'Filling Players...' : 'Fill Dummy Players & Generate Matches'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {participants.map((playerId, idx) => {
            const detail = detailMap.get(playerId);
            const displayName = detail?.fullName || (playerId.length > 20 ? `Player ${playerId.slice(-6)}` : playerId);
            const displayEmail = detail?.email || `ID: ${playerId}`;

            return (
              <div
                key={playerId || idx}
                data-testid="participant-row"
                data-player-id={playerId}
                className="flex items-center justify-between rounded-panel border border-white/5 bg-slate-900/60 p-3.5 transition-colors hover:border-white/15"
              >
                <div data-testid="participant-item" className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-button bg-primary/10 text-primary font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <p data-testid="participant-name" className="text-sm font-semibold text-white">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400">{displayEmail}</p>
                  </div>
                </div>

                <span className="rounded-badge border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                  Seed #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}