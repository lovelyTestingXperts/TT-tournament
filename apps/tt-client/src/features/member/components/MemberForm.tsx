import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button  from '@/components/ui/button/Button';
import Input  from '@/components/ui/input/Input';
import Textarea  from '@/components/ui/input/TextArea';

const memberSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Required'),

  lastName: z
    .string()
    .min(2, 'Required'),

  employeeId: z
    .string()
    .min(1, 'Required'),

  email: z.email(
    'Invalid email',
  ),

  password: z
    .string()
    .min(
      6,
      'Password must be at least 6 characters',
    ),

  phoneNumber:
    z.string().optional(),

  role: z.enum([
    'admin',
    'referee',
    'player',
    'member',
  ]),

  bio: z.string().optional(),
});

type MemberFormValues =
  z.infer<
    typeof memberSchema
  >;

interface Props {
  mode?: 'create' | 'edit';
}

export default function MemberForm({
  mode = 'create',
}: Props) {
  const [showPassword,
    setShowPassword] =
    useState(false);

  const form =
    useForm<MemberFormValues>({
      resolver: zodResolver(
        memberSchema,
      ),

      defaultValues: {
        firstName: '',
        lastName: '',
        employeeId: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'member',
        bio: '',
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (
    values: MemberFormValues,
  ) => {
    console.log(values);

    // graphql mutation
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* first name */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            First Name
          </label>

          <Input
            {...register(
              'firstName',
            )}
            placeholder="John"
          />

          <p className="mt-1 text-sm text-red-400">
            {
              errors.firstName
                ?.message
            }
          </p>
        </div>

        {/* last name */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Last Name
          </label>

          <Input
            {...register(
              'lastName',
            )}
            placeholder="Doe"
          />
        </div>

        {/* employee id */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Employee ID
          </label>

          <Input
            {...register(
              'employeeId',
            )}
            placeholder="EMP-001"
          />
        </div>

        {/* role */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Role
          </label>

          <select
            {...register('role')}
            className="
              h-11 w-full rounded-xl
              border border-white/10
              bg-black/40 px-4
              text-zinc-200
            "
          >
            <option value="member">
              Member
            </option>

            <option value="player">
              Player
            </option>

            <option value="referee">
              Referee
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        {/* email */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">
            Email
          </label>

          <Input
            {...register(
              'email',
            )}
            placeholder="john@example.com"
          />
        </div>

        {/* password */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">
            Password
          </label>

          <div className="relative">
            <Input
              {...register(
                'password',
              )}
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword,
                )
              }
              className="
                absolute right-3
                top-1/2
                -translate-y-1/2
                text-zinc-500
              "
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* phone */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">
            Phone Number
          </label>

          <Input
            {...register(
              'phoneNumber',
            )}
            placeholder="+91..."
          />
        </div>

        {/* bio */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">
            Bio
          </label>

          <Textarea
            {...register('bio')}
            className="min-h-[120px]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
        >
          Cancel
        </Button>

        <Button type="submit">
          {mode === 'create'
            ? 'Create User'
            : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}