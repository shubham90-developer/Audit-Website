/** Shared bilingual and media types. Module response shapes may differ. */
export type Localized<T = string> = { en: T; ar: T };
export interface Media { url: string; publicId?: string }
export type LocalizedMedia = Localized<Media[]>;
export type ContentRecord = Record<string, unknown>;
export interface ApiEnvelope<T> { data: T; success?: boolean; status?: string; message?: string }
