export type RequestStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "DONE";

export type CreateRequestInput = {
  requester: string;
  summary: string;
};

export type UpdateStatusInput = {
  status: RequestStatus;
};

type ValidationIssue = {
  field:
    | "body"
    | "requester"
    | "summary"
    | "status";
  message: string;
};

type CreateRequestValidationResult =
  | {
      ok: true;
      value: CreateRequestInput;
    }
  | {
      ok: false;
      issues: ValidationIssue[];
    };

type UpdateStatusValidationResult =
  | {
      ok: true;
      value: UpdateStatusInput;
    }
  | {
      ok: false;
      issues: ValidationIssue[];
    };

export function validateCreateRequest(
  body: unknown,
): CreateRequestValidationResult {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return {
      ok: false,
      issues: [
        {
          field: "body",
          message:
            "Request body must be a JSON object.",
        },
      ],
    };
  }

  const input = body as Record<string, unknown>;
  const issues: ValidationIssue[] = [];

  if (
    typeof input.requester !== "string" ||
    input.requester.trim().length === 0
  ) {
    issues.push({
      field: "requester",
      message:
        "Requester must be a non-empty string.",
    });
  }

  if (
    typeof input.summary !== "string" ||
    input.summary.trim().length === 0
  ) {
    issues.push({
      field: "summary",
      message:
        "Summary must be a non-empty string.",
    });
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues,
    };
  }

  return {
    ok: true,
    value: {
      requester:
        (input.requester as string).trim(),
      summary:
        (input.summary as string).trim(),
    },
  };
}

export function validateUpdateStatus(
  body: unknown,
): UpdateStatusValidationResult {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return {
      ok: false,
      issues: [
        {
          field: "body",
          message:
            "Request body must be a JSON object.",
        },
      ],
    };
  }

  const input = body as Record<string, unknown>;

  if (
    input.status !== "NEW" &&
    input.status !== "IN_PROGRESS" &&
    input.status !== "DONE"
  ) {
    return {
      ok: false,
      issues: [
        {
          field: "status",
          message:
            "Status must be NEW, IN_PROGRESS, or DONE.",
        },
      ],
    };
  }

  return {
    ok: true,
    value: {
      status: input.status,
    },
  };
}