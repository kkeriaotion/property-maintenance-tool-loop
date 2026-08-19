export type MaintenanceRequest = { id: string; tenant: string; property: string; description: string; reportedAt: string };
export type WorkOrder = MaintenanceRequest & { priority: "routine" | "urgent"; state: "queued" | "dispatch" };

export function decideWorkOrder(request: MaintenanceRequest): WorkOrder {
  const text = request.description.toLowerCase();
  const urgent = ["flood", "leak", "gas", "fire", "no heat", "no water"].some((signal) => text.includes(signal));
  return { ...request, priority: urgent ? "urgent" : "routine", state: urgent ? "dispatch" : "queued" };
}
