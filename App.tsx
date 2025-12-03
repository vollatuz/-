import React, { useEffect, useState } from 'react';
import { AppState, CertificateData } from './types';
import { fetchCertificateData } from './services/sheetService';
import { SearchPage } from './components/SearchPage';
import { EditPreviewPage } from './components/EditPreviewPage';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SEARCH);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchCertificateData();
      setCertificates(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSelectCertificate = (cert: CertificateData) => {
    setSelectedCertificate(cert);
    setAppState(AppState.PREVIEW);
  };

  const handleBackToSearch = () => {
    setSelectedCertificate(null);
    setAppState(AppState.SEARCH);
  };

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      {appState === AppState.SEARCH && (
        <SearchPage 
          data={certificates} 
          onSelect={handleSelectCertificate} 
          isLoading={isLoading}
        />
      )}

      {appState === AppState.PREVIEW && selectedCertificate && (
        <EditPreviewPage 
          initialData={selectedCertificate} 
          onBack={handleBackToSearch} 
        />
      )}
    </div>
  );
};

export default App;