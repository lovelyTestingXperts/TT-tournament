import { cva } from 'class-variance-authority';

export const buttonVariants =
  cva(
    `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    font-medium
    transition-all
    duration-300
    disabled:pointer-events-none
    disabled:opacity-50
    active:scale-[0.98]
    `,
    {
      variants: {
        variant: {
          primary: `
            bg-white/15
            text-white
            border
            border-white/10
            backdrop-blur-xl
            hover:bg-white/20
            hover:shadow-lg
          `,

          secondary: `
            bg-black/10
            border
            border-white/10
            text-white/90
            hover:bg-white/10
          `,

          ghost: `
            bg-transparent
            text-white/80
            hover:bg-white/10
          `,

          danger: `
            bg-red-500/20
            text-red-200
            border-red-400/20
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
            px-6
            text-base
          `,

          lg: `
            h-14
            px-8
            text-lg
          `,
        },
      },

      defaultVariants: {
        variant: 'primary',
        size: 'md',
      },
    }
  );