import Fastify from "fastify";
import cors from "@fastify/cors";
import { databaseConnect } from "./database/databaseConnect";
import { allRoutes } from "./routes/routes";
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

app.register(allRoutes); // all routes are @registered here

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