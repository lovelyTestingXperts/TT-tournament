import { User, UserCheck } from 'lucide-react';

type Props = {
  participants?: string[];
  maxPlayers?: number;
};

export default function ParticipantList({
  participants = [],
  maxPlayers,
}: Props) {
  return (
    <div data-testid="participant-list" className="glass-card rounded-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Participants</h2>
          <p className="text-xs text-slate-400">
            {participants.length} registered {maxPlayers ? `out of ${maxPlayers} slots` : ''}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-badge border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          <UserCheck className="size-3.5" />
          <span>Active</span>
        </span>
      </div>

      {participants.length === 0 ? (
        <div data-testid="empty-participants-state" className="flex flex-col items-center justify-center rounded-panel border border-dashed border-white/10 p-8 text-center">
          <User className="size-8 text-slate-500 mb-2" />
          <p className="text-sm font-medium text-slate-300">No participants yet</p>
          <p className="text-xs text-slate-500 mt-1">Be the first to register for this event!</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {participants.map((player, idx) => (
            <div
              key={player || idx}
              data-testid="participant-row"
              data-player-id={player}
              className="flex items-center justify-between rounded-panel border border-white/5 bg-slate-900/60 p-3.5 transition-colors hover:border-white/15"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-button bg-primary/10 text-primary font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {player.startsWith('user_') || player.length > 20
                      ? `Player ${player.slice(-6)}`
                      : player}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {player}</p>
                </div>
              </div>

              <span className="rounded-badge border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                Registered
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}