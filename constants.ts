// Google Sheet ID and GID provided by user
export const SHEET_ID = '18N48csAZlt2kXh85zDwbsi48k1T2BnsV2UZJVB1Zz0o';
export const SHEET_GID = '1108253420';

// Constructing the CSV export URL
// Note: The sheet must be "Published to the Web" or accessible via link sharing for this to work without an API key.
// If link sharing is restrictive, this might fail, so we will implement a fallback/demo mode.
export const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

// Background Image
// Using a proxy or direct download link hack for Google Drive images to avoid CORS in canvas if possible,
// but for simple img tags, the direct link works.
// We use a high-res placeholder if the drive link fails to load in canvas due to CORS.
export const BACKGROUND_IMAGE_URL = 'https://lh3.googleusercontent.com/d/1LtVQzOC4ME7DgVlm5c4K5n26kwFMks--'; 

export const SAMPLE_DATA_FALLBACK = [
  {
    id: "CERT-001",
    name: "เด็กชายตัวอย่าง มุ่งมั่น",
    school: "โรงเรียนบ้านหนองปลาดุก",
    award: "รางวัลชนะเลิศเหรียญทอง",
    competition: "การแข่งขันเขียนโปรแกรมคอมพิวเตอร์"
  },
  {
    id: "CERT-002",
    name: "เด็กหญิงสมศรี ดีใจ",
    school: "โรงเรียนอนุบาลหมีน้อย",
    award: "รางวัลรองชนะเลิศอันดับ 1",
    competition: "การแข่งขันวาดภาพระบายสี"
  }
];