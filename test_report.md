# SmartLoad — Test Report

**Date:** 2026-08-01
**Scope:** Backend API (FastAPI, `localhost:8000`) and Frontend UI (React/Vite, `localhost:5173`)
**Method:** Direct API calls (`curl`) for the backend; automated headless-browser walkthroughs (Playwright) for the frontend, with console/page-error monitoring on every scenario. Screenshots for every UI scenario are in [`test_screenshots/`](test_screenshots/).

## Summary

| # | Scenario | Result |
|---|---|---|
| — | Backend API: health, predict (normal/null/extreme), validation errors, malformed JSON, 404 | ✅ PASS |
| 1 | Normal prediction, all 8 params filled | ✅ PASS |
| 2 | 2–3 params toggled "Unknown" | ✅ PASS |
| 3 | ALL 8 params toggled "Unknown" | ✅ PASS |
| 4 | Extreme min/max slider values | ✅ PASS |
| 5 | Optimize — Analyze with defaults | ✅ PASS |
| 6 | Backend down — error handling (predict, optimize, recovery) | ✅ PASS |
| 7 | Rapid slider movement / debounce | ✅ PASS |
| 8a | Rapid "Unknown" toggle on/off | ✅ PASS |
| 8b | Double-click Analyze (race condition) | ✅ PASS |

**13/13 checks pass.** Zero console errors, zero page crashes, zero blank-screen failures across every scenario. Two non-blocking findings are documented below (neither is a functional bug reachable through normal UI use).

---

## Backend API tests (direct `curl`)

Tested independently of the frontend to establish ground truth.

| Test | Request | Result |
|---|---|---|
| Health check | `GET /health` | `200 {"status":"ok","model":"Ridge Regression"}` ✅ |
| Normal predict | All 8 fields, mid-range values | `200`, HL=26.55, CL=28.45, 8 SHAP values, 3-item explanation ✅ |
| All-null predict | `{}` | `200`, falls back to all 8 medians, `missing_count:8` ✅ |
| All-minimum predict | All 8 fields at their documented minimum | `200`, HL=26.57, CL=31.94, sane SHAP values ✅ |
| All-maximum predict | All 8 fields at their documented maximum | `200`, HL=15.52, CL=14.39, sane SHAP values ✅ |
| Optimize, defaults | All 8 fields, mid-range values | `200`, 8 ranked recommendations, `savings` sorted descending ✅ |
| Optimize, null field | `orientation: null` (required field) | `422` with clear Pydantic detail (`"Input should be a valid number"`) ✅ |
| Predict, wrong type | `relative_compactness: "abc"` | `422` with clear Pydantic detail ✅ |
| Malformed JSON body | Invalid JSON | `422` with JSON-decode error detail, not a `500` ✅ |
| Nonexistent route | `GET /nonexistent` | `404 {"detail":"Not Found"}` ✅ |

**Finding (non-blocking):** `POST /predict` does **not** validate that inputs fall within the documented per-feature ranges (e.g. `relative_compactness: 5.0`, ~5× the valid max of 0.98, returns `200` with a physically nonsensical `heating_load: -203.95`). This is unreachable through the actual UI — every slider is HTML-`min`/`max`-constrained, so a user can never submit an out-of-range value by design — so it only matters for a hypothetical direct API consumer bypassing the frontend. **Not fixed**, since adding range validation/clamping is a product decision (reject vs. clamp vs. warn) that's out of scope for a test pass; flagging it here for a deliberate call rather than guessing at a fix.

---

## Frontend UI scenarios

### 1. Normal prediction, all 8 params filled — ✅ PASS
Loaded the Energy Predictor section with all defaults (none toggled Unknown). Prediction returned instantly (Heating Load 26.55, Cooling Load 28.45 — matches the backend `curl` test exactly), SHAP chart rendered 5 bars, "In Plain Language" explanation populated, no missing-data note shown. Zero console errors.
📸 `01-normal-prediction.png`

### 2. 2–3 params toggled "Unknown" — ✅ PASS
Toggled Relative Compactness, Roof Area, and Overall Height to "Unknown" (sliders blur + "?" icon appears, per design). The missing-data banner correctly read **"3 of 8 parameters were unavailable — median values were used for estimation"**, and the prediction updated using medians for those 3 fields. Zero console errors.
📸 `02-partial-unknown.png`

