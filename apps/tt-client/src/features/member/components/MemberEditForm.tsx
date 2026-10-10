import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Textarea from '@/components/ui/input/TextArea';
import { useUpdateUser } from '@/features/member/graphql/hooks';

const editMemberSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(['ADMIN', 'REFEREE', 'PLAYER', 'MEMBER']),
  isActive: z.boolean(),
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

interface Props {
  initialData?: any;
  userId: string;
}

export default function MemberEditForm({ initialData, userId }: Props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updateUser, { loading }] = useUpdateUser();

  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phoneNumber: initialData?.phoneNumber || '',
      bio: initialData?.bio || '',
      avatar: initialData?.avatar || '',
      role: (initialData?.role?.toUpperCase() as any) || 'MEMBER',
      isActive: initialData?.isActive ?? true,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        phoneNumber: initialData.phoneNumber || '',
        bio: initialData.bio || '',
        avatar: initialData.avatar || '',
        role: (initialData.role?.toUpperCase() as any) || 'MEMBER',
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (values: EditMemberFormValues) => {
    setErrorMessage(null);
    try {
      await updateUser({
        variables: {
          id: userId,
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber || undefined,
            avatar: values.avatar || undefined,
            bio: values.bio || undefined,
            role: values.role,
            isActive: values.isActive,
          },
        },
      });
      navigate(`/members/${userId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update user.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 md:p-8">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-panel border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle className="size-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            First Name <span className="text-primary">*</span>
          </label>
          <Input
            {...register('firstName')}
            placeholder="First name"
            error={errors.firstName?.message}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Last Name <span className="text-primary">*</span>
          </label>
          <Input
            {...register('lastName')}
            placeholder="Last name"
            error={errors.lastName?.message}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Phone Number
          </label>
          <Input
            {...register('phoneNumber')}
            placeholder="+1 555-0199"
            error={errors.phoneNumber?.message}
          />
        </div>

        {/* Avatar URL */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Avatar URL
          </label>
          <Input
            {...register('avatar')}
            placeholder="https://..."
            error={errors.avatar?.message}
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Role
          </label>
          <select
            {...register('role')}
            className="
              h-10 w-full rounded-button
              border border-white/[0.09]
              bg-surface-850/90 px-3.5 text-sm
              font-medium text-slate-200 outline-none
              transition-all hover:border-white/[0.18]
              focus:border-primary focus:ring-2 focus:ring-primary/20
            "
          >
            <option value="MEMBER">Member (Audience)</option>
            <option value="PLAYER">Player</option>
            <option value="REFEREE">Referee</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        {/* Account Status */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Account Status
          </label>
          <select
            {...register('isActive', {
              setValueAs: (v) => v === 'true' || v === true,
            })}
            className="
              h-10 w-full rounded-button
              border border-white/[0.09]
              bg-surface-850/90 px-3.5 text-sm
              font-medium text-slate-200 outline-none
              transition-all hover:border-white/[0.18]
              focus:border-primary focus:ring-2 focus:ring-primary/20
            "
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Bio / Notes
          </label>
          <Textarea
            {...register('bio')}
            placeholder="Tell something about this user..."
            className="min-h-[120px]"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/[0.07] pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(`/members/${userId}`)}
        >
          Cancel
        </Button>

        <Button type="submit" variant="primary" loading={loading}>
          <CheckCircle2 className="size-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </form>
  );
}
