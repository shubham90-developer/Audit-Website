"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeadershipMember = exports.updateLeadershipMember = exports.createLeadershipMember = exports.updateLeadershipSection = exports.getLeadershipAdmin = exports.getLeadership = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("./model");
const validation_1 = require("./validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const SECTION_FOLDER = "audit-website/leadership/section";
const MEMBER_FOLDER = "audit-website/leadership/members";
const SECTION_FIELDS = {
    en: "bgImageEn",
    ar: "bgImageAr",
};
const MEMBER_FIELDS = {
    en: "imageEn",
    ar: "imageAr",
};
const DEFAULT_SECTION = {
    leadershipTitle: {
        en: "Meet Our Leadership Team",
        ar: "تعرف على فريق القيادة لدينا",
    },
    leadershipDescription: {
        en: "Meet our experienced leadership team, dedicated to delivering excellence, building lasting relationships, and guiding our firm with integrity, expertise, and professionalism.",
        ar: "تعرف على فريق القيادة ذو الخبرة لدينا، الملتزم بتقديم التميز وبناء علاقات طويلة الأمد وقيادة شركتنا بالنزاهة والخبرة والاحترافية.",
    },
    teamTitle: {
        en: "Meet the Team Behind Your Business",
        ar: "تعرف على الفريق الذي يدعم أعمالك",
    },
    teamDescription: {
        en: "The accountants, tax agents and corporate advisers who handle your UAE compliance day to day.",
        ar: "فريق المحاسبين والوكلاء الضريبيين ومستشاري الشركات الذين يدعمون أعمالك ويديرون متطلبات الامتثال اليومية.",
    },
    backgroundImage: {
        en: [],
        ar: [],
    },
};
const zodMessage = (error) => error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
const normalizeBody = (body) => {
    const out = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (/^[\[{]/.test(trimmed)) {
                try {
                    out[key] = JSON.parse(trimmed);
                    continue;
                }
                catch { }
            }
            if (trimmed === "true") {
                out[key] = true;
                continue;
            }
            if (trimmed === "false") {
                out[key] = false;
                continue;
            }
        }
        out[key] = value;
    }
    return out;
};
const toMedia = (items) => items.map((item) => ({
    url: item.url,
    publicId: item.publicId ?? "",
}));
const mediaIds = (list) => (list ?? []).map((item) => item.publicId ?? "").filter(Boolean);
const deleteAll = (ids) => Promise.allSettled(ids.map((id) => (0, upload_1.deleteFromCloudinary)(id, "image")));
// ================= DEFAULT SECTION =================
const ensureDefaults = async () => {
    if (!(await model_1.LeadershipSection.exists({}))) {
        await model_1.LeadershipSection.create(DEFAULT_SECTION);
    }
};
// ================= GET PUBLIC CONTENT =================
// GET /v1/api/leadership
const getLeadership = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, members] = await Promise.all([
            model_1.LeadershipSection.findOne(),
            model_1.LeadershipMember.find({
                isActive: true,
            }).sort({
                order: 1,
                createdAt: 1,
            }),
        ]);
        res.status(200).json({
            status: "success",
            data: {
                section,
                featuredLeader: members.find((m) => m.isFeatured) ?? null,
                members: members.filter((m) => !m.isFeatured),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.getLeadership = getLeadership;
// ================= GET ADMIN CONTENT =================
// GET /v1/api/leadership/admin
const getLeadershipAdmin = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, members] = await Promise.all([
            model_1.LeadershipSection.findOne(),
            model_1.LeadershipMember.find().sort({
                order: 1,
                createdAt: 1,
            }),
        ]);
        res.status(200).json({
            status: "success",
            data: {
                section,
                members,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.getLeadershipAdmin = getLeadershipAdmin;
// ================= UPDATE SECTION =================
// PATCH /v1/api/leadership/section
const updateLeadershipSection = async (req, res) => {
    try {
        const parsed = validation_1.updateLeadershipSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: zodMessage(parsed.error),
            });
            return;
        }
        await ensureDefaults();
        const section = await model_1.LeadershipSection.findOne();
        if (!section) {
            res.status(404).json({
                status: "error",
                message: "Leadership section not found",
            });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[SECTION_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const path = `backgroundImage.${lang}`;
            toDelete.push(...mediaIds(section.get(path)));
            const uploaded = await (0, upload_1.uploadMany)(incoming, SECTION_FOLDER, "image");
            section.set(path, toMedia(uploaded));
        }
        await section.save();
        await deleteAll(toDelete);
        res.status(200).json({
            status: "success",
            data: section,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.updateLeadershipSection = updateLeadershipSection;
// ================= CREATE MEMBER =================
// POST /v1/api/leadership/members
const createLeadershipMember = async (req, res) => {
    try {
        const parsed = validation_1.createLeadershipMemberSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: zodMessage(parsed.error),
            });
            return;
        }
        const files = req.files;
        const image = {
            en: await (0, upload_1.uploadMany)(files?.[MEMBER_FIELDS.en], MEMBER_FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[MEMBER_FIELDS.ar], MEMBER_FOLDER, "image"),
        };
        // Only one featured leader is allowed.
        if (parsed.data.isFeatured) {
            await model_1.LeadershipMember.updateMany({ isFeatured: true }, { $set: { isFeatured: false } });
        }
        const member = await model_1.LeadershipMember.create({
            ...parsed.data,
            image: {
                en: toMedia(image.en),
                ar: toMedia(image.ar),
            },
        });
        res.status(201).json({
            status: "success",
            data: member,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.createLeadershipMember = createLeadershipMember;
// ================= UPDATE MEMBER =================
// PATCH /v1/api/leadership/members/:id
const updateLeadershipMember = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid member id",
            });
            return;
        }
        const parsed = validation_1.updateLeadershipMemberSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: zodMessage(parsed.error),
            });
            return;
        }
        const member = await model_1.LeadershipMember.findById(id);
        if (!member) {
            res.status(404).json({
                status: "error",
                message: "Member not found",
            });
            return;
        }
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[MEMBER_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const path = `image.${lang}`;
            toDelete.push(...mediaIds(member.get(path)));
            const uploaded = await (0, upload_1.uploadMany)(incoming, MEMBER_FOLDER, "image");
            member.set(path, toMedia(uploaded));
        }
        // Remove featured status from other members.
        if (parsed.data.isFeatured === true) {
            await model_1.LeadershipMember.updateMany({
                _id: { $ne: id },
                isFeatured: true,
            }, {
                $set: { isFeatured: false },
            });
        }
        member.set(parsed.data);
        await member.save();
        await deleteAll(toDelete);
        res.status(200).json({
            status: "success",
            data: member,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.updateLeadershipMember = updateLeadershipMember;
// ================= DELETE MEMBER =================
// DELETE /v1/api/leadership/members/:id
const deleteLeadershipMember = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid member id",
            });
            return;
        }
        const member = await model_1.LeadershipMember.findByIdAndDelete(id);
        if (!member) {
            res.status(404).json({
                status: "error",
                message: "Member not found",
            });
            return;
        }
        await deleteAll([
            ...mediaIds(member.image.en),
            ...mediaIds(member.image.ar),
        ]);
        res.status(200).json({
            status: "success",
            message: "Team member deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.deleteLeadershipMember = deleteLeadershipMember;
