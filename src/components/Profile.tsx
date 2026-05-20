import { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Calendar, Repeat, ChevronDown, Filter, User } from 'lucide-react';
import { OUTFITS, Outfit } from '../constants';
import { PERSONA_DATA, Persona } from '../constants/personas';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  onLogout: () => void;
  onResetDNA: () => void;
  selectedPersonas: Persona[];
}

export default function Profile({ onLogout, onResetDNA, selectedPersonas }: ProfileProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'most'>('latest');
  const [profileGender, setProfileGender] = useState('남성');
  const [occupation, setOccupation] = useState('30대 회사원');
  const [concerns, setConcerns] = useState('하체가 조금 통통한 편이고 어깨가 좁아 보임');

  const radarData = [
    { subject: 'Comfort', A: 85, fullMark: 100 },
    { subject: 'Clean', A: 72, fullMark: 100 },
    { subject: 'Urban', A: 90, fullMark: 100 },
    { subject: 'Unique', A: 65, fullMark: 100 },
    { subject: 'Active', A: 78, fullMark: 100 },
    { subject: 'Feminine', A: 60, fullMark: 100 },
  ];

  const sortedOutfits = [...OUTFITS].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.lastWorn).getTime() - new Date(a.lastWorn).getTime();
    } else {
      return b.wearCount - a.wearCount;
    }
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 pt-32 pb-32 flex flex-col gap-10">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-outline-variant/20 pb-10">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary p-1 bg-surface">
          <img
            className="w-full h-full object-cover rounded-full"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
            alt="User profile"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-3xl font-serif italic uppercase tracking-wider text-primary">Alexandria Sterling</h1>
            <div className="flex justify-center md:justify-start gap-2">
              <button
                onClick={onResetDNA}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Repeat size={14} className="animate-spin-slow" />
                스타일 DNA 다시 테스트
              </button>
              {/* Unused Settings button removed */}
              <button
                onClick={onLogout}
                className="p-2.5 rounded-full bg-surface-container border border-outline-variant/30 hover:bg-red-50 text-red-600 transition-all hover:scale-110"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest/50 rounded-full px-6 py-4 mb-10 max-w-4xl border border-outline-variant/10 text-left shadow-sm flex items-center gap-6">
            <h2 className="flex flex-col items-center justify-center gap-1 text-on-surface border-r border-outline-variant/10 pr-6">
              <User size={16} className="text-primary" fill="currentColor" />
              <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-1">Profile</span>
            </h2>

            <div className="flex-1 flex flex-row items-center gap-4">
              <div className="w-1/4">
                <div className="relative">
                  <select
                    value={profileGender}
                    onChange={(e) => setProfileGender(e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/20 py-2 text-xs appearance-none outline-none focus:border-primary/50 cursor-pointer font-medium"
                  >
                    <option value="남성">성별: 남성</option>
                    <option value="여성">성별: 여성</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="w-1/4">
                <input
                  type="text"
                  value={occupation}
                  placeholder="연령 및 직업"
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant/20 py-2 text-xs outline-none focus:border-primary/50 font-medium placeholder:text-on-surface-variant/40"
                />
              </div>

              <div className="w-1/2">
                <input
                  type="text"
                  value={concerns}
                  placeholder="체형 및 고민 사항"
                  onChange={(e) => setConcerns(e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant/20 py-2 text-xs outline-none focus:border-primary/50 font-medium placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">전체 코디</p>
              <p className="text-xl font-serif">{OUTFITS.length}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">사용 빈도</p>
              <p className="text-xl font-serif">84%</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">스타일 DNA</p>
              <p className="text-xl font-serif uppercase text-primary">Active Sportive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Style DNA Section (Comprehensive) */}
      <section className="w-full bg-surface-container-low/50 rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col md:flex-row">

        {/* Left: Visual DNA Radar */}
        <div className="p-8 md:p-10 flex-1 border-b md:border-b-0 md:border-r border-outline-variant/10 flex flex-col items-center justify-center bg-surface-container-lowest/30">
          <h2 className="text-2xl font-serif italic mb-2">Style DNA Blueprint</h2>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-6">개인화된 패션 성향 지표</p>

          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center bg-surface rounded-full shadow-inner border border-outline-variant/5">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E5E2DD" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#000000', fontSize: 9, fontWeight: 700 }} />
                <Radar name="DNA" dataKey="A" stroke="#000000" fill="#000000" fillOpacity={0.10} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Insights & Origin Personas */}
        <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif">스타일 DNA 인사이트</h3>
              <button onClick={onResetDNA} className="text-[9px] font-bold text-primary uppercase tracking-widest underline underline-offset-4 hover:opacity-70 transition-opacity">
                DNA 재분석
              </button>
            </div>

            <p className="text-on-surface-variant font-light text-sm leading-relaxed mb-8 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/5">
              당신의 시맨틱 프로필은 <strong>도시적인 실용성(Urban Utility)</strong>과 <strong>깔끔한 미니멀리즘(Clean Minimalist)</strong> 미학을 강조하고 있습니다.
              타인은 당신의 옷차림을 "세련되고 감각적인 스타일"로 인식할 가능성이 높습니다. 현재 옷장은 지적인 느낌을 주는 실루엣과 저채도 톤에 집중되어 있습니다.
            </p>

            <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-3 ml-1">분석의 기반이 된 페르소나 무드</h3>
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 snap-x">
              {selectedPersonas.map((persona) => (
                <div key={persona.id} className="relative shrink-0 w-28 aspect-square rounded-xl overflow-hidden group shadow-sm border border-outline-variant/10 snap-center">
                  <img src={persona.image} alt={persona.mood} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-white text-[7px] font-black uppercase tracking-widest leading-none mb-1">{persona.category}</span>
                    <span className="text-white/90 text-[8px] italic leading-tight truncate">{persona.mood}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outfit Collections Section */}
      <section className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-serif">코디 컬렉션</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">직접 큐레이션한 스타일 조합</p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'most')}
                className="appearance-none bg-surface-container-low border border-outline-variant/30 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-secondary-container transition-all pr-12"
              >
                <option value="latest">정렬: 최신순</option>
                <option value="most">정렬: 자주 입은 순</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" size={14} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedOutfits.map((outfit, idx) => (
            <motion.div
              key={outfit.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex h-[160px] group hover:shadow-lg transition-all"
            >
              <div className="w-1/3 h-full overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={outfit.image}
                  alt={outfit.name}
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">{outfit.occasion}</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container rounded text-[9px] font-bold uppercase tracking-tight">
                      <Repeat size={10} />
                      {outfit.wearCount}회 착용
                    </div>
                  </div>
                  <h3 className="text-lg font-serif italic mb-1">{outfit.name}</h3>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 opacity-50">
                    <Calendar size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">최근: {outfit.lastWorn}</span>
                  </div>
                  <button className="text-[9px] font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity">
                    룩 수정하기
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
