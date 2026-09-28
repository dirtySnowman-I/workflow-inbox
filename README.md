# Workflow Inbox

A small Node.js/TypeScript demonstration of a business request workflow with validation, persistence, integrations, and predictable failure handling.

The project intentionally uses a small fictional business scenario so the engineering behavior is easy to inspect.

## Scenario

**Northstar Office Services** is a fictional office-maintenance company.

Its operations team receives maintenance requests and moves them through:

`NEW → IN_PROGRESS → DONE`

Requests can eventually arrive either:

1. manually through Workflow Inbox, or
2. through the fictional **FormRelay** webhook integration.

All project data is synthetic.


## Current Status

The project is under active development.

Currently implemented:

- [x] Minimal Fastify/TypeScript service
- [x] Health endpoint
- [x] Synthetic-data policy
- [x] SQLite request/integration schema
- [x] Deterministic synthetic seed data

Planned:

- [ ] Create request
- [ ] List requests
- [ ] Update request status
- [ ] Input validation
- [ ] Synthetic JSON import
- [ ] Mock FormRelay webhook
- [ ] Duplicate-event protection
- [ ] Bounded retry behavior
- [ ] Browser interface
- [ ] Failure-path checks

## Run Locally

Requirements:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Run the service:

```bash
npm start
```

Check it:

```bash
curl http://127.0.0.1:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

For development:

```bash
npm run dev
```

Type-check:

```bash
npm run typecheck
```
## Database Setup

Initialize the SQLite schema:

```bash
npm run db:init
```

Load deterministic synthetic demo data:

```bash
npm run db:seed
```

The generated database is stored under `data/` and is not committed to Git.


## Current Endpoints

### `GET /`

Returns basic service information.

### `GET /health`

Returns a simple health response.

## Planned Core Workflow

A request will contain:

- ID
- requester
- summary
- status
- creation time
- last modification time

Statuses:

`NEW → IN_PROGRESS → DONE`

## Planned Integration

**FormRelay** is a fictional website-form provider used to demonstrate webhook integration behavior.

The integration will eventually demonstrate:

- authenticated webhook requests;
- persisted event IDs;
- duplicate-delivery detection;
- idempotent processing.

No external service is required.

## Acceptance Goals

The completed demonstration will verify:

1. valid requests can be created;
2. invalid requests are rejected without being stored;
3. requests can be listed;
4. status changes persist;
5. a valid integration event creates exactly one request;
6. delivering the same integration event twice does not create a duplicate request.

## Synthetic Data

This project contains no production customer data.

See [`docs/synthetic-data.md`](docs/synthetic-data.md).

## Scope

This is intentionally a small engineering demonstration.

It is not intended to be a complete ticketing, CRM, help-desk, or workflow-management product.

## License

MIT