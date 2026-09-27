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

Planned:

- [ ] SQLite persistence
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