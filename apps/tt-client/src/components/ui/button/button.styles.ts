import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  gap-2
  rounded-button
  font-medium
  transition-all
  duration-200
  disabled:pointer-events-none
  disabled:opacity-50
  active:scale-[0.98]
  select-none
  outline-none
  focus-visible:ring-2
  focus-visible:ring-primary/60
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-brandGradient
          text-white
          shadow-brandGlow
          border
          border-white/20
          hover:bg-brandGradientHover
          hover:shadow-[0_0_25px_rgba(255,23,68,0.5)]
        `,

        secondary: `
          bg-surface-800
          border
          border-white/[0.09]
          text-slate-200
          hover:bg-surface-750
          hover:border-white/[0.18]
          hover:text-white
        `,

        ghost: `
          bg-transparent
          text-slate-300
          hover:bg-white/[0.08]
          hover:text-white
        `,

        danger: `
          bg-red-500/15
          text-red-300
          border
          border-red-500/30
          hover:bg-red-500/25
          hover:text-red-200
        `,

        outline: `
          bg-transparent
          border
          border-primary/50
          text-primary
          hover:bg-primary/10
          hover:border-primary
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
          px-4.5
          text-sm
        `,

        lg: `
          h-12
          px-6
          text-base
        `,
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);