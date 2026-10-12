import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Textarea from '@/components/ui/input/TextArea';
import { useCreateUser } from '@/features/member/graphql/hooks';

const memberSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  employeeId: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
  role: z.enum(['ADMIN', 'REFEREE', 'PLAYER', 'MEMBER']),
  bio: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function MemberForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createUser, { loading }] = useCreateUser();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'MEMBER',
      bio: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values: MemberFormValues) => {
    setErrorMessage(null);
    try {
      await createUser({
        variables: {
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber || undefined,
            employeeId: values.employeeId || undefined,
            role: values.role,
            bio: values.bio || undefined,
          },
        },
      });
      navigate('/members');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create user. Please try again.');
    }
  };

  return (
    <form data-testid="create-user-form" onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 md:p-8">
      {errorMessage && (
        <div data-testid="alert-error" className="mb-6 flex items-center gap-3 rounded-panel border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle className="size-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* First Name */}
        <div>
          <label htmlFor="user-firstname-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            First Name <span className="text-primary">*</span>
          </label>
          <Input
            id="user-firstname-input"
            data-testid="user-firstname-input"
            {...register('firstName')}
            placeholder="Jane"
            error={errors.firstName?.message}
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="user-lastname-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Last Name <span className="text-primary">*</span>
          </label>
          <Input
            id="user-lastname-input"
            data-testid="user-lastname-input"
            {...register('lastName')}
            placeholder="Doe"
            error={errors.lastName?.message}
          />
        </div>

        {/* Employee ID */}
        <div>
          <label htmlFor="user-employeeid-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Employee ID (Optional)
          </label>
          <Input
            id="user-employeeid-input"
            data-testid="user-employeeid-input"
            {...register('employeeId')}
            placeholder="EMP-1024"
            error={errors.employeeId?.message}
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="user-role-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Role
          </label>
          <select
            id="user-role-select"
            data-testid="user-role-select"
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

        {/* Email */}
        <div className="md:col-span-2">
          <label htmlFor="user-email-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Email Address <span className="text-primary">*</span>
          </label>
          <Input
            id="user-email-input"
            data-testid="user-email-input"
            {...register('email')}
            type="email"
            placeholder="jane.doe@example.com"
            error={errors.email?.message}
          />
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label htmlFor="user-password-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Initial Password <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <Input
              id="user-password-input"
              data-testid="user-password-input"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              error={errors.password?.message}
            />
            <button
              type="button"
              data-testid="toggle-password-visibility-btn"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <label htmlFor="user-phone-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Phone Number (Optional)
          </label>
          <Input
            id="user-phone-input"
            data-testid="user-phone-input"
            {...register('phoneNumber')}
            placeholder="+1 (555) 000-0000"
            error={errors.phoneNumber?.message}
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label htmlFor="user-bio-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Bio / Notes
          </label>
          <Textarea
            id="user-bio-input"
            data-testid="user-bio-input"
            {...register('bio')}
            placeholder="Short bio or participant notes..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/[0.07] pt-6">
        <Button
          data-testid="cancel-btn"
          type="button"
          variant="secondary"
          onClick={() => navigate('/members')}
        >
          Cancel
        </Button>

        <Button data-testid="submit-user-btn" type="submit" variant="primary" loading={loading}>
          <CheckCircle2 className="size-4" />
          <span>Create User</span>
        </Button>
      </div>
    </form>
  );
}