# SmartLoad Backend

FastAPI backend that serves trained Ridge Regression models predicting building heating and cooling energy demand from early-stage architectural design parameters. Built for the SmartLoad MSc dissertation project; consumed by a separate React frontend.

## Requirements

- Python 3.10+
- Trained model artifacts already present in `trained_models/`:
  - `model_heating_load.joblib`
  - `model_cooling_load.joblib`
  - `scaler.joblib`
  - `shap_explainer.joblib`

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

Interactive API docs: `http://localhost:8000/docs`

## Endpoints

### `GET /health`
Liveness check.

```json
{ "status": "ok", "model": "Ridge Regression" }
```

### `POST /predict`
Predicts heating/cooling load from up to 8 design parameters. Any field left as `null` is filled in with its training-set median. Returns predictions, SHAP feature attributions (computed on the scaled input, explaining heating load), and a plain-language top-3 explanation.

### `POST /optimize`
Given a full set of 8 design parameters, sweeps each feature's valid candidate values (holding the others fixed) to find changes that reduce predicted heating load. Returns the current predictions plus a list of recommendations sorted by largest improvement first.

## Feature Reference

| Feature | Range / Values | Median |
|---|---|---|
| Relative_Compactness | [0.62, 0.98] | 0.75 |
| Surface_Area (m²) | [514.5, 808.5] | 673.75 |
| Wall_Area (m²) | [245.0, 416.5] | 318.5 |
| Roof_Area (m²) | [110.25, 220.5] | 183.75 |
| Overall_Height (m) | 3.5 or 7.0 | 5.25 |
| Orientation | 2=N, 3=E, 4=S, 5=W | 3.5 |
| Glazing_Area | 0.0, 0.10, 0.25, 0.40 | 0.25 |
| Glazing_Dist | 0=None, 1=Uniform, 2=N, 3=E, 4=S, 5=W | 3.0 |

## CORS

CORS is open to all origins for development. Tighten `allow_origins` in `main.py` before deploying.
