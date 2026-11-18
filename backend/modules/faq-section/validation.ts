import { z } from 'zod'
export const localizedSchema = z.object({ en: z.string().trim(), ar: z.string().trim() })
const mediaSchema = z.object({ url: z.string(), publicId: z.string() })
const questionSchema = z.object({ _id: z.string().optional(), question: localizedSchema, answer: localizedSchema, order: z.number(), active: z.boolean() })
const categorySchema = z.object({ _id: z.string().optional(), name: localizedSchema, order: z.number(), active: z.boolean(), questions: z.array(questionSchema) })
export const faqSectionSchema = z.object({ title: localizedSchema, description: localizedSchema, breadcrumbHome: localizedSchema, exploreLabel: localizedSchema, questionsLabel: localizedSchema, emptyLabel: localizedSchema, ctaTitle: localizedSchema, ctaDescription: localizedSchema, ctaButton: localizedSchema, backgroundImage: z.object({ en: mediaSchema, ar: mediaSchema }).optional(), categories: z.array(categorySchema) })
