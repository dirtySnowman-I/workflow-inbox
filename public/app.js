const requestList =
  document.querySelector("#request-list");

const message =
  document.querySelector("#message");

const refreshButton =
  document.querySelector("#refresh-button");

const STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "DONE",
];

const NEXT_STATUS = {
  NEW: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: null,
};

function setMessage(text, type = "status") {
  message.textContent = text;

  if (type === "error") {
    message.setAttribute("role", "alert");
    message.className = "message error";
    return;
  }

  message.setAttribute("role", "status");
  message.className = "message";
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

async function readApiError(response) {
  try {
    const data = await response.json();

    if (
      data &&
      data.error &&
      typeof data.error.message === "string"
    ) {
      return data.error.message;
    }
  } catch {
    // Fall through to the HTTP message.
  }

  return `Request failed with HTTP ${response.status}.`;
}

async function updateStatus(
  request,
  nextStatus,
  select,
) {
  select.disabled = true;

  setMessage(
    `Updating request #${request.id}…`,
  );

  try {
    const response = await fetch(
      `/requests/${request.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        await readApiError(response),
      );
    }

    /*
     * Fetch the inbox again rather than only
     * changing the DOM locally.
     *
     * This confirms that the persisted database
     * state is what the UI displays.
     */
    await loadRequests(
      `Request #${request.id} updated to ${formatStatus(nextStatus)}.`,
    );
  } catch (error) {
    console.error(error);

    select.value = request.status;
    select.disabled = false;

    setMessage(
      error instanceof Error
        ? error.message
        : "Could not update request.",
      "error",
    );
  }
}

function createStatusControl(request) {
  const select =
    document.createElement("select");

  select.setAttribute(
    "aria-label",
    `Status for request ${request.id}`,
  );

  const allowedNext =
    NEXT_STATUS[request.status];

  for (const status of STATUSES) {
    const option =
      document.createElement("option");

    option.value = status;
    option.textContent =
      formatStatus(status);

    option.selected =
      status === request.status;

    /*
     * The current status remains visible.
     * Only the legal next state is selectable.
     */
    if (
      status !== request.status &&
      status !== allowedNext
    ) {
      option.disabled = true;
    }

    select.append(option);
  }

  if (allowedNext === null) {
    select.disabled = true;
  }

  select.addEventListener(
    "change",
    async () => {
      if (
        select.value === request.status
      ) {
        return;
      }

      await updateStatus(
        request,
        select.value,
        select,
      );
    },
  );

  return select;
}

function createRequestCard(request) {
  const article =
    document.createElement("article");

  article.className = "request-card";

  const heading =
    document.createElement("h3");

  heading.textContent =
    `Request #${request.id}`;

  const requester =
    document.createElement("p");

  const requesterLabel =
    document.createElement("strong");

  requesterLabel.textContent =
    "Requester: ";

  requester.append(
    requesterLabel,
    document.createTextNode(
      request.requester,
    ),
  );

  const summary =
    document.createElement("p");

  const summaryLabel =
    document.createElement("strong");

  summaryLabel.textContent =
    "Summary: ";

  summary.append(
    summaryLabel,
    document.createTextNode(
      request.summary,
    ),
  );

  const created =
    document.createElement("p");

  created.textContent =
    `Created: ${formatDate(
      request.createdAt,
    )}`;

  const updated =
    document.createElement("p");

  updated.textContent =
    `Updated: ${formatDate(
      request.updatedAt,
    )}`;

  const statusRow =
    document.createElement("div");

  statusRow.className = "status-row";

  const statusLabel =
    document.createElement("span");

  statusLabel.textContent = "Status:";

  statusRow.append(
    statusLabel,
    createStatusControl(request),
  );

  article.append(
    heading,
    requester,
    summary,
    created,
    updated,
    statusRow,
  );

  return article;
}

function renderRequests(requests) {
  requestList.replaceChildren();

  for (const request of requests) {
    requestList.append(
      createRequestCard(request),
    );
  }
}

async function loadRequests(
  successMessage = null,
) {
  refreshButton.disabled = true;

  setMessage("Loading requests…");
  requestList.replaceChildren();

  try {
    const response =
      await fetch("/requests");

    if (!response.ok) {
      throw new Error(
        await readApiError(response),
      );
    }

    const data = await response.json();

    if (
      !Array.isArray(data.requests)
    ) {
      throw new Error(
        "Server returned an invalid request list.",
      );
    }

    if (data.requests.length === 0) {
      setMessage(
        "No requests yet.",
      );
      return;
    }

    renderRequests(data.requests);

    if (successMessage) {
      setMessage(successMessage);
    } else {
      setMessage(
        `Loaded ${data.requests.length} request(s).`,
      );
    }
  } catch (error) {
    console.error(error);

    requestList.replaceChildren();

    setMessage(
      error instanceof Error
        ? `Could not load requests: ${error.message}`
        : "Could not load requests.",
      "error",
    );
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener(
  "click",
  () => {
    loadRequests();
  },
);

loadRequests();