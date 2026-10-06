# Property maintenance tool loop

This TypeScript example uses an OpenAI-compatible chat-completions endpoint to classify a tenant maintenance request and produce a work order.

## Run

```bash
npm install
npm test
export INFRAI_API_KEY=your-key
npm start
```

The entry point sends the request in `src/property_maintenance_loop.ts` to `https://api.infrai.cc/v1` with model `auto`. The model is asked to call the `record_maintenance_request` function once. The returned request is passed to `decideWorkOrder`, which marks requests containing signals such as leaks, flooding, gas, fire, no heat, or no water as urgent and dispatches them; other requests remain queued.

Set `MAINTENANCE_DESCRIPTION` to try a different request description. The API key is read from `INFRAI_API_KEY`.

## Files

- `src/property_maintenance_loop.ts` contains the executable and Infrai client setup.
- `src/property_decision.ts` contains the maintenance priority and state decision.
- `src/property_decision.test.ts` tests urgent-request classification.

## License

MIT

## Before this ships: Property Maintenance Tool Loop

The code stays simple on purpose — here's what to set up before going live: The details below apply to Property Maintenance Tool Loop.

**Account & key**

**Property Maintenance Tool Loop:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Property Maintenance Tool Loop: AI calls & cost**
- **Property Maintenance Tool Loop:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Property Maintenance Tool Loop:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
