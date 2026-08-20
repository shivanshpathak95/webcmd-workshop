# Webcmd Interactive Demo Hub

A small full-stack app that doubles as a live demo of Webcmd's four
execution strategies (`PUBLIC`, `COOKIE`, `INTERCEPT`, `UI`). This README is
a **presenter's script** — how to stand this project up and walk someone
through it, live.

For the deeper "why" behind each strategy, that content already lives in
the app itself (each strategy page has a Guide pane) — this doc is about
the *demo*, not the explanation.

---

## 1. Setup (3 terminals)

**Terminal 1 — backend**
```bash
cd backend
npm install   # first time only
npm start
```
Runs on `http://localhost:4000`.

**Terminal 2 — frontend**
```bash
cd frontend
npm install   # first time only
npm run dev
```
Runs on `http://localhost:5173` — open this in a browser.

**Terminal 3 — webcmd-adapters** (used mid-demo, not started continuously)
```bash
cd webcmd-adapters
npm install   # first time only
npx playwright install chromium   # first time only — needed for the two browser-based adapters
```

Verify everything's wired up before the audience shows up:
```bash
curl http://localhost:4000/api/health   # {"ok":true}
```

---

## 2. The 5-minute demo script

Open `http://localhost:5173/` and walk top-to-bottom through the sidebar.
Each strategy page is split into a **Guide** (left) explaining the concept
and a **Live Target** (right) that's a real, functioning mock app — not a
screenshot. The idea to land with the audience: *the CLI commands on the
left produce exactly the JSON the panel on the right is displaying.*

### Intro (`/`)
Just frame it: "This app pretends to be four different real websites, one
per tab, so we can show four different ways an agent can talk to a site
without falling back to blind DOM-scraping every time."

### Strategy 1 — Public Bypass (`/strategies/public`)
1. Point at the **Server Status** panel — it's auto-refreshing every 4s.
2. Click **Refresh** to show it's a live network call, not a canned animation.
3. Switch to the terminal:
   ```bash
   node webcmd-adapters/public-status.js
   ```
   Show that the JSON it prints matches the numbers on screen — no browser
   was opened for this one. That's the whole point of `PUBLIC`.

### Strategy 2 — Authenticated Cookie Jars (`/strategies/cookie`)
1. Show the **Please Login** form — the page just got a real 401.
2. Type any username/password, submit → billing dashboard appears.
3. Reload the browser tab → still logged in (real cookie, not app state).
4. Terminal — show the login happens **once**:
   ```bash
   node webcmd-adapters/billing-cookie.js login --profile demo-user --username demo --password demo
   node webcmd-adapters/billing-cookie.js billing --profile demo-user
   ```
   Run the `billing` command again — no login step, same data. This is the
   `--profile` cookie-jar idea: authenticate once, reuse forever.
5. Optional gotcha to show: delete `webcmd-adapters/.profiles/demo-user.json`
   and re-run `billing` alone — it fails loudly with a clear "run login
   first" error instead of silently returning nothing.

### Strategy 3 — Network Interception (`/strategies/intercept`)
1. Point out the **Support Tickets** table — real React, real loading state.
2. Click **Refetch** — the table clears back to a skeleton and reloads.
3. Flip to **Raw JSON** — this is the exact payload behind those rows.
4. Terminal — show a headless browser grabbing that same payload directly,
   without ever touching the table's HTML:
   ```bash
   node webcmd-adapters/tickets-intercept.js
   ```

### Strategy 4 — Complex UI Automation (`/strategies/ui`)
1. Walk the wizard by hand: name → region → review (note the computed specs
   and hourly cost) → Create Instance → success panel.
2. Terminal — same flow, but driven headlessly:
   ```bash
   node webcmd-adapters/server-wizard-ui.js --name demo-01 --region eu-west-1
   ```
   Point out the `data-testid` attributes in the DOM (open dev tools on any
   input) as the reason this script doesn't break on a redesign.

---

## 3. If something's not working

| Symptom | Fix |
|---|---|
| `EADDRINUSE` on 4000 or 5173 | Something from a previous run is still up — `lsof -i :4000` / `:5173`, kill the PID |
| `tickets-intercept.js` / `server-wizard-ui.js` error "playwright is not installed" | `cd webcmd-adapters && npm install && npx playwright install chromium` |
| `billing-cookie.js billing` fails with "no session" | Expected — run the `login` subcommand first |
| Cookie page shows logged-in state you didn't expect | A previous demo run's cookie is still in the browser — open the page in an incognito window |

---

## 4. What each adapter actually proves

| Adapter | Strategy | What it demonstrates |
|---|---|---|
| `public-status.js` | PUBLIC | A plain `fetch()` beats spinning up a browser when the data's already open |
| `billing-cookie.js` | COOKIE | A named profile (`--profile demo-user`) is a persistent cookie jar — log in once, replay forever |
| `tickets-intercept.js` | INTERCEPT | Capturing a network response is more stable than parsing the DOM it renders into |
| `server-wizard-ui.js` | UI | When there's truly no API, `data-testid` selectors make DOM automation survive a redesign |

More detail on each adapter, its manifest shape, and the JSON stability
contract they follow: see [`webcmd-adapters/README.md`](webcmd-adapters/README.md).
