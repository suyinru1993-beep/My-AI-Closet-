import { motion } from 'motion/react';
import { Persona } from '../constants/personas';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
    selectedPersonas: Persona[];
    onReset: () => void;
    isModal?: boolean;
}

export default function StyleDNA({ selectedPersonas, onReset, isModal }: Props) {
    // Mock analysis logic
    const radarData = [
        { subject: 'Comfort', A: 85, fullMark: 100 },
        { subject: 'Clean', A: 72, fullMark: 100 },
        { subject: 'Urban', A: 90, fullMark: 100 },
        { subject: 'Unique', A: 65, fullMark: 100 },
        { subject: 'Active', A: 78, fullMark: 100 },
        { subject: 'Feminine', A: 60, fullMark: 100 },
    ];

    const mainStyles = [
        { name: 'Sportive Casual', percentage: 72, color: '#000000' },
        { name: 'Normcore', percentage: 18, color: '#666666' },
        { name: 'Minimal', percentage: 10, color: '#999999' },
    ];

    const impressions = ['Comfortable & Natural', 'Full of Vitality', 'Clean & Fresh', 'Relaxed'];

    return (
        <div className={`${isModal ? 'pt-12 pb-12 px-6 sm:px-12' : 'pt-24 pb-32 px-6'} max-w-4xl mx-auto min-h-screen`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h2 className="font-serif text-5xl mb-4 tracking-tighter">당신의 스타일 DNA</h2>
                <p className="text-on-surface-variant font-light text-xl italic uppercase tracking-widest">
                    스타일 감성과 무드를 분석한 시맨틱 블루프린트
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                {/* Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface-container-low rounded-[3rem] p-8 aspect-square flex items-center justify-center border border-outline-variant/10 shadow-sm"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#E5E2DD" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#000000', fontSize: 10, fontWeight: 700 }} />
                            <Radar
                                name="DNA"
                                dataKey="A"
                                stroke="#000000"
                                fill="#000000"
                                fillOpacity={0.15}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Style Percentages */}
                <div className="space-y-8">
                    <div>
                        <h3 className="font-serif text-2xl mb-6 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-primary"></span>
                            핵심 스타일 구성
                        </h3>
                        <div className="space-y-6">
                            {mainStyles.map((style, idx) => (
                                <motion.div
                                    key={style.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.1) }}
                                >
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-sm uppercase tracking-widest">{style.name}</span>
                                        <span className="font-serif italic text-xl">{style.percentage}%</span>
                                    </div>
                                    <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${style.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.6 + (idx * 0.1) }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-2xl mb-6 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-primary"></span>
                            타인이 느끼는 인상
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {impressions.map((keyword, idx) => (
                                <motion.span
                                    key={keyword}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + (idx * 0.1) }}
                                    className="px-6 py-3 bg-secondary-container text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10"
                                >
                                    ✓ {keyword}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-primary text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                    <h3 className="font-serif text-3xl mb-4 italic">Style DNA 인사이트</h3>
                    <p className="text-white/80 leading-relaxed text-lg font-light">
                        당신의 시맨틱 프로필은 <strong>도시적인 실용성(Urban Utility)</strong>과 <strong>깔끔한 미니멀리즘(Clean Minimalist)</strong> 미학을 강조하고 있습니다.
                        타인은 당신의 옷차림을 "세련되고 감각적인 스타일"로 인식할 가능성이 높습니다. 현재 당신의 옷장은 지적인 느낌을 주는 실루엣과 저채도 톤에 집중되어 있습니다.
                    </p>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={onReset}
                    className="group text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-4 hover:opacity-70 transition-opacity"
                >
                    <span className="w-12 h-[1px] bg-primary group-hover:w-20 transition-all"></span>
                    페르소나 다시 선택 / 스타일 DNA 재분석
                    <span className="w-12 h-[1px] bg-primary group-hover:w-20 transition-all"></span>
                </button>
            </div>
        </div>
    );
}
