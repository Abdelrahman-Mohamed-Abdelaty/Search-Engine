"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHandler = exports.processPhraseMatchingSearch = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const invertedIndex_1 = __importDefault(require("../models/invertedIndex"));
const page_1 = __importDefault(require("../models/page"));
const node_fs_1 = __importDefault(require("node:fs"));
const stemmer_1 = __importDefault(require("../utils/stemmer"));
const stopWords = {};
const stopWordsFile = node_fs_1.default.readFileSync('./stopWords.txt', 'utf-8');
const stemmer = new stemmer_1.default();
stopWordsFile.split('\n').forEach(el => stopWords[el] = 1);
const isNotStopWord = (word) => 1 !== stopWords[word];
const isPharseSearching = (search) => search.endsWith(('"')) && search.startsWith('"');
const validatQuery = (search) => {
    if (!search)
        throw new appError_1.default('Please provide a query to search for', 400);
    if (Array.isArray(search))
        search = search[0];
    return search;
};
const extractQueryFromQuotes = (searchingQuery) => searchingQuery.slice(1, searchingQuery.length - 1);
const getStemmedWords = (searchingQuery) => {
    const stemmedWordsArray = [];
    const originalWordsMap = {};
    searchingQuery.split(' ').forEach((word) => {
        if (word && isNotStopWord(word))
            stemmedWordsArray.push(stemmer.stemWord(word));
        originalWordsMap[word] = 1;
    });
    return stemmedWordsArray;
};
const getOriginalWordsMap = (searchingQuery) => {
    const originalWordsMap = {};
    searchingQuery.split(' ').forEach(word => {
        originalWordsMap[word] = 1;
    });
    return originalWordsMap;
};
const paginate = (pages, limit, page) => {
    limit = limit || 5;
    page = page || 1;
    const startPage = (+page - 1) * +limit;
    const endPage = +limit + startPage;
    pages = pages.slice(startPage, endPage);
    return pages;
};
exports.processPhraseMatchingSearch = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let searchingQuery = extractQueryFromQuotes(req.query.search);
    const stemmedWordsArray = getStemmedWords(searchingQuery);
    const originalWordsMap = getOriginalWordsMap(searchingQuery);
    const matchedInvertedIndexWords = yield invertedIndex_1.default.find({ stemmedWord: { $in: stemmedWordsArray } });
    const foundPages = {};
    const foundWords = {};
    const urls = [];
    matchedInvertedIndexWords.forEach((stemmedWordResult) => {
        stemmedWordResult.originalWords.forEach((originalWord) => {
            if (originalWordsMap.hasOwnProperty(originalWord.originalWord)) {
                originalWord.Pages.forEach((page) => {
                    foundWords[page.url] = page.originalWord;
                    if (!foundPages[page.url]) {
                        urls.push(page.url);
                        foundPages[page.url] = .5 * page.rank;
                    }
                    foundPages[page.url] += page.tf_idf;
                });
            }
        });
    });
    let pages = yield page_1.default.find({ url: { $in: urls } }).select('-rank');
    pages = pages.filter((page) => {
        let indexOfFoundWord = page.content.indexOf(searchingQuery);
        if (indexOfFoundWord == -1)
            return false;
        let startIndex = Math.max(0, indexOfFoundWord - 50);
        let lastIndex = Math.min(page.content.length, indexOfFoundWord + 50);
        page.matchedContent = page.content.slice(startIndex, indexOfFoundWord) + `<b>${searchingQuery}</b>` +
            page.content.slice(searchingQuery.length + indexOfFoundWord, lastIndex);
        page.content = null;
        return true;
    });
    pages = pages.sort((a, b) => {
        return foundPages[b.url] - foundPages[a.url];
    });
    pages = paginate(pages, req.query.limit, req.query.page);
    return res.status(200).json({
        status: "success",
        pages,
    });
}));
exports.searchHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let searchingQuery = validatQuery(req.query.search);
    if (isPharseSearching(searchingQuery)) {
        req.query.search = searchingQuery;
        return next();
    }
    const stemmedWordsArray = getStemmedWords(searchingQuery);
    const matchedInvertedIndexWords = yield invertedIndex_1.default.find({ stemmedWord: { $in: stemmedWordsArray } });
    const foundPages = {};
    const foundWords = {};
    const urls = [];
    matchedInvertedIndexWords.forEach((stemmedWordResult) => {
        stemmedWordResult.originalWords.forEach((originalWord) => {
            originalWord.Pages.forEach((page) => {
                foundWords[page.url] = page.originalWord;
                if (!foundPages[page.url]) {
                    urls.push(page.url);
                    foundPages[page.url] = .5 * page.rank;
                }
                foundPages[page.url] += page.tf_idf;
            });
        });
    });
    let pages = yield page_1.default.find({ url: { $in: urls } }).select('-rank');
    //Sort the results
    pages = pages.sort((a, b) => {
        return foundPages[b.url] - foundPages[a.url];
    });
    pages = paginate(pages, req.query.limit, req.query.page);
    //Bold the found Words
    pages.forEach((page) => {
        let indexOfFoundWord = page.content.indexOf(foundWords[page.url]);
        let startIndex = Math.max(0, indexOfFoundWord - 50);
        let lastIndex = Math.min(page.content.length, indexOfFoundWord + 50);
        page.matchedContent = page.content.slice(startIndex, indexOfFoundWord) + `<b>${foundWords[page.url]}</b>` +
            page.content.slice(foundWords[page.url].length + indexOfFoundWord, lastIndex);
        page.content = null;
    });
    return res.status(200).json({
        status: "success",
        pages,
    });
}));
