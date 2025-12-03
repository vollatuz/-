import React, { useState, useMemo, useEffect } from 'react';
import { CertificateData } from '../types';
import { Search, Loader2, ExternalLink, Award, Trophy, Medal, BarChart3, Target, FileText, Sparkles } from 'lucide-react';

interface Props {
  data: CertificateData[];
  onSelect: (cert: CertificateData) => void;
  isLoading: boolean;
}

export const SearchPage: React.FC<Props> = ({ data, onSelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [animateChart, setAnimateChart] = useState(false);

  // Trigger animation when loading finishes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setAnimateChart(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const filteredData = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return data.filter(cert => 
      cert.name.toLowerCase().includes(lowerQuery) ||
      cert.id.toLowerCase().includes(lowerQuery) ||
      cert.school.toLowerCase().includes(lowerQuery)
    );
  }, [query, data]);

  // Calculate Medal Stats
  const stats = useMemo(() => {
    let gold = 0;
    let silver = 0;
    let bronze = 0;

    data.forEach(cert => {
        const award = cert.award || '';
        if (award.includes('เหรียญทองแดง')) {
            bronze++;
        } else if (award.includes('เหรียญเงิน')) {
            silver++;
        } else if (award.includes('เหรียญทอง')) {
            gold++;
        }
    });

    const max = Math.max(gold, silver, bronze, 1);
    return { gold, silver, bronze, max: max * 1.1 };
  }, [data]);

  // Calculate School Stats (Top 10)
  const schoolStats = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(cert => {
      const schoolName = cert.school.trim();
      if (schoolName) {
        counts[schoolName] = (counts[schoolName] || 0) + 1;
      }
    });

    // Sort by count desc and take top 10
    const sorted = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const maxCount = sorted.length > 0 ? sorted[0].count : 1;

    return { topSchools: sorted, maxCount };
  }, [data]);

  // Calculate Competition Stats
  const compStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalCerts = 0;
    
    data.forEach(cert => {
        totalCerts++;
        const comp = cert.competition.trim();
        if(comp) counts[comp] = (counts[comp] || 0) + 1;
    });

    const uniqueComps = Object.keys(counts).length;
    // Get Top 10 Competitions
    const sorted = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const maxCount = sorted.length > 0 ? sorted[0].count : 1;

    return { uniqueComps, totalCerts, topComps: sorted, maxCount };
  }, [data]);

  const hasSearched = query.length > 0;

  // Colors for the top 10 schools
  const barColors = [
    'from-rose-400 to-pink-600 shadow-rose-200',
    'from-violet-400 to-purple-600 shadow-violet-200',
    'from-cyan-400 to-blue-600 shadow-cyan-200',
    'from-emerald-400 to-teal-600 shadow-emerald-200',
    'from-amber-400 to-orange-600 shadow-amber-200',
    'from-blue-400 to-indigo-600 shadow-blue-200',
    'from-fuchsia-400 to-pink-600 shadow-fuchsia-200',
    'from-lime-400 to-green-600 shadow-lime-200',
    'from-orange-400 to-red-600 shadow-orange-200',
    'from-teal-400 to-cyan-600 shadow-teal-200',
  ];

  // Colors for top competitions (Spectrum)
  const compColors = [
    'from-blue-500 to-indigo-600',
    'from-indigo-500 to-purple-600',
    'from-purple-500 to-fuchsia-600',
    'from-fuchsia-500 to-pink-600',
    'from-pink-500 to-rose-600',
    'from-rose-500 to-orange-600',
    'from-orange-500 to-amber-600',
    'from-amber-500 to-yellow-600',
    'from-lime-500 to-green-600',
    'from-emerald-500 to-teal-600',
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-24 relative min-h-screen flex flex-col">
      <div className="text-center space-y-2">
        <img 
          src="https://lh3.googleusercontent.com/d/1pZ1D_WhKJIew_x6PHI-Y-XGM-wQIMZpY" 
          alt="Logo" 
          className="mx-auto w-[300px] h-[300px] object-contain mb-6"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-relaxed">
          การแข่งขันทักษะภาษาไทย โครงการรักษ์ภาษาไทย
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 leading-relaxed">
           เนื่องในสัปดาห์วันภาษาไทยแห่งชาติ ปี ๒๕๖๘
        </h2>
        <h3 className="text-xl md:text-2xl font-bold text-blue-800">
          สำนักงานเขตพื้นที่การศึกษาประถมศึกษากรุงเทพมหานคร
        </h3>
        <h4 className="text-lg md:text-xl font-bold text-gray-400 pt-10">
          ระบบดาวน์โหลดเกียรติบัตร
        </h4>
        <p className="text-gray-400 pt-2">กรอกชื่อ-นามสกุล, โรงเรียน หรือเลขที่เกียรติบัตรเพื่อค้นหา</p>
      </div>

      <div className="relative max-w-xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-blue-200 bg-blue-50 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all text-lg shadow-sm font-medium"
            placeholder="ค้นหาข้อมูล..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        {hasSearched && filteredData.length === 0 && !isLoading && (
           <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
             <p>ไม่พบข้อมูลที่ค้นหา</p>
           </div>
        )}

        {hasSearched && filteredData.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredData.map((cert) => (
              <button
                key={`${cert.id}-${cert.rowNumber}`}
                onClick={() => onSelect(cert)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 text-left transition-all hover:border-blue-300 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium">
                    {cert.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 mb-1">
                  {cert.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{cert.school}</p>
                <div className="text-sm text-gray-600 border-t pt-2 mt-2">
                  <p className="line-clamp-1"><span className="font-medium">รางวัล:</span> {cert.award}</p>
                  <p className="line-clamp-1"><span className="font-medium">รายการ:</span> {cert.competition}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="space-y-10 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* View All Button */}
            <div className="flex justify-center">
              <a 
                href="https://drive.google.com/file/d/1IBXLorUooRDnaQA61RDKPofFLra91Qhf/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                ดูข้อมูลรายชื่อทั้งหมด
              </a>
            </div>

            {/* 1. Competition Stats Dashboard */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-purple-500" />
                ข้อมูลรายการแข่งขัน
              </h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-2 text-blue-100">
                       <Sparkles className="w-4 h-4" />
                       <span className="text-sm font-medium">รายการแข่งขันทั้งหมด</span>
                     </div>
                     <div className="text-4xl font-bold tracking-tight">{compStats.uniqueComps} <span className="text-lg font-normal opacity-80">รายการ</span></div>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-2 text-pink-100">
                       <FileText className="w-4 h-4" />
                       <span className="text-sm font-medium">เกียรติบัตรทั้งหมด</span>
                     </div>
                     <div className="text-4xl font-bold tracking-tight">{compStats.totalCerts} <span className="text-lg font-normal opacity-80">ใบ</span></div>
                   </div>
                </div>
              </div>

              {/* Top Competitions Chart */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                   <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                   10 อันดับรายการที่มีผู้เข้าร่วมมากที่สุด
                </h4>
                <div className="space-y-3">
                  {compStats.topComps.map((item, index) => (
                    <div key={item.name} className="group">
                      <div className="flex justify-between items-end mb-1 px-1">
                         <span className="text-sm font-medium text-gray-700 line-clamp-1 w-2/3" title={item.name}>
                           {index + 1}. {item.name}
                         </span>
                         <span className="text-xs font-bold text-gray-500">{item.count} คน</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${compColors[index % compColors.length]} opacity-90 group-hover:opacity-100 transition-all duration-1000 ease-out`}
                          style={{ width: animateChart ? `${(item.count / compStats.maxCount) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Medal Stats Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                สรุปจำนวนเหรียญรางวัล
              </h3>
              <div className="flex justify-center items-end h-64 gap-4 md:gap-12 px-4">
                {/* Gold */}
                <div className="flex flex-col items-center gap-3 w-24 group">
                  <div className="text-yellow-600 font-bold text-2xl drop-shadow-sm">{stats.gold}</div>
                  <div className="w-full relative flex items-end justify-center rounded-t-2xl overflow-hidden shadow-lg shadow-yellow-200/50 transition-all duration-1000 ease-out bg-gray-100 h-full">
                     <div 
                       className={`w-full bg-gradient-to-t from-yellow-300 via-yellow-400 to-yellow-200 transition-all duration-1000 ease-out rounded-t-xl relative overflow-hidden`}
                       style={{ height: animateChart ? `${(stats.gold / stats.max) * 100}%` : '0%' }}
                     >
                        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                     </div>
                  </div>
                  <div className="text-gray-600 font-semibold flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">ทอง</span>
                  </div>
                </div>

                {/* Silver */}
                <div className="flex flex-col items-center gap-3 w-24 group">
                  <div className="text-gray-600 font-bold text-2xl drop-shadow-sm">{stats.silver}</div>
                   <div className="w-full relative flex items-end justify-center rounded-t-2xl overflow-hidden shadow-lg shadow-gray-300/50 transition-all duration-1000 ease-out bg-gray-100 h-full">
                     <div 
                       className={`w-full bg-gradient-to-t from-gray-300 via-gray-400 to-gray-200 transition-all duration-1000 ease-out rounded-t-xl relative overflow-hidden`}
                       style={{ height: animateChart ? `${(stats.silver / stats.max) * 100}%` : '0%' }}
                     >
                        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                     </div>
                  </div>
                  <div className="text-gray-600 font-semibold flex items-center gap-1">
                    <Medal className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">เงิน</span>
                  </div>
                </div>

                {/* Bronze */}
                <div className="flex flex-col items-center gap-3 w-24 group">
                  <div className="text-orange-700 font-bold text-2xl drop-shadow-sm">{stats.bronze}</div>
                   <div className="w-full relative flex items-end justify-center rounded-t-2xl overflow-hidden shadow-lg shadow-orange-200/50 transition-all duration-1000 ease-out bg-gray-100 h-full">
                     <div 
                       className={`w-full bg-gradient-to-t from-orange-300 via-orange-400 to-orange-200 transition-all duration-1000 ease-out rounded-t-xl relative overflow-hidden`}
                       style={{ height: animateChart ? `${(stats.bronze / stats.max) * 100}%` : '0%' }}
                     >
                        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                     </div>
                  </div>
                  <div className="text-gray-600 font-semibold flex items-center gap-1">
                    <Medal className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">ทองแดง</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. School Stats Chart (Horizontal) */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                10 อันดับโรงเรียนที่ได้รับรางวัลสูงสุด
              </h3>
              
              <div className="space-y-4">
                {schoolStats.topSchools.map((item, index) => (
                  <div key={item.name} className="relative">
                    <div className="flex justify-between text-sm mb-1 px-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-gray-400`}>
                          {index + 1}
                        </span>
                        {item.name}
                      </span>
                      <span className="font-bold text-blue-600">{item.count} รางวัล</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${barColors[index % barColors.length]} shadow-lg transition-all duration-1000 ease-out relative`}
                        style={{ width: animateChart ? `${(item.count / schoolStats.maxCount) * 100}%` : '0%' }}
                      >
                         <div className="absolute inset-0 bg-white/20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Footer Marquee */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 border-t border-gray-100 py-2 overflow-hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-[10pt] text-gray-400/40 font-medium mx-4">
            นายวรทัศน์ หวังวรวุฒิสกุล รองผู้อำนวยการโรงเรียนสายน้ำทิพย์ ผู้ดูแลระบบ
          </span>
          <span className="text-[10pt] text-gray-400/40 font-medium mx-4">
            นายวรทัศน์ หวังวรวุฒิสกุล รองผู้อำนวยการโรงเรียนสายน้ำทิพย์ ผู้ดูแลระบบ
          </span>
          <span className="text-[10pt] text-gray-400/40 font-medium mx-4">
            นายวรทัศน์ หวังวรวุฒิสกุล รองผู้อำนวยการโรงเรียนสายน้ำทิพย์ ผู้ดูแลระบบ
          </span>
          <span className="text-[10pt] text-gray-400/40 font-medium mx-4">
            นายวรทัศน์ หวังวรวุฒิสกุล รองผู้อำนวยการโรงเรียนสายน้ำทิพย์ ผู้ดูแลระบบ
          </span>
          <span className="text-[10pt] text-gray-400/40 font-medium mx-4">
            นายวรทัศน์ หวังวรวุฒิสกุล รองผู้อำนวยการโรงเรียนสายน้ำทิพย์ ผู้ดูแลระบบ
          </span>
        </div>
      </div>
    </div>
  );
};