import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  `
  w-full
  rounded-button
  border
  bg-surface-850/90
  text-white
  backdrop-blur-md
  transition-all
  duration-200
  outline-none
  placeholder:text-slate-500
  disabled:opacity-50
  disabled:cursor-not-allowed
  `,
  {
    variants: {
      state: {
        default: `
          border-white/[0.09]
          hover:border-white/[0.18]
          focus:border-primary
          focus:ring-2
          focus:ring-primary/25
          focus:shadow-[0_0_15px_rgba(230,0,38,0.2)]
        `,

        error: `
          border-red-500/60
          focus:border-red-500
          focus:ring-2
          focus:ring-red-500/30
        `,
      },

      size: {
        sm: `
          h-9
          px-3.5
          text-xs
        `,

        md: `
          h-10
          px-4
          text-sm
        `,

        lg: `
          h-12
          px-5
          text-base
        `,
      },
    },

    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
);