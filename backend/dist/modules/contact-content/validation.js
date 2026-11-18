"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactContentSchema = void 0;
const zod_1 = require("zod");
const localized = zod_1.z.object({ en: zod_1.z.string(), ar: zod_1.z.string() });
const card = zod_1.z.object({ key: zod_1.z.enum(['phone', 'email', 'whatsapp', 'address']), label: localized, value: localized, href: zod_1.z.string(), order: zod_1.z.number(), isActive: zod_1.z.boolean() });
const feature = zod_1.z.object({ icon: zod_1.z.enum(['headphones', 'clock', 'users', 'shield']), title: localized, description: localized, order: zod_1.z.number(), isActive: zod_1.z.boolean() });
exports.updateContactContentSchema = zod_1.z.object({
    heroBadge: localized, heroTitle: localized, heroHighlight: localized, heroDescription: localized,
    contactCards: zod_1.z.array(card), sectionBadge: localized, sectionTitle: localized, sectionHighlight: localized,
    sectionDescription: localized, sectionNote: localized, features: zod_1.z.array(feature),
    formTitle: localized, formDescription: localized, formDisclaimer: localized,
}).partial().strict();
