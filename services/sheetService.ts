import { CertificateData } from '../types';
import { CSV_URL, SAMPLE_DATA_FALLBACK } from '../constants';

// Helper to parse CSV line correctly handling quotes
const parseCSVLine = (text: string) => {
  const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  
  const a: string[] = [];
  text.replace(re_value, (m0, m1, m2, m3) => {
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return '';
  });
  if (/,\s*$/.test(text)) a.push('');
  return a;
};

export const fetchCertificateData = async (): Promise<CertificateData[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text();
    
    // Split by new line
    const rows = text.split('\n');
    
    // Remove header row (assuming row 1 is header)
    const dataRows = rows.slice(1);

    const certificates: CertificateData[] = dataRows.map((row, index): CertificateData | null => {
      // Use simple split if complex regex fails or for speed, but regex is safer for commas in fields
      // Fallback to simple split for this specific dataset structure if regex is overkill
      // const columns = row.split(','); 
      
      // Let's use a slightly more robust splitter that respects quotes if present, 
      // but standard google sheet export usually just commas.
      const columns = parseCSVLine(row);

      // Mapping based on User Request:
      // Col B (Index 1): Competition
      // Col C (Index 2): Cert ID
      // Col D (Index 3): Name
      // Col E (Index 4): School
      // Col F (Index 5): Award
      
      // Safety check for empty rows
      if (columns.length < 6) return null;

      return {
        rowNumber: index + 2,
        competition: columns[1] || '',
        id: columns[2] || '',
        name: columns[3] || '',
        school: columns[4] || '',
        award: columns[5] || ''
      };
    }).filter((item): item is CertificateData => item !== null && item.name.trim() !== '');

    return certificates;

  } catch (error) {
    console.error("Failed to fetch Google Sheet data, using fallback/demo data.", error);
    // Return mock data so the app is usable even if the sheet isn't public
    return SAMPLE_DATA_FALLBACK.map((item, idx) => ({ ...item, rowNumber: idx + 1 }));
  }
};