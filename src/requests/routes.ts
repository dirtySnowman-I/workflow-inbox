import type { FastifyInstance } from "fastify";
import {
  createRequest,
  listRequests,
} from "./repository.js";
import { validateCreateRequest } from "./validation.js";

export async function requestRoutes(
  app: FastifyInstance,
) {
  app.get("/requests", async () => {
    return {
      requests: listRequests(),
    };
  });

  app.post<{ Body: unknown }>(
    "/requests",
    async (request, reply) => {
      const validation = validateCreateRequest(
        request.body,
      );

      if (!validation.ok) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            details: validation.issues,
          },
        });
      }

      const created = createRequest(
        validation.value,
      );

      return reply.code(201).send({
        request: created,
      });
    },
  );
}