### 3. ALL 8 params toggled "Unknown" — ✅ PASS
Toggled every field to "Unknown." The app handled it gracefully — no crash, no blank panel. Banner correctly read **"8 of 8 parameters were unavailable"**, prediction fell back to all training medians (Heating Load 22.82, Cooling Load 25.09 — matches the backend's all-null `curl` test exactly), SHAP chart and explanation still rendered against the median-baseline inputs.
📸 `03-all-unknown.png`

### 4. Extreme min/max slider values — ✅ PASS
Set all 5 sliders and 3 dropdowns to their documented minimums, then to their documented maximums. Both extremes predicted cleanly (min: HL=26.57; max: HL=15.52 — both match the backend `curl` tests exactly), no `NaN`, no layout breakage, SHAP chart scaled its axis correctly to the larger swings.
📸 `04a-extreme-min-values.png`, `04b-extreme-max-values.png`

### 5. Optimize — Analyze with defaults — ✅ PASS
Clicked Analyze with the default design. Returned 8 ranked recommendations (Overall Height first at 15.10 kWh/m² savings, down to Orientation at 0.07), each with a proportional green progress bar. Zero console errors.
📸 `05-optimize-recommendations.png`

### 6. Backend down — error handling — ✅ PASS
This was the priority scenario. Stopped the backend process (`taskkill`), then:
- **6a — Fresh load, Energy Predictor:** The page still renders completely (inputs, layout, everything) — no blank screen. A clear coral error banner reads **"Could not reach the prediction service. Is the backend running on localhost:8000?"** The only console entry is the browser's own `net::ERR_CONNECTION_REFUSED` network log (expected for any failed request, not a JS exception — the app's `try/catch` around the `axios.post` call caught it correctly, no uncaught error).
- **6b — Interact further while still down:** Moved a slider; the error banner persists correctly, sliders remain fully interactive (not frozen/disabled), zero new console errors.
- **6c — Optimize, Analyze with backend down:** Same pattern — clear banner ("Could not reach the optimization service..."), and critically the Analyze button correctly **recovers from its loading state** back to normal (not stuck on "Analyzing your design...").
- **6d — Recovery after restart:** Restarted the backend, then interacted with a slider again **without reloading the page**. The error banner disappeared and a normal prediction (Heating Load 30.41) came back immediately — the app self-heals on the very next request, no manual refresh required.

📸 `06a-predict-backend-down.png`, `06b-predict-backend-down-after-interaction.png`, `06c-optimize-backend-down.png`, `06d-recovery-after-backend-restart.png`

**Verdict: the app handles backend failure exactly as hoped for** — user-friendly, specific error messages; no blank screens; no raw stack traces or exposed error objects; full self-recovery once the backend returns.

### 7. Rapid slider movement — ✅ PASS
Fired 10 slider value changes back-to-back with no waiting between them (faster than the 150ms debounce window). Result: only **1** `POST /predict` request was actually sent (monitored via `page.on('request')`), confirming the debounce is working as designed rather than firing one request per change. UI stayed responsive throughout, zero console errors.
📸 `07-rapid-slider-settled.png`

### 8a. Rapid "Unknown" toggle on/off — ✅ PASS
Clicked one field's "Unknown" button 4 times in immediate succession (on→off→on→off). Final state settled correctly to "off," matching the value's controlled-input source of truth. Zero console errors.

### 8b. Double-click Analyze rapidly — ✅ PASS
Clicked Analyze twice in immediate succession (simulating an impatient double-click). No duplicate/overlapping request state, no broken UI — 8 recommendations rendered cleanly, same as a single click.
📸 `08b-double-click-analyze.png`

---

## Notes on the testing process itself

Two dead ends worth recording, since they cost real investigation time and could otherwise look like app bugs to a future reader of the raw test logs:

1. **A `Malformed value` error from Playwright's `.fill()`** on the Surface Area slider. Root cause: the feature's default/training-median value (673.75) isn't perfectly aligned to the slider's `step="0.5"` grid starting from `min="514.5"` (673.75 − 514.5 = 159.25, not a whole multiple of 0.5). This is **not reachable by a real user** — React sets the input's `value` directly regardless of step alignment, and only native click-drag interaction snaps to the step grid (landing within 0.25 of the true median, imperceptible). It only affects Playwright's stricter `fill()` validation. Worked around in the test script by setting the value via the native property setter + `input` event instead of `fill()`.
2. **An apparent "stuck Unknown toggle"** spotted by eye in an early screenshot (Glazing Distribution's button looked visually different from the other 7 after a sequence of toggles). Traced it down to the DOM state directly (`className` inspection) at that exact point in the sequence — the toggle was correctly `off`; the visual difference was the browser's default keyboard-focus ring on the most-recently-clicked button, not the app's "Unknown" active style. Confirmed via a dedicated reproduction script. Not a bug.

## Conclusion

Both the backend and frontend behaved correctly across every requested scenario, including the ones most likely to break a less-careful implementation (all-fields-unknown, extreme values, rapid input, concurrent clicks, and — most importantly — a fully unavailable backend). No code changes were required as a result of this test pass; the one backend finding (no range validation on `/predict`) is documented above as a design decision for the user to weigh in on rather than something silently patched.
