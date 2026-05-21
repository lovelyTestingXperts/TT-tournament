import { cva } from 'class-variance-authority';

export const inputVariants =
  cva(
    `
    w-full
    rounded-2xl
    border
    bg-white/10
    text-white
    backdrop-blur-xl
    transition-all
    duration-300
    outline-none
    placeholder:text-white/40
    disabled:opacity-50
    disabled:cursor-not-allowed
    `,
    {
      variants: {
        state: {
          default: `
            border-white/10
            focus:border-violet-400
            focus:ring-4
            focus:ring-violet-500/20
          `,

          error: `
            border-red-400/40
            focus:ring-red-400/20
          `,
        },

        size: {
          sm: `
            h-10
            px-4
            text-sm
          `,

          md: `
            h-12
            px-5
            text-base
          `,

          lg: `
            h-14
            px-6
            text-lg
          `,
        },
      },

      defaultVariants: {
        state: 'default',
        size: 'md',
      },
    }
  );