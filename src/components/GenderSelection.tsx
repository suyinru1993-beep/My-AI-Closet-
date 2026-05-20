import { motion } from 'motion/react';
import { Minus } from 'lucide-react';

interface GenderSelectionProps {
    onSelect: (gender: 'male' | 'female') => void;
}

export default function GenderSelection({ onSelect }: GenderSelectionProps) {
    return (
        <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Header Info */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-24 px-12 z-10"
            >
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.4em] mb-4 text-center md:text-left">Personalization Guide</p>
                <h2 className="text-4xl md:text-5xl font-serif italic leading-tight max-w-xl text-center md:text-left mx-auto md:mx-0">
                    당신의 고유한<br />스타일 여정을 시작하세요
                </h2>
            </motion.div>

            {/* Exquisite Selection Area */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 px-12 z-10">

                {/* Women Option */}
                <motion.button
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 10 }}
                    onClick={() => onSelect('female')}
                    className="group flex flex-col items-start md:items-center gap-6"
                >
                    <div className="relative">
                        <span className="text-7xl md:text-[12rem] font-serif italic text-on-surface tracking-tighter opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all duration-700 select-none">
                            Women
                        </span>
                        <div className="absolute top-1/2 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-700" />
                    </div>
                    <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                        <Minus size={20} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Female Edition</span>
                    </div>
                </motion.button>

                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block w-[1px] h-48 bg-outline-variant/30" />

                {/* Men Option */}
                <motion.button
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -10 }}
                    onClick={() => onSelect('male')}
                    className="group flex flex-col items-start md:items-center gap-6"
                >
                    <div className="relative">
                        <span className="text-7xl md:text-[12rem] font-serif italic text-on-surface tracking-tighter opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all duration-700 select-none">
                            Men
                        </span>
                        <div className="absolute top-1/2 right-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-700" />
                    </div>
                    <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Male Edition</span>
                        <Minus size={20} className="text-primary" />
                    </div>
                </motion.button>

            </div>

            {/* Footer Accents */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pb-12 px-12 flex justify-between items-end z-10"
            >
                <div className="space-y-2 hidden md:block">
                    <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">System Core</p>
                    <p className="text-[10px] font-medium italic opacity-60">Personal Style Intelligence v2.0</p>
                </div>
                <div className="w-full md:w-auto text-center md:text-right">
                    <div className="inline-flex items-center gap-2 opacity-30">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <p className="text-[9px] font-bold uppercase tracking-widest">AI Engine Standby</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
