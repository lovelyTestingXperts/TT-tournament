import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';

import Button from '@/components/ui/button/Button';
import FormInput from '@/components/ui/form/FormInput';
import FormPasswordInput from '@/components/ui/form/FormPasswordInput';
import {
  RegisterFormData,
  registerSchema,
} from '@/features/auth/schemas/register.schema';
import { REGISTER_MUTATION } from '@/features/auth/graphql/mutations';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const user = data.register;
      if (!user.isActive) {
        setSuccessMessage(
          'Registration successful! Your account is currently awaiting Admin approval before you can log in.',
        );
      } else {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    registerMutation({
      variables: {
        input: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber || undefined,
        },
      },
    });
  };

  return (
    <div data-testid="register-page" className="mx-auto w-full max-w-[520px]">
      <div
        className="
        glass-card
        rounded-card
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
            bg-primary/10
            text-primary
            border
            border-primary/30
          "
          >
            <Trophy size={28} />
          </div>

          <h1 className="text-3xl font-bold text-white">Create Player Account</h1>

          <p className="mt-2 text-sm text-slate-400">
            Join tournaments and compete as an official player.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div
            data-testid="alert-error"
            className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            data-testid="alert-success"
            className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400"
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form data-testid="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              name="firstName"
              control={control}
              label="First Name"
              placeholder="John"
            />

            <FormInput
              name="lastName"
              control={control}
              label="Last Name"
              placeholder="Doe"
            />
          </div>

          <FormInput
            name="email"
            control={control}
            label="Email Address"
            placeholder="john@example.com"
          />

          <FormInput
            name="phoneNumber"
            control={control}
            label="Phone Number (Optional)"
            placeholder="+1 555-0199"
          />

          {/* Role badge indicator: Public registration is locked to PLAYER */}
          <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Account Role:</span>
            <span
              data-testid="status-badge"
              data-status="player"
              className="rounded bg-primary/20 px-2 py-0.5 font-medium uppercase tracking-wider text-primary border border-primary/30"
            >
              Player
            </span>
          </div>

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

          <Button
            data-testid="register-submit-btn"
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register as Player'}
          </Button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            data-testid="login-link"
            className="
              font-medium
              text-primary
              transition
              hover:underline
            "
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
