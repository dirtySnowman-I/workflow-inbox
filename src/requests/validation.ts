export type CreateRequestInput = {
  requester: string;
  summary: string;
};

type ValidationIssue = {
  field: "body" | "requester" | "summary";
  message: string;
};

type ValidationResult =
  | {
      ok: true;
      value: CreateRequestInput;
    }
  | {
      ok: false;
      issues: ValidationIssue[];
    };

export function validateCreateRequest(body: unknown): ValidationResult {
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
          message: "Request body must be a JSON object.",
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
      message: "Requester must be a non-empty string.",
    });
  }

  if (
    typeof input.summary !== "string" ||
    input.summary.trim().length === 0
  ) {
    issues.push({
      field: "summary",
      message: "Summary must be a non-empty string.",
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
      requester: (input.requester as string).trim(),
      summary: (input.summary as string).trim(),
    },
  };
}