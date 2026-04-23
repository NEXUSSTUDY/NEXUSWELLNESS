import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] }
      }}
      className="fixed inset-0 z-[100] bg-[#000000] flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Perspective Grid (Very Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(2)'
        }}
      />

      {/* Floating Energy Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200
          }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1.5, 0],
            y: "-=100",
            transition: { 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}
      
      <div className="relative flex flex-col items-center">
        {/* The Monolith Container */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.8, 
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative group"
        >
          {/* Diamond Framing */}
          <div className="absolute inset-x-[-40px] inset-y-[-40px] border border-white/10 rotate-45 animate-pulse-slow" />
          <div className="absolute inset-x-[-60px] inset-y-[-60px] border border-white/5 rotate-[22.5deg]" />
          
          {/* Main Logo Hex/Diamond */}
          <div className="w-28 h-28 bg-[#111] rounded-[30%] rotate-45 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10 overflow-hidden border border-white/5">
            {/* Spinning Shine Effect */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-[200%] h-[20px] bg-white/20 blur-md"
            />
            
            <motion.div
              initial={{ rotate: -45, scale: 0.5, opacity: 0 }}
              animate={{ rotate: -45, scale: 1.2, opacity: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.6,
                ease: "easeOut"
              }}
            >
              <Leaf size={44} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Typography with Staggered Reveal */}
        <div className="mt-16 flex flex-col items-center space-y-2">
          <motion.div
            initial={{ letterSpacing: "1em", opacity: 0, filter: "blur(10px)" }}
            animate={{ letterSpacing: "0.4em", opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            className="text-3xl font-black text-white uppercase"
          >
            NEXUS
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-[10px] font-bold tracking-[0.8em] uppercase text-white/40"
          >
            Sanctuary of Wellness
          </motion.div>
        </div>

        {/* High-End Loading Indicator */}
        <div className="mt-16 relative w-64 h-[1px]">
          <div className="absolute inset-0 bg-white/5" />
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          />
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </motion.div>
  );
}
