import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  QrCode, 
  LogOut, 
  Clock, 
  Check, 
  X,
  ChevronRight,
  Calendar,
  Mail,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Link,
  Instagram,
  Linkedin,
  Upload,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { PremiumButton } from './ui/PremiumButton';
import { Slot, Booking, AdminSettings } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface AdminDashboardProps {
  bookings: Booking[];
  slots: Slot[];
  settings: AdminSettings;
  onUpdateSlots: (slots: Slot[]) => void;
  onUpdateSettings: (settings: AdminSettings) => void;
  onDeleteBooking: (id: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ 
  bookings, 
  slots, 
  settings, 
  onUpdateSlots, 
  onUpdateSettings,
  onDeleteBooking,
  onLogout
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'logs' | 'slots' | 'content' | 'settings'>('logs');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);

  const [isSaving, setIsSaving] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateSettings(localSettings);
      setHasUnsavedChanges(false);
      setIsSaving(false);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    }, 800);
  };

  const updateLocalSettings = (newSettings: AdminSettings) => {
    setLocalSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const handleAddSlot = () => {
    if (!newSlotTime) return;
    const newSlot: Slot = {
      id: crypto.randomUUID(),
      time: newSlotTime,
      isActive: true
    };
    onUpdateSlots([...slots, newSlot]);
    setNewSlotTime('');
  };

  const handleDeleteSlot = (id: string) => {
    onUpdateSlots(slots.filter(s => s.id !== id));
  };

  const handleToggleSlot = (id: string) => {
    onUpdateSlots(slots.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleQRCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLocalSettings({ ...localSettings, upiQRCode: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoPageUpdate = (id: string, field: 'content' | 'imageUrl', value: string) => {
    const updatedPages = localSettings.infoPages.map(page => 
      page.id === id ? { ...page, [field]: value } : page
    );
    updateLocalSettings({ ...localSettings, infoPages: updatedPages });
  };

  const handleInfoPageImageUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInfoPageUpdate(id, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match or are empty.');
      return;
    }
    
    // Create the new settings object
    const updatedSettings = { ...localSettings, adminPassword: newPassword };
    
    // Update local state
    setLocalSettings(updatedSettings);
    
    // Persist immediately to the parent/system to ensure login works with new password
    onUpdateSettings(updatedSettings);
    setHasUnsavedChanges(false);
    
    setNewPassword('');
    setConfirmPassword('');
    alert('Sanctuary Passphrase has been permanently updated. Use the new passphrase for future logins.');
  };

  const handleSocialLinkUpdate = (platform: 'instagram' | 'linkedin' | 'x', value: string) => {
    updateLocalSettings({
      ...localSettings,
      socialLinks: { ...localSettings.socialLinks, [platform]: value }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--premium-bg)] pb-32 text-[var(--premium-text)] font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed -top-48 -left-48 w-[600px] h-[600px] bg-[var(--premium-accent)]/10 rounded-full blur-[120px] opacity-60 animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[var(--premium-accent)]/5 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      {/* Admin Header */}
      <div className="bg-[var(--premium-glass)] backdrop-blur-xl border-b border-[var(--premium-border)] px-6 py-6 md:py-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--premium-text)] tracking-tighter">Nexus Admin</h1>
          <p className="text-[9px] md:text-[10px] text-[var(--premium-accent)] font-bold uppercase tracking-widest">Sanctuary Control Center • {bookings.length} Logs</p>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-[var(--premium-accent)] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg haptic-button disabled:opacity-50"
            >
              {isSaving ? "Syncing..." : "Save Changes"}
            </motion.button>
          )}

          <AnimatePresence>
            {showStatus && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 bg-[var(--premium-accent)] text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 backdrop-blur-xl"
              >
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Sanctuary Synced</span>
              </motion.div>
            )}
          </AnimatePresence>
          <PremiumButton variant="secondary" className="px-3 py-2 md:px-4 border-[var(--premium-border)] hover:bg-[var(--premium-bg)]" onClick={onLogout}>
            <LogOut size={16} />
          </PremiumButton>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 md:mt-8 space-y-6 md:space-y-8">
        {/* Navigation Tabs */}
        <div className="flex bg-[var(--premium-surface)] p-1 rounded-2xl gap-1 overflow-x-auto no-scrollbar border border-[var(--premium-border)] backdrop-blur-md">
          {[
            { id: 'logs', label: 'Logs', icon: Users },
            { id: 'slots', label: 'Slots', icon: Clock },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 md:px-6 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all min-w-fit whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-[var(--premium-accent)] text-white shadow-xl shadow-[var(--premium-accent)]/20" 
                  : "text-[var(--premium-text-secondary)] hover:text-[var(--premium-text)] hover:bg-[var(--premium-bg)]"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--premium-text)] tracking-tight">Nexus Wellness</h2>
                  <p className="text-[9px] md:text-[10px] font-bold text-[var(--premium-accent)] uppercase tracking-[0.4em] opacity-60">Operations Registry</p>
                </div>
                <div className="bg-[var(--premium-accent)]/10 px-4 py-2 rounded-full border border-[var(--premium-accent)]/20">
                   <p className="text-[9px] md:text-[10px] font-bold text-[var(--premium-accent)] uppercase tracking-widest">{bookings.length} Sessions</p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-20 text-[var(--premium-text-secondary)]/40">
                  <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold tracking-widest uppercase text-[10px]">No bookings recorded</p>
                </div>
              ) : (
                bookings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(booking => (
                  <div key={booking.id}>
                    <GlassCard className="p-5 md:p-6 transition-all hover:translate-y-[-2px] bg-[var(--premium-surface)] border-[var(--premium-border)] group shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-[var(--premium-text)]">{booking.name}</h3>
                            <span className={cn(
                              "text-[8px] md:text-[10px] uppercase font-bold px-3 py-1 rounded-full",
                              booking.status === 'Confirmed' ? "bg-[var(--premium-accent)] text-white" : "bg-[var(--premium-text-secondary)]/10 text-[var(--premium-text-secondary)] border border-[var(--premium-border)]"
                            )}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-[9px] md:text-[10px] text-[var(--premium-text-secondary)] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-[var(--premium-accent)]" /> {booking.email}</span>
                            <span className="flex items-center gap-1.5"><MessageSquare size={12} className="text-[var(--premium-accent)]" /> {booking.whatsapp}</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right flex flex-col md:items-end w-full md:w-auto">
                          <p className="text-[9px] md:text-[10px] font-bold text-[var(--premium-text-secondary)] uppercase tracking-widest">
                            {format(new Date(booking.timestamp), 'MMM dd, HH:mm')}
                          </p>
                          <p className="text-sm font-bold text-[var(--premium-text)] mt-1 opacity-80">
                            {booking.counselingType} {booking.otherDetail ? `(${booking.otherDetail})` : ''} • <span className="text-[var(--premium-accent)] font-extrabold">{slots.find(s => s.id === booking.slotId)?.time}</span>
                          </p>
                          <p className="text-[9px] md:text-[10px] font-bold text-[var(--premium-accent)] uppercase tracking-tighter mt-1 opacity-60">
                            {booking.consultationMode} Mode • ₹{booking.price}
                          </p>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this session record?')) {
                                onDeleteBooking(booking.id);
                              }
                            }}
                            className="mt-4 p-2 text-[var(--premium-text-secondary)] hover:text-red-500 transition-colors opacity-60 hover:opacity-100 flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest self-start md:self-end"
                          >
                            <Trash2 size={12} /> Delete Record
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'slots' && (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <GlassCard className="p-6 md:p-8 bg-[var(--premium-glass)] border-[var(--premium-border)]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--premium-text)]">
                  <Clock size={18} className="text-[var(--premium-accent)]" /> Time Slots
                </h3>
                <div className="flex gap-3 mb-10">
                  <input
                    type="text"
                    placeholder="e.g. 11:00 AM"
                    value={newSlotTime}
                    onChange={e => setNewSlotTime(e.target.value)}
                    className="flex-1 bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-4 text-sm text-[var(--premium-text)] outline-none focus:ring-2 focus:ring-[var(--premium-accent)] transition-all"
                  />
                  <PremiumButton onClick={handleAddSlot} className="px-6 md:px-8">
                    <Plus size={18} />
                  </PremiumButton>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-4 bg-[var(--premium-surface)] rounded-2xl border border-[var(--premium-border)] group hover:border-[var(--premium-accent)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", slot.isActive ? "bg-[var(--premium-accent)] shadow-[0_0_8px_var(--premium-accent)]" : "bg-[var(--premium-text-secondary)]/30")} />
                        <span className="font-bold text-[var(--premium-text)]">{slot.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleSlot(slot.id)}
                          className={cn(
                            "p-2 rounded-xl transition-all",
                            slot.isActive ? "bg-[var(--premium-accent)]/10 text-[var(--premium-text)]" : "bg-[var(--premium-bg)] text-[var(--premium-text-secondary)]"
                          )}
                        >
                          {slot.isActive ? <Check size={16} /> : <X size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 md:space-y-8"
            >
              {localSettings.infoPages.map(page => (
                <div key={page.id}>
                  <GlassCard className="p-6 md:p-10 bg-[var(--premium-glass)] border-[var(--premium-border)]">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-[var(--premium-text)]">
                      <FileText size={22} className="text-[var(--premium-accent)]" /> {page.title}
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2.5 block tracking-[0.2em]">Narrative Content</label>
                        <textarea
                          rows={6}
                          value={page.content}
                          onChange={e => handleInfoPageUpdate(page.id, 'content', e.target.value)}
                          className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-3xl px-6 py-5 text-[var(--premium-text)] text-sm focus:ring-2 focus:ring-[var(--premium-accent)] outline-none transition-all resize-none font-medium leading-relaxed"
                          placeholder="Compose narrative..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2.5 block tracking-[0.2em]">Visual Assets</label>
                        <div className="flex flex-col gap-4">
                          <input
                            type="text"
                            value={page.imageUrl || ''}
                            onChange={e => handleInfoPageUpdate(page.id, 'imageUrl', e.target.value)}
                            className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-4 text-sm text-[var(--premium-text)] focus:ring-2 focus:ring-[var(--premium-accent)] outline-none transition-all"
                            placeholder="Image URL"
                          />
                          <div className="flex items-center gap-4">
                            <label className="flex-1 h-12 bg-[var(--premium-surface)] border border-[var(--premium-border)] rounded-2xl flex items-center justify-center cursor-pointer hover:bg-[var(--premium-bg)] transition-all group px-4">
                              <Upload size={18} className="text-[var(--premium-accent)] mr-2" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--premium-text-secondary)]">Upload File</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleInfoPageImageUpload(page.id, e)}
                              />
                            </label>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-[var(--premium-border)]">
                              {page.imageUrl ? (
                                <img src={page.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <ImageIcon size={20} className="text-[var(--premium-text-secondary)]/30" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Payment Section */}
              <GlassCard className="p-6 md:p-8 bg-[var(--premium-accent)]/5 border-[var(--premium-border)]">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-[var(--premium-text)]">
                  <QrCode size={18} className="text-[var(--premium-accent)]" /> Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2 block tracking-widest">WhatsApp Admin</label>
                      <input
                        type="text"
                        value={localSettings.adminWhatsApp}
                        onChange={e => updateLocalSettings({ ...localSettings, adminWhatsApp: e.target.value })}
                        className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--premium-accent)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2 block tracking-widest">UPI Identity</label>
                      <input
                        type="text"
                        value={localSettings.upiId}
                        onChange={e => updateLocalSettings({ ...localSettings, upiId: e.target.value })}
                        className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--premium-accent)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2 block tracking-widest">UPI QR Sync</label>
                      <label className="w-full h-14 flex items-center justify-center bg-[var(--premium-surface)] border border-dashed border-[var(--premium-border)] rounded-2xl cursor-pointer hover:bg-[var(--premium-accent)]/5 transition-all px-4 text-center">
                        <span className="text-[10px] font-bold text-[var(--premium-text-secondary)] uppercase tracking-widest">Replace Visual Hash</span>
                        <input type="file" accept="image/*" onChange={handleQRCodeChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-8 bg-[var(--premium-surface)] rounded-[32px] border border-[var(--premium-border)] relative">
                    <p className="text-[9px] font-bold text-[var(--premium-accent)] uppercase mb-6 tracking-[0.3em]">Operational Identity</p>
                    <div className="p-4 bg-white rounded-3xl shadow-2xl">
                      <img 
                        src={localSettings.upiQRCode || 'https://picsum.photos/seed/qr/300/300'} 
                        alt="Active QR" 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[10px] text-[var(--premium-text-secondary)] italic mt-6">{localSettings.upiId}</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--premium-border)] flex justify-end">
                  <PremiumButton 
                    onClick={handleSaveAll}
                    disabled={!hasUnsavedChanges || isSaving}
                    variant={hasUnsavedChanges ? "primary" : "secondary"}
                    className={cn(
                      "px-8 md:px-12",
                      hasUnsavedChanges && "animate-pulse"
                    )}
                  >
                    {isSaving ? "Synchronizing..." : "Update Configuration"}
                  </PremiumButton>
                </div>
              </GlassCard>

              {/* Password Section */}
              <GlassCard className="p-6 md:p-8 bg-[var(--premium-glass)] border-[var(--premium-border)] shadow-xl">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-[var(--premium-text)]">
                  <Lock size={18} className="text-[var(--premium-accent)]" /> Security Protocol
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2 block tracking-widest">New Sanctuary Passphrase</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--premium-accent)] outline-none pr-12"
                      />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--premium-text-secondary)]">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[var(--premium-text-secondary)] mb-2 block tracking-widest">Confirm Policy</label>
                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--premium-accent)] outline-none"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <PremiumButton onClick={handlePasswordChange} className="px-10 w-full md:w-auto">
                    Stage Access Policy
                  </PremiumButton>
                </div>
              </GlassCard>

              {/* Social Section */}
              <GlassCard className="p-6 md:p-8 bg-[var(--premium-glass)] border-[var(--premium-border)]">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-[var(--premium-text)]">
                  <Instagram size={18} className="text-[var(--premium-accent)]" /> Social Identity
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {['instagram', 'linkedin', 'x'].map(platform => (
                    <div key={platform} className="space-y-2">
                       <span className="text-[10px] font-bold text-[var(--premium-text-secondary)] uppercase tracking-widest">{platform}</span>
                       <input
                         type="text"
                         value={(localSettings.socialLinks as any)[platform]}
                         onChange={e => handleSocialLinkUpdate(platform as any, e.target.value)}
                         className="w-full bg-[var(--premium-bg)] border border-[var(--premium-border)] rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[var(--premium-accent)]"
                       />
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-[var(--premium-border)] flex flex-col items-center gap-4">
                  <p className="text-[10px] text-[var(--premium-text-secondary)] font-bold uppercase tracking-widest text-center">
                    Commit all changes to the cloud sanctuary
                  </p>
                  <PremiumButton 
                    fullWidth 
                    size="lg" 
                    onClick={handleSaveAll}
                    disabled={!hasUnsavedChanges || isSaving}
                    variant={hasUnsavedChanges ? "primary" : "secondary"}
                    className={cn(
                      "shadow-2xl transition-all duration-500 py-6",
                      hasUnsavedChanges ? "animate-pulse-slow ring-4 ring-[var(--premium-accent)]/10" : "opacity-50"
                    )}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">Synchronizing Sanctuary...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Upload size={20} />
                        Commit & Synchronize All Settings
                      </span>
                    )}
                  </PremiumButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Save Fab for Mobile */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-[60] md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveAll}
            className="bg-[var(--premium-accent)] text-white p-4 rounded-full shadow-2xl flex items-center gap-2"
          >
            <Check size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest pr-2">Save Sync</span>
          </motion.button>
        </div>
      )}
      {/* Quick Stats Grid */}
      {activeTab === 'logs' && bookings.length > 0 && (
        <div className="mt-8 px-4 grid grid-cols-2 gap-6 max-w-4xl mx-auto pb-12">
          <div className="bg-[var(--premium-surface)] backdrop-blur-md p-8 rounded-[32px] border border-[var(--premium-border)] shadow-xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--premium-accent)]/5 blur-2xl rounded-full transition-all group-hover:bg-[var(--premium-accent)]/10" />
            <p className="text-[10px] font-bold text-[var(--premium-text-secondary)] uppercase mb-2 tracking-[0.2em] relative z-10">Success Index</p>
            <p className="text-4xl font-bold text-[var(--premium-text)] relative z-10 tracking-tighter">84%</p>
          </div>
          <div className="bg-[var(--premium-surface)] backdrop-blur-md p-8 rounded-[32px] border border-[var(--premium-border)] shadow-xl overflow-hidden relative group text-right">
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[var(--premium-accent)]/5 blur-2xl rounded-full transition-all group-hover:bg-[var(--premium-accent)]/10" />
            <p className="text-[10px] font-bold text-[var(--premium-text-secondary)] uppercase mb-2 tracking-[0.2em] relative z-10">Active Readiness</p>
            <p className="text-4xl font-bold text-[var(--premium-accent)] relative z-10 tracking-tighter">{slots.filter(s => s.isActive).length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
