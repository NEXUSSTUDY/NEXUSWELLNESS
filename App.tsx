/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  ArrowRight, 
  Leaf, 
  Menu, 
  X, 
  Instagram, 
  Linkedin, 
  Home, 
  Users, 
  Heart, 
  Moon, 
  ShieldAlert, 
  Briefcase, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Brain,
  MessageSquare
} from 'lucide-react';
import { BookingForm } from './components/BookingForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Booking, Slot, AdminSettings, InfoPage } from './types';
import { PremiumButton } from './components/ui/PremiumButton';
import { GlassCard } from './components/ui/GlassCard';
import { cn } from './lib/utils';
import emailjs from '@emailjs/browser';

import { SplashScreen } from './components/ui/SplashScreen';

const INITIAL_SLOTS: Slot[] = [
  { id: '1', time: '11:00 AM', isActive: true },
  { id: '2', time: '12:30 PM', isActive: true },
  { id: '3', time: '02:00 PM', isActive: true },
  { id: '4', time: '04:00 PM', isActive: true },
  { id: '5', time: '05:30 PM', isActive: true },
];

const DEFAULT_INFO_PAGES: InfoPage[] = [
  { id: 'career', title: 'Career Counseling', content: 'Navigate your professional journey with confidence. From career transitions to workplace stress, we are here to guide you.', imageUrl: 'https://picsum.photos/seed/career/800/600' },
  { id: 'anxiety', title: 'Anxiety & Stress', content: 'We provide evidence-based strategies to manage anxiety, reduce stress, and regain control over your life in a calm, supportive environment.', imageUrl: 'https://picsum.photos/seed/anxiety/800/600' },
  { id: 'relationship', title: 'Relationship Issues', content: 'Our relationship counseling focuses on building strong foundations, improving communication, and resolving conflicts with empathy and understanding.', imageUrl: 'https://picsum.photos/seed/relationship/800/600' },
  { id: 'sleep', title: 'Sleep Problems', content: 'Dedicated support for overcoming sleep challenges, including cognitive behavioral therapy for insomnia and personalized sleep hygiene plans.', imageUrl: 'https://picsum.photos/seed/sleep/800/600' },
  { id: 'trauma', title: 'Trauma Support', content: 'A compassionate approach to processing trauma. We help you heal from the past and build resilience for a brighter future.', imageUrl: 'https://picsum.photos/seed/trauma/800/600' },
];

