import type {
  RequestStatus,
} from "./validation.js";

export function canTransitionStatus(
  currentStatus: RequestStatus,
  nextStatus: RequestStatus,
): boolean {
  if (
    currentStatus === "NEW" &&
    nextStatus === "IN_PROGRESS"
  ) {
    return true;
  }

  if (
    currentStatus === "IN_PROGRESS" &&
    nextStatus === "DONE"
  ) {
    return true;
  }

  return false;
}