import { describe, expect, it } from 'vitest';
import { createWorkbook } from '../src/xlsx';

function ascii(bytes: Uint8Array) {
  return String.fromCharCode(...bytes);
}

describe('createWorkbook', () => {
  it('creates an xlsx zip with worksheet content', () => {
    const workbook = createWorkbook(
      [{ respondent_code: 'ibu-001', score: 87 }],
      ['respondent_code', 'score'],
    );

    expect(workbook[0]).toBe(0x50);
    expect(workbook[1]).toBe(0x4b);
    expect(ascii(workbook)).toContain('[Content_Types].xml');
    expect(ascii(workbook)).toContain('xl/worksheets/sheet1.xml');
  });

  it('creates multiple worksheets when sheet definitions are provided', () => {
    const workbook = createWorkbook([
      {
        name: 'Responden',
        rows: [{ name: 'Ibu Sari', phone_number: '08123456789' }],
        keys: ['name', 'phone_number'],
        headers: ['Nama', 'Nomor Telepon'],
      },
      {
        name: 'Hasil Tes',
        rows: [{ name: 'Ibu Sari', score: 90 }],
        keys: ['name', 'score'],
        headers: ['Nama', 'Nilai'],
      },
    ]);
    const contents = ascii(workbook);

    expect(contents).toContain('sheet name="Responden"');
    expect(contents).toContain('sheet name="Hasil Tes"');
    expect(contents).toContain('xl/worksheets/sheet1.xml');
    expect(contents).toContain('xl/worksheets/sheet2.xml');
  });
});
