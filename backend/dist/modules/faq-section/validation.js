"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqSectionSchema = exports.localizedSchema = void 0;
const zod_1 = require("zod");
exports.localizedSchema = zod_1.z.object({ en: zod_1.z.string().trim(), ar: zod_1.z.string().trim() });
const mediaSchema = zod_1.z.object({ url: zod_1.z.string(), publicId: zod_1.z.string() });
const questionSchema = zod_1.z.object({ _id: zod_1.z.string().optional(), question: exports.localizedSchema, answer: exports.localizedSchema, order: zod_1.z.number(), active: zod_1.z.boolean() });
const categorySchema = zod_1.z.object({ _id: zod_1.z.string().optional(), name: exports.localizedSchema, order: zod_1.z.number(), active: zod_1.z.boolean(), questions: zod_1.z.array(questionSchema) });
exports.faqSectionSchema = zod_1.z.object({ title: exports.localizedSchema, description: exports.localizedSchema, breadcrumbHome: exports.localizedSchema, exploreLabel: exports.localizedSchema, questionsLabel: exports.localizedSchema, emptyLabel: exports.localizedSchema, ctaTitle: exports.localizedSchema, ctaDescription: exports.localizedSchema, ctaButton: exports.localizedSchema, backgroundImage: zod_1.z.object({ en: mediaSchema, ar: mediaSchema }).optional(), categories: zod_1.z.array(categorySchema) });
