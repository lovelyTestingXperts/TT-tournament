import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import FormInput from '@/components/ui/form/FormInput';
import FormPasswordInput from '@/components/ui/form/FormPasswordInput';
import FormSelect from '@/components/ui/form/FormSelect';

import {
  RegisterFormData,
  registerSchema,
} from '@/features/auth/schemas/register.schema';

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      role: 'player',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div
        className="
        glass-card
        rounded-[36px]
        p-8
        md:p-10
      "
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="
            mx-auto
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

          <h1 className="text-3xl font-bold">Create Account</h1>

          <p className="mt-2 text-sm text-white/60">
            Join tournaments and manage matches.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            name="fullName"
            control={control}
            label="Full Name"
            placeholder="John Doe"
          />

          <FormInput
            name="username"
            control={control}
            label="Username"
            placeholder="johndoe"
          />

          <FormInput
            name="email"
            control={control}
            label="Email"
            placeholder="example@email.com"
          />

          <FormInput
            name="phoneNumber"
            control={control}
            label="Phone Number"
            placeholder="+91 9876543210"
          />

          <FormSelect
            name="role"
            control={control}
            label="Role"
            options={[
              {
                label: 'Player',
                value: 'player',
              },
              {
                label: 'Member',
                value: 'member',
              },
              {
                label: 'Referee',
                value: 'referee',
              },
            ]}
          />

          <FormPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="••••••••"
          />

          <FormPasswordInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" size="lg">
            Create Account
          </Button>
        </form>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-white/60">
          Already have an account?{' '}
          <Link
            to="/login"
            className="
      font-medium
      text-violet-300
      transition
      hover:text-violet-200
    "
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
