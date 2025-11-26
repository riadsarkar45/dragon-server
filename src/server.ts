// server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { databaseConnect } from "./database/databaseConnect";
import { allRoutes } from "./routes/post/routes";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { getRoutes } from "./routes/get/routes";
import fastifyMultipart from "@fastify/multipart";
import { updateRoutes } from "./routes/update/routes";
import cachePlugin from "./plugins/caching/cache";

const app = Fastify({
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
  "http://localhost:5173",
  "http://localhost:5174",
  "https://tasty-flax.vercel.app",
  "https://learn-lovat-psi.vercel.app",
];

app.register(cors, {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
});

app.register(fastifyCookie);
app.register(cachePlugin, { stdTTL: 600, useClones: false });
app.register(fastifyMultipart);

app.register(allRoutes);
app.register(getRoutes);
app.register(updateRoutes);

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not set");

app.register(fastifyJwt, {
  secret: jwtSecret,
  verify: {
    extractToken: (req) => req.cookies?.token,
  }
});

(async () => {
  try {
    // Ensure database connection before starting server
    await databaseConnect(app);

    app.get("/", async () => {
      return { server: "fastify server running" };
    });

    const port = parseInt(process.env.PORT || "2000", 10);
    // 0.0.0.0 ensures Render can access the server
    const address = await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
