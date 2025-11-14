import Fastify from "fastify";
import cors from "@fastify/cors";
import { databaseConnect } from "./database/databaseConnect";
import { allRoutes } from "./routes/routes";
import fastifyCookie from "@fastify/cookie";
import { env } from "process";
import fastifyJwt from "@fastify/jwt";
import { getRoutes } from "./routes/getRoutes/get.dyeingOrders";
const app = Fastify(
  {
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
  }
)

const allowedOrigins = [
  "http://localhost:5173", "http://localhost:5174",
  "https://tasty-flax.vercel.app", "https://learn-lovat-psi.vercel.app",
];

app.register(cors, {
  origin: allowedOrigins,
  credentials: true,
})

app.register(fastifyCookie)



app.register(allRoutes); // post method routes are @registered here
app.register(getRoutes); // get method routes are @registered here

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error("jwtSecrete Token is not set at line 37 file server.ts")

app.register(fastifyJwt, {
  secret: jwtSecret,
  verify: {
    extractToken: (req) => {
      return req.cookies?.token
    }
  }
})

databaseConnect(app)
app.get("/", async () => {
  return { "server": "fastify server running" };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3000", 10); // changed to 3000
    const address = await app.listen({ port, host: '0.0.0.0' }); // '0.0.0.0' listens on all interfaces
    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();