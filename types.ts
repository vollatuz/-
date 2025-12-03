export interface CertificateData {
  id: string; // Column C
  name: string; // Column D
  school: string; // Column E
  award: string; // Column F
  competition: string; // Column B
  rowNumber?: number;
}

export enum AppState {
  SEARCH = 'SEARCH',
  PREVIEW = 'PREVIEW'
}