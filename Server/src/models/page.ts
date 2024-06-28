import mongoose from "mongoose";

const pageSchema= new mongoose.Schema({
    url: String,
    title: String,
    content: String,
    rank: Number,
    matchedContent:String,
},{ collection: 'PagesCollection' })
const Page=mongoose.model('PagesCollection',pageSchema);

export default Page;

