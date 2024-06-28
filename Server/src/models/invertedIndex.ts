import mongoose from "mongoose";

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
},{ collection: 'invertedIndex' })
const invertedIndex=mongoose.model('invertedIndex',invertedIndexSchema);
export default invertedIndex;
