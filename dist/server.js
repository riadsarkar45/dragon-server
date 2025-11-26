"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const databaseConnect_1 = require("./database/databaseConnect");
const routes_1 = require("./routes/post/routes");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const routes_2 = require("./routes/get/routes");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const routes_3 = require("./routes/update/routes");
const cache_1 = __importDefault(require("./plugins/caching/cache"));
const app = (0, fastify_1.default)({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
            }
        }
    }
});
const allowedOrigins = [
    "http://localhost:5173", "http://localhost:5174",
    "https://tasty-flax.vercel.app", "https://learn-lovat-psi.vercel.app",
];
app.register(cors_1.default, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
});
app.register(cookie_1.default);
app.register(cache_1.default, {
    stdTTL: 600,
    useClones: false
});
app.register(multipart_1.default);
app.register(routes_1.allRoutes); // post method routes are @registered here
app.register(routes_2.getRoutes); // get method routes are @registered here
app.register(routes_3.updateRoutes); // update method routes are @registered here
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret)
    throw new Error("jwtSecrete Token is not set at line 37 file server.ts");
app.register(jwt_1.default, {
    secret: jwtSecret,
    verify: {
        extractToken: (req) => {
            return req.cookies?.token;
        }
    }
});
(0, databaseConnect_1.databaseConnect)(app);
app.get("/", async () => {
    return { "server": "fastify server running" };
});
const start = async () => {
    try {
        const port = parseInt(process.env.PORT || "2000", 10); // changed to 3000
        const address = await app.listen({ port, host: '0.0.0.0' }); // '0.0.0.0' listens on all interfaces
        app.log.info(`Server listening at ${address}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
