import { strict as assert } from "node:assert";
import { decideWorkOrder } from "./property_decision.ts";
const result = decideWorkOrder({ id: "mr-test", tenant: "Ari Chen", property: "4 Pine Street", description: "The boiler has no heat", reportedAt: "2026-01-15T09:00:00Z" });
assert.equal(result.priority, "urgent");
assert.equal(result.state, "dispatch");
console.log("urgent maintenance requests dispatch immediately");
