const encoder = new TextEncoder();

type WorkbookCell = unknown;
type WorkbookSheet = {
  name: string;
  rows: Record<string, unknown>[];
  keys: string[];
  headers?: string[];
};

const crcTable = new Uint32Array(256);
for (let i = 0; i < crcTable.length; i += 1) {
  let c = i;
  for (let j = 0; j < 8; j += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

function crc32(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (const byte of bytes) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeUint16(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function xml(value: unknown) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function columnName(index: number) {
  let name = '';
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function cellReference(columnIndex: number, rowIndex: number) {
  return `${columnName(columnIndex)}${rowIndex + 1}`;
}

function cell(value: WorkbookCell, columnIndex: number, rowIndex: number) {
  const reference = cellReference(columnIndex, rowIndex);
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${reference}"><v>${value}</v></c>`;
  }
  if (typeof value === 'boolean') {
    return `<c r="${reference}" t="b"><v>${value ? 1 : 0}</v></c>`;
  }
  return `<c r="${reference}" t="inlineStr"><is><t>${xml(value)}</t></is></c>`;
}

function sheetName(value: string) {
  const cleaned = value.replace(/[\[\]:*?/\\]/g, ' ').trim();
  return xml((cleaned || 'Sheet').slice(0, 31));
}

function worksheetXml(
  rows: Record<string, WorkbookCell>[],
  keys: string[],
  headers: string[],
) {
  const values = [headers, ...rows.map((row) => keys.map((key) => row[key]))];
  const lastColumn = columnName(Math.max(keys.length - 1, 0));
  const range = keys.length > 0 ? `A1:${lastColumn}${values.length}` : 'A1';
  const rowXml = values
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => cell(value, columnIndex, rowIndex))
        .join('');
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="${range}"/>
  <sheetViews>
    <sheetView workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>${rowXml}</sheetData>
  <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>`;
}

function zip(files: { name: string; content: string }[]) {
  const entries = files.map((file) => ({
    name: encoder.encode(file.name),
    content: encoder.encode(file.content),
    crc: 0,
    offset: 0,
  }));

  let localSize = 0;
  for (const entry of entries) {
    entry.crc = crc32(entry.content);
    entry.offset = localSize;
    localSize += 30 + entry.name.length + entry.content.length;
  }

  const centralSize = entries.reduce(
    (size, entry) => size + 46 + entry.name.length,
    0,
  );
  const output = new Uint8Array(localSize + centralSize + 22);
  let offset = 0;

  for (const entry of entries) {
    writeUint32(output, offset, 0x04034b50);
    writeUint16(output, offset + 4, 20);
    writeUint16(output, offset + 6, 0);
    writeUint16(output, offset + 8, 0);
    writeUint16(output, offset + 10, 0);
    writeUint16(output, offset + 12, 0);
    writeUint32(output, offset + 14, entry.crc);
    writeUint32(output, offset + 18, entry.content.length);
    writeUint32(output, offset + 22, entry.content.length);
    writeUint16(output, offset + 26, entry.name.length);
    writeUint16(output, offset + 28, 0);
    offset += 30;
    output.set(entry.name, offset);
    offset += entry.name.length;
    output.set(entry.content, offset);
    offset += entry.content.length;
  }

  const centralOffset = offset;
  for (const entry of entries) {
    writeUint32(output, offset, 0x02014b50);
    writeUint16(output, offset + 4, 20);
    writeUint16(output, offset + 6, 20);
    writeUint16(output, offset + 8, 0);
    writeUint16(output, offset + 10, 0);
    writeUint16(output, offset + 12, 0);
    writeUint16(output, offset + 14, 0);
    writeUint32(output, offset + 16, entry.crc);
    writeUint32(output, offset + 20, entry.content.length);
    writeUint32(output, offset + 24, entry.content.length);
    writeUint16(output, offset + 28, entry.name.length);
    writeUint16(output, offset + 30, 0);
    writeUint16(output, offset + 32, 0);
    writeUint16(output, offset + 34, 0);
    writeUint16(output, offset + 36, 0);
    writeUint32(output, offset + 38, 0);
    writeUint32(output, offset + 42, entry.offset);
    offset += 46;
    output.set(entry.name, offset);
    offset += entry.name.length;
  }

  writeUint32(output, offset, 0x06054b50);
  writeUint16(output, offset + 4, 0);
  writeUint16(output, offset + 6, 0);
  writeUint16(output, offset + 8, entries.length);
  writeUint16(output, offset + 10, entries.length);
  writeUint32(output, offset + 12, centralSize);
  writeUint32(output, offset + 16, centralOffset);
  writeUint16(output, offset + 20, 0);

  return output;
}

export function createWorkbook(
  rowsOrSheets: Record<string, unknown>[] | WorkbookSheet[],
  keys?: string[],
  headers = keys,
) {
  const sheets: WorkbookSheet[] = keys
    ? [
        {
          name: 'Data Penelitian',
          rows: rowsOrSheets as Record<string, unknown>[],
          keys,
          headers,
        },
      ]
    : (rowsOrSheets as WorkbookSheet[]);
  const workbookSheets = sheets.length
    ? sheets
    : [{ name: 'Data Penelitian', rows: [], keys: [], headers: [] }];
  const contentTypes = workbookSheets
    .map(
      (_sheet, index) =>
        `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
    )
    .join('\n  ');
  const sheetList = workbookSheets
    .map(
      (sheet, index) =>
        `<sheet name="${sheetName(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`,
    )
    .join('\n    ');
  const workbookRelationships = [
    ...workbookSheets.map(
      (_sheet, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
    ),
    `<Relationship Id="rId${workbookSheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`,
  ].join('\n  ');
  const worksheetFiles = workbookSheets.map((sheet, index) => ({
    name: `xl/worksheets/sheet${index + 1}.xml`,
    content: worksheetXml(sheet.rows, sheet.keys, sheet.headers ?? sheet.keys),
  }));

  return zip([
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${contentTypes}
</Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`,
    },
    {
      name: 'docProps/app.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>SiAGA Bunda</Application>
</Properties>`,
    },
    {
      name: 'docProps/core.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>SiAGA Bunda</dc:creator>
  <cp:lastModifiedBy>SiAGA Bunda</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`,
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <workbookViews>
    <workbookView activeTab="0"/>
  </workbookViews>
  <sheets>
    ${sheetList}
  </sheets>
</workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${workbookRelationships}
</Relationships>`,
    },
    {
      name: 'xl/styles.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1">
    <font>
      <sz val="11"/>
      <color theme="1"/>
      <name val="Calibri"/>
      <family val="2"/>
    </font>
  </fonts>
  <fills count="2">
    <fill>
      <patternFill patternType="none"/>
    </fill>
    <fill>
      <patternFill patternType="gray125"/>
    </fill>
  </fills>
  <borders count="1">
    <border>
      <left/>
      <right/>
      <top/>
      <bottom/>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`,
    },
    ...worksheetFiles,
  ]);
}
