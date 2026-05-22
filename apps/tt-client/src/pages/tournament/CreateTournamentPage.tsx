import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';

import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/button/Button';
import FormInput from '@/components/ui/form/FormInput';
import FormSelect from '@/components/ui/form/FormSelect';

import {
  createTournamentSchema,
  CreateTournamentForm,
} from '@/features/tournament/schemas/tournament.schema';

export default function CreateTournamentPage() {
  const {
    control,
    handleSubmit,
  } =
    useForm<CreateTournamentForm>({
      resolver:
        zodResolver(
          createTournamentSchema
        ),
    });

  const onSubmit = (
    data: CreateTournamentForm
  ) => {
    console.log(data);
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl">
        <div
          className="
          glass-card
          rounded-[36px]
          p-8
        "
        >
          {/* Header */}
          <div className="mb-8">
            <div
              className="
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-white/10
            "
            >
              <Trophy size={28} />
            </div>

            <h1 className="text-3xl font-bold">
              Create Tournament
            </h1>

            <p className="mt-2 text-white/60">
              Configure tournament
              details and launch it.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >
            <FormInput
              name="name"
              control={control}
              label="Tournament Name"
              placeholder="Winter Cup 2026"
            />

            <FormInput
              name="description"
              control={control}
              label="Description"
              placeholder="Tournament details..."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                name="category"
                control={control}
                label="Category"
                placeholder="Cricket"
              />

              <FormSelect
                name="type"
                control={control}
                label="Type"
                options={[
                  {
                    label:
                      'Online',
                    value:
                      'online',
                  },
                  {
                    label:
                      'Offline',
                    value:
                      'offline',
                  },
                ]}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormSelect
                name="format"
                control={control}
                label="Format"
                options={[
                  {
                    label:
                      'Single Elimination',
                    value:
                      'single_elimination',
                  },
                  {
                    label:
                      'Double Elimination',
                    value:
                      'double_elimination',
                  },
                  {
                    label:
                      'Round Robin',
                    value:
                      'round_robin',
                  },
                ]}
              />

              <FormSelect
                name="status"
                control={control}
                label="Status"
                options={[
                  {
                    label:
                      'Draft',
                    value:
                      'draft',
                  },
                  {
                    label:
                      'Upcoming',
                    value:
                      'upcoming',
                  },
                  {
                    label:
                      'Active',
                    value:
                      'active',
                  },
                ]}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                name="startDate"
                control={control}
                label="Start Date"
                type="date"
              />

              <FormInput
                name="endDate"
                control={control}
                label="End Date"
                type="date"
              />
            </div>

            <FormInput
              name="maxPlayers"
              control={control}
              label="Max Players"
              type="number"
            />

            <Button
              type="submit"
              size="lg"
            >
              Create Tournament
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}