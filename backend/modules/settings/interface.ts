export type Localized = { en: string; ar: string };
export type Media = { url: string; publicId: string };
export interface SiteSettings {
 singleton: string;
 companyName: Localized;
 tagline: Localized;
 address: Localized;
 officeHours: Localized;
 footerDescription: Localized;
 copyright: Localized;
 footerQuickLinksTitle: Localized;
 footerServicesTitle: Localized;
 footerContactTitle: Localized;
 headerFollowTitle: Localized;
 whatsappCta: Localized;
 phone: string;
 alternatePhone: string;
 email: string;
 whatsapp: string;
 googleMapsUrl: string;
 socials: { instagram: string; facebook: string; youtube: string; linkedin: string; x: string };
 logo: Media; footerLogo: Media; favicon: Media;
}
