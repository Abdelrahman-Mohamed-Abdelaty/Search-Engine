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
process.on('uncaughtException', err => {
    console.log("ERROR 🔥: ", err);
    process.exit(1);
});
const app_1 = __importDefault(require("./app"));
console.log(__dirname);
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const PORT = process.env.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    console.log(`the server is running at ${process.env.PORT}`);
    mongoose_1.default.connect(process.env.CONNECTION_STRING, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then((r) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("connected successfully to database");
        // console.log(await InvertedIndex.create({url:"test"}))
        // console.log(await Page.create({url:"test"}))
    }));
});
process.on('unhandledRejection', (err) => {
    console.log("ERROR 🔥: ", err.name, err.message);
    console.log("Shutting down ...");
    // process.exit(1);//will abort all running reqeusts
    server.close(() => {
        process.exit(1);
    });
});
