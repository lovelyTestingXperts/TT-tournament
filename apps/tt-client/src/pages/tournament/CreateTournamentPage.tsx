import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2, Trophy, AlertCircle } from 'lucide-react';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Textarea from '@/components/ui/input/TextArea';
import { useCreateTournament } from '@/features/tournament/graphql/hooks';

const tournamentFormSchema = z.object({
  name: z.string().min(3, 'Tournament title must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required (e.g. Cricket, FIFA, Chess)'),
  type: z.enum(['ONLINE', 'OFFLINE']),
  format: z.enum([
    'SINGLE_ELIMINATION',
    'DOUBLE_ELIMINATION',
    'ROUND_ROBIN',
    'LEAGUE',
  ]),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  maxPlayers: z.coerce.number().min(2, 'Must have at least 2 participants'),
  prizePool: z.coerce.number().min(0).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
});

type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createTournament, { loading }] = useCreateTournament();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Cricket',
      type: 'ONLINE',
      format: 'SINGLE_ELIMINATION',
      visibility: 'PUBLIC',
      maxPlayers: 16,
      prizePool: 0,
      startDate: '',
      endDate: '',
      registrationDeadline: '',
    },
  });

  const onSubmit = async (values: TournamentFormValues) => {
    setErrorMessage(null);
    try {
      await createTournament({
        variables: {
          input: {
            name: values.name,
            description: values.description || undefined,
            category: values.category,
            type: values.type,
            format: values.format,
            visibility: values.visibility,
            maxPlayers: values.maxPlayers,
            prizePool: values.prizePool || 0,
            startDate: new Date(values.startDate).toISOString(),
            endDate: new Date(values.endDate).toISOString(),
            registrationDeadline: new Date(values.registrationDeadline).toISOString(),
          },
        },
      });
      navigate('/tournaments');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create tournament.');
    }
  };

  return (
    <div data-testid="create-tournament-page" className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          data-testid="back-btn"
          variant="secondary"
          size="sm"
          onClick={() => navigate('/tournaments')}
          className="size-9 p-0"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create Tournament
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            Set up rules, schedules, and player limits for your new competition.
          </p>
        </div>
      </div>

      <form data-testid="create-tournament-form" onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 md:p-8">
        {errorMessage && (
          <div data-testid="alert-error" className="mb-6 flex items-center gap-3 rounded-panel border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="size-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tournament Name */}
          <div className="md:col-span-2">
            <label htmlFor="tournament-name-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Tournament Title <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-name-input"
              data-testid="tournament-name-input"
              {...register('name')}
              placeholder="e.g. Winter Cup 2026"
              error={errors.name?.message}
            />
          </div>

          {/* Category / Game */}
          <div>
            <label htmlFor="tournament-category-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Category / Sport <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-category-input"
              data-testid="tournament-category-input"
              {...register('category')}
              placeholder="e.g. Cricket, FIFA 24, Table Tennis"
              error={errors.category?.message}
            />
          </div>

          {/* Tournament Type */}
          <div>
            <label htmlFor="tournament-type-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Venue Type
            </label>
            <select
              id="tournament-type-select"
              data-testid="tournament-type-select"
              {...register('type')}
              className="
                h-10 w-full rounded-button
                border border-white/[0.09]
                bg-surface-850/90 px-3.5 text-sm
                font-medium text-slate-200 outline-none
                transition-all hover:border-white/[0.18]
                focus:border-primary focus:ring-2 focus:ring-primary/20
              "
            >
              <option value="ONLINE">Online Event</option>
              <option value="OFFLINE">Offline / In-Person</option>
            </select>
          </div>

          {/* Tournament Format */}
          <div>
            <label htmlFor="tournament-format-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Bracket Format
            </label>
            <select
              id="tournament-format-select"
              data-testid="tournament-format-select"
              {...register('format')}
              className="
                h-10 w-full rounded-button
                border border-white/[0.09]
                bg-surface-850/90 px-3.5 text-sm
                font-medium text-slate-200 outline-none
                transition-all hover:border-white/[0.18]
                focus:border-primary focus:ring-2 focus:ring-primary/20
              "
            >
              <option value="SINGLE_ELIMINATION">Single Elimination</option>
              <option value="DOUBLE_ELIMINATION">Double Elimination</option>
              <option value="ROUND_ROBIN">Round Robin</option>
              <option value="LEAGUE">League</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label htmlFor="tournament-visibility-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Visibility
            </label>
            <select
              id="tournament-visibility-select"
              data-testid="tournament-visibility-select"
              {...register('visibility')}
              className="
                h-10 w-full rounded-button
                border border-white/[0.09]
                bg-surface-850/90 px-3.5 text-sm
                font-medium text-slate-200 outline-none
                transition-all hover:border-white/[0.18]
                focus:border-primary focus:ring-2 focus:ring-primary/20
              "
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private / Invite Only</option>
            </select>
          </div>

          {/* Max Players */}
          <div>
            <label htmlFor="tournament-max-players-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Max Participants <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-max-players-input"
              data-testid="tournament-max-players-input"
              type="number"
              {...register('maxPlayers')}
              placeholder="16"
              error={errors.maxPlayers?.message}
            />
          </div>

          {/* Prize Pool */}
          <div>
            <label htmlFor="tournament-prize-pool-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Prize Pool (USD / Points)
            </label>
            <Input
              id="tournament-prize-pool-input"
              data-testid="tournament-prize-pool-input"
              type="number"
              {...register('prizePool')}
              placeholder="1000"
              error={errors.prizePool?.message}
            />
          </div>

          {/* Registration Deadline */}
          <div>
            <label htmlFor="tournament-deadline-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Registration Deadline <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-deadline-input"
              data-testid="tournament-deadline-input"
              type="date"
              {...register('registrationDeadline')}
              error={errors.registrationDeadline?.message}
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="tournament-start-date-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Event Start Date <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-start-date-input"
              data-testid="tournament-start-date-input"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
          </div>

          {/* End Date */}
          <div className="md:col-span-2">
            <label htmlFor="tournament-end-date-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Event End Date <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-end-date-input"
              data-testid="tournament-end-date-input"
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="tournament-description-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description & Rules
            </label>
            <Textarea
              id="tournament-description-input"
              data-testid="tournament-description-input"
              {...register('description')}
              placeholder="Outline match schedules, scoring rules, and player guidelines..."
              className="min-h-[120px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/[0.07] pt-6">
          <Button
            data-testid="cancel-btn"
            type="button"
            variant="secondary"
            onClick={() => navigate('/tournaments')}
          >
            Cancel
          </Button>

          <Button data-testid="submit-tournament-btn" type="submit" variant="primary" loading={loading}>
            <CheckCircle2 className="size-4" />
            <span>Launch Tournament</span>
          </Button>
        </div>
      </form>
    </div>
  );
}