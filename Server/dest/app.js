"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const searchController_1 = require("./controllers/searchController");
const app = (0, express_1.default)();
app.set('view engine', 'pug');
app.set('views', './views');
//middlewares
app.enable('trust proxy');
//Implement CORS
app.use((0, cors_1.default)());
//here we apply preflight request
app.options('*', (0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//Set security headers
app.use((0, helmet_1.default)({
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
}));
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Tour many requests from this IP,please try in an hour'
});
//Data sanitization against NoSQL injection
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, compression_1.default)()); //for text send in responses
//Data sanitize against from xss
app.use((0, xss_clean_1.default)());
app.use('/api', limiter);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10kb' })); // 10 kilo byte as max for denial attacks
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' })); // for sending requests from forms
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
//routes
app.get('/api/v1/', searchController_1.searchHandler, searchController_1.processPhraseMatchingSearch);
app.all("*", (req, res, next) => {
    const err = new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});
app.use(errorController_1.default);
exports.default = app;
