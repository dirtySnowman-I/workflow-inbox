import type {
  FastifyInstance,
} from "fastify";

import {
  createRequest,
  getRequestById,
  listRequests,
  updateRequestStatus,
} from "./repository.js";

import {
  validateCreateRequest,
  validateUpdateStatus,
} from "./validation.js";

import {
  canTransitionStatus,
} from "./workflow.js";

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
      const validation =
        validateCreateRequest(request.body);

      if (!validation.ok) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message:
              "Request validation failed.",
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

  app.patch<{
    Params: {
      id: string;
    };
    Body: unknown;
  }>(
    "/requests/:id/status",
    async (request, reply) => {
      const id = Number(request.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message:
              "Request ID must be a positive integer.",
          },
        });
      }

      const validation =
        validateUpdateStatus(request.body);

      if (!validation.ok) {
        return reply.code(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message:
              "Request validation failed.",
            details: validation.issues,
          },
        });
      }

      const existing = getRequestById(id);

      if (!existing) {
        return reply.code(404).send({
          error: {
            code: "REQUEST_NOT_FOUND",
            message:
              `Request ${id} was not found.`,
          },
        });
      }

      const nextStatus =
        validation.value.status;

      if (
        !canTransitionStatus(
          existing.status,
          nextStatus,
        )
      ) {
        return reply.code(409).send({
          error: {
            code:
              "INVALID_STATUS_TRANSITION",
            message:
              `Cannot move request from ${existing.status} to ${nextStatus}.`,
          },
        });
      }

      const updated =
        updateRequestStatus(
          id,
          nextStatus,
        );

      return {
        request: updated,
      };
    },
  );
}