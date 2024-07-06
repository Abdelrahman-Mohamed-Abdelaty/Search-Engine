"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invertedIndexSchema = new mongoose_1.default.Schema({
    stemmedWord: String,
    originalWords: [{
            originalWord: String,
            Pages: [{
                    originalWord: String,
                    url: String,
                    rank: Number,
                    tf_idf: Number
                }]
        }]
}, { collection: 'InvertedIndex' });
const invertedIndex = mongoose_1.default.model('InvertedIndex', invertedIndexSchema);
exports.default = invertedIndex;
