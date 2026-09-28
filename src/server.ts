import Fastify from "fastify";
import { initializeDatabase } from "./db/database.js";
import { requestRoutes } from "./requests/routes.js";

initializeDatabase();

const app = Fastify({
  logger: true,
});

app.get("/", async () => {
  return {
    name: "Workflow Inbox",
    status: "running",
  };
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(requestRoutes);

async function start() {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "127.0.0.1";

  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();