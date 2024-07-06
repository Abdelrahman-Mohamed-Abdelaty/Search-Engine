"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pageSchema = new mongoose_1.default.Schema({
    url: String,
    title: String,
    content: String,
    rank: Number,
    matchedContent: String,
}, { collection: 'Pages' });
const Page = mongoose_1.default.model('Pages', pageSchema);
exports.default = Page;
