import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Textarea from '@/components/ui/input/TextArea';

const editMemberSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),

  lastName: z.string().min(2, 'Last name is required'),

  email: z.email('Please enter a valid email'),

  phoneNumber: z.string().optional(),

  bio: z.string().optional(),

  avatar: z.string().optional(),

  role: z.enum(['admin', 'referee', 'player', 'member']),

  isActive: z.boolean(),
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

export default function MemberEditForm() {
  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),

    defaultValues: {
      firstName: 'Lovely',
      lastName: 'Singh',
      email: 'lovely@test.com',
      phoneNumber: '+91 9876543210',
      bio: '',
      avatar: '',
      role: 'admin',
      isActive: true,
    },
  });

  const onSubmit = (values: EditMemberFormValues) => {
    console.log(values);

    // graphql mutation later
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Update user profile, role and account status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* first name */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">First Name</label>

          <Input {...register('firstName')} placeholder="Enter first name" />

          {errors.firstName && (
            <p className="mt-2 text-sm text-red-400">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* last name */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Last Name</label>

          <Input {...register('lastName')} placeholder="Enter last name" />

          {errors.lastName && (
            <p className="mt-2 text-sm text-red-400">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* email */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Email</label>

          <Input
            {...register('email')}
            type="email"
            placeholder="Enter email"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* phone */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Phone Number
          </label>

          <Input {...register('phoneNumber')} placeholder="+91 9876543210" />
        </div>

        {/* avatar */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Avatar URL</label>

          <Input {...register('avatar')} placeholder="https://..." />
        </div>

        {/* role */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Role</label>

          <select
            {...register('role')}
            className="
              h-11 w-full rounded-xl
              border border-white/10
              bg-black/40
              px-4 text-sm
              text-zinc-200
              outline-none
            "
          >
            <option value="admin">Admin</option>

            <option value="referee">Referee</option>

            <option value="player">Player</option>

            <option value="member">Member</option>
          </select>
        </div>

        {/* status */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Status</label>

          <select
            {...register('isActive', {
              setValueAs: (v) => v === 'true',
            })}
            className="
              h-11 w-full rounded-xl
              border border-white/10
              bg-black/40
              px-4 text-sm
              text-zinc-200
              outline-none
            "
          >
            <option value="true">Active</option>

            <option value="false">Inactive</option>
          </select>
        </div>

        {/* bio */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Bio</label>

          <Textarea
            {...register('bio')}
            placeholder="Tell something about this user..."
            className="min-h-[140px]"
          />
        </div>
      </div>

      {/* actions */}
      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
          className="
            rounded-xl
          "
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="
            rounded-xl
          "
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
