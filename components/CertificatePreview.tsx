import React, { forwardRef } from 'react';
import { CertificateData } from '../types';
import { BACKGROUND_IMAGE_URL } from '../constants';

interface Props {
  data: CertificateData;
  scale?: number;
}

// A4 Ratio: 297mm x 210mm (Landscape) ~ 1.414 aspect ratio
// We'll use a fixed pixel width container for the rendering logic to ensure absolute positioning works consistently,
// then scale it down for the preview using CSS transform.
const BASE_WIDTH = 1123; // approx pixels for A4 at 96dpi (297mm)
const BASE_HEIGHT = 794; // approx pixels for A4 at 96dpi (210mm)

export const CertificatePreview = forwardRef<HTMLDivElement, Props>(({ data, scale = 1 }, ref) => {
  return (
    <div 
      ref={ref}
      className="relative bg-white shadow-lg overflow-hidden text-gray-800 mx-auto"
      style={{
        width: `${BASE_WIDTH}px`,
        height: `${BASE_HEIGHT}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        // Important for html2canvas to capture correctly without scaling issues
        minWidth: `${BASE_WIDTH}px`, 
        minHeight: `${BASE_HEIGHT}px` 
      }}
    >
      {/* Background Image */}
      <img 
        src={BACKGROUND_IMAGE_URL} 
        alt="Certificate Background" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        crossOrigin="anonymous"
      />

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col font-bold">
        
        {/* Line 1: Certificate ID - Top Right */}
        {/* Moved right by 1 tab (approx 4%) from right-28% to right-24% */}
        <div className="absolute top-[7%] right-[24%] text-right w-1/3">
          <p className="text-[24px] text-black leading-[0.2]">{data.id}</p>
        </div>

        {/* Line 2: Name - Center */}
        {/* Kept at 36% */}
        <div className="absolute top-[36%] left-0 w-full text-center px-10">
          <h1 className="text-[24px] text-black leading-[0.2]">{data.name}</h1>
        </div>

        {/* Line 3: School - Center */}
        {/* Kept at 40% */}
        <div className="absolute top-[40%] left-0 w-full text-center px-10">
          <h2 className="text-[24px] text-black leading-[0.2]">{data.school}</h2>
        </div>

        {/* Line 4: Award - Center */}
        {/* Kept at 44% */}
        <div className="absolute top-[44%] left-0 w-full text-center px-10">
           <h3 className="text-[24px] text-black leading-[0.2]">{data.award}</h3>
        </div>

        {/* Line 5: Competition - Center */}
        {/* Kept at 48% */}
        <div className="absolute top-[48%] left-0 w-full text-center px-10">
          <p className="text-[24px] text-black leading-[0.2]">{data.competition}</p>
        </div>

      </div>
    </div>
  );
});

CertificatePreview.displayName = 'CertificatePreview';