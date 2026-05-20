import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Sparkles, PlusCircle, User, Menu, X, LogOut } from 'lucide-react';
import Splash from './components/Splash';
import GenderSelection from './components/GenderSelection';
import PersonaSelection from './components/PersonaSelection';
import StyleDNA from './components/StyleDNA';
import MixAndMatch from './components/MixAndMatch';
import Suggestions from './components/Suggestions';
import WardrobeAnalysis from './components/WardrobeAnalysis';
import Profile from './components/Profile';
import SavedLooks from './components/SavedLooks';
import { Persona } from './constants/personas';

type Screen = 'dna' | 'closet' | 'recommend' | 'match' | 'profile' | 'saved';
type Gender = 'male' | 'female' | null;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const [hasSelectedPersona, setHasSelectedPersona] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('recommend');
  const [showDNAModal, setShowDNAModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    // Basic persistence check
    const savedGender = localStorage.getItem('style_gender');
    const savedPersonas = localStorage.getItem('style_dna_selected');

    if (savedGender) {
      setSelectedGender(savedGender as Gender);
    }

    if (savedPersonas) {
      setHasSelectedPersona(true);
      setSelectedPersonas(JSON.parse(savedPersonas));
    }
  }, []);

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
    localStorage.setItem('style_gender', gender as string);
  };

  const handlePersonaSelect = (personas: Persona[]) => {
    setSelectedPersonas(personas);
    setHasSelectedPersona(true);
    localStorage.setItem('style_dna_selected', JSON.stringify(personas));
    setShowDNAModal(true);
  };

  const handleResetDNA = () => {
    setHasSelectedPersona(false);
    setSelectedGender(null);
    setSelectedPersonas([]);
    localStorage.removeItem('style_dna_selected');
    localStorage.removeItem('style_gender');
    setShowDNAModal(false);
  };

  const handleLogin = (type: string) => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Splash onLogin={handleLogin} />;
  }



  if (!selectedGender) {
    return <GenderSelection onSelect={handleGenderSelect} />;
  }

  if (!hasSelectedPersona) {
    return <PersonaSelection onSelect={handlePersonaSelect} gender={selectedGender} />;
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary-container">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full bg-surface/80 backdrop-blur-md z-50 px-6 py-4 border-b border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <Menu onClick={() => setIsNavOpen(true)} className="text-primary cursor-pointer hover:opacity-60 transition-opacity" size={20} />
          <h1 className="font-serif text-xl tracking-[0.3em] uppercase">스타일 캐비닛</h1>
          <div className="flex items-center gap-4">
            <div
              onClick={() => setCurrentScreen('profile')}
              className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant/20 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <img src={selectedPersonas[0]?.image} alt="User Persona" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer */}
      <AnimatePresence>
        {isNavOpen && (
          <div className="fixed inset-0 z-[200] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[300px] bg-surface h-full shadow-2xl flex flex-col pt-20 px-6 pb-6"
            >
              <button
                onClick={() => setIsNavOpen(false)}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="font-serif italic text-2xl text-primary mb-10 tracking-widest">Navigation</h2>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'recommend', icon: Sparkles, label: '추천 스타일' },
                  { id: 'closet', icon: Shirt, label: '시맨틱 클로젯' },
                  { id: 'match', icon: PlusCircle, label: '매치 분석' },
                  { id: 'profile', icon: User, label: '내 정보' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentScreen(item.id as Screen);
                      setIsNavOpen(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest ${currentScreen === item.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-outline-variant/20 flex flex-col gap-4">
                <button
                  onClick={() => {
                    setIsNavOpen(false);
                    setIsLoggedIn(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="min-h-screen pt-4"
        >
          {currentScreen === 'closet' && <MixAndMatch gender={selectedGender!} onOpenSavedLooks={() => setCurrentScreen('saved')} />}
          {currentScreen === 'saved' && <SavedLooks gender={selectedGender!} onBack={() => setCurrentScreen('closet')} />}
          {currentScreen === 'recommend' && <Suggestions onResetDNA={handleResetDNA} gender={selectedGender!} onGoToWardrobe={() => setCurrentScreen('closet')} />}
          {currentScreen === 'match' && <WardrobeAnalysis />}
          {currentScreen === 'profile' && <Profile onLogout={() => setIsLoggedIn(false)} onResetDNA={handleResetDNA} selectedPersonas={selectedPersonas} />}
        </motion.div>
      </AnimatePresence>

      {/* Style DNA Modal */}
      <AnimatePresence>
        {showDNAModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDNAModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="overflow-y-auto flex-1">
                <StyleDNA selectedPersonas={selectedPersonas} onReset={handleResetDNA} isModal />
              </div>
              <div className="p-6 bg-surface border-t border-outline-variant/10 flex justify-center">
                <button
                  onClick={() => setShowDNAModal(false)}
                  className="px-10 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-lg"
                >
                  확인 및 닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-outline-variant/10 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] rounded-t-[2.5rem] px-6 pt-3 pb-8 md:pb-8">
        <div className="max-w-md mx-auto flex justify-around items-center h-full">
          {[
            { id: 'recommend', icon: Sparkles, label: '추천 스타일' },
            { id: 'closet', icon: Shirt, label: '시맨틱 클로젯' },
            { id: 'match', icon: PlusCircle, label: '매치 분석' },
            { id: 'profile', icon: User, label: '내 정보' },
          ].map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id as Screen)}
                className="relative flex flex-col items-center justify-center p-2 group transition-all"
              >
                <div className={`
                  p-3 rounded-full mb-1 transition-all duration-300
                  ${isActive ? 'bg-secondary-container text-primary scale-110' : 'text-on-surface-variant group-hover:bg-surface-container-low'}
                `}>
                  <item.icon size={isActive ? 22 : 20} className={isActive ? 'fill-primary' : ''} />
                </div>
                <span className={`
                  text-[9px] uppercase font-bold tracking-widest transition-opacity duration-300
                  ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}
                `}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

