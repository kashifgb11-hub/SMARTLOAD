"""Optimization recommendations logic.

For each feature, sweep every valid candidate value (holding the other
7 features fixed at the request's values) and find the value that
minimizes predicted heating load.
"""

from app.config import FEATURE_CANDIDATES, FEATURE_DISPLAY, FEATURE_LABELS, FEATURE_NAMES
from app.predictor import predictor


def _format_value(feature_name: str, value: float) -> str:
    display = FEATURE_DISPLAY[feature_name]
    kind = display["kind"]
    if kind == "unit":
        return f"{round(value, display['decimals'])}{display['unit']}"
    if kind == "percent":
        return f"{round(value * 100):g}%"
    if kind == "category":
        return display["labels"].get(int(value), str(value))
    return f"{round(value, display['decimals']):g}"


def _direction_verb(current_value: float, suggested_value: float, kind: str) -> str:
    if kind == "category":
        return "Change"
    return "Reduce" if suggested_value < current_value else "Increase"


def find_recommendations(feature_values: dict) -> tuple[float, float, list[dict]]:
    current_hl, current_cl, _ = predictor.predict_raw(feature_values)

    recommendations = []
    for feature_name in FEATURE_NAMES:
        best_value = feature_values[feature_name]
        best_hl = current_hl

        for candidate in FEATURE_CANDIDATES[feature_name]:
            trial_values = dict(feature_values)
            trial_values[feature_name] = candidate
            trial_hl, _, _ = predictor.predict_raw(trial_values)
            if trial_hl < best_hl:
                best_hl = trial_hl
                best_value = candidate

        savings = current_hl - best_hl
        if savings > 0:
            current_value = feature_values[feature_name]
            kind = FEATURE_DISPLAY[feature_name]["kind"]
            verb = _direction_verb(current_value, best_value, kind)
            label = FEATURE_LABELS[feature_name]
            direction = (
                f"{verb} {label} from {_format_value(feature_name, current_value)} "
                f"to {_format_value(feature_name, best_value)}"
            )
            recommendations.append(
                {
                    "feature": label,
                    "current_value": float(current_value),
                    "suggested_value": float(best_value),
                    "current_hl": round(current_hl, 2),
                    "new_hl": round(best_hl, 2),
                    "savings": round(savings, 2),
                    "direction": direction,
                }
            )

    recommendations.sort(key=lambda rec: rec["savings"], reverse=True)
    return current_hl, current_cl, recommendations
