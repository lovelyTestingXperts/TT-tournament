import {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'danger';

  size?: 'sm' | 'md' | 'lg';

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  loading?: boolean;
}