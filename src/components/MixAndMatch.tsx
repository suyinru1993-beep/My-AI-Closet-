import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Wand2, X, ArrowRight } from 'lucide-react';
import { ITEMS } from '../constants';

interface Props {
  gender: 'male' | 'female';
  onOpenSavedLooks?: () => void;
}

export default function MixAndMatch({ gender, onOpenSavedLooks }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const [filterColor, setFilterColor] = useState('All');
  const [filterSeason, setFilterSeason] = useState('All');
  const [filterStyle, setFilterStyle] = useState('All');

  const itemCategories = [
    { key: 'outer', label: '아우터 (Outer)', icon: '🧥' },
    { key: 'tops', label: '상의 (Tops)', icon: '👕' },
    { key: 'bottoms', label: '하의 (Bottoms)', icon: '👖' },
    { key: 'shoes', label: '신발 (Shoes)', icon: '👟' },
    { key: 'accessories', label: '액세서리 (Acc)', icon: '👜' }
  ];

  const filteredByGender = ITEMS.filter(i =>
    (i.gender === gender || i.gender === 'both' || !i.gender) &&
    (filterColor === 'All' || i.color === filterColor) &&
    (filterSeason === 'All' || i.season === filterSeason) &&
    (filterStyle === 'All' || i.semantics.includes(filterStyle as any))
  );

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setAnalysisDone(false); // Reset analysis if new items selected
  };

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisDone(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
    }, 2000);
  };

  const closeAnalysis = () => {
    setAnalysisDone(false);
    setSelectedItems([]);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto pt-20 pb-40 bg-surface min-h-screen relative">
      <section className="px-6 mb-4 flex justify-between items-center pt-6">
        <div>
          <h2 className="text-2xl font-serif">나의 옷장</h2>
          <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] opacity-60">전체 아이템 현황</p>
        </div>
        <div className="hidden">
          {/* Removed unused Sparkles button */}
        </div>
      </section>

      {/* Wardrobe Filters */}
      <section className="px-6 mb-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 relative">
          <div className="flex items-center gap-1.5 shrink-0 bg-surface border border-outline-variant/20 rounded-full px-4 py-2 hover:bg-surface-container transition-colors focus-within:border-primary/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">색상</span>
            <select
              value={filterColor}
              onChange={e => setFilterColor(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-on-surface outline-none cursor-pointer border-none p-0 pr-4 appearance-none relative z-10"
            >
              <option value="All">All / 전체</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Navy">Navy</option>
              <option value="Beige">Beige</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-surface border border-outline-variant/20 rounded-full px-4 py-2 hover:bg-surface-container transition-colors focus-within:border-primary/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">계절</span>
            <select
              value={filterSeason}
              onChange={e => setFilterSeason(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-on-surface outline-none cursor-pointer border-none p-0 appearance-none pr-4 relative z-10"
            >
              <option value="All">All / 전체</option>
              <option value="Spring/Summer">SS (봄/여름)</option>
              <option value="Autumn/Winter">AW (가을/겨울)</option>
              <option value="All Year">All Year / 4계절</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-surface border border-outline-variant/20 rounded-full px-4 py-2 hover:bg-surface-container transition-colors focus-within:border-primary/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">스타일</span>
            <select
              value={filterStyle}
              onChange={e => setFilterStyle(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-on-surface outline-none cursor-pointer border-none p-0 appearance-none pr-4 relative z-10"
            >
              <option value="All">All / 전체</option>
              <option value="Clean">Clean</option>
              <option value="Urban">Urban</option>
              <option value="Active">Active</option>
              <option value="Relaxed">Relaxed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Entry to Saved Looks */}
      <section className="px-6 mb-8 mt-2">
        <motion.div
          onClick={onOpenSavedLooks}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="bg-surface-container-lowest p-6 rounded-[1.5rem] border border-outline-variant/10 shadow-sm cursor-pointer flex justify-between items-center group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em] mb-1">Style Archive</p>
            <h3 className="font-serif italic text-2xl group-hover:text-primary transition-colors">Saved Looks</h3>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-2 font-medium">
              <Sparkles size={12} className="text-primary/70" /> 12개의 조합 저장됨
            </p>
          </div>
          <div className="text-right relative z-10">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold hidden md:block">최근 저장: 3시간 전</p>
            <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-primary ml-auto group-hover:translate-x-1 transition-transform border border-primary/10 shadow-sm">
              <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>
      </section>

      <div className="px-2 space-y-2">
        {itemCategories.map((cat) => {
          const filteredItems = filteredByGender.filter(i => i.category === cat.key);
          return (
            <div key={cat.key} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
              <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                  <span className="text-[9px] font-medium text-on-surface-variant/40">• {filteredItems.length}</span>
                </div>
                <button className="text-[9px] font-bold text-primary/40 uppercase tracking-widest hover:underline">
                  전체보기
                </button>
              </div>

              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                {filteredItems.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSelection(item.id)}
                      className={`shrink-0 w-20 group cursor-pointer relative rounded-xl border-2 transition-all ${isSelected ? 'border-primary' : 'border-transparent'}`}
                    >
                      <div className="aspect-square bg-surface-container/30 rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`object-contain h-[90%] w-[90%] transition-transform duration-500 ${isSelected ? 'scale-90' : 'group-hover:scale-110'}`}
                        />
                      </div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg"
                          >
                            <Check size={12} strokeWidth={4} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Add Item Placeholder */}
                <div className="shrink-0 w-20 aspect-square bg-surface-container rounded-xl border border-dashed border-outline-variant/30 flex items-center justify-center group cursor-pointer hover:bg-surface-container-high transition-all">
                  <span className="text-lg text-primary/20">+</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar for Selected Items */}
      <AnimatePresence>
        {selectedItems.length > 0 && !analysisDone && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm"
          >
            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-primary text-white py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 font-bold text-sm tracking-widest hover:bg-primary/95 transition-colors disabled:opacity-80"
            >
              {isAnalyzing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Sparkles size={18} />
                  </motion.div>
                  <span>AI 매칭 분석 중...</span>
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  <span>{selectedItems.length}개 아이템 매치 분석하기</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Result Modal */}
      <AnimatePresence>
        {analysisDone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAnalysis}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-surface rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
            >
              <button onClick={closeAnalysis} className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary transition-colors">
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center text-primary mb-6 shadow-inner">
                <Sparkles size={28} />
              </div>

              <h3 className="font-serif italic text-3xl mb-1">Style Match: 92%</h3>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary/60 mb-6 flex items-center gap-1">
                Excellent Combination
              </p>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 w-full mb-6">
                <p className="text-sm font-medium leading-relaxed text-on-surface mb-4">
                  "선택하신 {selectedItems.length}개의 아이템은 상호 완벽한 시너지를 냅니다. 형태와 색상의 조합이 전체적인 룩에 안정감을 더해주며 당신의 고유한 DNA를 가장 잘 표현합니다."
                </p>

                <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-outline-variant/10">
                  {selectedItems.map(id => {
                    const matchedItem = ITEMS.find(i => i.id === id);
                    if (!matchedItem) return null;
                    return (
                      <div key={id} className="w-12 h-12 bg-surface-container/50 rounded-lg overflow-hidden border border-outline-variant/20" title={matchedItem.name}>
                        <img src={matchedItem.image} alt={matchedItem.name} className="w-full h-full object-contain p-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex w-full gap-3 mt-2">
                <button onClick={closeAnalysis} className="flex-1 bg-surface border-2 border-outline-variant/30 text-on-surface py-4 rounded-full font-bold text-xs uppercase tracking-[0.1em] hover:bg-surface-container-low transition-all">
                  다시 선택
                </button>
                <button onClick={closeAnalysis} className="flex-1 bg-primary text-white py-4 rounded-full font-bold text-xs uppercase tracking-[0.1em] shadow-lg hover:bg-primary/90 transition-all">
                  조합 저장
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
