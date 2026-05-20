import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CloudSun, Thermometer, Wind, Check, Bookmark, Loader2 } from 'lucide-react';
import { OUTFITS, ITEMS, Outfit } from '../constants';

interface Props {
  gender: 'male' | 'female' | 'both';
  onResetDNA: () => void;
  onGoToWardrobe?: () => void;
}

export default function Suggestions({ gender, onResetDNA, onGoToWardrobe }: Props) {
  const [weather, setWeather] = useState({
    temp: 24,
    condition: '맑음',
    location: '위치 확인 중...',
    wind: '3.2m/s',
    feelsLike: 26,
    loading: true
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,weather_code,wind_speed_10m&timezone=auto`);
          const data = await res.json();
          const current = data.current;

          let conditionStr = '맑음';
          const code = current.weather_code;
          if (code >= 1 && code <= 3) conditionStr = '구름많음/흐림';
          else if (code >= 51 && code <= 67) conditionStr = '비';
          else if (code >= 71 && code <= 77) conditionStr = '눈';
          else if (code >= 80 && code <= 82) conditionStr = '소나기';
          else if (code >= 45 && code <= 48) conditionStr = '안개';

          setWeather({
            temp: Math.round(current.temperature_2m),
            condition: conditionStr,
            location: '현재 위치 (GPS)',
            wind: `${current.wind_speed_10m}km/h`,
            feelsLike: Math.round(current.apparent_temperature),
            loading: false
          });
        } catch (e) {
          console.error('Weather fetch error', e);
          setWeather(prev => ({ ...prev, location: '수집 실패 (Seoul, KR)', loading: false }));
        }
      }, (error) => {
        console.error('Geolocation error', error);
        setWeather({ temp: 24, condition: '맑음', location: '접근 거부됨 (Seoul)', wind: '3.2m/s', feelsLike: 26, loading: false });
      });
    } else {
      setWeather(prev => ({ ...prev, location: 'GPS 미지원', loading: false }));
    }
  }, []);

  const filteredByGender = OUTFITS.filter(o =>
    o.gender === gender || o.gender === 'both' || !o.gender
  );

  const weatherRecommendations = filteredByGender.filter(o => {
    if (o.minTemp && o.maxTemp) {
      return weather.temp >= o.minTemp && weather.temp <= o.maxTemp;
    }
    return true;
  });

  const weatherOutfit = weatherRecommendations[0] || filteredByGender[0];
  const getOccasionOutfits = (occasion: string) => filteredByGender.filter(o => o.occasion === occasion);

  const campusOutfit = getOccasionOutfits('CAMPUS')[0] || filteredByGender[1];
  const officeOutfit = getOccasionOutfits('OFFICE')[0] || filteredByGender[2];
  const streetOutfit = getOccasionOutfits('STREET')[0] || filteredByGender[3];
  const minimalOutfit = getOccasionOutfits('MINIMAL')[0] || filteredByGender[4];

  return (
    <div className="pt-24 pb-40 min-h-screen max-w-[1440px] mx-auto bg-surface">
      {/* Weather Briefing Section */}
      <section className="px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low rounded-[3rem] p-8 md:p-12 border border-outline-variant/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center text-primary shadow-inner">
              {weather.loading ? <Loader2 size={40} className="animate-spin" /> : <CloudSun size={40} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Real-time Weather</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{weather.location}</span>
              </div>
              <h2 className="text-4xl font-serif italic mb-2">
                {weather.temp}°C {weather.condition}
              </h2>
              <div className="flex gap-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Wind size={12} /> {weather.wind}</span>
                <span className="flex items-center gap-1"><Thermometer size={12} /> Feels like {weather.feelsLike}°C</span>
              </div>
            </div>
          </div>
          <div className="h-[1px] md:h-12 w-full md:w-[1px] bg-outline-variant/30" />
          <div className="flex-1 md:max-w-md">
            <p className="text-on-surface-variant font-light leading-relaxed italic text-sm">
              "현재 위치의 날씨는 {weather.temp}도, {weather.condition} 상태입니다. 날씨 데이터 기반으로 통기성 및 스타일 DNA를 유지하면서도 쾌적함을 극대화할 착장을 분석했습니다."
            </p>
          </div>
        </motion.div>
      </section>

      {/* Sequences */}
      <UnrolledOutfitTrack title="Weather-Matched Vision" outfit={weatherOutfit} delay={0.1} onGoToWardrobe={onGoToWardrobe} />
      <UnrolledOutfitTrack title="Campus Core / 캠퍼스" outfit={campusOutfit} delay={0.2} onGoToWardrobe={onGoToWardrobe} />
      <UnrolledOutfitTrack title="Office Professional / 오피스" outfit={officeOutfit} delay={0.3} onGoToWardrobe={onGoToWardrobe} />
      <UnrolledOutfitTrack title="Street Essence / 스트릿" outfit={streetOutfit} delay={0.4} onGoToWardrobe={onGoToWardrobe} />
      <UnrolledOutfitTrack title="Minimal Edge / 미니멀" outfit={minimalOutfit} delay={0.5} onGoToWardrobe={onGoToWardrobe} />

      {/* AI Insights Section (Compact) */}
      <section className="mt-8 px-6">
        <div className="bg-primary text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <Sparkles size={24} className="text-secondary-container flex-shrink-0" />
          <p className="flex-1 text-lg font-serif italic leading-relaxed text-center md:text-left">
            "당신의 '클린 미니멀' 페르소나는 구조적인 디테일에 민감합니다. 오늘의 온도에서 통기성을 확보하면서도 엣지를 살릴 수 있는 오버사이즈 핏을 시도해보세요."
          </p>
          <button
            onClick={onResetDNA}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all backdrop-blur-md whitespace-nowrap"
          >
            스타일 DNA 업데이트
          </button>
        </div>
      </section>
    </div>
  );
}

function UnrolledOutfitTrack({ title, outfit, delay, onGoToWardrobe }: { title: string; outfit?: Outfit; delay: number; onGoToWardrobe?: () => void }) {
  if (!outfit) return null;

  // Mocking the sequence of items for this presentation
  const sequence = [
    { label: 'Outer / 외투', item: ITEMS[0] },
    { label: 'Top / 상의', item: ITEMS[1] },
    { label: 'Bottom / 하의', item: ITEMS[2] },
    { label: 'Shoes / 신발', item: ITEMS[3] },
    { label: 'Acc / 패션잡화', item: ITEMS[5] || ITEMS[4] }
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 px-6 mb-4">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h3 className="text-xl font-serif italic text-on-surface">{title}</h3>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 pb-6 items-stretch snap-x snap-mandatory">
        {sequence.map((seq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + (idx * 0.1) }}
            className="shrink-0 w-[140px] md:w-[160px] snap-center flex flex-col group/item"
          >
            <div className="relative w-full aspect-[4/5] bg-surface-container-low rounded-2xl p-4 flex flex-col justify-between border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest z-10">{seq.label}</p>

              {idx === 0 && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full z-10 shadow-sm border border-outline-variant/10 flex items-center gap-1">
                  <span className="text-xs font-serif italic font-bold">{outfit.matchPercentage}%</span>
                  <div className="w-[1px] h-2 bg-outline-variant/50" />
                  <span className="text-[7px] text-primary uppercase font-bold tracking-widest">DNA</span>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center p-6 mt-4">
                <img src={seq.item?.image} alt={seq.label} className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-700" />
              </div>
            </div>
            <div className="mt-3 px-2 flex flex-col gap-0.5">
              <p className="font-serif italic text-base leading-tight truncate text-on-surface">{seq.item?.name}</p>
              <p className="text-[8px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{seq.item?.semantics?.join(' / ')}</p>
            </div>
          </motion.div>
        ))}

        {/* Actions: Use & Save */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="shrink-0 w-[180px] snap-center flex flex-col justify-start pb-6 pl-2"
        >
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex flex-col gap-3 shadow-sm h-auto my-auto justify-center ring-1 ring-black/5">
            <p className="text-[10px] text-center text-on-surface-variant/80 font-bold uppercase tracking-widest leading-relaxed">
              Action
            </p>
            <div className="flex flex-col gap-2.5">
              <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-1.5 group/btn">
                <Check size={12} className="group-hover/btn:scale-125 transition-transform" /> 사용하기 (입기)
              </button>
              <button className="w-full py-3 bg-white border border-outline-variant/20 text-primary rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 tooltip" title="조합을 Saved Looks에 추가">
                <Bookmark size={12} /> 코디 저장
              </button>
            </div>
            {onGoToWardrobe && (
              <button
                onClick={onGoToWardrobe}
                className="mt-1 w-full text-[9px] font-bold text-on-surface-variant/60 underline underline-offset-4 hover:text-primary transition-colors text-center pb-1"
              >
                마음에 안 드시나요? 직접 고르기
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
