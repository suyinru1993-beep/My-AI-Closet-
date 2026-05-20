import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONA_DATA, Persona } from '../constants/personas';
import { Check, Sparkles, Loader2, BrainCircuit } from 'lucide-react';

interface Props {
    onSelect: (personas: Persona[]) => void;
    gender: 'male' | 'female';
}

export default function PersonaSelection({ onSelect, gender }: Props) {
    const filteredPersonas = PERSONA_DATA.filter(p => p.gender === gender);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);

    const analysisMessages = [
        "당신의 시맨틱 스타일 패턴 분석 중...",
        "선택한 페르소나의 미학적 유사도 계산...",
        "개인화된 스타일 DNA 구조 생성 중...",
        "최종 스타일 프로필 동기화 중..."
    ];

    useEffect(() => {
        if (isAnalyzing) {
            const interval = setInterval(() => {
                setAnalysisStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isAnalyzing]);

    const togglePersona = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : prev.length < 5 ? [...prev, id] : prev
        );
    };

    const handleConfirm = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const selected = PERSONA_DATA.filter(p => selectedIds.includes(p.id));
            onSelect(selected);
        }, 3500);
    };

    return (
        <div className="pt-24 pb-32 px-6 max-w-[1440px] mx-auto min-h-screen relative">
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-surface z-[100] flex flex-col items-center justify-center p-12 overflow-hidden"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 blur-[100px] bg-gradient-to-tr from-primary via-secondary to-primary/20 animate-pulse" />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative mb-12"
                        >
                            <div className="w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center">
                                <BrainCircuit size={48} className="text-primary animate-pulse" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-primary rounded-full"
                            />
                        </motion.div>

                        <div className="text-center max-w-sm">
                            <h3 className="text-2xl font-serif italic mb-4">DNA Analysis</h3>
                            <div className="flex flex-col gap-2">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={analysisStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-on-surface-variant font-medium tracking-tight text-sm h-6"
                                    >
                                        {analysisMessages[analysisStep]}
                                    </motion.p>
                                </AnimatePresence>
                                <div className="w-full bg-outline-variant/20 h-[1px] mt-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3.5, ease: "easeInOut" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-16">
                <div className="flex items-center gap-3 mb-4 opacity-40">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Step 02: Aesthetic Profiling</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl italic mb-6 tracking-tight">당신의 스타일 DNA를 선택하세요</h2>
                <p className="text-on-surface-variant/60 font-light text-lg max-w-2xl leading-relaxed">
                    자신의 스타일과 가장 가까운 페르소나를 3~5개 선택하세요. <br />
                    AI가 당신의 미학적 취향을 분석하여 최적의 스타일 솔루션을 설계합니다.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {filteredPersonas.map((persona) => {
                    const isSelected = selectedIds.includes(persona.id);
                    return (
                        <motion.div
                            key={persona.id}
                            whileHover={{ y: -8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => togglePersona(persona.id)}
                            className={`relative cursor-pointer rounded-[2rem] overflow-hidden group border transition-all duration-700
                ${isSelected ? 'border-primary shadow-2xl scale-105 z-10' : 'border-outline-variant/10 opacity-70 hover:opacity-100'}
              `}
                        >
                            <div className="aspect-[3/4] overflow-hidden grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    src={persona.image}
                                    alt={persona.mood}
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
                                <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] mb-1">{persona.category}</p>
                                <p className="text-white text-xs font-serif italic tracking-wide">{persona.mood}</p>
                            </div>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
                                    >
                                        <Check size={14} strokeWidth={4} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 w-full p-10 bg-gradient-to-t from-surface via-surface/90 to-transparent z-40">
                <div className="max-w-md mx-auto">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        disabled={selectedIds.length < 3}
                        className={`w-full py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] transition-all duration-700 shadow-2xl relative overflow-hidden group
              ${selectedIds.length >= 3
                                ? 'bg-primary text-white opacity-100'
                                : 'bg-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed'}
            `}
                    >
                        <span className="relative z-10">스타일 DNA 분석 시작 ({selectedIds.length}/5)</span>
                        {selectedIds.length >= 3 && (
                            <motion.div
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
