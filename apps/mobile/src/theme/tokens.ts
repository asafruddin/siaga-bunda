import { TextStyle } from 'react-native';

export const colors = {
  surfaceBase: '#FFF8F5',
  surfaceRaised: '#FFFFFF',
  surfaceMuted: '#F4EFEC',
  inkPrimary: '#1D1B20',
  inkSecondary: '#4E454A',
  primary: '#176B5B',
  onPrimary: '#FFFFFF',
  researcher: '#315A7D',
  outline: '#79747E',
  outlineSubtle: '#CAC4D0',
  focusRing: '#0B57D0',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
  screenMargin: 16,
  sectionGap: 24,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  headline: {
    color: colors.inkPrimary,
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  } satisfies TextStyle,
  body: {
    color: colors.inkPrimary,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  bodyStrong: {
    color: colors.inkPrimary,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } satisfies TextStyle,
} as const;
