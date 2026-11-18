import { z } from 'zod';
const localized = z.object({ en: z.string(), ar: z.string() });
const card = z.object({ key: z.enum(['phone','email','whatsapp','address']), label: localized, value: localized, href: z.string(), order: z.number(), isActive: z.boolean() });
const feature = z.object({ icon: z.enum(['headphones','clock','users','shield']), title: localized, description: localized, order: z.number(), isActive: z.boolean() });
export const updateContactContentSchema = z.object({
 heroBadge: localized, heroTitle: localized, heroHighlight: localized, heroDescription: localized,
 contactCards: z.array(card), sectionBadge: localized, sectionTitle: localized, sectionHighlight: localized,
 sectionDescription: localized, sectionNote: localized, features: z.array(feature),
 formTitle: localized, formDescription: localized, formDisclaimer: localized,
}).partial().strict();
