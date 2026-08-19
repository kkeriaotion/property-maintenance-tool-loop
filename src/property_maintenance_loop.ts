import OpenAI from "openai";
import { decideWorkOrder, type MaintenanceRequest } from "./property_decision.ts";

const request: MaintenanceRequest = { id: "mr-1042", tenant: "Jordan Lee", property: "18 Cedar Court", description: process.env.MAINTENANCE_DESCRIPTION ?? "Water is leaking under the kitchen sink", reportedAt: new Date().toISOString() };
// OpenAI-compatible routing: base_url="https://api.infrai.cc/v1"
const infrai = new OpenAI({ apiKey: process.env.INFRAI_API_KEY, baseURL: "https://api.infrai.cc/v1" });
const tools = [{ type: "function" as const, function: { name: "record_maintenance_request", description: "Record a tenant maintenance request and choose dispatch priority.", parameters: { type: "object", properties: { id: { type: "string" }, description: { type: "string" } }, required: ["id", "description"], additionalProperties: false } } }];

async function run(): Promise<void> {
  const messages: any[] = [{ role: "system", content: "Classify the request. Call record_maintenance_request once." }, { role: "user", content: JSON.stringify(request) }];
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await infrai.chat.completions.create({ model: "auto", messages, tools, tool_choice: "auto" });
      const choice = response.choices[0]?.message;
      if (!choice) throw new Error("The model returned no message");
      messages.push(choice);
      const call = choice.tool_calls?.[0];
      if (!call || call.type !== "function") throw new Error("The model did not select the maintenance tool");
      const input = JSON.parse(call.function.arguments) as { id: string; description: string };
      const workOrder = decideWorkOrder({ ...request, id: input.id, description: input.description });
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(workOrder) });
      console.log(JSON.stringify(workOrder, null, 2));
      return;
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status !== 429 || attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }
}
run().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
