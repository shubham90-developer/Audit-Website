"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetTheTeam = void 0;
const mongoose_1 = require("mongoose");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { _id: false });
const meetTheTeamSchema = new mongoose_1.Schema({
    leftTitle: localizedString,
    scriptTitle: localizedString,
    watermark: localizedString,
    image: {
        en: { type: [mediaSchema], default: [] },
        ar: { type: [mediaSchema], default: [] },
    },
}, { timestamps: true });
exports.MeetTheTeam = (0, mongoose_1.model)("MeetTheTeam", meetTheTeamSchema);
