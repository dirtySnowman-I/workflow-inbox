import { db, initializeDatabase } from "./database.js";

initializeDatabase();

const requests = [
  {
    id: 1,
    requester: "Jordan Lee",
    summary: "Conference room projector is not working",
    status: "NEW",
    createdAt: "2026-09-27T08:00:00.000Z",
    updatedAt: "2026-09-27T08:00:00.000Z",
  },
  {
    id: 2,
    requester: "Maya Chen",
    summary: "Replace broken office chair",
    status: "IN_PROGRESS",
    createdAt: "2026-09-27T08:10:00.000Z",
    updatedAt: "2026-09-27T08:30:00.000Z",
  },
  {
    id: 3,
    requester: "Daniel Brooks",
    summary: "Repair kitchen faucet",
    status: "DONE",
    createdAt: "2026-09-27T08:20:00.000Z",
    updatedAt: "2026-09-27T09:00:00.000Z",
  },
  {
    id: 4,
    requester: "Taylor Morgan",
    summary: "Air conditioner is leaking",
    status: "NEW",
    createdAt: "2026-09-27T08:40:00.000Z",
    updatedAt: "2026-09-27T08:40:00.000Z",
  },
];

const integrationEvents = [
  {
    eventId: "evt_demo_001",
    eventType: "request.created",
    requestId: 4,
    receivedAt: "2026-09-27T08:40:00.000Z",
  },
];

const insertRequest = db.prepare(`
  INSERT OR IGNORE INTO requests (
    id,
    requester,
    summary,
    status,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertIntegrationEvent = db.prepare(`
  INSERT OR IGNORE INTO integration_events (
    event_id,
    event_type,
    request_id,
    received_at
  )
  VALUES (?, ?, ?, ?)
`);

try {
  db.exec("BEGIN");

  for (const request of requests) {
    insertRequest.run(
      request.id,
      request.requester,
      request.summary,
      request.status,
      request.createdAt,
      request.updatedAt,
    );
  }

  for (const event of integrationEvents) {
    insertIntegrationEvent.run(
      event.eventId,
      event.eventType,
      event.requestId,
      event.receivedAt,
    );
  }

  db.exec("COMMIT");

  const requestCount = db
    .prepare("SELECT COUNT(*) AS count FROM requests")
    .get() as { count: number };

  const eventCount = db
    .prepare("SELECT COUNT(*) AS count FROM integration_events")
    .get() as { count: number };

  console.log("Synthetic seed completed.");
  console.log(`Requests: ${requestCount.count}`);
  console.log(`Integration events: ${eventCount.count}`);
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
} finally {
  db.close();
}