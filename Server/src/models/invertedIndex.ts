import mongoose from "mongoose";
import Page from "./page";

const invertedIndexSchema= new mongoose.Schema({
    stemmedWord:String,
    originalWords:[{
        originalWord:String,
        Pages:[{
            originalWord:String,
            url: String,
            rank: Number,
            tf_idf:Number
        }]
    }]
},{ collection: 'InvertedIndex'})
const invertedIndex=mongoose.model('InvertedIndex',invertedIndexSchema);


export default invertedIndex;
