export type Lang = 'en' | 'ar';
export interface Localized { en: string; ar: string }
export interface Media { url: string; publicId: string }
export interface LocalizedMedia { en: Media[]; ar: Media[] }
export interface ContactCard { key: 'phone'|'email'|'whatsapp'|'address'; label: Localized; value: Localized; href: string; order: number; isActive: boolean }
export interface ContactFeature { icon: 'headphones'|'clock'|'users'|'shield'; title: Localized; description: Localized; order: number; isActive: boolean }
export interface ContactContent {
  heroBadge: Localized; heroTitle: Localized; heroHighlight: Localized; heroDescription: Localized;
  heroBgImage: LocalizedMedia; heroVideo: LocalizedMedia;
  contactCards: ContactCard[];
  sectionBadge: Localized; sectionTitle: Localized; sectionHighlight: Localized;
  sectionDescription: Localized; sectionNote: Localized; sectionBgImage: LocalizedMedia;
  features: ContactFeature[];
  formTitle: Localized; formDescription: Localized; formDisclaimer: Localized;
}
