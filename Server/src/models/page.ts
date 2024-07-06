import mongoose from "mongoose";

const pageSchema= new mongoose.Schema({
    url: String,
    title: String,
    content: String,
    rank: Number,
    matchedContent:String,
},{ collection: 'Pages' })
const Page=mongoose.model('Pages',pageSchema);


export default Page;


