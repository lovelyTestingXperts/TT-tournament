import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import FormInput from '@/components/ui/form/FormInput';
import FormPasswordInput from '@/components/ui/form/FormPasswordInput';

import {
  LoginFormData,
  loginSchema,
} from '@/features/auth/schemas/login.schema';
import InteractiveCard from '@/components/ui/card/InteractiveCard';
import StatCard from '@/components/ui/card/StatCard';
import Card from '@/components/ui/card/Card';

export default function LoginPage() {
  const { handleSubmit, control } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className="
        glass-card
        w-full
        max-w-[460px]
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
            backdrop-blur-xl
          "
          >
            <Trophy size={28} />
          </div>

          <h1
            className="
            text-3xl
            font-bold
            tracking-tight
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-white/65
          "
          >
            Sign in to manage tournaments, matches and registrations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="
              text-sm
              text-white/60
              transition
              hover:text-white
            "
            >
              Forgot Password?
            </button>
          </div>

          <Button className="w-full" type="submit" size="lg">
            Login
          </Button>
        </form>

        {/* Footer */}
        <div
          className="
          mt-6
          text-center
          text-sm
          text-white/60
        "
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="
            font-medium
            text-violet-300
            transition
            hover:text-violet-200
          "
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
