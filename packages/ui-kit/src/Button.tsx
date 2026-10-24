import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export type ButtonKind = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default 'secondary'. */
  kind?: ButtonKind;
  size?: 'md' | 'sm';
}

export function Button({
  kind = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[kind], size === 'sm' ? styles.small : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={classes} {...rest} />;
}
