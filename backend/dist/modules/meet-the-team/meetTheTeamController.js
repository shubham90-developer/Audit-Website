"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeetTheTeam = exports.getMeetTheTeam = void 0;
const meetTheTeam_model_1 = require("./meetTheTeam.model");
const meetTheTeam_validation_1 = require("./meetTheTeam.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDER = "audit-website/meet-the-team/image";
const IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" };
// ---- Default content, inserted only when the collection is empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_CONTENT = {
    leftTitle: {
        en: "The team you'll actually work with",
        ar: "الفريق الذي ستعمل معه فعليًا",
    },
    scriptTitle: {
        en: "People Behind Your Progress",
        ar: "الأشخاص وراء تقدمك",
    },
    watermark: {
        en: "Auditing • Tax • Accounting",
        ar: "التدقيق • الضرائب • المحاسبة",
    },
};
const ensureDefaults = async () => {
    if (!(await meetTheTeam_model_1.MeetTheTeam.exists({}))) {
        await meetTheTeam_model_1.MeetTheTeam.create({ ...DEFAULT_CONTENT, image: { en: [], ar: [] } });
    }
};
const zodMessage = (error) => error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
// Multipart sends nested objects as JSON strings. Parse them back.
const normalizeBody = (body) => {
    const out = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
            try {
                out[key] = JSON.parse(value);
                continue;
            }
            catch {
                // not JSON, keep the raw value and let validation report it
            }
        }
        out[key] = value;
    }
    return out;
};
const toMedia = (items) => items.map((x) => ({ url: x.url, publicId: x.publicId }));
// GET /v1/api/meet-the-team (public)
const getMeetTheTeam = async (_req, res) => {
    try {
        await ensureDefaults();
        const section = await meetTheTeam_model_1.MeetTheTeam.findOne();
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getMeetTheTeam = getMeetTheTeam;
// PATCH /v1/api/meet-the-team (admin, multipart/form-data)
// Uploading an image replaces the old one for that language
const updateMeetTheTeam = async (req, res) => {
    try {
        const parsed = meetTheTeam_validation_1.updateMeetTheTeamSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await meetTheTeam_model_1.MeetTheTeam.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[IMAGE_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const current = section.get(`image.${lang}`) ?? [];
            toDelete.push(...current.map((x) => x.publicId));
            const added = await (0, upload_1.uploadMany)(incoming, FOLDER, "image");
            section.set(`image.${lang}`, toMedia(added));
        }
        await section.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateMeetTheTeam = updateMeetTheTeam;
