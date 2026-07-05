const NUMERIC_KEYBOARD_TYPES = new Set(['number-pad', 'numeric']);

export function isNumericKeyboard(
  keyboardType?: string,
): keyboardType is 'number-pad' | 'numeric' {
  return NUMERIC_KEYBOARD_TYPES.has(keyboardType ?? '');
}

/** Strip non-digits and prevent leading zeros (except a lone "0"). */
export function normalizeNumericInput(text: string): string {
  const digits = text.replace(/\D/g, '');
  if (!digits) return '';
  if (/^0+$/.test(digits)) return '0';
  return digits.replace(/^0+/, '');
}
