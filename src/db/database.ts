import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const configuredPath =
  process.env.DATABASE_PATH ?? "data/workflow-inbox.db";

const databasePath =
  configuredPath === ":memory:"
    ? configuredPath
    : resolve(configuredPath);

if (databasePath !== ":memory:") {
  mkdirSync(dirname(databasePath), { recursive: true });
}

export const db = new DatabaseSync(databasePath, {
  timeout: 5000,
});

db.exec("PRAGMA foreign_keys = ON;");

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY,

      requester TEXT NOT NULL
        CHECK (length(trim(requester)) > 0),

      summary TEXT NOT NULL
        CHECK (length(trim(summary)) > 0),

      status TEXT NOT NULL DEFAULT 'NEW'
        CHECK (status IN ('NEW', 'IN_PROGRESS', 'DONE')),

      created_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),

      updated_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      )
    ) STRICT;

    CREATE TABLE IF NOT EXISTS integration_events (
      event_id TEXT PRIMARY KEY
        CHECK (length(trim(event_id)) > 0),

      event_type TEXT NOT NULL
        CHECK (length(trim(event_type)) > 0),

      request_id INTEGER NOT NULL,

      received_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),

      FOREIGN KEY (request_id)
        REFERENCES requests(id)
    ) STRICT;
  `);
}