const INITIAL_SETTINGS: AdminSettings = {
  upiQRCode: '',
  upiId: 'nexuswellness@upi',
  socialLinks: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    x: 'https://x.com'
  },
  infoPages: DEFAULT_INFO_PAGES,
  adminWhatsApp: '+919876543210',
  callMeBotApiKey: '',
  adminPassword: 'Aarya$999'
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nexus_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  
  // Theme Toggle Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);
  
  // State from LocalStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('nexus_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [slots, setSlots] = useState<Slot[]>(() => {
    const saved = localStorage.getItem('nexus_slots');
    return saved ? JSON.parse(saved) : INITIAL_SLOTS;
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('nexus_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = {
        ...INITIAL_SETTINGS,
        ...parsed,
        socialLinks: parsed.socialLinks || INITIAL_SETTINGS.socialLinks,
        infoPages: (parsed.infoPages && parsed.infoPages.length > 0) ? parsed.infoPages : INITIAL_SETTINGS.infoPages
      };
      
      // Migration: If the stored password is the old default, update it to the new requested default
      if (merged.adminPassword === 'nexus_admin') {
        merged.adminPassword = 'Aarya$999';
      }
      
      return merged;
    }
    return INITIAL_SETTINGS;
  });

  // Ensure mandatory pages exist
  useEffect(() => {
    const missingPages = DEFAULT_INFO_PAGES.filter(
      defPage => !settings.infoPages.some(page => page.id === defPage.id)
    );
    
    if (missingPages.length > 0) {
      setSettings(prev => ({
        ...prev,
        infoPages: [...prev.infoPages, ...missingPages]
      }));
    }
  }, [settings.infoPages]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('nexus_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('nexus_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('nexus_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Premium Splash Screen Duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === settings.adminPassword) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPasswordInput('');
    } else {
      alert('Incorrect Password.');
    }
  };

  const currentPage = activePage === 'home' 
    ? null 
    : settings.infoPages.find(p => p.id === activePage);

  if (isAdmin) {
    return (
      <AdminDashboard
        bookings={bookings}
        slots={slots}
        settings={settings}
        onUpdateSlots={setSlots}
        onUpdateSettings={setSettings}
        onDeleteBooking={handleDeleteBooking}
        onLogout={() => setIsAdmin(false)}
      />
    );
  }

  const menuItems = [
    { id: 'home', title: 'Home', icon: Home, color: 'text-[var(--premium-accent)]' },
    ...settings.infoPages.map(p => {
      let icon: any = Users;
      
      const title = p.title.toLowerCase();
      if (title.includes('relationship')) {
        icon = '❤️';
      } else if (title.includes('anxiety') || title.includes('stress')) {
        icon = '🧠';
      } else if (title.includes('sleep')) {
        icon = '🌙';
      } else if (title.includes('trauma')) {
        icon = '🛡️';
      } else if (title.includes('career')) {
        icon = '💼';
      }
      
      return { id: p.id, title: p.title, icon, color: 'text-[var(--premium-accent)]' };
    })
  ];

  return (
    <div className={cn(
      "min-h-screen relative overflow-x-hidden font-sans selection:bg-[var(--premium-accent)]/30 transition-colors duration-[2s]",
      theme === 'dark' ? "bg-black" : "bg-[var(--premium-bg)]"
    )}>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>
      {/* Neural Aura Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[100vw] h-[100vw] bg-blue-600/10 aura-glow rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -left-1/4 w-[80vw] h-[80vw] bg-indigo-600/5 aura-glow rounded-full" 
        />
      </div>
      
      {/* Background Orbs */}
      <div className="fixed -top-48 -left-48 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[140px] opacity-40 animate-pulse pointer-events-none" />
      <div className="fixed -bottom-48 -right-48 w-[600px] h-[600px] bg-sky-400/5 dark:bg-sky-500/5 rounded-full blur-[140px] opacity-30 animate-pulse-slow pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[160px] opacity-20 pointer-events-none" />

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            />
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-full max-w-[340px] obsidian-panel z-50 p-6 md:p-10 flex flex-col border-r border-white/5"
            >
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setActivePage('home'); setIsSidebarOpen(false); }}>
                  <div className="w-8 h-8 bg-[var(--premium-accent)] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Leaf className="text-[var(--premium-bg)]" size={18} />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-[var(--premium-text)]">Nexus Menu</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)] transition-colors haptic-button p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <nav className="space-y-2 md:space-y-3 overflow-y-auto pr-2 no-scrollbar">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => {
                        setActivePage(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden haptic-button",
                        activePage === item.id 
                          ? "bg-[var(--premium-accent)] text-[var(--premium-bg)] shadow-lg" 
                          : "text-[var(--premium-text-secondary)] hover:bg-[var(--premium-accent)]/5 hover:text-[var(--premium-text)]"
                      )}
                    >
                      {typeof item.icon === 'string' ? (
                        <span className="text-xl w-5 flex items-center justify-center">{item.icon}</span>
                      ) : (
                        <item.icon size={20} className={activePage === item.id ? "text-[var(--premium-bg)]" : "text-[var(--premium-text-secondary)] opacity-50 group-hover:opacity-100 transition-opacity"} />
                      )}
                      <span className="font-semibold text-sm md:text-base">{item.title}</span>
                      {activePage === item.id && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute left-0 w-1 h-8 bg-[var(--premium-bg)] rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-6 md:mt-8 space-y-6 md:space-y-8">
                  <div className="pt-0 space-y-3">
                    <p className="text-[9px] uppercase font-bold text-[var(--premium-text-secondary)] tracking-widest px-4">Connect</p>
                    <div className="grid grid-cols-3 gap-2 px-4 pb-2">
                      <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-neutral-900 flex items-center justify-center rounded-xl hover:scale-110 transition-all text-[#E4405F] shadow-sm group">
                        <Instagram size={18} />
                      </a>
                      <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-neutral-900 flex items-center justify-center rounded-xl hover:scale-110 transition-all text-[#0077B5] shadow-sm group">
                        <Linkedin size={18} />
                      </a>
                      <a href={settings.socialLinks.x} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#000000] flex items-center justify-center rounded-xl hover:scale-110 transition-all text-white shadow-sm group">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="opacity-90 group-hover:opacity-100 transition-opacity">
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-8 border-t border-[var(--premium-border)]">
                    <p className="text-[9px] uppercase font-bold text-[var(--premium-text-secondary)] tracking-widest px-4 mb-3">Appearance</p>
                    <div className="bg-[var(--premium-surface)] p-1 rounded-2xl flex gap-1 border border-[var(--premium-border)] shadow-sm">
                      <button 
                        onClick={() => setTheme('light')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                          theme === 'light' ? "bg-white text-black shadow-lg" : "text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)]"
                        )}
                      >
                        <Sparkles size={12} className={theme === 'light' ? "text-amber-500" : ""} /> Light
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                          theme === 'dark' ? "bg-[var(--premium-accent)] text-[var(--premium-bg)] shadow-lg" : "text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)]"
                        )}
                      >
                        <Moon size={12} /> Dark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-4 md:px-8 py-6 md:py-8 relative z-10 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-[var(--premium-surface)] backdrop-blur-md border border-[var(--premium-border)] text-[var(--premium-text)] hover:shadow-xl transition-all haptic-button"
          >
            <Menu size={20} md:size={24} />
          </button>
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => setActivePage('home')}>
            <div className="w-10 h-10 md:w-12 md:h-12 dark:bg-white bg-black rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500">
              <Leaf className="dark:text-black text-white" size={20} md:size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-[-0.05em] text-[var(--premium-text)] leading-none uppercase">Nexus</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--premium-text-secondary)] mt-1">Sanctuary</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAdminLogin(true)}
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl text-[var(--premium-accent)] bg-[var(--premium-accent)]/5 hover:bg-[var(--premium-accent)]/10 transition-all haptic-button"
        >
          <Fingerprint size={20} md:size={24} />
        </button>
      </motion.nav>

      {/* Content Section */}
      <main className="relative z-10 safe-area-inset">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 text-center space-y-6">
          <AnimatePresence mode="wait">
            {activePage === 'home' ? (
              <motion.div
                key="home-hero"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-8 mb-12 md:mb-20 text-sharp">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <span className="h-px w-8 bg-[var(--premium-accent)]/20" />
                    <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.5em] text-[var(--premium-accent)]">
                      The Sanctuary of Distinction
                    </span>
                    <span className="h-px w-8 bg-[var(--premium-accent)]/20" />
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-8xl md:text-[180px] font-black tracking-[-0.08em] leading-[0.8] monolith-text"
                  >
                    NEXUS
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1.2 }}
                    className="text-[var(--premium-text-secondary)] max-w-lg mx-auto text-[10px] md:text-xs font-bold leading-loose tracking-[0.5em] uppercase px-4 pt-4"
                  >
                    The destination of absolute clarity. <br />
                    Refining the modern psyche.
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="w-full"
                >
                  <BookingForm 
                    slots={slots} 
                    upiQRCode={settings.upiQRCode}
                    adminWhatsApp={settings.adminWhatsApp}
                    callMeBotApiKey={settings.callMeBotApiKey}
                    onBookingComplete={handleBooking} 
                  />
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-12 md:pt-24 space-y-12"
                  >
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-12 h-[1px] bg-[var(--premium-text)] mx-auto opacity-20"
                      />
                      <h2 className="text-4xl md:text-8xl font-black tracking-[-0.05em] text-[var(--premium-text)] text-sharp leading-none">
                        Expertise <span className="opacity-20">&</span> <br />
                        Excellence
                      </h2>
                      <div className="flex items-center justify-center gap-4 opacity-40">
                        <span className="text-[10px] font-black text-[var(--premium-text-secondary)] uppercase tracking-[0.8em]">The nexus standard</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                      {settings.infoPages.map((page, index) => (
                        <motion.div
                          key={page.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                        >
                          <GlassCard 
                            className="p-10 group cursor-pointer border-[var(--premium-border)] hover:border-[var(--premium-accent)] transition-all duration-700 hover:shadow-[0_80px_120px_-20px_rgba(0,0,0,0.3)] h-full flex flex-col justify-between ultra-glass"
                            onClick={() => setActivePage(page.id as any)}
                          >
                            <div className="space-y-6 text-left">
                              <div className="w-16 h-16 bg-[var(--premium-accent)]/5 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--premium-accent)] transition-all duration-700">
                                {(() => {
                                  const title = page.title.toLowerCase();
                                  if (title.includes('anxiety') || title.includes('stress')) return <span className="text-2xl">🧠</span>;
                                  if (title.includes('relationship')) return <span className="text-2xl">❤️</span>;
                                  if (title.includes('sleep')) return <span className="text-2xl">🌙</span>;
                                  if (title.includes('career')) return <span className="text-2xl">💼</span>;
                                  if (title.includes('trauma')) return <span className="text-2xl">🛡️</span>;
                                  return <Sparkles size={24} className="text-[var(--premium-accent)] group-hover:text-white" />;
                                })()}
                              </div>
                              <h3 className="text-xl font-bold text-[var(--premium-text)] tracking-tight group-hover:translate-x-1 transition-transform">{page.title}</h3>
                              <p className="text-xs text-[var(--premium-text-secondary)] leading-relaxed line-clamp-3">
                                {page.content.replace(/[#*`]/g, '').slice(0, 150)}...
                              </p>
                            </div>
                            <div className="pt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--premium-accent)]">
                              <span>Read Entry</span>
                              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>

                    {/* Luxury Sign-off */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 2 }}
                      className="pt-24 pb-12 flex flex-col items-center space-y-6"
                    >
                      <div className="w-16 h-[1px] architectural-line" />
                      <div className="flex flex-col items-center">
                        <Leaf size={24} className="text-emerald-500 mb-4 fill-emerald-500/10" />
                        <span className="text-[10px] font-black tracking-[0.8em] text-[var(--premium-text-secondary)] uppercase">NEXUS WELLNESS</span>
                        <div className="mt-4 flex items-center gap-6 opacity-20">
                          <div className="w-12 h-[1px] bg-[var(--premium-text)]" />
                        </div>
                      </div>
                      <p className="text-[8px] font-bold tracking-[0.4em] text-[var(--premium-text-secondary)] uppercase">
                        Established MMXXVI • Curating Excellence
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : currentPage && (
              <motion.div
                key={currentPage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-left"
              >
                <div className="mb-20">
                  <PremiumButton 
                    variant="ghost" 
                    onClick={() => setActivePage('home')} 
                    className="mb-8 p-0 hover:bg-transparent haptic-button !justify-start text-xs font-bold uppercase tracking-widest"
                  >
                    ← Exit Reader
                  </PremiumButton>

                  <div className="space-y-12">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="relative h-[60vh] rounded-[48px] overflow-hidden shadow-2xl border border-[var(--premium-border)]"
                    >
                      <img 
                        src={currentPage.imageUrl || `https://picsum.photos/seed/${currentPage.id}/1200/800`} 
                        alt={currentPage.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-12 left-12 right-12">
                         <motion.h1 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-4"
                        >
                          {currentPage.title}
                        </motion.h1>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest"
                        >
                          <span>Nexus Editorial</span>
                          <div className="w-1 h-1 bg-white/40 rounded-full" />
                          <span>5 Min Read</span>
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                      <div className="md:col-span-8 space-y-8">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="prose prose-xl dark:prose-invert"
                        >
                          <p className="text-xl md:text-2xl text-[var(--premium-text)] leading-relaxed font-normal whitespace-pre-wrap opacity-90 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                            {currentPage.content}
                          </p>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="p-8 rounded-[32px] bg-[var(--premium-accent)]/5 border border-[var(--premium-border)]"
                        >
                          <h4 className="text-lg font-bold mb-4">Therapeutic Insight</h4>
                          <p className="text-sm text-[var(--premium-text-secondary)] leading-relaxed">
                            Every journey to wellness starts with understanding. Our practitioners utilize evidence-based 
                            methodologies to ensure that " {currentPage.title} " is addressed with the utmost precision.
                          </p>
                        </motion.div>
                      </div>

                      <aside className="md:col-span-4 space-y-6">
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="glass-card p-8 sticky top-8"
                        >
                          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Expert Guidance</h3>
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[var(--premium-accent)] rounded-full" />
                              <div>
                                <p className="text-sm font-bold">Dr. Nexus</p>
                                <p className="text-[10px] text-[var(--premium-text-secondary)]">Lead Consultant</p>
                              </div>
                            </div>
                            <PremiumButton onClick={() => setActivePage('home')} size="sm" fullWidth>
                              Schedule Session
                            </PremiumButton>
                          </div>
                        </motion.div>
                      </aside>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 md:py-32 relative z-10 border-t border-[var(--premium-border)] bg-[var(--premium-surface)] px-4"
      >
        <div className="flex items-center justify-center gap-12 md:gap-20 mb-10 md:mb-16">
          <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="group">
            <Instagram size={32} md:size={40} className="text-[#E4405F] transition-all duration-700 group-hover:scale-125" />
          </a>
          <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="group">
            <Linkedin size={32} md:size={40} className="text-[#0077B5] transition-all duration-700 group-hover:scale-125" />
          </a>
          <a href={settings.socialLinks.x} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-[#000000] flex items-center justify-center rounded-xl md:rounded-2xl hover:scale-110 transition-all text-white shadow-xl group">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="opacity-90 group-hover:opacity-100 transition-opacity">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
            </svg>
          </a>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] md:text-sm font-bold text-[var(--premium-text)] opacity-40 uppercase tracking-[0.4em]">Nexus Wellness Sanctuary</p>
          <p className="text-[8px] md:text-[10px] text-[var(--premium-text)]/20 uppercase font-bold tracking-widest leading-none">EST. 2026 • Private Concierge Mental Health</p>
        </div>
      </motion.footer>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLogin(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <div className="relative w-full max-w-sm z-10">
              <GlassCard className="p-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] border-[var(--premium-border)] bg-[var(--premium-glass)] backdrop-blur-3xl">
                <div className="w-16 h-16 bg-[var(--premium-accent)] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                  <Fingerprint size={32} className="text-[var(--premium-bg)]" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-[var(--premium-text)] tracking-tight">Secure Access</h2>
                <p className="text-[10px] text-[var(--premium-accent)] font-bold uppercase tracking-widest text-center mb-8">Enter Nexus Control</p>
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div className="relative group">
                    <input
                      autoFocus
                      type={showPassword ? "text" : "password"}
                      placeholder="Nexus Passphrase"
                      value={adminPasswordInput}
                      onChange={e => setAdminPasswordInput(e.target.value)}
                      className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-5 text-[var(--premium-text)] placeholder:text-[var(--premium-text-secondary)]/40 focus:ring-2 focus:ring-[var(--premium-accent)] outline-none transition-all pr-14"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--premium-text-secondary)] hover:text-[var(--premium-accent)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <PremiumButton fullWidth type="submit">
                      Authenticate
                    </PremiumButton>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setShowAdminLogin(false)}
                    className="w-full py-2 text-xs text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)] transition-colors font-medium haptic-button"
                  >
                    Return to Sanctuary
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
