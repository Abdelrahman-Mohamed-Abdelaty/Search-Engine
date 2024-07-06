import path from "path";
import Page from './models/page';
import InvertedIndex from './models/invertedIndex';
process.on('uncaughtException',err=>{
    console.log("ERROR 🔥: ",err)
    process.exit(1);
});
import app from './app';
console.log(__dirname)
import mongoose from "mongoose";
import dotenv from "dotenv";
import invertedIndex from "./models/invertedIndex";
dotenv.config({path:"./config.env"})
const PORT=process.env.PORT||3000;

const server=app.listen(PORT, ()=>{
    console.log(`the server is running at ${process.env.PORT}`);
    mongoose.connect(process.env.CONNECTION_STRING!, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false

    }).then(async r => {
        console.log("connected successfully to database")
        // console.log(await InvertedIndex.create({url:"test"}))
        // console.log(await Page.create({url:"test"}))
    })
});
process.on('unhandledRejection',(err:{name:string ,message:string})=>{
        console.log("ERROR 🔥: ",err.name,err.message)
        console.log("Shutting down ...");
        // process.exit(1);//will abort all running reqeusts
        server.close(()=>{
            process.exit(1);
        })
    }
);

