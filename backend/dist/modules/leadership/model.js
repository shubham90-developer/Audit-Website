"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadershipMember = exports.LeadershipSection = void 0;
const mongoose_1 = require("mongoose");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
}, { _id: false });
const localizedMedia = {
    en: { type: [mediaSchema], default: [] },
    ar: { type: [mediaSchema], default: [] },
};
// ================= SECTION =================
const leadershipSectionSchema = new mongoose_1.Schema({
    leadershipTitle: localizedString,
    leadershipDescription: localizedString,
    teamTitle: localizedString,
    teamDescription: localizedString,
    backgroundImage: localizedMedia,
}, { timestamps: true });
exports.LeadershipSection = (0, mongoose_1.model)("LeadershipSection", leadershipSectionSchema);
// ================= MEMBERS =================
const leadershipMemberSchema = new mongoose_1.Schema({
    name: localizedString,
    role: localizedString,
    department: localizedString,
    bio: localizedString,
    image: localizedMedia,
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true });
leadershipMemberSchema.index({
    order: 1,
    isActive: 1,
});
exports.LeadershipMember = (0, mongoose_1.model)("LeadershipMember", leadershipMemberSchema);
