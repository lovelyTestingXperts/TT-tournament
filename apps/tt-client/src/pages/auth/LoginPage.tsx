import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';

import Button from '@/components/ui/button/Button';
import FormInput from '@/components/ui/form/FormInput';
import FormPasswordInput from '@/components/ui/form/FormPasswordInput';
import {
  LoginFormData,
  loginSchema,
} from '@/features/auth/schemas/login.schema';
import { LOGIN_MUTATION } from '@/features/auth/graphql/mutations';

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { handleSubmit, control } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { accessToken, user } = data.login;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/');
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    loginMutation({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    });
  };

  return (
    <div data-testid="login-page" className="flex min-h-screen items-center justify-center px-4">
      <div
        className="
        glass-card
        w-full
        max-w-[460px]
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

          <h1
            className="
            text-3xl
            font-bold
            tracking-tight
            text-white
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-slate-400
          "
          >
            Sign in to manage tournaments, matches and registrations.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            data-testid="alert-error"
            className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form data-testid="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            name="email"
            control={control}
            label="Email"
            placeholder="Enter email"
          />

          <FormPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="Enter password"
          />

          <div className="flex justify-end">
            <button
              type="button"
              data-testid="forgot-password-btn"
              className="
              text-sm
              text-slate-400
              transition
              hover:text-white
            "
            >
              Forgot Password?
            </button>
          </div>

          <Button
            data-testid="login-submit-btn"
            className="w-full"
            type="submit"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        {/* Footer */}
        <div
          className="
          mt-6
          text-center
          text-sm
          text-slate-400
        "
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            data-testid="register-link"
            className="
            font-medium
            text-primary
            transition
            hover:underline
          "
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
