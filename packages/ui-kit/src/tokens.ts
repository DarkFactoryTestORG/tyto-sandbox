/**
 * Theme tokens. Each is a CSS custom property set in theme.css; use the var() here in inline
 * styles, or the property name in CSS. Override them under :root to theme an app.
 */
export const color = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryContrast: 'var(--color-primary-contrast)',
  primarySubtle: 'var(--color-primary-subtle)',
  danger: 'var(--color-danger)',
  dangerHover: 'var(--color-danger-hover)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  surface: 'var(--color-surface)',
  surfaceRaised: 'var(--color-surface-raised)',
  border: 'var(--color-border)',
  focus: 'var(--color-focus)',
} as const;

export const space = {
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
} as const;

export const radius = { sm: 'var(--radius-sm)', md: 'var(--radius-md)' } as const;
