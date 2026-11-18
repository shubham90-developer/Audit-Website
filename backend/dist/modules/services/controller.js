"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("./model");
const validation_1 = require("./validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDERS = {
    image: "audit-website/services/images",
    video: "audit-website/services/videos",
};
const MEDIA_FIELDS = [
    "iconImg",
    "cardImg",
    "mainImg",
    "bgImage",
    "bgVideo",
];
const normalizeBody = (body) => {
    const result = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
            try {
                if (/^[\[{]/.test(value.trim())) {
                    result[key] = JSON.parse(value);
                    continue;
                }
            }
            catch {
                // Keep original value
            }
        }
        result[key] = value;
    }
    return result;
};
const toMedia = (items) => items.map((item) => ({
    url: item.url,
    publicId: item.publicId ?? "",
}));
const mediaIds = (items = []) => items.map((item) => item.publicId).filter(Boolean);
const deleteMedia = async (ids, type) => {
    await Promise.allSettled(ids.map((id) => (0, upload_1.deleteFromCloudinary)(id, type)));
};
const getFiles = (req) => req.files;
const uploadField = async (files, fieldName, folder, type) => {
    const selected = files.filter((file) => file.fieldname === fieldName);
    if (!selected.length)
        return [];
    const uploaded = await (0, upload_1.uploadMany)(selected, folder, type);
    return toMedia(uploaded);
};
const getMediaType = (field) => field === "bgVideo" ? "video" : "image";
const getFolder = (field) => field === "bgVideo" ? FOLDERS.video : FOLDERS.image;
// GET /services
const getServices = async (_req, res) => {
    try {
        const services = await model_1.Service.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            data: services,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.getServices = getServices;
// GET /services/:id
const getServiceById = async (req, res) => {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid service ID",
            });
            return;
        }
        const service = await model_1.Service.findById(req.params.id);
        if (!service) {
            res.status(404).json({
                status: "error",
                message: "Service not found",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: service,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.getServiceById = getServiceById;
// POST /services
const createService = async (req, res) => {
    try {
        const parsed = validation_1.createServiceSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: parsed.error.issues
                    .map((i) => `${i.path.join(".")}: ${i.message}`)
                    .join(", "),
            });
            return;
        }
        const files = getFiles(req) ?? [];
        const media = {};
        for (const field of MEDIA_FIELDS) {
            const type = getMediaType(field);
            media[field] = {};
            for (const lang of LANGS) {
                media[field][lang] = await uploadField(files, `${field}${lang === "en" ? "En" : "Ar"}`, getFolder(field), type);
            }
        }
        const details = await Promise.all(parsed.data.details.map(async (detail, index) => {
            const img = {};
            for (const lang of LANGS) {
                img[lang] = await uploadField(files, `detailImage${lang === "en" ? "En" : "Ar"}_${index}`, FOLDERS.image, "image");
            }
            return {
                ...detail,
                img,
            };
        }));
        const service = await model_1.Service.create({
            ...parsed.data,
            ...media,
            details,
        });
        res.status(201).json({
            status: "success",
            data: service,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.createService = createService;
// PATCH /services/:id
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid service ID",
            });
            return;
        }
        const parsed = validation_1.updateServiceSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: parsed.error.issues
                    .map((i) => `${i.path.join(".")}: ${i.message}`)
                    .join(", "),
            });
            return;
        }
        const service = await model_1.Service.findById(id);
        if (!service) {
            res.status(404).json({
                status: "error",
                message: "Service not found",
            });
            return;
        }
        const files = getFiles(req) ?? [];
        const toDelete = [];
        // Update text fields
        if (parsed.data.title)
            service.title = parsed.data.title;
        if (parsed.data.desc)
            service.desc = parsed.data.desc;
        // Update media fields
        for (const field of MEDIA_FIELDS) {
            const type = getMediaType(field);
            for (const lang of LANGS) {
                const uploadName = `${field}${lang === "en" ? "En" : "Ar"}`;
                const selected = files.filter((file) => file.fieldname === uploadName);
                if (!selected.length)
                    continue;
                const current = service.get(`${field}.${lang}`) ?? [];
                toDelete.push(...mediaIds(current).map((id) => ({ id, type })));
                const uploaded = await uploadField(files, uploadName, getFolder(field), type);
                service.set(`${field}.${lang}`, uploaded);
            }
        }
        // Update details while preserving existing detail images
        if (parsed.data.details) {
            const oldDetails = service.details;
            const newDetails = [];
            for (let i = 0; i < parsed.data.details.length; i++) {
                const detail = parsed.data.details[i];
                const oldDetail = oldDetails.find((item) => detail._id && item._id.toString() === detail._id) ?? oldDetails[i];
                const img = {
                    en: oldDetail?.img?.en ?? [],
                    ar: oldDetail?.img?.ar ?? [],
                };
                for (const lang of LANGS) {
                    const uploadName = `detailImage${lang === "en" ? "En" : "Ar"}_${i}`;
                    const selected = files.filter((file) => file.fieldname === uploadName);
                    if (!selected.length)
                        continue;
                    toDelete.push(...mediaIds(img[lang]).map((id) => ({
                        id,
                        type: "image",
                    })));
                    img[lang] = await uploadField(files, uploadName, FOLDERS.image, "image");
                }
                newDetails.push({
                    ...detail,
                    img,
                });
            }
            // Delete images belonging to removed details
            const retainedIds = new Set(newDetails.flatMap((detail) => [
                ...mediaIds(detail.img.en),
                ...mediaIds(detail.img.ar),
            ]));
            for (const oldDetail of oldDetails) {
                for (const lang of LANGS) {
                    for (const id of mediaIds(oldDetail.img[lang])) {
                        if (!retainedIds.has(id)) {
                            toDelete.push({ id, type: "image" });
                        }
                    }
                }
            }
            service.details = newDetails;
        }
        await service.save();
        await Promise.allSettled(toDelete.map(({ id, type }) => (0, upload_1.deleteFromCloudinary)(id, type)));
        res.status(200).json({
            status: "success",
            data: service,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.updateService = updateService;
// DELETE /services/:id
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid service ID",
            });
            return;
        }
        const service = await model_1.Service.findByIdAndDelete(id);
        if (!service) {
            res.status(404).json({
                status: "error",
                message: "Service not found",
            });
            return;
        }
        for (const field of MEDIA_FIELDS) {
            const type = getMediaType(field);
            for (const lang of LANGS) {
                await deleteMedia(mediaIds(service.get(`${field}.${lang}`)), type);
            }
        }
        for (const detail of service.details) {
            for (const lang of LANGS) {
                await deleteMedia(mediaIds(detail.img[lang]), "image");
            }
        }
        res.status(200).json({
            status: "success",
            message: "Service deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.deleteService = deleteService;
