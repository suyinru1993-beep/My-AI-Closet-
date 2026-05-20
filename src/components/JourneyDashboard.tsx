import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudRain, Thermometer, Wind, ShoppingBag, Archive, Check } from 'lucide-react';

type Gender = 'Male' | 'Female';
type Theme = 'CAMPUS' | 'OFFICE' | 'STREET' | 'MINIMAL';

const ITEMS_DB = {
    M_OFFICE: {
        items: [
            { id: 'ITM_MO01', name: '시어서커 블레이저', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvgTyCPYqubzphVE_NyclLooh-5J-9k5JHv4k0Cc3ICDf_JXivrE87WZ94CI5NGSJjfvPvkl74hSJM7jGTgJBH0fo8akczE4gLFxhiz1HpLdHoDVjja4MgoVgnWxk81L2VSJQRdusgxEG2Yw6RjYFnKRhboWTVoPyC_mTPF1eMHDay98G3kg3Bum0Vq5_a0DBsivvMl6tCtYsaeVgcJgUl1Xp7o58LxOb13PF-6T6GRvwu2fJolt3oKXaD60Ljwe6KaXLLRFO5A', func: '❄️ 냉감 / 🌬️ 통기' },
            { id: 'ITM_MO02', name: '쿨 스판 슬랙스', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_oKrm6HryglESvgrTW4AAWMugFapt0dwFCcA4oxJeC_538_RaNCMobDZcRZe0lE_fzgiY0vWQvPqs6HE97cgwSiP9liP_qmJhiFyQuIdZDCIKZdZ1iHIkqxKV4WaFyjAAvE682xjXs2ldfWoYzMS4PLl-Kns_bMzCE1xE9AyekTmKn975tvdXWm4vZ1g6KzNRy4HTGfIP5OCU835wX5MX5XVT91saFF_yIR75XSkOfZLoMHJQEm1Es-mtFxDzTMgc1juHzU_b02w', func: '🌬️ 속건 / 👔 구김' },
            { id: 'ITM_MO03', name: '피케 카라 셔츠', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvgTyCPYqubzphVE_NyclLooh-5J-9k5JHv4k0Cc3ICDf_JXivrE87WZ94CI5NGSJjfvPvkl74hSJM7jGTgJBH0fo8akczE4gLFxhiz1HpLdHoDVjja4MgoVgnWxk81L2VSJQRdusgxEG2Yw6RjYFnKRhboWTVoPyC_mTPF1eMHDay98G3kg3Bum0Vq5_a0DBsivvMl6tCtYsaeVgcJgUl1Xp7o58LxOb13PF-6T6GRvwu2fJolt3oKXaD60Ljwe6KaXLLRFO5A', func: '❄️ 냉감' }
        ],
        tip: "중요한 임원 보고는 시어서커로 격식과 시원함을 모두 챙기세요. 클래식 수트 아이템 셋업입니다."
    },
    F_OFFICE: {
        items: [
            { id: 'ITM_FO01', name: '린넨 블렌드 자켓', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_oKrm6HryglESvgrTW4AAWMugFapt0dwFCcA4oxJeC_538_RaNCMobDZcRZe0lE_fzgiY0vWQvPqs6HE97cgwSiP9liP_qmJhiFyQuIdZDCIKZdZ1iHIkqxKV4WaFyjAAvE682xjXs2ldfWoYzMS4PLl-Kns_bMzCE1xE9AyekTmKn975tvdXWm4vZ1g6KzNRy4HTGfIP5OCU835wX5MX5XVT91saFF_yIR75XSkOfZLoMHJQEm1Es-mtFxDzTMgc1juHzU_b02w', func: '❄️ 냉감 / 🌬️ 통기' },
            { id: 'ITM_FO02', name: '쿨니트 오피스 이너', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvgTyCPYqubzphVE_NyclLooh-5J-9k5JHv4k0Cc3ICDf_JXivrE87WZ94CI5NGSJjfvPvkl74hSJM7jGTgJBH0fo8akczE4gLFxhiz1HpLdHoDVjja4MgoVgnWxk81L2VSJQRdusgxEG2Yw6RjYFnKRhboWTVoPyC_mTPF1eMHDay98G3kg3Bum0Vq5_a0DBsivvMl6tCtYsaeVgcJgUl1Xp7o58LxOb13PF-6T6GRvwu2fJolt3oKXaD60Ljwe6KaXLLRFO5A', func: '🌬️ 통기' },
            { id: 'ITM_FO03', name: '크롭 슬랙스', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_oKrm6HryglESvgrTW4AAWMugFapt0dwFCcA4oxJeC_538_RaNCMobDZcRZe0lE_fzgiY0vWQvPqs6HE97cgwSiP9liP_qmJhiFyQuIdZDCIKZdZ1iHIkqxKV4WaFyjAAvE682xjXs2ldfWoYzMS4PLl-Kns_bMzCE1xE9AyekTmKn975tvdXWm4vZ1g6KzNRy4HTGfIP5OCU835wX5MX5XVT91saFF_yIR75XSkOfZLoMHJQEm1Es-mtFxDzTMgc1juHzU_b02w', func: '👔 구김 방지' }
        ],
        tip: "루엘(Luel) 세계관 시그니처 셋업. 린넨 셋업과 시원한 이너 코디로 세련됨을 유지하세요."
    },
    DEFAULT: {
        items: [
            { id: 'D1', name: '시그니처 반팔', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvgTyCPYqubzphVE_NyclLooh-5J-9k5JHv4k0Cc3ICDf_JXivrE87WZ94CI5NGSJjfvPvkl74hSJM7jGTgJBH0fo8akczE4gLFxhiz1HpLdHoDVjja4MgoVgnWxk81L2VSJQRdusgxEG2Yw6RjYFnKRhboWTVoPyC_mTPF1eMHDay98G3kg3Bum0Vq5_a0DBsivvMl6tCtYsaeVgcJgUl1Xp7o58LxOb13PF-6T6GRvwu2fJolt3oKXaD60Ljwe6KaXLLRFO5A', func: '🌬️ 통기' },
            { id: 'D2', name: '와이드 데님', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_oKrm6HryglESvgrTW4AAWMugFapt0dwFCcA4oxJeC_538_RaNCMobDZcRZe0lE_fzgiY0vWQvPqs6HE97cgwSiP9liP_qmJhiFyQuIdZDCIKZdZ1iHIkqxKV4WaFyjAAvE682xjXs2ldfWoYzMS4PLl-Kns_bMzCE1xE9AyekTmKn975tvdXWm4vZ1g6KzNRy4HTGfIP5OCU835wX5MX5XVT91saFF_yIR75XSkOfZLoMHJQEm1Es-mtFxDzTMgc1juHzU_b02w', func: '세탁 용이' },
            { id: 'D3', name: '테크니컬 러너', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvgTyCPYqubzphVE_NyclLooh-5J-9k5JHv4k0Cc3ICDf_JXivrE87WZ94CI5NGSJjfvPvkl74hSJM7jGTgJBH0fo8akczE4gLFxhiz1HpLdHoDVjja4MgoVgnWxk81L2VSJQRdusgxEG2Yw6RjYFnKRhboWTVoPyC_mTPF1eMHDay98G3kg3Bum0Vq5_a0DBsivvMl6tCtYsaeVgcJgUl1Xp7o58LxOb13PF-6T6GRvwu2fJolt3oKXaD60Ljwe6KaXLLRFO5A', func: '🏃 활동성' }
        ],
        tip: "선택하신 테마에 맞춘 편안하고 스타일리시한 추천 착장입니다."
    }
};

export default function JourneyDashboard({ onBack }: { onBack: () => void }) {
    const [gender, setGender] = useState<Gender>('Male');
    const [theme, setTheme] = useState<Theme>('OFFICE');
    const [onboardingChecked, setOnboardingChecked] = useState(false);

    const categoryCode = `${gender.charAt(0)}_${theme}`;
    const currentData = ITEMS_DB[categoryCode as keyof typeof ITEMS_DB] || ITEMS_DB.DEFAULT;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F5F2F0] p-4 md:p-8 font-sans overflow-y-auto"
        >
            <div className="max-w-[1440px] mx-auto h-full flex flex-col md:flex-row gap-6">

                {/* Left Column: Inputs */}
                <div className="w-full md:w-[45%] flex flex-col gap-6">

                    {/* Header Back Button */}
                    <button onClick={onBack} className="self-start text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                        &larr; 돌아가기
                    </button>

                    {/* Stage 1: Awareness (Weather) */}
                    <div className="bg-gradient-to-br from-[#d4ebf2] to-[#bde0ec] p-6 rounded-3xl shadow-sm relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-blue-400 opacity-20"><CloudRain size={120} /></div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-[#006699] mb-1 flex items-center gap-2">
                                <Thermometer size={20} /> 1단계: 플렛폼 진입
                            </h2>
                            <p className="text-blue-900/80 text-xs mb-4 uppercase tracking-widest font-bold">Location: 오늘의 강남구</p>

                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-4xl font-black text-[#003366] tracking-tighter">31.5℃</span>
                                <span className="text-[#006699] font-bold mb-1 flex items-center gap-1 text-sm"><Wind size={14} /> 습도 82%</span>
                            </div>

                            <div className="bg-white/50 backdrop-blur-md px-4 py-3 rounded-xl border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border-l-4 border-l-red-500">
                                <p className="font-bold text-red-700 text-[13px]">🚨 불쾌지수 매우 높음 (80)</p>
                                <p className="text-[#003366] text-[11px] mt-1 font-medium">통기성 중심 착장 가이드가 시급합니다.</p>
                            </div>
                        </div>
                    </div>

                    {/* Combined Box for Stage 2 & 3 */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/20 flex-1 flex flex-col">

                        {/* Stage 2: Profile */}
                        <div className="mb-8">
                            <h3 className="font-serif italic text-2xl mb-5 text-on-surface">2단계: Profile</h3>

                            <div className="flex gap-4 mb-4">
                                {(['Male', 'Female'] as Gender[]).map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setGender(g)}
                                        className={`flex-1 py-3 md:py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all border-2 
                      ${gender === g ? 'border-primary bg-primary text-white shadow-md' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30'}
                    `}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>

                            <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 cursor-pointer group hover:bg-surface-container-low transition-colors">
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${onboardingChecked ? 'bg-primary border-primary text-white' : 'bg-white border-outline-variant group-hover:border-primary/50'}`}>
                                    {onboardingChecked && <Check size={12} strokeWidth={3} />}
                                </div>
                                <input type="checkbox" className="hidden" checked={onboardingChecked} onChange={(e) => setOnboardingChecked(e.target.checked)} />
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs tracking-wide text-on-surface">3초 온보딩 퀵 체크박스 [SYS-001]</span>
                                    <span className="text-[10px] text-on-surface-variant mt-0.5">번거로운 의류 촬영 생략, 소장 기본 아이템 로드</span>
                                </div>
                            </label>
                        </div>

                        <div className="w-full h-px bg-outline-variant/20 mb-8" />

                        {/* Stage 3: Mapping */}
                        <div className="mt-auto pb-2">
                            <h3 className="font-serif italic text-2xl mb-5 text-on-surface">3단계: Mapping</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {(['CAMPUS', 'OFFICE', 'STREET', 'MINIMAL'] as Theme[]).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`py-4 px-2 rounded-xl text-center font-bold uppercase tracking-[0.2em] text-[10px] transition-all
                      ${theme === t ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-low'}
                    `}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Output */}
                <div className="w-full md:w-[55%] flex flex-col gap-6">
                    {/* Stage 4: Output */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/20 flex-1 flex flex-col relative overflow-hidden">

                        <div className="flex justify-between items-end mb-8 relative z-10">
                            <div>
                                <p className="text-[10px] text-primary/40 font-bold uppercase tracking-[0.3em] mb-2">Category Code: {categoryCode}</p>
                                <h2 className="font-serif italic text-3xl md:text-4xl text-on-surface">4단계: AI 룩북 출력</h2>
                            </div>
                            <div className="px-3 py-1 bg-[#e2f0d9] border border-[#385723]/30 text-[#385723] rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm">
                                Macro Query Linked
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={categoryCode}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {currentData.items.map((item, idx) => (
                                        <div key={idx} className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 flex flex-col group h-full">
                                            <div className="aspect-[3/4] bg-surface-container-low overflow-hidden relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0" />
                                                <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-md text-on-surface px-2 py-1 rounded text-[9px] font-bold shadow-sm border border-outline-variant/30">
                                                    {item.func}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white flex-1 flex items-center justify-center text-center">
                                                <p className="text-[11px] font-bold text-on-surface tracking-wide">{item.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto bg-[#fff2cc]/40 p-5 rounded-2xl border border-[#d5a6bd]/30">
                                    <p className="text-[10px] font-bold text-[#cc0000] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        <Thermometer size={12} /> AI Styling Tip
                                    </p>
                                    <p className="text-on-surface text-sm font-medium leading-relaxed">{currentData.tip}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                    </div>

                    {/* Stage 5: Outcome */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <button className="flex-1 bg-primary text-white h-[60px] rounded-[1.5rem] font-bold text-[11px] tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 group">
                            <ShoppingBag size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            이 룩북 그대로 쇼핑하기
                        </button>
                        <button className="flex-1 bg-surface border-2 border-outline-variant/30 text-on-surface h-[60px] rounded-[1.5rem] font-bold text-[11px] tracking-widest uppercase hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 group">
                            <Archive size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            오늘의 착장 확정 (보관)
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
