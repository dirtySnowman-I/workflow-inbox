import { db } from "../db/database.js";
import type { CreateRequestInput } from "./validation.js";

export type RequestRecord = {
  id: number;
  requester: string;
  summary: string;
  status: "NEW" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
};

export function createRequest(
  input: CreateRequestInput,
): RequestRecord {
  const insert = db.prepare(`
    INSERT INTO requests (
      requester,
      summary
    )
    VALUES (?, ?)
  `);

  const result = insert.run(
    input.requester,
    input.summary,
  );

  const id = Number(result.lastInsertRowid);

  const request = db
    .prepare(`
      SELECT
        id,
        requester,
        summary,
        status,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM requests
      WHERE id = ?
    `)
    .get(id) as RequestRecord | undefined;

  if (!request) {
    throw new Error(
      `Created request ${id} could not be read back.`,
    );
  }

  return request;
}

export function listRequests(): RequestRecord[] {
  return db
    .prepare(`
      SELECT
        id,
        requester,
        summary,
        status,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM requests
      ORDER BY id ASC
    `)
    .all() as RequestRecord[];
}