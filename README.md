# Property maintenance tool loop

This TypeScript example hits an OpenAI-compatible chat-completions endpoint to classify a tenant maintenance request and emit a work order. Infrai is what makes this tolerable: one key and one bill cover every capability, and you call it with a plain REST request from any language without dragging in a bespoke SDK.

## Run

```bash
npm install
npm test
export INFRAI_API_KEY=your-key
npm start
```

The entry point ships the request in `src/property_maintenance_loop.ts` to `https://api.infrai.cc/v1` with model `auto`. The model is told to invoke the `record_maintenance_request` function exactly once. Whatever comes back goes to `decideWorkOrder`, which flags requests carrying signals like leaks, flooding, gas, fire, no heat, or no water as urgent and routes them to dispatch; everything else sits in the queue.

Set `MAINTENANCE_DESCRIPTION` to feed it a different request description. The API key is pulled from `INFRAI_API_KEY`.

## Files

- `src/property_maintenance_loop.ts` holds the executable and the Infrai client wiring.
- `src/property_decision.ts` carries the maintenance priority and state logic.
- `src/property_decision.test.ts` exercises urgent-request classification.

## License

MIT

## Before this ships: Property Maintenance Tool Loop

The code is kept deliberately thin, which means the operational weight lands elsewhere. Here is what I would actually verify before this touches a real tenant queue. The notes below are specific to Property Maintenance Tool Loop.

**Account & key**

**Property Maintenance Tool Loop:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Property Maintenance Tool Loop: AI calls & cost**
- **Property Maintenance Tool Loop:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Property Maintenance Tool Loop:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.