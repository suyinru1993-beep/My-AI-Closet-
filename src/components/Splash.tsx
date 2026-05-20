import { motion } from 'motion/react';

export default function Splash({ onLogin }: { onLogin: (type: string) => void }) {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-white">
      {/* Editorial Background Element (Desktop Only) */}
      <div className="absolute inset-0 pointer-events-none opacity-5 hidden md:block">
        <img
          alt=""
          className="w-full h-full object-cover grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvgTyCPYqubzphVE_NyclLooh-5J-9k5JHv4k0Cc3ICDf_JXivrE87WZ94CI5NGSJjfvPvkl74hSJM7jGTgJBH0fo8akczE4gLFxhiz1HpLdHoDVjja4MgoVgnWxk81L2VSJQRdusgxEG2Yw6RjYFnKRhboWTVoPyC_mTPF1eMHDay98G3kg3Bum0Vq5_a0DBsivvMl6tCtYsaeVgcJgUl1Xp7o58LxOb13PF-6T6GRvwu2fJolt3oKXaD60Ljwe6KaXLLRFO5A"
        />
      </div>

      {/* Header Section */}
      <header className="w-full pt-16 md:pt-32 flex flex-col items-center z-10 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-6xl tracking-[0.2em] text-primary mb-2"
        >
          STYLIST AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.3 }}
          className="font-sans text-xs uppercase tracking-widest text-on-surface-variant"
        >
          당신을 위한 퍼스널 스타일 아카이브
        </motion.p>
      </header>

      {/* Center Section */}
      <section className="w-full max-w-[400px] px-6 flex flex-col gap-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-sm"
        >
          <img
            alt="Editorial flatlay"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_oKrm6HryglESvgrTW4AAWMugFapt0dwFCcA4oxJeC_538_RaNCMobDZcRZe0lE_fzgiY0vWQvPqs6HE97cgwSiP9liP_qmJhiFyQuIdZDCIKZdZ1iHIkqxKV4WaFyjAAvE682xjXs2ldfWoYzMS4PLl-Kns_bMzCE1xE9AyekTmKn975tvdXWm4vZ1g6KzNRy4HTGfIP5OCU835wX5MX5XVT91saFF_yIR75XSkOfZLoMHJQEm1Es-mtFxDzTMgc1juHzU_b02w"
          />
        </motion.div>

        {/* Auth Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLogin('kakao')}
            className="flex items-center justify-center w-full h-14 bg-[#FEE500] rounded-full text-sm font-semibold transition-colors"
          >
            카카오 계정으로 로그인
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLogin('google')}
            className="flex items-center justify-center w-full h-14 bg-white border border-outline-variant rounded-full text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            구글 계정으로 계속하기
          </motion.button>
        </div>

        <div className="text-center">
          <p className="text-sm text-on-surface-variant">
            스타일리스트 AI가 처음이신가요? <a className="text-primary font-bold underline underline-offset-4" href="#">초대 요청하기</a>
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full py-8 px-6 z-10">
        <div className="flex justify-center gap-8 border-t border-outline-variant/30 pt-4">
          <a className="text-[10px] text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors" href="#">개인정보 처리방침</a>
          <a className="text-[10px] text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors" href="#">이용약관</a>
        </div>
        <p className="mt-4 text-center text-[10px] text-outline uppercase tracking-[0.3em]">
          © 2026 STYLIST AI INC. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
