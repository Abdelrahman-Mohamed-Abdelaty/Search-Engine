import helmet from "helmet";
import express, {query} from 'express'
import Stemmer from './utils/stemmer'
import morgan from "morgan";
import path from "path";
import cookieParser from 'cookie-parser';
import rateLimit from "express-rate-limit";
// @ts-ignore
import xss from "xss-clean";
import mongoSantize from "express-mongo-sanitize";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import catchAsync from "./utils/catchAsync";
import * as fs from "node:fs";
import mongoose from "mongoose";
import * as sea from "node:sea";
import Page from './models/page';
import InvertedIndex from "./models/invertedIndex";
import {processPhraseMatchingSearch, searchHandler} from "./controllers/searchController";
const app=express();
app.set('view engine','pug');
app.set('views','./views');
//middlewares
app.enable('trust proxy');

//Implement CORS
app.use(cors());
//here we apply preflight request
app.options('*',cors());
app.use(express.static(path.join(__dirname,'public')));
//Set security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                scriptSrc: [
                    "'self'",
                    'https:',
                    'http:',
                    'blob:',
                    'https://*.mapbox.com',
                    'https://js.stripe.com',
                    'https://*.cloudflare.com',
                ],
                frameSrc: ["'self'", 'https://js.stripe.com'],
                objectSrc: ['none'],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                workerSrc: ["'self'", 'data:', 'blob:'],
                childSrc: ["'self'", 'blob:'],
                imgSrc: ["'self'", 'data:', 'blob:'],
                connectSrc: [
                    "'self'",
                    'blob:',
                    'wss:',
                    'https://*.tiles.mapbox.com',
                    'https://api.mapbox.com',
                    'https://events.mapbox.com',
                ],
                upgradeInsecureRequests: [],
            },
        },
    })
);

const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Tour many requests from this IP,please try in an hour'
})
//Data sanitization against NoSQL injection
app.use(mongoSantize())
app.use(compression());//for text send in responses
//Data sanitize against from xss
app.use(xss());
app.use('/api',limiter);

app.use(cookieParser())
app.use(express.json({limit:'10kb'}));// 10 kilo byte as max for denial attacks
app.use(express.urlencoded({extended:true,limit:'10kb'}));// for sending requests from forms
if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"));
}


//routes
app.get('/api/v1/',searchHandler,processPhraseMatchingSearch)

app.all("*",(req,res,next)=>{
    const err=new AppError(`Can't find ${req.originalUrl} on this server`,404);
    next(err);
});

app.use(globalErrorHandler);
export default app
