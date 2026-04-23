import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, MessageSquare, Users, Clock, ArrowRight, CheckCircle2, ChevronRight, QrCode } from 'lucide-react';
import { PremiumButton } from './ui/PremiumButton';
import { GlassCard } from './ui/GlassCard';
import { cn, formatWhatsAppLink } from '../lib/utils';
import { CounselingType, Sex, Slot, Booking, ConsultationMode } from '../types';
import emailjs from '@emailjs/browser';

interface BookingFormProps {
  slots: Slot[];
  upiQRCode: string;
  adminWhatsApp: string;
  callMeBotApiKey?: string;
  onBookingComplete: (booking: Booking) => void;
}

export function BookingForm({ slots, upiQRCode, adminWhatsApp, callMeBotApiKey, onBookingComplete }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '+91',
    sex: '' as Sex,
    counselingType: '' as CounselingType | 'Other',
    otherDetail: '',
    consultationMode: '' as ConsultationMode | '',
    price: 0,
    slotId: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const counselingTypes = [
    { name: 'Career Counseling', icon: '💼' },
    { name: 'Anxiety & Stress', icon: '🧠' },
    { name: 'Relationship Issues', icon: '❤️' },
    { name: 'Sleep Problems', icon: '🌙' },
    { name: 'Trauma Support', icon: '🛡️' },
    { name: 'Other', icon: '✨' }
  ];
  const sexes: Sex[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const booking: Booking = {
        id: crypto.randomUUID(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };

      // Bookings are now only stored in the Admin Dashboard logs
      onBookingComplete(booking);
      setStep(4);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    whatsapp: false
  });

  const handleWhatsAppChange = (val: string) => {
    // Keep +91 prefix
    let formatted = val;
    if (!val.startsWith('+91')) {
      formatted = '+91' + val.replace(/^\+?91?/, '');
    }
    
    // Max 10 digits after +91 (Total 13 chars: +91 + 10 digits)
    const digitsOnly = formatted.slice(3).replace(/\D/g, '');
    const limitedDigits = digitsOnly.slice(0, 10);
    
    setFormData(d => ({ ...d, whatsapp: '+91' + limitedDigits }));
  };

  const isEmailValid = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isNameValid = formData.name.trim().length >= 3;
  const isWhatsAppValid = formData.whatsapp.length === 13;

  const isStep1Valid = isNameValid && isEmailValid(formData.email) && isWhatsAppValid;

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) {
      setTouched({ name: true, email: true, whatsapp: true });
      return;
    }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-12 md:py-24">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--premium-accent)]/5 blur-3xl rounded-full pointer-events-none" />
            <GlassCard className="p-8 md:p-16 border-[var(--premium-border)]">
              <div className="space-y-10">
                <div className="text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                  >
                    <User size={32} className="text-[var(--premium-accent)]" />
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-bold text-[var(--premium-text)] tracking-tighter">Begin Your Journey</h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1 w-12 bg-[var(--premium-accent)] rounded-full" />
                    <p className="text-[10px] font-bold text-[var(--premium-accent)] uppercase tracking-widest">Personal Identification</p>
                    <span className="h-1 w-12 bg-[var(--premium-accent)] rounded-full opacity-20" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--premium-text-secondary)] mb-3 block px-2">Legal Identity</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onBlur={() => setTouched(t => ({ ...t, name: true }))}
                      onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                      placeholder="Full Name"
                      className={cn(
                        "w-full bg-[var(--premium-surface)] border rounded-[24px] px-8 py-6 text-[var(--premium-text)] placeholder:text-[var(--premium-text-secondary)]/30 focus:ring-2 outline-none transition-all duration-500",
                        touched.name && !isNameValid ? "border-red-500/50 ring-red-500/10" : "border-[var(--premium-border)] focus:ring-[var(--premium-accent)]/10 focus:border-[var(--premium-accent)]"
                      )}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {isNameValid && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="group overflow-hidden"
                      >
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--premium-text-secondary)] mb-3 block px-2 pt-4">Digital Portal (Email)</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onBlur={() => setTouched(t => ({ ...t, email: true }))}
                          onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                          placeholder="john@nexus.premium"
                          className={cn(
                            "w-full bg-[var(--premium-surface)] border rounded-[24px] px-8 py-6 text-[var(--premium-text)] placeholder:text-[var(--premium-text-secondary)]/30 focus:ring-2 outline-none transition-all duration-500",
                            touched.email && !isEmailValid(formData.email) ? "border-red-500/50 ring-red-500/10" : "border-[var(--premium-border)] focus:ring-[var(--premium-accent)]/10 focus:border-[var(--premium-accent)]"
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isEmailValid(formData.email) && isNameValid && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="group overflow-hidden"
                      >
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--premium-text-secondary)] mb-3 block px-2 pt-4">Nexus Terminal (WhatsApp)</label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsapp}
                          onBlur={() => setTouched(t => ({ ...t, whatsapp: true }))}
                          onChange={e => handleWhatsAppChange(e.target.value)}
                          placeholder="+91 00000 00000"
                          className={cn(
                            "w-full bg-[var(--premium-surface)] border rounded-[24px] px-8 py-6 text-[var(--premium-text)] placeholder:text-[var(--premium-text-secondary)]/30 focus:ring-2 outline-none transition-all duration-500",
                            touched.whatsapp && !isWhatsAppValid ? "border-red-500/50 ring-red-500/10" : "border-[var(--premium-border)] focus:ring-[var(--premium-accent)]/10 focus:border-[var(--premium-accent)]"
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <PremiumButton 
                  fullWidth 
                  size="lg"
                  onClick={nextStep}
                  disabled={!isStep1Valid}
                  className="rounded-[24px] py-8 text-xs font-black shadow-2xl"
                >
                  Confirm & Advance <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </PremiumButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative"
          >
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--premium-accent)]/5 blur-3xl rounded-full pointer-events-none" />
            <GlassCard className="p-8 md:p-16 border-[var(--premium-border)]">
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                  >
                    <Clock size={32} className="text-[var(--premium-accent)]" />
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-bold text-[var(--premium-text)] tracking-tighter">Choose Your Path</h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1 w-12 bg-[var(--premium-accent)] rounded-full opacity-20" />
                    <p className="text-[10px] font-bold text-[var(--premium-accent)] uppercase tracking-widest">Step 2 of 3</p>
                    <span className="h-1 w-12 bg-[var(--premium-accent)] rounded-full opacity-20" />
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--premium-text-secondary)] text-center block">Select Gender</label>
                    <div className="grid grid-cols-2 gap-4">
                      {sexes.map(sex => (
                        <button
                          key={sex}
                          onClick={() => setFormData(d => ({ ...d, sex }))}
                          className={cn(
                            "py-5 px-4 rounded-[20px] text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 haptic-button",
                            formData.sex === sex 
                              ? "bg-[var(--premium-accent)] text-white border-[var(--premium-accent)] shadow-xl" 
                              : "bg-[var(--premium-surface)] border-[var(--premium-border)] text-[var(--premium-text-secondary)] hover:bg-[var(--premium-bg)] hover:text-[var(--premium-text)]"
                          )}
                        >
                          {sex}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.sex && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--premium-text-secondary)] text-center block pt-4">Discipline</label>
                        <div className="grid grid-cols-1 gap-3">
                          {counselingTypes.map(type => (
                            <button
                              key={type.name}
                              onClick={() => setFormData(d => ({ ...d, counselingType: type.name as any }))}
                              className={cn(
                                "w-full py-5 px-8 rounded-[20px] text-[10px] font-bold uppercase tracking-widest border flex items-center justify-between transition-all duration-500 haptic-button",
                                formData.counselingType === type.name 
                                  ? "bg-[var(--premium-accent)] text-white border-[var(--premium-accent)] shadow-xl" 
                                  : "bg-[var(--premium-surface)] border-[var(--premium-border)] text-[var(--premium-text-secondary)] hover:bg-[var(--premium-bg)] hover:text-[var(--premium-text)]"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{type.icon}</span>
                                {type.name}
                              </div>
                              {formData.counselingType === type.name && <CheckCircle2 size={18} />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {formData.counselingType && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--premium-text-secondary)] text-center block pt-4">Session Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { mode: 'Audio' as const, price: 300, icon: MessageSquare },
                            { mode: 'Video' as const, price: 500, icon: Users }
                          ].map(({ mode, price, icon: Icon }) => (
                            <button
                              key={mode}
                              onClick={() => setFormData(d => ({ ...d, consultationMode: mode, price }))}
                              className={cn(
                                "py-6 px-4 rounded-[24px] border transition-all duration-500 flex flex-col items-center gap-3 haptic-button",
                                formData.consultationMode === mode 
                                  ? "bg-[var(--premium-accent)] text-white border-[var(--premium-accent)] shadow-xl" 
                                  : "bg-[var(--premium-surface)] border-[var(--premium-border)] text-[var(--premium-text-secondary)] hover:bg-[var(--premium-bg)] hover:text-[var(--premium-text)]"
                              )}
                            >
                              <Icon size={24} className={formData.consultationMode === mode ? "text-white" : "text-[var(--premium-accent)]"} />
                              <div className="text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">{mode}</span>
                                <span className="text-xs font-medium opacity-60 italic">₹ {price}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {formData.consultationMode && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--premium-text-secondary)] text-center block pt-4">Available Slots</label>
                        <div className="grid grid-cols-2 gap-3 pb-4">
                          {slots.filter(s => s.isActive).map(slot => (
                            <button
                              key={slot.id}
                              onClick={() => setFormData(d => ({ ...d, slotId: slot.id }))}
                              className={cn(
                                "py-4 px-4 rounded-[16px] text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 haptic-button",
                                formData.slotId === slot.id 
                                  ? "bg-[var(--premium-accent)] text-white border-[var(--premium-accent)] shadow-lg" 
                                  : "bg-white/5 border-[var(--premium-border)] text-[var(--premium-text-secondary)] hover:bg-[var(--premium-accent)]/5 hover:text-[var(--premium-text)]"
                              )}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-4">
                  <PremiumButton 
                    fullWidth 
                    size="lg"
                    onClick={nextStep}
                    disabled={!formData.sex || !formData.counselingType || (formData.counselingType === 'Other' && !formData.otherDetail.trim()) || !formData.consultationMode || !formData.slotId}
                    className="rounded-[24px] py-8 text-xs font-black shadow-2xl"
                  >
                    Proceed to Payment <ArrowRight size={20} className="ml-2" />
                  </PremiumButton>
                  <button onClick={prevStep} className="text-[10px] font-bold uppercase tracking-widest text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)] transition-colors py-2">
                    Review Details
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--premium-accent)]/10 blur-3xl rounded-full pointer-events-none" />
            <GlassCard className="p-8 md:p-16 border-[var(--premium-border)]">
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <QrCode size={40} className="text-[var(--premium-accent)]" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-[var(--premium-text)] tracking-tighter">Finalize</h2>
                  <p className="text-[10px] font-bold text-[var(--premium-accent)] uppercase tracking-widest">Step 3 of 3</p>
                </div>

                <div className="bg-[var(--premium-bg)]/80 backdrop-blur-xl rounded-[40px] p-10 border border-[var(--premium-border)] flex flex-col items-center shadow-inner">
                  <div className="bg-white p-6 rounded-[32px] shadow-3xl mb-10 border border-black/5 hover:scale-105 transition-transform duration-700">
                    <img 
                      src={upiQRCode || 'https://picsum.photos/seed/qr/300/300'} 
                      alt="Nexus Pay" 
                      className="w-48 h-48 rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-5xl font-black text-[var(--premium-text)] tracking-tighter">₹ {formData.price.toFixed(2)}</p>
                    <p className="text-[10px] text-[var(--premium-accent)] font-bold uppercase tracking-[0.4em] opacity-60">Inclusive of Premium Tax</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-6 py-2 group cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                    termsAccepted ? "bg-[var(--premium-accent)] border-[var(--premium-accent)]" : "border-[var(--premium-border)] bg-white/5"
                  )}>
                    {termsAccepted && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <p className="text-[10px] sm:text-xs font-medium text-[var(--premium-text-secondary)] group-hover:text-[var(--premium-text)] transition-colors italic">
                    I acknowledge and accept the <span className="text-[var(--premium-accent)] font-bold underline cursor-pointer">Terms of Service</span> & Nexus Privacy Guidelines.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <PremiumButton 
                    fullWidth 
                    size="lg"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || !formData.slotId || !formData.consultationMode || !formData.price || !termsAccepted}
                    className="rounded-[24px] py-8 text-xs font-black shadow-2xl"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Confirm Payment & Sync'}
                  </PremiumButton>
                  <button onClick={prevStep} className="text-[10px] font-bold uppercase tracking-widest text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)] transition-colors py-2">
                    Modify Requirements
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <GlassCard className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-24 h-24 bg-[var(--premium-accent)] text-[var(--premium-bg)] rounded-[24px] flex items-center justify-center mx-auto mb-10 shadow-3xl rotate-12"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-[var(--premium-text)] tracking-tighter">Session Dispatched</h2>
              <p className="text-[var(--premium-text-secondary)] mb-10 leading-loose italic font-medium">
                Your request has been securely stored. <br />
                A Nexus Wellness representative will contact you shortly.
              </p>
              <div className="flex flex-col gap-4">
                <PremiumButton fullWidth size="lg" onClick={() => (window.location.href = '/')}>
                  Return to Sanctuary
                </PremiumButton>
                <button 
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[var(--premium-text-secondary)] hover:text-[var(--premium-accent)] transition-colors uppercase tracking-[0.2em]"
                >
                  Book New Session
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
