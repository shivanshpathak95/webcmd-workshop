# webcmd-adapters

One plugin per Webcmd execution strategy, targeting the Demo Hub's own
backend (`http://localhost:4000`) and frontend (`http://localhost:5173`).

| File | Strategy | Browser? | What it does |
|---|---|---|---|
| `public-status.js` | `PUBLIC` | No | Direct `fetch` to `/api/public/status` |
| `billing-cookie.js` | `COOKIE` | No | `login` writes a cookie jar per `--profile`; `billing` replays it |
| `tickets-intercept.js` | `INTERCEPT` | Yes (headless) | Captures the `/api/internal/tickets` network response, never parses the DOM |
| `server-wizard-ui.js` | `UI` | Yes (headless) | Drives the 3-step wizard via `data-testid` selectors |

## Setup

```bash
cd webcmd-adapters
npm install
npx playwright install chromium   # only needed for tickets-intercept.js / server-wizard-ui.js
```

Make sure the demo hub's backend (`cd ../backend && npm start`) and frontend
(`cd ../frontend && npm run dev`) are both running first.

## Usage

```bash
node public-status.js
node billing-cookie.js login   --profile demo-user --username demo --password demo
node billing-cookie.js billing --profile demo-user
node tickets-intercept.js
node server-wizard-ui.js --name prod-api-01 --region eu-west-1
```

Every command prints one line of JSON to stdout, in the same stable
envelope:

```json
{ "ok": true, "strategy": "PUBLIC", "endpoint": "/api/public/status", "data": { ... }, "error": null, "fetchedAt": "..." }
```

`data` is `null` on failure, `error` is `null` on success — keys never
disappear, matching the "stable keys, null for missing optional fields"
contract documented at webcmd.dev/docs.

## ⚠️ Manifest schema caveat

CLAUDE.md asks for outputs that "strictly conform to Webcmd's JSON
stability rules." I could confirm that specific rule from the public docs
(stable keys + `null` for missing fields, implemented above), and that a
plugin manifest generally carries `site`, `command name`, `args`, `output
columns`, `strategy`, `browser requirement`, `tags`, and `keywords` — each
adapter exports a `manifest` object with exactly those fields.

What the public docs do **not** expose is the actual loader contract: how
`webcmd skills add` / `webcmd doctor` discovers and registers a plugin file,
or the exact runtime signature it calls. The `manifest` + `run(args)`
exports here are a reasonable best guess, not a confirmed API.

**Before wiring these into a real `webcmd` install:** run `webcmd doctor`
and check its plugin-loading docs/output, then adjust the `manifest` shape
and the `run` export signature in each file to match. Until then, every
adapter also works standalone via `node <file>.js ...` for testing and for
this demo's purposes.

## Future: real Webcmd plugin

When you're ready to graduate from workshop scripts to a discoverable plugin:

1. Add `webcmd-plugin.json` (name, version, description, `webcmd` compatibility).
2. Migrate adapters to ESM and register with `cli()` from `@agentrhq/webcmd/registry`.
3. Rename manifest fields to match production: `name` (not `command`), `columns` (not `outputColumns`), `browser` (not `browserRequired`).
4. Return JSON **rows** (array of objects); let the CLI handle formatting via `-f json|table`.
5. Replace custom `.profiles/` cookie jars with Webcmd `--profile` and interactive auth handoff for the COOKIE demo.
6. Replace direct Playwright launches with the Webcmd browser runtime for INTERCEPT/UI adapters.
7. Verify with `webcmd list -f json`, `webcmd validate`, and representative `webcmd verify` fixtures.

See [Create a Plugin](https://webcmd.dev/docs/create-plugin) and [`docs/WEBCMD_SETUP.md`](../docs/WEBCMD_SETUP.md).
