import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Filter, Share2, Trash2, ArrowLeft, RotateCcw, Heart } from 'lucide-react';
import { OUTFITS, ITEMS } from '../constants'; // Reuse mock data

interface Props {
    onBack: () => void;
    gender: 'male' | 'female';
}

export default function SavedLooks({ onBack, gender }: Props) {
    const SAVED = [
        ...OUTFITS,
        ...OUTFITS.map(o => ({ ...o, id: o.id + '2', matchPercentage: o.matchPercentage - 2 }))
    ].filter(o => o.gender === gender || o.gender === 'both' || !o.gender);

    const [activeFilter, setActiveFilter] = useState('All');
    const [liked, setLiked] = useState<string[]>([]);

    const toggleLike = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert("공유 링크가 클립보드에 복사되었습니다.");
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-surface pb-32"
        >
            {/* Header */}
            <header className="px-6 py-8 pt-12 flex flex-col gap-6">
                <button onClick={onBack} className="self-start text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowLeft size={14} /> Back to Wardrobe
                </button>
                <div>
                    <h2 className="text-4xl font-serif italic mb-2 text-on-surface">Saved Looks</h2>
                    <p className="text-sm text-on-surface-variant font-light tracking-wide">나만의 스타일 아카이브 (개인 스타일 프로필)</p>
                </div>

                {/* Stats & AI Summary */}
                <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[1.5rem] border border-outline-variant/10 shadow-sm flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                    <div className="flex gap-8 border-b md:border-b-0 md:border-r border-outline-variant/10 pb-4 md:pb-0 md:pr-10 w-full md:w-auto">
                        <div>
                            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-1">Total Looks</p>
                            <p className="text-3xl font-serif italic">{SAVED.length}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-1">Top Style</p>
                            <p className="text-xl font-bold uppercase tracking-widest mt-1">MINIMAL</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Sparkles size={12} /> AI Style Insight</p>
                        <p className="text-sm text-on-surface italic font-light leading-relaxed">
                            "주로 '클린 미니멀'과 '어반' 룩을 선호하시며, 구조적이고 절제된 톤온톤 무드의 착장을 주기적으로 아카이빙하고 있습니다. 완성된 개인 패션 세계관입니다."
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-2">
                    <div className="flex items-center gap-2 shrink-0 bg-surface border border-outline-variant/20 rounded-full px-5 py-2.5 hover:bg-surface-container transition-colors focus-within:border-primary/50 cursor-pointer">
                        <select className="bg-transparent text-[11px] font-bold text-on-surface uppercase tracking-widest outline-none cursor-pointer border-none p-0 appearance-none relative z-10 w-full min-w[60px]">
                            <option>ALL ▾</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 bg-black rounded-full px-5 py-2.5 cursor-pointer shadow-md">
                        <select className="bg-transparent text-[11px] font-bold text-white uppercase tracking-widest outline-none cursor-pointer border-none p-0 appearance-none relative z-10 w-full min-w[80px]">
                            <option>SEASON ▾</option>
                            <option>SS (봄/여름)</option>
                            <option>AW (가을/겨울)</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 bg-surface border border-outline-variant/20 rounded-full px-5 py-2.5 hover:bg-surface-container transition-colors focus-within:border-primary/50 cursor-pointer">
                        <select className="bg-transparent text-[11px] font-bold text-on-surface uppercase tracking-widest outline-none cursor-pointer border-none p-0 appearance-none relative z-10 w-full min-w[90px]">
                            <option>OCCASION ▾</option>
                            <option>OFFICE</option>
                            <option>CAMPUS</option>
                            <option>STREET</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 bg-surface border border-outline-variant/20 rounded-full px-5 py-2.5 hover:bg-surface-container transition-colors focus-within:border-primary/50 cursor-pointer">
                        <select className="bg-transparent text-[11px] font-bold text-on-surface uppercase tracking-widest outline-none cursor-pointer border-none p-0 appearance-none relative z-10 w-full min-w[70px]">
                            <option>STYLE ▾</option>
                            <option>CLEAN</option>
                            <option>URBAN</option>
                            <option>RELAXED</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Waterfall Layout (Pinterest Style) */}
            <div className="px-6 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {SAVED.map((outfit) => (
                    <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="break-inside-avoid relative group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-outline-variant/10 flex flex-col"
                    >
                        {/* 1) Tops & Bottoms Stack Area */}
                        <div className="bg-surface-container-low p-2.5 flex flex-col gap-2 relative">
                            {/* Glass overlay actions */}
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => toggleLike(outfit.id, e)}
                                    className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${liked.includes(outfit.id) ? 'bg-secondary text-white' : 'bg-white/70 hover:bg-white text-primary'}`}
                                >
                                    <Heart size={14} className={liked.includes(outfit.id) ? "fill-white" : ""} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 bg-white/70 hover:bg-white rounded-full backdrop-blur-md transition-colors shadow-sm text-primary"
                                >
                                    <Share2 size={14} />
                                </button>
                            </div>

                            <div className="w-full h-32 md:h-40 xl:h-48 bg-surface rounded-[1rem] overflow-hidden shadow-sm relative group/top flex items-center justify-center border border-outline-variant/5">
                                <p className="absolute top-2 left-2 text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest z-10 bg-white/70 px-1.5 py-0.5 rounded backdrop-blur-sm">Tops / 상의</p>
                                <img src={ITEMS[0].image} alt="top" className="w-[85%] h-[85%] object-contain mix-blend-multiply group-hover/top:scale-110 transition-transform" />
                            </div>

                            <div className="w-full h-32 md:h-40 xl:h-48 bg-surface rounded-[1rem] overflow-hidden shadow-sm relative group/bot flex items-center justify-center border border-outline-variant/5">
                                <p className="absolute top-2 left-2 text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest z-10 bg-white/70 px-1.5 py-0.5 rounded backdrop-blur-sm">Bottoms / 하의</p>
                                <img src={ITEMS[2].image} alt="bottom" className="w-[85%] h-[85%] object-contain mix-blend-multiply group-hover/bot:scale-110 transition-transform" />
                            </div>
                        </div>

                        {/* 2) Shoes & Accessories + Title */}
                        <div className="p-5 border-b border-outline-variant/10 bg-surface-container-lowest flex gap-4 items-center">
                            <div className="w-16 h-16 bg-surface-container-low rounded-xl p-2 shrink-0 border border-outline-variant/5 shadow-inner relative overflow-hidden group/shoe">
                                <img src={ITEMS[3].image} alt="shoes" className="w-full h-full object-contain mix-blend-multiply group-hover/shoe:scale-110 transition-transform" />
                            </div>
                            <div className="pt-1">
                                <p className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                    <Sparkles size={8} /> Shoes & Acc
                                </p>
                                <h3 className="font-serif italic text-lg leading-tight mb-2 text-on-surface">{outfit.name}</h3>
                                <div className="flex flex-wrap gap-1">
                                    <span className="px-1.5 py-0.5 bg-secondary-container text-primary rounded text-[7px] font-bold uppercase tracking-widest">{outfit.occasion}</span>
                                    {outfit.tags.slice(0, 2).map((t, idx) => (
                                        <span key={idx} className="px-1.5 py-0.5 bg-outline-variant/10 text-on-surface-variant rounded text-[7px] font-bold uppercase">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3) Description & CTA */}
                        <div className="p-4 flex flex-col gap-2.5">
                            <div className="flex justify-between items-center mb-0.5">
                                <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">Description / 설명</p>
                                <span className="text-[8px] text-on-surface-variant flex items-center gap-1 font-medium"><Calendar size={8} /> 2026.05.20</span>
                            </div>

                            <p className="text-[10px] text-on-surface-variant/90 font-light leading-relaxed mb-1.5 line-clamp-2">
                                {outfit.notes}
                            </p>

                            <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-primary/95 flex items-center justify-center gap-2 group/btn transition-colors mt-auto">
                                <RotateCcw size={12} className="group-hover/btn:-rotate-90 transition-transform duration-500" /> 다시 사용하기
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
