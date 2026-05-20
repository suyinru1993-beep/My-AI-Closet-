import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Zap, CheckCircle2, ChevronRight, Sparkles, Database, ArrowRight, Loader2 } from 'lucide-react';
import { ITEMS } from '../constants';

type AnalysisStep = 'IDLE' | 'ANALYZING' | 'RESULT';

export default function WardrobeAnalysis() {
  const [step, setStep] = useState<AnalysisStep>('IDLE');
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const analysisMessages = [
    "Analyzing silhouette...",
    "Matching semantic style...",
    "Comparing wardrobe tone...",
    "Generating compatibility score...",
    "Finalizing style evolution path..."
  ];

  const compatibilityItems = ITEMS.slice(0, 4);

  // Handle analysis simulation
  useEffect(() => {
    if (step === 'ANALYZING') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('RESULT'), 500);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      const messageInterval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % analysisMessages.length);
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(messageInterval);
      };
    }
  }, [step]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setStep('ANALYZING');
      setProgress(0);
      setMessageIndex(0);
    }
  };

  return (
    <div className="pt-16 pb-32 px-6 max-w-[1440px] mx-auto w-full min-h-screen bg-surface">
      <AnimatePresence mode="wait">
        {step === 'IDLE' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-serif mb-3 leading-tight">
                새로운 아이템이 당신의 스타일 DNA와<br />
                얼마나 어울리는지 분석해보세요
              </h2>
              <p className="text-[10px] text-on-surface-variant/50 tracking-[0.2em] uppercase font-bold">Style Compatibility Engine v2.0</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <label htmlFor="photo-upload" className="block cursor-pointer">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <motion.div
                  whileHover={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-[1.2/1] bg-surface-container-low rounded-[3rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-8 text-center group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                    <Camera size={32} className="text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-serif mb-3 italic">이미지 촬영 / 업로드</h3>
                  <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                    분석하고 싶은 상품 사진을<br />직접 촬영하거나 파일로 선택하세요.
                  </p>
                </motion.div>
              </label>

              <div className="space-y-8">
                <div className="space-y-6">
                  {[
                    { title: '현재 옷장과의 조화', desc: '기존에 보유한 아이템들과의 매칭 가능성을 시맨틱하게 분석합니다.' },
                    { title: '스타일 방향성 유지 여부', desc: '현재 설정된 스타일 DNA 경로 상에서 아이템의 위치를 확인합니다.' },
                    { title: '컬러 / 실루엣 적합도', desc: '퍼스널 톤과 선호하는 실루엣 지표를 기반으로 적합도를 측정합니다.' },
                    { title: '활용 가능한 추천 코디', desc: '옷장의 아이템을 활용한 최적의 레이어링 조합을 제안합니다.' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="mt-1"><CheckCircle2 size={16} className="text-primary/40" /></div>
                      <div>
                        <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                        <p className="text-xs text-on-surface-variant font-light">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 bg-surface-container-high rounded-2xl border border-outline-variant/10">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                    <Database size={12} /> System Status
                  </p>
                  <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                    AI가 당신의 124개 보유 아이템과 시맨틱 인덱싱을 마쳤습니다. 즉시 분석이 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'ANALYZING' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 min-h-[60vh]"
          >
            <div className="relative w-64 h-64 mb-12">
              {/* Scanning visual effect */}
              <motion.div
                className="absolute inset-x-0 h-1 bg-primary/40 z-10 blur-sm"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl overflow-hidden bg-surface-container-highest/30">
                {uploadedImage ? (
                  <img src={uploadedImage} className="w-full h-full object-cover opacity-40 grayscale blur-[2px]" alt="scanning" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-30">
                    <Sparkles size={48} className="text-primary animate-pulse" />
                  </div>
                )}
              </div>

              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
            </div>

            <div className="text-center space-y-6 max-w-sm">
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={16} className="text-primary animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                  {analysisMessages[messageIndex]}
                </span>
              </div>

              <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm font-light text-on-surface-variant leading-relaxed opacity-60">
                아이템의 실루엣과 소재의 질감을 추출하여<br />당신의 스타일 데이터베이스와 대조 중입니다.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'RESULT' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-20"
          >
            {/* Analysis Header */}
            <header className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-1/3 aspect-[3/4] bg-surface-container-low rounded-[3rem] overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={uploadedImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGxIL_3sez4z_oPnLkQpNz6Dn8nSviwl1D-Ef6_hYKCVIscMRWxBBFaKIaxwXdLCF37UV939Ke4_myTjDkzBw2aw-h0cE30KZ_rKM4PDOh3ue4DRCf3mKlgP1T4l3XIsVaAkHv9OIqLN4wnRoMds1FsNDdLxOb1W_U2NUAFc2aj8plNhxqPWyIcHyNlEKlDUNIVENbpPBUJFww5QsCGAsP82iJFrDSh3V-xZsXutYe84Cxm5Wz2R8r3E8NS84DJKIHhummX11CxYY"}
                  alt="Analyzed item"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">Semantic ID</p>
                    <p className="text-white text-xs font-serif italic">#Urban_Minimal #Structure_Fit</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-10 py-4">
                {/* Layer 1: AI Conclusion */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                      <Zap size={12} className="fill-primary text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Conclusion</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif italic leading-tight mb-4">
                    “이 아이템은 당신의 Urban Clean 스타일과<br />높은 일관성을 유지합니다.”
                  </h3>
                  <p className="text-on-surface-variant font-light leading-relaxed max-w-xl">
                    현재 옷장의 미니멀한 무드와 완벽하게 연결됩니다. 특히 무채색 중심의 기존 하의 제품들과 톤온톤 매치가 매우 용이한 구성입니다.
                  </p>
                </section>

                {/* Layer 2: Reasons */}
                <section className="grid grid-cols-2 gap-4">
                  {[
                    { label: '미니멀 실루엣 유지', value: true },
                    { label: '기존 컬러 톤과 조화', value: true },
                    { label: '높은 활용 가능성', value: true },
                    { label: '레이어드 확장 가능', value: true }
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-surface-container-high/50 rounded-2xl border border-outline-variant/10">
                      <CheckCircle2 size={16} className="text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant">{r.label}</span>
                    </div>
                  ))}
                </section>

                {/* Layer 3: Data & Style Evolution */}
                <section className="pt-6 border-t border-outline-variant/30 grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mb-2">Semantic Match</p>
                    <p className="text-2xl font-serif italic tracking-tighter">84%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mb-2">Color Harmony</p>
                    <p className="text-2xl font-serif italic tracking-tighter">78%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mb-2">Silhouette Fit</p>
                    <p className="text-2xl font-serif italic tracking-tighter">91%</p>
                  </div>
                </section>

                {/* Style Evolution Concept */}
                <div className="p-6 bg-secondary-container/30 rounded-3xl border border-secondary/10 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={120} className="text-secondary" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="fill-secondary" /> Style Evolution Path
                  </h4>
                  <p className="text-sm text-on-secondary-container leading-relaxed font-light">
                    “이 아이템은 현재 당신의 <span className="font-bold underline decoration-secondary/30">Urban Minimal</span> 스타일을 유지하면서<br />
                    조금 더 <span className="font-serif italic font-medium">Classic</span> 방향으로 확장시켜줍니다.”
                  </p>
                </div>
              </div>
            </header>

            {/* Recommendations Section */}
            <section className="space-y-12">
              <div className="flex items-end justify-between border-b border-outline-variant pb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Database size={16} className="text-primary/40" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Personal Wardrobe System</span>
                  </div>
                  <h2 className="text-3xl font-serif italic">기존 보유 상품과의 최적 조합</h2>
                  <p className="text-xs text-on-surface-variant/60 mt-3 font-light leading-relaxed">
                    당신의 기존 옷장 데이터를 기반으로 AI가 선별한 가장 조화로운 매칭 아이템입니다.
                  </p>
                </div>
                <button className="flex items-center gap-2 group text-[10px] font-bold uppercase tracking-widest text-primary">
                  <span>Explore All Synergies</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {compatibilityItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-surface-container-low rounded-[2rem] overflow-hidden mb-5 relative shadow-sm border border-outline-variant/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-bold tracking-[0.2em] shadow-sm uppercase text-primary">
                        보유 중
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Similarity 92%</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{item.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-light">{item.semantics.join(' / ')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="bg-surface-container-low p-12 rounded-[4rem] flex flex-col items-center text-center gap-8 border border-outline-variant/10 shadow-sm">
              <div className="max-w-md space-y-4">
                <h3 className="text-2xl font-serif italic">분석 결과가 마음에 드시나요?</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                  이 아이템을 내 스타일 DNA에 반영하면 AI가 향후 당신의 옷장 코디 제안에 이 실루엣과 컬러감을 우선적으로 고려하게 됩니다.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-[2] py-6 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  <Sparkles size={16} className="fill-white group-hover:rotate-12 transition-transform" />
                  내 스타일 DNA에 반영하기
                </button>
                <button
                  onClick={() => { setStep('IDLE'); setUploadedImage(null); }}
                  className="flex-1 py-6 bg-surface-container-highest text-primary rounded-full text-xs font-bold uppercase tracking-[0.3em] border border-outline-variant/20 hover:bg-surface-dim active:scale-[0.98] transition-all"
                >
                  분석 결과 제외
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

