import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2, AlertCircle, Plus, Eye, Edit3, Shield } from 'lucide-react';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Textarea from '@/components/ui/input/TextArea';
import { useCreateTournament } from '@/features/tournament/graphql/hooks';
import {
  SportType,
  SPORTS_PRESETS,
  COMMON_RULE_PRESETS,
} from '@/features/tournament/constants/sports';

const tournamentFormSchema = z
  .object({
    name: z.string().min(3, 'Tournament title must be at least 3 characters'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    sport: z.string().optional(),
    competitionType: z.enum(['INDIVIDUAL', 'TEAM']),
    hasBothDivisions: z.boolean().optional(),
    minTeamSize: z.coerce.number().min(1).optional(),
    maxTeamSize: z.coerce.number().min(1).optional(),
    scoringFormat: z.string().optional(),
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
  })
  .refine(
    (data) => {
      if (data.startDate && data.registrationDeadline) {
        return new Date(data.startDate).getTime() > new Date(data.registrationDeadline).getTime();
      }
      return true;
    },
    {
      message: 'Start date must be after registration deadline',
      path: ['startDate'],
    },
  )
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate).getTime() >= new Date(data.startDate).getTime();
      }
      return true;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    },
  );

export type TournamentFormValues = {
  name: string;
  description?: string;
  category: string;
  sport?: string;
  competitionType: 'INDIVIDUAL' | 'TEAM';
  hasBothDivisions?: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  scoringFormat?: string;
  type: 'ONLINE' | 'OFFLINE';
  format: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'LEAGUE';
  visibility: 'PUBLIC' | 'PRIVATE';
  maxPlayers: number;
  prizePool?: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
};

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<SportType>(SportType.TABLE_TENNIS);
  const [divisionMode, setDivisionMode] = useState<'INDIVIDUAL' | 'TEAM' | 'BOTH'>('INDIVIDUAL');
  const [rulesViewTab, setRulesViewTab] = useState<'edit' | 'preview'>('edit');

  const [createTournament, { loading }] = useCreateTournament();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema) as any,
    defaultValues: {
      name: '',
      description: SPORTS_PRESETS[SportType.TABLE_TENNIS].defaultRules.map((r, i) => `${i + 1}. ${r}`).join('\n'),
      category: SPORTS_PRESETS[SportType.TABLE_TENNIS].categoryLabel,
      sport: SportType.TABLE_TENNIS,
      competitionType: 'INDIVIDUAL',
      minTeamSize: 1,
      maxTeamSize: 1,
      scoringFormat: SPORTS_PRESETS[SportType.TABLE_TENNIS].defaultScoringFormat,
      type: 'OFFLINE',
      format: 'SINGLE_ELIMINATION',
      visibility: 'PUBLIC',
      maxPlayers: 8,
      prizePool: 500,
      startDate: '',
      endDate: '',
      registrationDeadline: '',
    },
  });

  const currentCompetitionType = watch('competitionType');
  const currentDescription = watch('description') || '';

  const handleSelectSport = (sportKey: SportType) => {
    setSelectedSport(sportKey);
    const preset = SPORTS_PRESETS[sportKey];

    setValue('sport', sportKey);
    setValue('category', preset.categoryLabel);
    setValue('competitionType', preset.defaultCompetitionType);
    setValue('scoringFormat', preset.defaultScoringFormat);
    setValue('maxPlayers', preset.defaultMaxPlayers);

    if (preset.minTeamSize) {
      setValue('minTeamSize', preset.minTeamSize);
    }
    if (preset.maxTeamSize) {
      setValue('maxTeamSize', preset.maxTeamSize);
    }

    if (preset.defaultCompetitionType === 'TEAM') {
      setDivisionMode('TEAM');
    } else {
      setDivisionMode('INDIVIDUAL');
    }

    const defaultRulesText = preset.defaultRules.map((r, i) => `${i + 1}. ${r}`).join('\n');
    setValue('description', defaultRulesText);
  };

  const handleAppendRule = (ruleText: string) => {
    const existing = currentDescription.trim();
    const nextIndex = existing ? existing.split('\n').filter(Boolean).length + 1 : 1;
    const updated = existing ? `${existing}\n${nextIndex}. ${ruleText}` : `1. ${ruleText}`;
    setValue('description', updated);
  };

  const onSubmit = async (values: TournamentFormValues) => {
    setErrorMessage(null);
    try {
      await createTournament({
        variables: {
          input: {
            name: values.name,
            description: values.description || undefined,
            category: values.category,
            sport: values.sport,
            competitionType: values.competitionType,
            hasBothDivisions: divisionMode === 'BOTH',
            minTeamSize: values.minTeamSize,
            maxTeamSize: values.maxTeamSize,
            scoringFormat: values.scoringFormat,
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
            Set up rules, schedules, and player limits tailored to your sport.
          </p>
        </div>
      </div>

      <form data-testid="create-tournament-form" onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 md:p-8 space-y-8">
        {errorMessage && (
          <div data-testid="alert-error" className="flex items-center gap-3 rounded-panel border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="size-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Sport Selection Engine */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Select Sport & Discipline <span className="text-primary">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.values(SPORTS_PRESETS).map((preset) => {
              const isSelected = selectedSport === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  data-testid={`sport-card-${preset.id.toLowerCase()}`}
                  onClick={() => handleSelectSport(preset.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-card border transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary/15 shadow-[0_0_20px_rgba(230,0,38,0.25)] text-white'
                      : 'border-white/10 bg-slate-900/50 text-slate-300 hover:border-white/20 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{preset.icon}</span>
                  <span className="text-xs font-bold">{preset.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {preset.defaultCompetitionType === 'TEAM' ? 'Team Sport' : 'Singles / Team'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Basic Tournament Details */}
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
              placeholder={`e.g. 2026 ${SPORTS_PRESETS[selectedSport].name} Championship`}
              error={errors.name?.message}
            />
          </div>

          {/* Category / Game */}
          <div>
            <label htmlFor="tournament-category-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Category / Sport Label <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-category-input"
              data-testid="tournament-category-input"
              {...register('category')}
              error={errors.category?.message}
            />
          </div>

          {/* Competition Mode & Divisions */}
          <div className="space-y-2">
            <label htmlFor="tournament-competition-type-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Competition Mode & Divisions
            </label>

            <div className="flex items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                <input
                  type="radio"
                  name="competitionTypeRadio"
                  data-testid="tournament-comp-type-individual"
                  value="INDIVIDUAL"
                  checked={currentCompetitionType === 'INDIVIDUAL' && divisionMode !== 'BOTH'}
                  onChange={() => {
                    setDivisionMode('INDIVIDUAL');
                    setValue('competitionType', 'INDIVIDUAL');
                    setValue('hasBothDivisions', false);
                    setValue('minTeamSize', 1);
                    setValue('maxTeamSize', 1);
                  }}
                  className="size-4 accent-primary"
                />
                <span>Individual (Singles)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                <input
                  type="radio"
                  name="competitionTypeRadio"
                  data-testid="tournament-comp-type-team"
                  value="TEAM"
                  checked={currentCompetitionType === 'TEAM'}
                  onChange={() => {
                    setDivisionMode('TEAM');
                    setValue('competitionType', 'TEAM');
                    setValue('hasBothDivisions', false);
                    const preset = SPORTS_PRESETS[selectedSport];
                    setValue('minTeamSize', preset.minTeamSize || 2);
                    setValue('maxTeamSize', preset.maxTeamSize || 2);
                  }}
                  className="size-4 accent-primary"
                />
                <span>Team (Squads)</span>
              </label>
            </div>

            <select
              id="tournament-competition-type-select"
              data-testid="tournament-competition-type-select"
              value={divisionMode}
              onChange={(e) => {
                const val = e.target.value as 'INDIVIDUAL' | 'TEAM' | 'BOTH';
                setDivisionMode(val);
                if (val === 'BOTH') {
                  setValue('competitionType', 'INDIVIDUAL');
                  setValue('hasBothDivisions', true);
                  setValue('minTeamSize', 2);
                  setValue('maxTeamSize', 2);
                } else if (val === 'TEAM') {
                  setValue('competitionType', 'TEAM');
                  setValue('hasBothDivisions', false);
                  const preset = SPORTS_PRESETS[selectedSport];
                  setValue('minTeamSize', preset.minTeamSize || 2);
                  setValue('maxTeamSize', preset.maxTeamSize || 2);
                } else {
                  setValue('competitionType', 'INDIVIDUAL');
                  setValue('hasBothDivisions', false);
                  setValue('minTeamSize', 1);
                  setValue('maxTeamSize', 1);
                }
              }}
              className="h-10 w-full rounded-button border border-white/[0.09] bg-surface-850/90 px-3.5 text-sm font-medium text-slate-200 outline-none hover:border-white/[0.18] focus:border-primary"
            >
              <option value="INDIVIDUAL">Individual (Singles)</option>
              <option value="TEAM">Team (Squads / Doubles)</option>
              {(selectedSport === SportType.TABLE_TENNIS ||
                selectedSport === SportType.BADMINTON ||
                selectedSport === SportType.CARROM) && (
                <option value="BOTH">Dual Division: Singles & Doubles (2 Sub-Tournaments)</option>
              )}
            </select>
          </div>

          {/* Dual Division Explanatory Banner */}
          {divisionMode === 'BOTH' && (
            <div data-testid="dual-division-info" className="md:col-span-2 p-4 rounded-panel bg-primary/10 border border-primary/25 text-xs text-primary-light flex items-start gap-3">
              <span className="text-xl">🏓👥</span>
              <div>
                <p className="font-semibold text-white text-sm">Championship Dual Format (Singles & Doubles)</p>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  This creates a master Championship managing <strong>2 independent sub-tournaments</strong>: Singles (Individual) and Doubles (Pairs of 2). Brackets, player registrations, and matches are tracked separately, crowning both a <strong>Singles Champion</strong> and <strong>Doubles Champions</strong> under this single tournament!
                </p>
              </div>
            </div>
          )}

          {/* Team Size constraints (Visible when Team competition selected) */}
          {currentCompetitionType === 'TEAM' && (
            <>
              <div>
                <label htmlFor="tournament-min-team-size-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Min Players Per Team <span className="text-primary">*</span>
                </label>
                <Input
                  id="tournament-min-team-size-input"
                  data-testid="tournament-min-team-size-input"
                  type="number"
                  {...register('minTeamSize')}
                  error={errors.minTeamSize?.message}
                />
              </div>

              <div>
                <label htmlFor="tournament-max-team-size-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Max Players Per Team <span className="text-primary">*</span>
                </label>
                <Input
                  id="tournament-max-team-size-input"
                  data-testid="tournament-max-team-size-input"
                  type="number"
                  {...register('maxTeamSize')}
                  error={errors.maxTeamSize?.message}
                />
              </div>
            </>
          )}

          {/* Tournament Format */}
          <div>
            <label htmlFor="tournament-format-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Bracket Format
            </label>
            <select
              id="tournament-format-select"
              data-testid="tournament-format-select"
              {...register('format')}
              className="h-10 w-full rounded-button border border-white/[0.09] bg-surface-850/90 px-3.5 text-sm font-medium text-slate-200 outline-none hover:border-white/[0.18] focus:border-primary"
            >
              <option value="SINGLE_ELIMINATION">Single Elimination</option>
              <option value="DOUBLE_ELIMINATION">Double Elimination</option>
              <option value="ROUND_ROBIN">Round Robin</option>
              <option value="LEAGUE">League</option>
            </select>
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
              className="h-10 w-full rounded-button border border-white/[0.09] bg-surface-850/90 px-3.5 text-sm font-medium text-slate-200 outline-none hover:border-white/[0.18] focus:border-primary"
            >
              <option value="OFFLINE">Offline / In-Person</option>
              <option value="ONLINE">Online Event</option>
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
              className="h-10 w-full rounded-button border border-white/[0.09] bg-surface-850/90 px-3.5 text-sm font-medium text-slate-200 outline-none hover:border-white/[0.18] focus:border-primary"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private / Invite Only</option>
            </select>
          </div>

          {/* Max Participants */}
          <div>
            <label htmlFor="tournament-max-players-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {currentCompetitionType === 'TEAM' ? 'Max Teams' : 'Max Participants'} <span className="text-primary">*</span>
            </label>
            <Input
              id="tournament-max-players-input"
              data-testid="tournament-max-players-input"
              type="number"
              {...register('maxPlayers')}
              placeholder="8"
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
        </div>

        {/* Step 3: Application-Themed Rules & Description Builder */}
        <div data-testid="rules-builder-section" className="space-y-4 rounded-card border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                <span>Tournament Rules & Description</span>
              </h3>
              <p className="text-xs text-slate-400">
                Customized according to {SPORTS_PRESETS[selectedSport].name} official standards
              </p>
            </div>

            {/* Edit / Preview Tabs */}
            <div className="flex rounded-button border border-white/10 bg-slate-800/60 p-1">
              <button
                type="button"
                data-testid="rules-tab-edit"
                onClick={() => setRulesViewTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                  rulesViewTab === 'edit'
                    ? 'bg-primary text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span data-testid="rules-edit-tab-btn" className="contents">
                  <Edit3 className="size-3.5" />
                  <span>Editor</span>
                </span>
              </button>
              <button
                type="button"
                data-testid="rules-tab-preview"
                onClick={() => setRulesViewTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                  rulesViewTab === 'preview'
                    ? 'bg-primary text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span data-testid="rules-preview-tab-btn" className="contents">
                  <Eye className="size-3.5" />
                  <span>Preview</span>
                </span>
              </button>
            </div>
          </div>

          {/* Quick preset rule chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Rule Templates (Click to Add):
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMON_RULE_PRESETS.map((presetRule, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-testid={`rule-preset-chip-${idx}`}
                  onClick={() => handleAppendRule(presetRule)}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:border-primary/50 hover:bg-primary/10 hover:text-white transition-all active:scale-95"
                >
                  <span data-testid={`append-rule-chip-${idx}`} className="contents">
                    <Plus className="size-3 text-primary" />
                    <span>{presetRule}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Editor or Preview View */}
          {rulesViewTab === 'edit' ? (
            <div>
              <Textarea
                id="tournament-description-input"
                data-testid="tournament-description-input"
                {...register('description')}
                placeholder="Numbered tournament rules, match guidelines, and conduct policies..."
                className="min-h-[140px] font-mono text-xs leading-relaxed"
              />
            </div>
          ) : (
            <div data-testid="rules-preview-panel" className="rounded-card border border-white/5 bg-slate-800/40 p-4 space-y-2 max-h-56 overflow-y-auto">
              {currentDescription ? (
                currentDescription.split('\n').filter(Boolean).map((line: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{line.replace(/^\d+[\.\)]\s*/, '')}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No rules specified yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] pt-6">
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