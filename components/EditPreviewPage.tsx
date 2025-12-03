import React, { useState, useRef } from 'react';
import { CertificateData } from '../types';
import { CertificatePreview } from './CertificatePreview';
import { ArrowLeft, Download, RefreshCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  initialData: CertificateData;
  onBack: () => void;
}

export const EditPreviewPage: React.FC<Props> = ({ initialData, onBack }) => {
  const [data, setData] = useState<CertificateData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  // Ref for the hidden export element
  const exportRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof CertificateData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setIsGenerating(true);

    try {
      // 1. Capture the hidden export certificate div
      // Using scale: 3 gives approximately 300 DPI for A4 (1123px * 3 ≈ 3369px width)
      const canvas = await html2canvas(exportRef.current, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 1123,
        height: 794,
        windowWidth: 1123,
        windowHeight: 794,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0
      });

      // 2. Download as Image
      const link = document.createElement('a');
      link.download = `Certificate-${data.id}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Editors */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 p-6 shadow-xl z-20 overflow-y-auto h-screen sticky top-0">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <RefreshCcw className="w-6 h-6 text-blue-500" />
          แก้ไขข้อมูล
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ - สกุล</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-blue-50 text-blue-900 font-medium"
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500 space-y-2 mt-4">
             <p><span className="font-semibold">เลขที่:</span> {data.id}</p>
             <p><span className="font-semibold">โรงเรียน:</span> {data.school}</p>
             <p><span className="font-semibold">รางวัล:</span> {data.award}</p>
             <p><span className="font-semibold">รายการ:</span> {data.competition}</p>
             <p className="text-xs text-gray-400 mt-2">* ข้อมูลอื่นๆ ไม่สามารถแก้ไขได้</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
           <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isGenerating ? (
               <>กำลังบันทึก...</>
             ) : (
               <>
                 <Download className="w-5 h-5" />
                 ดาวน์โหลดเกียรติบัตร
               </>
             )}
           </button>
           <p className="text-xs text-gray-400 text-center mt-3">
             แนะนำให้ตรวจสอบข้อมูลให้ถูกต้องก่อนกดดาวน์โหลด
           </p>
        </div>
      </div>

      {/* Main Area - Preview */}
      <div className="w-full md:w-2/3 p-4 md:p-8 flex flex-col items-center justify-center bg-gray-100 overflow-hidden relative">
        <div className="mb-4 text-gray-500 font-medium">ตัวอย่างเกียรติบัตร</div>
        
        {/* Visible Preview Container */}
        <div className="relative shadow-2xl border-4 border-white rounded-sm overflow-hidden" style={{ maxWidth: '100%', maxHeight: '80vh' }}>
           {/* Desktop View */}
           <div className="hidden md:block">
              <CertificatePreview data={data} scale={0.75} />
           </div>
           {/* Mobile View */}
           <div className="block md:hidden">
              <CertificatePreview data={data} scale={0.3} />
           </div>
        </div>

        {/* Hidden Export Component (Off-screen) */}
        {/* We use scale=1 (1123px width) and rely on html2canvas scale option for resolution upgrade */}
        <div style={{ position: 'fixed', left: '-10000px', top: 0, width: '1123px', height: '794px', overflow: 'hidden' }}>
          <CertificatePreview ref={exportRef} data={data} scale={1} />
        </div>
      </div>
    </div>
  );
};