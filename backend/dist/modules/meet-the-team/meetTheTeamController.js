"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeetTheTeam = exports.getMeetTheTeam = void 0;
const meetTheTeam_model_1 = require("./meetTheTeam.model");
const meetTheTeam_validation_1 = require("./meetTheTeam.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDER = "audit-website/meet-the-team/image";
// Cloudinary URLs distinguish image and video using their delivery paths.
const resourceTypeFromUrl = (url) => /\/video\/upload\//.test(url) ? "video" : "image";
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
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await meetTheTeam_model_1.MeetTheTeam.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        const files = req.files;
        const toDelete = [];
        const newlyUploaded = [];
        try {
            // Upload first, then save the new content. Do not remove old files
            // until the MongoDB update has succeeded.
            for (const lang of LANGS) {
                const incoming = files?.[IMAGE_FIELDS[lang]];
                if (!incoming?.length)
                    continue;
                const current = section.get(`image.${lang}`) ?? [];
                toDelete.push(...current
                    .filter((item) => item.publicId)
                    .map((item) => ({
                    publicId: item.publicId,
                    resourceType: resourceTypeFromUrl(item.url),
                })));
                // Existing route limits each language to one file.
                // Detect image/video separately for each language.
                const resourceType = incoming[0].mimetype.startsWith("video/")
                    ? "video"
                    : "image";
                // DEBUG: remove once the issue is found
                console.log(lang, incoming[0].originalname, incoming[0].mimetype, incoming[0].size);
                let added;
                try {
                    added = await (0, upload_1.uploadMany)(incoming, FOLDER, resourceType);
                }
                catch (uploadError) {
                    // Cloudinary rejected the file (bad input), so report it as 400
                    const wrapped = new Error(`${IMAGE_FIELDS[lang]}: ${uploadError?.message ?? "Upload failed"}`);
                    wrapped.statusCode = uploadError?.http_code === 400 ? 400 : 500;
                    throw wrapped;
                }
                newlyUploaded.push(...added.map((item) => ({
                    publicId: item.publicId,
                    resourceType,
                })));
                section.set(`image.${lang}`, toMedia(added));
            }
            section.set(parsed.data);
            await section.save();
        }
        catch (error) {
            // Roll back newly uploaded Cloudinary files on failure, leaving
            // the previously saved MongoDB content and media untouched.
            await Promise.allSettled(newlyUploaded.map((item) => (0, upload_1.deleteFromCloudinary)(item.publicId, item.resourceType)));
            throw error;
        }
        await Promise.allSettled(toDelete.map((item) => (0, upload_1.deleteFromCloudinary)(item.publicId, item.resourceType)));
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res
            .status(error?.statusCode ?? 500)
            .json({ status: "error", message: error.message });
    }
};
exports.updateMeetTheTeam = updateMeetTheTeam;
