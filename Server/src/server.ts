import path from "path";

process.on('uncaughtException',err=>{
    console.log("ERROR 🔥: ",err)
    process.exit(1);
});
import app from './app';
console.log(__dirname)
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path:"./config.env"})
const PORT=process.env.PORT||3000;

const server=app.listen(PORT, ()=>{
    console.log(`the server is running at ${process.env.PORT}`);
    mongoose.connect(process.env.CONNECTION_STRING!, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false

    }).then(r =>console.log("connected successfully to database"))
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

