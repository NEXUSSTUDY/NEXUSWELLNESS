/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CounselingType = 'Anxiety & Stress' | 'Relationship Issues' | 'Sleep Problems' | 'Trauma Support' | 'Career Counseling' | 'Other';
export type Sex = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
export type ConsultationMode = 'Audio' | 'Video';

export interface Booking {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  sex: Sex;
  counselingType: CounselingType;
  otherDetail?: string;
  consultationMode: ConsultationMode;
  price: number;
  slotId: string;
  timestamp: string;
  status: 'Pending' | 'Confirmed' | 'Canceled';
}

export interface Slot {
  id: string;
  time: string; // e.g., "11:00 AM"
  isActive: boolean;
}

export interface InfoPage {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  x: string;
}

export interface AdminSettings {
  upiQRCode: string; // Base64 or URL
  upiId: string;
  socialLinks: SocialLinks;
  infoPages: InfoPage[];
  adminWhatsApp: string;
  callMeBotApiKey?: string;
  adminPassword: string;
}
