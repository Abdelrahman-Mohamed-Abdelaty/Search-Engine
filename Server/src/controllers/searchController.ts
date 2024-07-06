import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import InvertedIndex from "../models/invertedIndex";
import Page from "../models/page";
import fs from "node:fs";
import Stemmer from "../utils/stemmer";
import * as sea from "node:sea";

const stopWords={}as {[key:string]:number};
const stopWordsFile= fs.readFileSync('./stopWords.txt','utf-8');
const stemmer=new Stemmer();
stopWordsFile.split('\n').forEach(el=>stopWords[el]=1);

const isNotStopWord=(word:string)=> 1!==stopWords[word];
const isPharseSearching=(search:string)=>search.endsWith(('"')) && search.startsWith('"');

const validatQuery=(search:any)=>{
    if(!search)
        throw new AppError('Please provide a query to search for',400);
    if(Array.isArray(search)) search=search[0]as string;
    return search;
}
const extractQueryFromQuotes=(searchingQuery:string)=>searchingQuery.slice(1, searchingQuery.length - 1);
const getStemmedWords=(searchingQuery:string)=>{
    const stemmedWordsArray=[] as string[];
    const originalWordsMap={} as {[key:string]:number};
    (searchingQuery as string).split(' ').forEach((word: string) => {
        if (word&&isNotStopWord(word))
            stemmedWordsArray.push(stemmer.stemWord(word));
        originalWordsMap[word]=1;
    })
    return stemmedWordsArray
}
const getOriginalWordsMap=(searchingQuery:string)=>{
    const originalWordsMap={} as {[key:string]:number};
    searchingQuery.split(' ').forEach(word=>{
        originalWordsMap[word]=1;
    });
    return originalWordsMap;
}
const paginate=(pages:any,limit:any,page:any)=>{
    limit=limit||5;
    page=page||1;
    const startPage=(+page-1)*+limit;
    const endPage= +limit + startPage
    pages=pages.slice(startPage,endPage);
    return pages;
}
export const processPhraseMatchingSearch=catchAsync(async (req,res,next)=>{
    let searchingQuery = extractQueryFromQuotes(req.query.search as string);
    const stemmedWordsArray=getStemmedWords(searchingQuery);
    const originalWordsMap=getOriginalWordsMap(searchingQuery);
    const matchedInvertedIndexWords=await InvertedIndex.find({stemmedWord:{$in:stemmedWordsArray}});
    const foundPages={}as{[key:string]:number};
    const foundWords={}as{[key:string]:string};
    const urls=[] as string[];
    matchedInvertedIndexWords.forEach((stemmedWordResult:any) => {
        stemmedWordResult.originalWords.forEach((originalWord:any)=>{
            if(originalWordsMap.hasOwnProperty(originalWord.originalWord)) {
                originalWord.Pages.forEach((page: any) => {
                    foundWords[page.url]=page.originalWord;
                    if (!foundPages[page.url]) {
                        urls.push(page.url);
                        foundPages[page.url] = .5 * page.rank;
                    }
                    foundPages[page.url] += page.tf_idf;
                });
            }
        })
    });
    let pages=await Page.find({url:{$in:urls}}).select('-rank');
    const uniquePages={};
    pages=pages.filter( (page:any)=>{
        if(uniquePages.hasOwnProperty(page.url)) return false;
        // @ts-ignore
        uniquePages[page.url]=1;
        console.log(searchingQuery);
        let regex = new RegExp("\\b" + searchingQuery + "\\b");

        let match = page.content.match(regex);
        let indexOfFoundWord;
        if(match)
            indexOfFoundWord=match.index;
        else return false;
        let startIndex=Math.max(0,indexOfFoundWord-50);
        let lastIndex=Math.min(page.content.length,indexOfFoundWord+50);
        page.matchedContent=page.content.slice(startIndex,indexOfFoundWord)+`<b class="word-match">${searchingQuery}</b>`+
            page.content.slice(searchingQuery.length+indexOfFoundWord,lastIndex);
        page.content=null;
        return true;
    })
    pages= pages.sort((a:any,b:any)=>{
        return foundPages[b.url]-foundPages[a.url];
    });
    pages=paginate(pages,req.query.limit,req.query.page);
    return res.status(200).json({
        status: "success",
        pages,
    })
})


export const searchHandler=catchAsync(async (req,res,next)=>{
    let searchingQuery=validatQuery(req.query.search)
    if(isPharseSearching(searchingQuery as string)){
        req.query.search=searchingQuery;
        return next();
    }
    const stemmedWordsArray=getStemmedWords(searchingQuery);
    const matchedInvertedIndexWords=await InvertedIndex.find({stemmedWord:{$in:stemmedWordsArray}});
    const foundPages={}as{[key:string]:number};
    const foundWords={}as{[key:string]:string};
    const urls=[] as string[];
    matchedInvertedIndexWords.forEach((stemmedWordResult:any) => {
        stemmedWordResult.originalWords.forEach((originalWord:any)=>{
            originalWord.Pages.forEach((page:any) => {
                foundWords[page.url]=page.originalWord;
                if (!foundPages[page.url]) {
                    urls.push(page.url);
                    foundPages[page.url] = .5 * page.rank;
                }
                foundPages[page.url] += page.tf_idf;
            });
        })
    });
    let pages=await Page.find({url:{$in:urls}}).select('-rank');
    //Sort the results
    pages= pages.sort((a:any,b:any)=>{
        return foundPages[b.url]-foundPages[a.url];
    })
    //Bold the found Words
    //for remove duplicate pages
    const uniquePages={};
    pages=pages.filter((page:any)=>{
        if(uniquePages.hasOwnProperty(page.url)) return false;
        // @ts-ignore
        uniquePages[page.url]=1;
        let regex
        try{
            regex = new RegExp("\\b" + foundWords[page.url] + "\\b");
        }catch (er){
            return false;
        }
        let match = page.content.match(regex);
        if(!match) return false;
        let indexOfFoundWord=match.index;
        let startIndex=Math.max(0,indexOfFoundWord-50);
        let lastIndex=Math.min(page.content.length,indexOfFoundWord+50);
        page.matchedContent=page.content.slice(startIndex,indexOfFoundWord)+`<b class="word-match">${foundWords[page.url]}</b>`+
            page.content.slice(foundWords[page.url].length+indexOfFoundWord,lastIndex);
        page.content=null;
        return true;
    })
    pages=paginate(pages,req.query.limit,req.query.page);

    return res.status(200).json({
        status: "success",
        pages,
    })
})