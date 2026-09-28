import { db, initializeDatabase } from "./database.js";

try {
  initializeDatabase();

  console.log("Database initialized successfully.");
  console.log("Tables:");
  console.log("- requests");
  console.log("- integration_events");
} finally {
  db.close();
}