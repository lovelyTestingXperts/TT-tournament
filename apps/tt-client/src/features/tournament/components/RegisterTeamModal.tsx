import { useState, useMemo } from 'react';
import { X, Users, Shield, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tournament: any;
  availableUsers: any[];
  currentUserId?: string;
  onSubmit: (teamData: {
    name: string;
    captainId: string;
    members: Array<{ userId: string; roleInTeam: string }>;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export default function RegisterTeamModal({
  isOpen,
  onClose,
  tournament,
  availableUsers = [],
  currentUserId,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [teamName, setTeamName] = useState('');
  const [captainId, setCaptainId] = useState<string>(currentUserId || '');
  const [selectedMembers, setSelectedMembers] = useState<Array<{ userId: string; roleInTeam: string }>>(() => {
    if (currentUserId) {
      return [{ userId: currentUserId, roleInTeam: 'CAPTAIN' }];
    }
    return [];
  });
  const [error, setError] = useState<string | null>(null);

  const minTeamSize = tournament?.minTeamSize || 2;
  const maxTeamSize = tournament?.maxTeamSize || 15;

  // Set of user IDs already rostered in ANY existing team in this tournament
  const alreadyRosteredUserIds = useMemo(() => {
    const ids = new Set<string>();
    (tournament?.teams || []).forEach((t: any) => {
      (t.members || []).forEach((m: any) => ids.add(m.userId));
    });
    return ids;
  }, [tournament?.teams]);

  if (!isOpen) return null;

  const handleAddMember = (userId: string) => {
    if (!userId) return;
    if (selectedMembers.some((m) => m.userId === userId)) return;
    if (selectedMembers.length >= maxTeamSize) {
      setError(`Maximum team size is ${maxTeamSize}`);
      return;
    }
    setError(null);
    setSelectedMembers((prev) => [...prev, { userId, roleInTeam: 'PLAYER' }]);
  };

  const handleRemoveMember = (userId: string) => {
    if (selectedMembers.length <= 1 && userId === captainId) {
      setError('Team must have at least one member and a captain');
      return;
    }
    setError(null);
    setSelectedMembers((prev) => prev.filter((m) => m.userId !== userId));
    if (captainId === userId) {
      const remaining = selectedMembers.filter((m) => m.userId !== userId);
      setCaptainId(remaining[0]?.userId || '');
    }
  };

  const handleCaptainChange = (newCaptainId: string) => {
    setCaptainId(newCaptainId);
    setSelectedMembers((prev) =>
      prev.map((m) => ({
        ...m,
        roleInTeam: m.userId === newCaptainId ? 'CAPTAIN' : m.roleInTeam === 'CAPTAIN' ? 'PLAYER' : m.roleInTeam,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    if (selectedMembers.length < minTeamSize) {
      setError(`Team must have at least ${minTeamSize} members (currently has ${selectedMembers.length})`);
      return;
    }

    if (!captainId) {
      setError('Please select a team captain');
      return;
    }

    if (!selectedMembers.some((m) => m.userId === captainId)) {
      setError('The selected captain must be one of the team members');
      return;
    }

    try {
      await onSubmit({
        name: teamName.trim(),
        captainId,
        members: selectedMembers,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register team');
    }
  };

  const selectedCount = selectedMembers.length;
  const isMinMet = selectedCount >= minTeamSize;

  return (
    <div
      data-testid="register-team-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-card border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Register Team</h2>
              <p className="text-xs text-slate-400">
                {tournament?.name} &bull; Min {minTeamSize} - Max {maxTeamSize} Players
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-team-modal-btn"
            onClick={onClose}
            className="rounded-button p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div data-testid="team-modal-error" className="mb-4 flex items-center gap-2.5 rounded-panel border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label htmlFor="team-name-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Team Name <span className="text-primary">*</span>
            </label>
            <Input
              id="team-name-input"
              data-testid="team-name-input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Thunder Strikers"
              required
            />
          </div>

          {/* Captain Selector */}
          <div>
            <label htmlFor="team-captain-select" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Shield className="size-3.5 text-amber-400" />
              <span>Team Captain</span>
            </label>
            <select
              id="team-captain-select"
              data-testid="team-captain-select"
              value={captainId}
              onChange={(e) => handleCaptainChange(e.target.value)}
              className="h-10 w-full rounded-button border border-white/[0.09] bg-surface-850/90 px-3.5 text-sm text-slate-200 outline-none hover:border-white/[0.18] focus:border-primary"
            >
              <option value="">Select Captain...</option>
              {selectedMembers.map((m) => {
                const u = availableUsers.find((usr) => usr.id === m.userId);
                return (
                  <option key={m.userId} value={m.userId}>
                    {u?.fullName || u?.email || m.userId} (Captain)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Member Selection Section */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Team Roster
              </label>
              <span
                data-testid="team-size-indicator"
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isMinMet
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {selectedCount} / {minTeamSize} min {isMinMet && '✓'}
              </span>
            </div>

            {/* Dropdown to add a member */}
            <div className="flex gap-2">
              <select
                id="add-member-select"
                data-testid="add-member-select"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddMember(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="h-9 flex-1 rounded-button border border-white/[0.09] bg-surface-850/90 px-3 text-xs text-slate-200 outline-none hover:border-white/[0.18]"
              >
                <option value="">+ Add player to team...</option>
                {availableUsers.map((usr) => {
                  const isAlreadySelected = selectedMembers.some((m) => m.userId === usr.id);
                  const isRosteredInAnotherTeam = alreadyRosteredUserIds.has(usr.id);
                  const disabled = isAlreadySelected || isRosteredInAnotherTeam;

                  return (
                    <option key={usr.id} value={usr.id} disabled={disabled}>
                      {usr.fullName || usr.email}
                      {isAlreadySelected
                        ? ' (Added)'
                        : isRosteredInAnotherTeam
                        ? ' (In another team)'
                        : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Members List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selectedMembers.map((m) => {
                const u = availableUsers.find((usr) => usr.id === m.userId);
                const isCaptain = m.userId === captainId;

                return (
                  <div
                    key={m.userId}
                    data-testid={`team-member-row-${m.userId}`}
                    className="flex items-center justify-between rounded-button border border-white/5 bg-slate-800/40 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isCaptain && <Shield className="size-3.5 text-amber-400 shrink-0" />}
                      <span className="font-semibold text-white">
                        {u?.fullName || u?.email || m.userId}
                      </span>
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                        {isCaptain ? 'CAPTAIN' : m.roleInTeam}
                      </span>
                    </div>

                    <button
                      type="button"
                      data-testid={`remove-member-${m.userId}-btn`}
                      onClick={() => handleRemoveMember(m.userId)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              data-testid="cancel-team-btn"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              data-testid="submit-team-btn"
              loading={isSubmitting}
              disabled={!isMinMet || !teamName.trim() || isSubmitting}
            >
              <CheckCircle2 className="size-4" />
              <span>Confirm & Register Team</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
