import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Input from '@/components/ui/input/Input';
import Textarea from '@/components/ui/input/TextArea';
import Button from '@/components/ui/button/Button';
import TournamentHero from '@/features/tournament/components/TournamentHero';
import TournamentOverview from '@/features/tournament/components/TournamentOverview';
import TournamentTabs from '@/features/tournament/components/TournamentTabs';
import ParticipantList from '@/features/tournament/components/ParticipantList';
import TournamentMatchList from '@/features/tournament/components/TournamentMatchList';
import {
  useTournament,
  useDeleteTournament,
  useRegisterTournament,
  useUpdateTournament,
} from '@/features/tournament/graphql/hooks';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function TournamentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'matches' | 'settings'>('overview');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useTournament(id || '');
  const [deleteTournament, { loading: isDeleting }] = useDeleteTournament();
  const [registerTournament, { loading: isRegistering }] = useRegisterTournament();
  const [updateTournament, { loading: isUpdating }] = useUpdateTournament();

  const tournament = data?.tournament;

  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrizePool, setEditPrizePool] = useState<number | string>(0);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (tournament) {
      setEditName(tournament.name || '');
      setEditCategory(tournament.category || '');
      setEditPrizePool(tournament.prizePool ?? 0);
      setEditDescription(tournament.description || '');
    }
  }, [tournament]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this tournament? This will soft-delete the record.')) {
      try {
        await deleteTournament({ variables: { id } });
        navigate('/tournaments');
      } catch (err: any) {
        setActionError(err.message || 'Failed to delete tournament');
      }
    }
  };

  const handleRegister = async () => {
    if (!id) return;
    try {
      setActionSuccess(null);
      setActionError(null);
      await registerTournament({
        variables: {
          id,
          participantId: user?.id,
        },
      });
      setActionSuccess('Successfully registered for tournament!');
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to register for tournament');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setActionSuccess(null);
      setActionError(null);
      await updateTournament({
        variables: {
          id,
          input: {
            status: newStatus,
          },
        },
      });
      setActionSuccess(`Tournament status updated to ${newStatus}`);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update status');
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setActionSuccess(null);
      setActionError(null);
      await updateTournament({
        variables: {
          id,
          input: {
            name: editName,
            category: editCategory,
            prizePool: Number(editPrizePool) || 0,
            description: editDescription,
          },
        },
      });
      setActionSuccess('Tournament details updated successfully!');
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update tournament details');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div data-testid="loading-spinner" className="flex h-96 flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-400">Loading tournament details...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !tournament) {
    return (
      <PageContainer>
        <div data-testid="tournament-not-found" className="mx-auto max-w-lg rounded-card border border-rose-500/20 bg-rose-500/10 p-8 text-center">
          <AlertCircle className="mx-auto size-10 text-rose-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Tournament Not Found</h2>
          <p className="text-sm text-slate-300 mb-6">
            {error?.message || 'The requested tournament could not be found or has been removed.'}
          </p>
          <button
            type="button"
            data-testid="return-to-tournaments-btn"
            onClick={() => navigate('/tournaments')}
            className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-brand-vibrant"
          >
            <ArrowLeft className="size-4" />
            <span>Return to Tournaments</span>
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div data-testid="tournament-details-page" className="space-y-6">
        {/* Alerts */}
        {actionSuccess && (
          <div data-testid="alert-success" className="flex items-center gap-3 rounded-panel border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-sm">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div data-testid="alert-error" className="flex items-center gap-3 rounded-panel border border-rose-500/30 bg-rose-500/10 p-4 text-rose-400 text-sm">
            <AlertCircle className="size-5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Hero Section */}
        <TournamentHero
          tournament={tournament}
          onRegister={handleRegister}
          onDelete={handleDelete}
          isRegistering={isRegistering}
          isDeleting={isDeleting}
        />

        {/* Tab Navigation */}
        <TournamentTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          participantCount={tournament.participants?.length || 0}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div data-testid="tab-content-overview">
            <TournamentOverview tournament={tournament} />
          </div>
        )}

        {activeTab === 'participants' && (
          <div data-testid="tab-content-participants">
            <ParticipantList
              participants={tournament.participants}
              maxPlayers={tournament.maxPlayers}
            />
          </div>
        )}

        {activeTab === 'matches' && (
          <div data-testid="tab-content-matches">
            <TournamentMatchList matches={tournament.matches} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div data-testid="tab-content-settings" className="glass-card rounded-card p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Tournament Control Panel</h3>
              <p className="text-xs text-slate-400">Edit tournament parameters, operational status, or lifecycle</p>
            </div>

            {/* General Information Edit Form */}
            <form data-testid="edit-tournament-form" onSubmit={handleSaveDetails} className="space-y-4 border-b border-white/10 pb-6">
              <h4 className="text-sm font-semibold text-white">General Information</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="tournament-edit-name-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tournament Title <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="tournament-edit-name-input"
                    data-testid="tournament-edit-name-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tournament-edit-category-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category
                  </label>
                  <Input
                    id="tournament-edit-category-input"
                    data-testid="tournament-edit-category-input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Category"
                  />
                </div>

                <div>
                  <label htmlFor="tournament-edit-prize-pool-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Prize Pool (USD)
                  </label>
                  <Input
                    id="tournament-edit-prize-pool-input"
                    data-testid="tournament-edit-prize-pool-input"
                    type="number"
                    value={editPrizePool}
                    onChange={(e) => setEditPrizePool(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tournament-edit-description-input" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <Textarea
                  id="tournament-edit-description-input"
                  data-testid="tournament-edit-description-input"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Tournament description..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  data-testid="save-tournament-settings-btn"
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isUpdating}
                >
                  Save Changes
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Change Status
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    data-testid={`set-status-${st.toLowerCase()}-btn`}
                    onClick={() => handleStatusChange(st)}
                    disabled={isUpdating || tournament.status === st}
                    className={`rounded-button px-4 py-2 text-xs font-bold transition-all ${
                      tournament.status === st
                        ? 'bg-primary text-white shadow-glow'
                        : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-semibold text-rose-400 mb-2">Danger Zone</h4>
              <p className="text-xs text-slate-400 mb-4">
                Soft-deleting this tournament will hide it from the active tournament listings.
              </p>
              <button
                type="button"
                data-testid="delete-tournament-settings-btn"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-button border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Tournament'}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}